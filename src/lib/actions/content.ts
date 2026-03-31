"use server";

import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { generateAiSummary } from "@/lib/ai";
import { z } from "zod";

const addContentSchema = z.object({
  clientId: z.string().min(1),
  contentType: z.enum(["FORM", "TRANSCRIPT", "THREAD", "NOTE"]),
  contentBody: z.string().min(1, "Content is required"),
  sourceLabel: z.string().min(1, "Source label is required"),
  regenerateSummary: z.boolean().optional(),
});

export async function addContent(data: z.infer<typeof addContentSchema>) {
  const session = await getRequiredSession();

  const validated = addContentSchema.parse(data);

  const entry = await prisma.contentEntry.create({
    data: {
      clientId: validated.clientId,
      contentType: validated.contentType,
      contentBody: validated.contentBody,
      sourceLabel: validated.sourceLabel,
      matchMethod: "MANUAL",
    },
  });

  await prisma.activityLog.create({
    data: {
      clientId: validated.clientId,
      action: `${validated.contentType.toLowerCase()} added manually`,
      contentEntryId: entry.id,
      source: `Added by ${session.name} — ${validated.sourceLabel}`,
      matchMethod: "MANUAL",
    },
  });

  // Update client's updatedAt
  await prisma.client.update({
    where: { id: validated.clientId },
    data: { updatedAt: new Date() },
  });

  if (validated.regenerateSummary) {
    try {
      await generateAiSummary(validated.clientId);
    } catch (error) {
      console.error("Failed to generate AI summary:", error);
    }
  }

  revalidatePath(`/clients/${validated.clientId}`);
  revalidatePath("/dashboard");

  return { success: true, entryId: entry.id };
}

export async function deleteContent(entryId: string, clientId: string) {
  await getRequiredSession();

  await prisma.contentEntry.delete({ where: { id: entryId } });

  revalidatePath(`/clients/${clientId}`);

  return { success: true };
}

export async function regenerateSummary(clientId: string) {
  await getRequiredSession();

  const summary = await generateAiSummary(clientId);

  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/dashboard");

  return { success: true, summary };
}

export async function importGoogleDoc(clientId: string, docUrl: string) {
  const session = await getRequiredSession();

  // Extract doc ID from URL
  const match = docUrl.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) {
    return { success: false, error: "Invalid Google Docs URL" };
  }

  const docId = match[1];
  const apiKey = process.env.GOOGLE_DOCS_API_KEY;

  if (!apiKey) {
    return { success: false, error: "Google Docs API key not configured" };
  }

  try {
    // Fetch the doc content using the Google Docs API
    const response = await fetch(
      `https://docs.googleapis.com/v1/documents/${docId}?key=${apiKey}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: "Failed to fetch Google Doc. Check the URL and API key.",
      };
    }

    const doc = await response.json();
    const title = doc.title || "Untitled Document";

    // Extract text content from the document
    let textContent = "";
    if (doc.body?.content) {
      for (const element of doc.body.content) {
        if (element.paragraph?.elements) {
          for (const el of element.paragraph.elements) {
            if (el.textRun?.content) {
              textContent += el.textRun.content;
            }
          }
        }
      }
    }

    if (!textContent.trim()) {
      return { success: false, error: "Document appears to be empty" };
    }

    const entry = await prisma.contentEntry.create({
      data: {
        clientId,
        contentType: "TRANSCRIPT",
        contentBody: textContent.trim(),
        sourceLabel: `Google Doc — ${title}`,
        matchMethod: "MANUAL",
      },
    });

    await prisma.activityLog.create({
      data: {
        clientId,
        action: "transcript imported from Google Docs",
        contentEntryId: entry.id,
        source: `Imported by ${session.name} — ${title}`,
        matchMethod: "MANUAL",
      },
    });

    await prisma.client.update({
      where: { id: clientId },
      data: { updatedAt: new Date() },
    });

    revalidatePath(`/clients/${clientId}`);

    return { success: true, entryId: entry.id, title };
  } catch (error) {
    console.error("Google Docs import error:", error);
    return { success: false, error: "Failed to import document" };
  }
}
