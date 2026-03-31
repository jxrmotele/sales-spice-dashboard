"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

// ─── Offer Details ────────────────────────────────────────────────────────────

export async function saveOfferDetails(clientId: string, data: Record<string, string>) {
  await prisma.offerDetails.upsert({
    where: { clientId },
    create: { clientId, data: JSON.stringify(data) },
    update: { data: JSON.stringify(data) },
  });
  revalidatePath(`/clients/${clientId}`);
  revalidatePath(`/clients/${clientId}/setup`);
}

export async function getOfferDetails(clientId: string): Promise<Record<string, string>> {
  const row = await prisma.offerDetails.findUnique({ where: { clientId } });
  if (!row) return {};
  try {
    return JSON.parse(row.data);
  } catch {
    return {};
  }
}

// ─── Launch Plan ──────────────────────────────────────────────────────────────

export type KeyDates = {
  launchStart?: string;
  cartOpen?: string;
  cartClose?: string;
};

export async function saveLaunchPlan(
  clientId: string,
  templateId: string,
  keyDates: KeyDates
) {
  await prisma.launchPlan.upsert({
    where: { clientId },
    create: {
      clientId,
      templateId,
      keyDates: JSON.stringify(keyDates),
    },
    update: {
      templateId,
      keyDates: JSON.stringify(keyDates),
    },
  });
  revalidatePath(`/clients/${clientId}`);
  revalidatePath(`/clients/${clientId}/launch`);
  revalidatePath(`/clients/${clientId}/setup`);
}

export async function getLaunchPlan(clientId: string) {
  const row = await prisma.launchPlan.findUnique({ where: { clientId } });
  if (!row) return null;
  return {
    templateId: row.templateId,
    keyDates: JSON.parse(row.keyDates) as KeyDates,
    taskCompletions: JSON.parse(row.taskCompletions) as Record<string, boolean>,
    leadMagnetType: row.leadMagnetType,
  };
}

export async function toggleTaskCompletion(clientId: string, taskId: string, completed: boolean) {
  const row = await prisma.launchPlan.findUnique({ where: { clientId } });
  if (!row) return;
  const completions = JSON.parse(row.taskCompletions) as Record<string, boolean>;
  completions[taskId] = completed;
  await prisma.launchPlan.update({
    where: { clientId },
    data: { taskCompletions: JSON.stringify(completions) },
  });
  revalidatePath(`/clients/${clientId}/launch`);
}

export async function saveLeadMagnetType(clientId: string, type: string) {
  await prisma.launchPlan.update({
    where: { clientId },
    data: { leadMagnetType: type },
  });
  revalidatePath(`/clients/${clientId}/launch`);
}

// ─── Generated Content ────────────────────────────────────────────────────────

export async function saveGeneratedContent(
  clientId: string,
  contentType: string,
  key: string,
  content: string
) {
  // Upsert by clientId + contentType + key
  const existing = await prisma.generatedContent.findFirst({
    where: { clientId, contentType, key },
  });
  if (existing) {
    await prisma.generatedContent.update({
      where: { id: existing.id },
      data: { content },
    });
  } else {
    await prisma.generatedContent.create({
      data: { clientId, contentType, key, content },
    });
  }
  revalidatePath(`/clients/${clientId}/content`);
}

export async function getGeneratedContent(clientId: string) {
  const rows = await prisma.generatedContent.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
  });
  return rows;
}
