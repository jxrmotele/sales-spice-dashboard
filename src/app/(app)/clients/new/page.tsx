import { getRequiredSession } from "@/lib/auth-helpers";
import { getCoaches } from "@/lib/actions/clients";
import { ClientForm } from "@/components/client-form";

export default async function NewClientPage() {
  const session = await getRequiredSession();
  const coaches = session.role === "ADMIN" ? await getCoaches() : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">New Client</h1>
      <ClientForm coaches={coaches} currentUser={session} />
    </div>
  );
}
