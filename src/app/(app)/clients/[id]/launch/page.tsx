import { notFound } from "next/navigation";
import { getClient } from "@/lib/actions/clients";
import { getRequiredSession } from "@/lib/auth-helpers";
import { getOfferDetails, getLaunchPlan } from "@/lib/actions/launch";
import { TEMPLATES } from "@/lib/launch-templates";
import { LaunchPlanContent } from "./launch-plan-content";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";

export default async function LaunchPage({
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

  if (!launchPlan) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/clients/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Launch Plan</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <p className="text-muted-foreground">No launch plan set up yet.</p>
          <Link href={`/clients/${id}/setup`}>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Set up launch
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const template = TEMPLATES[launchPlan.templateId];
  if (!template) notFound();

  return (
    <LaunchPlanContent
      clientId={id}
      clientName={client.fullName}
      template={template}
      offerDetails={offerDetails}
      launchPlan={launchPlan}
    />
  );
}
