import { notFound } from "next/navigation";
import { getClient } from "@/lib/actions/clients";
import { getRequiredSession } from "@/lib/auth-helpers";
import { getOfferDetails, getLaunchPlan, getGeneratedContent } from "@/lib/actions/launch";
import { ContentHub } from "./content-hub";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";

export default async function ContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await getRequiredSession();
  const client = await getClient(id);
  if (!client) notFound();

  const [offerDetails, launchPlan, generatedContent] = await Promise.all([
    getOfferDetails(id),
    getLaunchPlan(id),
    getGeneratedContent(id),
  ]);

  if (!launchPlan || Object.keys(offerDetails).length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/clients/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Content Generator</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <p className="text-muted-foreground">
            Complete the launch setup first to generate content.
          </p>
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

  const savedContent: Record<string, string> = {};
  for (const row of generatedContent) {
    savedContent[`${row.contentType}:${row.key}`] = row.content;
  }

  return (
    <ContentHub
      clientId={id}
      clientName={client.fullName}
      offerDetails={offerDetails}
      templateId={launchPlan.templateId}
      savedContent={savedContent}
    />
  );
}
