import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateAiSummary(clientId: string) {
  // Fetch client with all content
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      contentEntries: {
        orderBy: { createdAt: "asc" },
      },
      assignedCoach: {
        select: { name: true },
      },
    },
  });

  if (!client) {
    throw new Error("Client not found");
  }

  // Build content summary for the prompt
  const contentSections = client.contentEntries.map((entry) => {
    const typeLabel = {
      FORM: "Form Submission",
      TRANSCRIPT: "Call Transcript",
      THREAD: "Community Chat Thread",
      NOTE: "Note",
    }[entry.contentType];

    return `[${typeLabel}] ${entry.sourceLabel} (${entry.createdAt.toISOString().split("T")[0]})\n${entry.contentBody}`;
  });

  if (contentSections.length === 0) {
    // No content to summarize
    const summary = await prisma.aiSummary.create({
      data: {
        clientId,
        currentFocus: "No content available yet. Add forms, transcripts, or notes to generate a meaningful summary.",
        milestones: "No milestones identified yet.",
        nextSteps: "Begin by adding content to this client's record — onboarding forms, call transcripts, or coaching notes.",
      },
    });
    return summary;
  }

  const prompt = `You are an AI assistant for a coaching practice. Analyse the following client record and provide a structured coaching summary.

Client: ${client.fullName}
Coach: ${client.assignedCoach.name}
Package: ${client.packageTier || "Not specified"}
Status: ${client.status}
Start Date: ${client.startDate.toISOString().split("T")[0]}

--- CLIENT RECORD CONTENT ---
${contentSections.join("\n\n---\n\n")}
--- END OF CONTENT ---

Based on ALL the content above, provide exactly three sections. Be specific and actionable. Reference concrete details from the content.

Respond in this exact JSON format:
{
  "currentFocus": "A clear summary of what the client is currently working on and where they are in their journey. 2-4 sentences.",
  "milestones": "The key milestones or goals the client is working towards, both short-term and longer-term. 2-4 sentences.",
  "nextSteps": "Recommended next steps for the coaching relationship — what the coach should focus on in the next session or interaction. 2-4 sentences."
}

Return ONLY the JSON object, no other text.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  let parsed: { currentFocus: string; milestones: string; nextSteps: string };
  try {
    parsed = JSON.parse(textBlock.text);
  } catch {
    // If JSON parsing fails, try to extract from the response
    parsed = {
      currentFocus: textBlock.text.substring(0, 500),
      milestones: "Could not parse AI response. Please regenerate.",
      nextSteps: "Could not parse AI response. Please regenerate.",
    };
  }

  const summary = await prisma.aiSummary.create({
    data: {
      clientId,
      currentFocus: parsed.currentFocus,
      milestones: parsed.milestones,
      nextSteps: parsed.nextSteps,
    },
  });

  // Log the summary generation
  await prisma.activityLog.create({
    data: {
      clientId,
      action: "AI summary generated",
      source: "System",
    },
  });

  return summary;
}
