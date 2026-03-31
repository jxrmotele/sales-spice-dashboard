import { notFound } from "next/navigation";
import { getClient, getCoaches } from "@/lib/actions/clients";
import { getRequiredSession } from "@/lib/auth-helpers";
import { ClientForm } from "@/components/client-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditClientPage({
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/clients/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Client</h1>
      </div>
      <ClientForm
        coaches={coaches}
        currentUser={session}
        client={{
          id: client.id,
          fullName: client.fullName,
          email: client.email,
          phone: client.phone || "",
          packageTier: client.packageTier || "",
          status: client.status,
          assignedCoachId: client.assignedCoach.id,
        }}
      />
    </div>
  );
}
