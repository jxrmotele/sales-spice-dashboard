import { getUnmatchedEntries } from "@/lib/actions/unmatched";
import { getRequiredSession } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { InboxContent } from "./inbox-content";

export default async function InboxPage() {
  await getRequiredSession();
  const entries = await getUnmatchedEntries();

  // Fetch all clients for assignment dropdown
  const clients = await prisma.client.findMany({
    select: { id: true, fullName: true, email: true },
    orderBy: { fullName: "asc" },
  });

  return <InboxContent entries={entries} clients={clients} />;
}
