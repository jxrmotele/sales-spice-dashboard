import { notFound } from "next/navigation";
import { getClient } from "@/lib/actions/clients";
import { getRequiredSession } from "@/lib/auth-helpers";
import { getOfferDetails, getLaunchPlan } from "@/lib/actions/launch";
import { SetupWizard } from "./setup-wizard";

export default async function SetupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await getRequiredSession();
  const client = await getClient(id);
  if (!client) notFound();

  const [offerDetails, launchPlan] = await Promise.all([
    getOfferDetails(id),
    getLaunchPlan(id),
  ]);

  return (
    <SetupWizard
      clientId={id}
      clientName={client.fullName}
      initialOfferDetails={offerDetails}
      initialLaunchPlan={launchPlan}
    />
  );
}
