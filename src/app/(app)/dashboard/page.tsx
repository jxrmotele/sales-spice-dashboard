import { getClients, getCoaches } from "@/lib/actions/clients";
import { getRequiredSession } from "@/lib/auth-helpers";
import { DashboardContent } from "./dashboard-content";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ coach?: string; status?: string; search?: string }>;
}) {
  const session = await getRequiredSession();
  const params = await searchParams;
  const clients = await getClients({
    coachId: params.coach,
    status: params.status as "ACTIVE" | "PAUSED" | "COMPLETED" | undefined,
    search: params.search,
  });
  const coaches = session.role === "ADMIN" ? await getCoaches() : [];

  return (
    <DashboardContent
      clients={clients}
      coaches={coaches}
      currentUser={session}
      filters={params}
    />
  );
}
