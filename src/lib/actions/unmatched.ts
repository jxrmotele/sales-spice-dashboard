"use server";

import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { generateAiSummary } from "@/lib/ai";

export async function getUnmatchedEntries() {
  await getRequiredSession();

  return prisma.unmatchedEntry.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getUnmatchedCount() {
  return prisma.unmatchedEntry.count();
}

export async function assignUnmatchedEntry(
  entryId: string,
  clientId: string,
  regenerateSummary: boolean = false
) {
  const session = await getRequiredSession();

  const entry = await prisma.unmatchedEntry.findUnique({
    where: { id: entryId },
  });

  if (!entry) {
    return { success: false, error: "Entry not found" };
  }

  // Create the content entry in the client record
  const contentEntry = await prisma.contentEntry.create({
    data: {
      clientId,
      contentType: entry.contentType,
      contentBody: entry.contentBody,
      sourceLabel: entry.sourceLabel,
      matchMethod: "MANUAL",
    },
  });

  // Log the assignment
  await prisma.activityLog.create({
    data: {
      clientId,
      action: `${entry.contentType.toLowerCase()} assigned from unmatched inbox`,
      contentEntryId: contentEntry.id,
      source: `Assigned by ${session.name} — ${entry.sourceLabel}`,
      matchMethod: "MANUAL",
    },
  });

  // Update client timestamp
  await prisma.client.update({
    where: { id: clientId },
    data: { updatedAt: new Date() },
  });

  // Delete from unmatched inbox
  await prisma.unmatchedEntry.delete({ where: { id: entryId } });

  // Optionally regenerate summary
  if (regenerateSummary) {
    try {
      await generateAiSummary(clientId);
    } catch (error) {
      console.error("Failed to regenerate summary:", error);
    }
  }

  revalidatePath("/inbox");
  revalidatePath(`/clients/${clientId}`);
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteUnmatchedEntry(entryId: string) {
  await getRequiredSession();

  await prisma.unmatchedEntry.delete({ where: { id: entryId } });

  revalidatePath("/inbox");

  return { success: true };
}
