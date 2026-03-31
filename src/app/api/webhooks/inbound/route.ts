import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAiSummary } from "@/lib/ai";
import { z } from "zod";

const webhookSchema = z.object({
  email: z.string().email().optional(),
  full_name: z.string().optional(),
  content_type: z.enum(["form", "transcript", "thread", "note"]),
  content_body: z.string().min(1),
  source_label: z.string().min(1),
  assigned_coach_email: z.string().email().optional(),
  webhook_secret: z.string(),
  auto_regenerate_summary: z.boolean().optional(),
});

const contentTypeMap: Record<string, string> = {
  form: "FORM",
  transcript: "TRANSCRIPT",
  thread: "THREAD",
  note: "NOTE",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = webhookSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Verify webhook secret
    if (data.webhook_secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    const contentType = contentTypeMap[data.content_type];
    let matchedClient = null;
    let matchMethod: string | null = null;

    // 1. Try to match by email (highest confidence)
    if (data.email) {
      matchedClient = await prisma.client.findUnique({
        where: { email: data.email },
      });
      if (matchedClient) {
        matchMethod = "EMAIL";
      }
    }

    // 2. Try to match by full name (medium confidence)
    if (!matchedClient && data.full_name) {
      const nameMatches = await prisma.client.findMany({
        where: {
          fullName: {
            contains: data.full_name,
          },
        },
      });

      if (nameMatches.length === 1) {
        matchedClient = nameMatches[0];
        matchMethod = "NAME";
      } else if (nameMatches.length > 1) {
        // Multiple matches — send to unmatched inbox with suggestions
        await prisma.unmatchedEntry.create({
          data: {
            email: data.email,
            fullName: data.full_name,
            contentType,
            contentBody: data.content_body,
            sourceLabel: data.source_label,
            assignedCoachEmail: data.assigned_coach_email,
            suggestedClientIds: JSON.stringify(nameMatches.map((c) => c.id)),
            matchAttemptDetails: `Name "${data.full_name}" matched ${nameMatches.length} clients: ${nameMatches.map((c) => c.fullName).join(", ")}`,
          },
        });

        return NextResponse.json(
          {
            status: "unmatched",
            reason: "multiple_name_matches",
            message: `Name matched ${nameMatches.length} clients. Added to unmatched inbox for manual assignment.`,
            suggested_clients: nameMatches.map((c) => ({
              id: c.id,
              name: c.fullName,
              email: c.email,
            })),
          },
          { status: 202 }
        );
      }
    }

    // 3. If no match found, add to unmatched inbox
    if (!matchedClient) {
      await prisma.unmatchedEntry.create({
        data: {
          email: data.email,
          fullName: data.full_name,
          contentType,
          contentBody: data.content_body,
          sourceLabel: data.source_label,
          assignedCoachEmail: data.assigned_coach_email,
          suggestedClientIds: "[]",
          matchAttemptDetails: `No match found for email: ${data.email || "not provided"}, name: ${data.full_name || "not provided"}`,
        },
      });

      return NextResponse.json(
        {
          status: "unmatched",
          reason: "no_match",
          message:
            "No matching client found. Added to unmatched inbox for manual assignment.",
        },
        { status: 202 }
      );
    }

    // Match found — create content entry
    const entry = await prisma.contentEntry.create({
      data: {
        clientId: matchedClient.id,
        contentType,
        contentBody: data.content_body,
        sourceLabel: data.source_label,
        matchMethod,
      },
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        clientId: matchedClient.id,
        action: `${data.content_type} received via webhook`,
        contentEntryId: entry.id,
        source: `Webhook — ${data.source_label}`,
        matchMethod,
      },
    });

    // Update client timestamp
    await prisma.client.update({
      where: { id: matchedClient.id },
      data: { updatedAt: new Date() },
    });

    // Optionally regenerate AI summary
    if (data.auto_regenerate_summary) {
      try {
        await generateAiSummary(matchedClient.id);
      } catch (error) {
        console.error("Failed to auto-regenerate summary:", error);
      }
    }

    return NextResponse.json(
      {
        status: "matched",
        client_id: matchedClient.id,
        client_name: matchedClient.fullName,
        match_method: matchMethod?.toLowerCase(),
        content_entry_id: entry.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
