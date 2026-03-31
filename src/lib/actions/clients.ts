"use server";

import { prisma } from "@/lib/prisma";
import { getRequiredSession } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createClientSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  packageTier: z.string().optional(),
  assignedCoachId: z.string().min(1, "Assigned coach is required"),
});

const updateClientSchema = createClientSchema.extend({
  id: z.string(),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED"]),
});

export async function getClients(filters?: {
  coachId?: string;
  status?: string;
  search?: string;
}) {
  const session = await getRequiredSession();

  const where: Record<string, unknown> = {};

  // Coaches can only see their own clients
  if (session.role === "COACH") {
    where.assignedCoachId = session.id;
  } else if (filters?.coachId) {
    where.assignedCoachId = filters.coachId;
  }

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.search) {
    where.OR = [
      { fullName: { contains: filters.search } },
      { email: { contains: filters.search } },
    ];
  }

  return prisma.client.findMany({
    where,
    include: {
      assignedCoach: {
        select: { id: true, name: true, email: true },
      },
      aiSummaries: {
        orderBy: { generatedAt: "desc" },
        take: 1,
      },
      contentEntries: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getClient(id: string) {
  const session = await getRequiredSession();

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      assignedCoach: {
        select: { id: true, name: true, email: true },
      },
      contentEntries: {
        orderBy: { createdAt: "desc" },
      },
      aiSummaries: {
        orderBy: { generatedAt: "desc" },
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  });

  if (!client) return null;

  // Coaches can only view their own clients
  if (session.role === "COACH" && client.assignedCoachId !== session.id) {
    return null;
  }

  return client;
}

export async function createClient(formData: FormData) {
  const session = await getRequiredSession();

  const data = createClientSchema.parse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    packageTier: formData.get("packageTier") || undefined,
    assignedCoachId:
      session.role === "COACH"
        ? session.id
        : formData.get("assignedCoachId"),
  });

  const client = await prisma.client.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      packageTier: data.packageTier,
      assignedCoachId: data.assignedCoachId,
    },
  });

  await prisma.activityLog.create({
    data: {
      clientId: client.id,
      action: "Client record created",
      source: `Created by ${session.name}`,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/clients");

  return { success: true, clientId: client.id };
}

export async function updateClient(formData: FormData) {
  await getRequiredSession();

  const data = updateClientSchema.parse({
    id: formData.get("id"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    packageTier: formData.get("packageTier") || undefined,
    status: formData.get("status"),
    assignedCoachId: formData.get("assignedCoachId"),
  });

  await prisma.client.update({
    where: { id: data.id },
    data: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      packageTier: data.packageTier,
      status: data.status,
      assignedCoachId: data.assignedCoachId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/clients");
  revalidatePath(`/clients/${data.id}`);

  return { success: true };
}

export async function deleteClient(id: string) {
  await getRequiredSession();

  await prisma.client.delete({ where: { id } });

  revalidatePath("/dashboard");
  revalidatePath("/clients");

  return { success: true };
}

export async function getCoaches() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });
}
