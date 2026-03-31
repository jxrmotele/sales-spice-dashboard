import { notFound } from "next/navigation";
import { getClient } from "@/lib/actions/clients";
import { getCoaches } from "@/lib/actions/clients";
import { getRequiredSession } from "@/lib/auth-helpers";
import { ClientDetailContent } from "./client-detail-content";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getRequiredSession();
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  const coaches = session.role === "ADMIN" ? await getCoaches() : [];

  return (
    <ClientDetailContent
      client={client}
      coaches={coaches}
      currentUser={session}
    />
  );
}
