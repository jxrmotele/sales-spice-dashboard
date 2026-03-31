"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Zap,
  Loader2,
  Copy,
  Check,
  Mail,
  Share2,
  FileText,
  Mic,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { saveGeneratedContent } from "@/lib/actions/launch";

const EMAIL_SEQUENCES = [
  { key: "waitlist-drive", label: "Drive to Waitlist", description: "14-email sequence to build your waitlist before cart opens.", icon: "📣", accentClass: "border-pink-200 bg-pink-50" },
  { key: "waitlist-nurture", label: "Nurture & Sell to Waitlist", description: "5-email welcome sequence for new subscribers who download your lead magnet.", icon: "💌", accentClass: "border-blue-200 bg-blue-50" },
  { key: "webinar-drive", label: "Drive to Webinar", description: "14-email sequence to get registrations for your live event.", icon: "🎙", accentClass: "border-purple-200 bg-purple-50" },
  { key: "cart-open", label: "Open to Close Cart", description: "Full cart open sequence from doors open to final hours.", icon: "🛒", accentClass: "border-green-200 bg-green-50" },
  { key: "onboarding", label: "Client Onboarding", description: "Welcome sequence for new clients after they purchase.", icon: "🎉", accentClass: "border-amber-200 bg-amber-50" },
];

const SOCIAL_BANKS = [
  { key: "pre-launch", label: "Pre-Launch Bank", description: "Social posts for building awareness and desire before your launch begins.", icon: "🌱", accentClass: "border-emerald-200 bg-emerald-50" },
  { key: "driving", label: "Driving Period Bank", description: "Posts for the main driving period — desire, objections, social proof.", icon: "🚀", accentClass: "border-blue-200 bg-blue-50" },
  { key: "cart-period", label: "Cart Period Bank", description: "Posts for the open-to-close window — urgency, FAQs, final day.", icon: "🔥", accentClass: "border-orange-200 bg-orange-50" },
];

interface Props {
  clientId: string;
  clientName: string;
  offerDetails: Record<string, string>;
  templateId: string;
  savedContent: Record<string, string>;
}

export function ContentHub({ clientId, clientName, offerDetails, templateId, savedContent }: Props) {
  const od = offerDetails;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/clients/${clientId}/launch`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Launch plan
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Content Generator</h1>
          <p className="text-sm text-muted-foreground">{clientName}</p>
        </div>
      </div>

      <Tabs defaultValue="emails">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emails">
            <Mail className="h-4 w-4 mr-1" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="h-4 w-4 mr-1" />
            Social
          </TabsTrigger>
          <TabsTrigger value="sales-page">
            <FileText className="h-4 w-4 mr-1" />
            Sales Page
          </TabsTrigger>
          <TabsTrigger value="podcast">
            <Mic className="h-4 w-4 mr-1" />
            Podcast
          </TabsTrigger>
        </TabsList>

        {/* ─── Emails ─────────────────────────────────────────────────────────── */}
        <TabsContent value="emails" className="space-y-4 mt-4">
          {(templateId === "alpha"
            ? EMAIL_SEQUENCES.filter((s) => ["waitlist-drive", "cart-open", "onboarding"].includes(s.key))
            : EMAIL_SEQUENCES
          ).map((seq) => (
            <ContentCard
              key={seq.key}
              title={seq.label}
              description={seq.description}
              icon={seq.icon}
              accentClass={seq.accentClass}
              clientId={clientId}
              contentType="email"
              contentKey={seq.key}
              saved={savedContent[`email:${seq.key}`]}
              offerDetails={od}
              templateId={templateId}
            />
          ))}
        </TabsContent>

        {/* ─── Social ──────────────────────────────────────────────────────────── */}
        <TabsContent value="social" className="space-y-4 mt-4">
          {SOCIAL_BANKS.map((bank) => (
            <ContentCard
              key={bank.key}
              title={bank.label}
              description={bank.description}
              icon={bank.icon}
              accentClass={bank.accentClass}
              clientId={clientId}
              contentType="social"
              contentKey={bank.key}
              saved={savedContent[`social:${bank.key}`]}
              offerDetails={od}
              templateId={templateId}
            />
          ))}
        </TabsContent>

        {/* ─── Sales Page ───────────────────────────────────────────────────────── */}
        <TabsContent value="sales-page" className="mt-4">
          <ContentCard
            title="Full Sales Page Copy"
            description="Complete sales page for your offer — headline, problem, solution, what's included, social proof, price, and CTA."
            icon="📄"
            accentClass="border-violet-200 bg-violet-50"
            clientId={clientId}
            contentType="sales-page"
            contentKey="full-page"
            saved={savedContent["sales-page:full-page"]}
            offerDetails={od}
            templateId={templateId}
          />
        </TabsContent>

        {/* ─── Private Podcast ──────────────────────────────────────────────────── */}
        <TabsContent value="podcast" className="space-y-4 mt-4">
          {[1, 2, 3, 4, 5, 6, 7].map((ep) => {
            const EPISODE_LABELS: Record<number, string> = {
              1: "Call out the big problem + why they're experiencing it",
              2: "Paint the future of the other side of the transformation",
              3: "Show how your framework is the bridge between problem and transformation",
              4: "Tell client stories or your own transformation / results",
              5: "Introduce the offer and your 3–5 Core Converting Concepts",
              6: "Speak about the tangible takeaway — features / deliverables",
              7: "Support structure and give the next step (Waitlist / launch dates)",
            };
            return (
              <ContentCard
                key={ep}
                title={`Episode ${ep}`}
                description={EPISODE_LABELS[ep]}
                icon="🎙"
                accentClass="border-teal-200 bg-teal-50"
                clientId={clientId}
                contentType="podcast"
                contentKey={`episode-${ep}`}
                saved={savedContent[`podcast:episode-${ep}`]}
                offerDetails={od}
                templateId={templateId}
              />
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentCard({
  title,
  description,
  icon,
  accentClass,
  clientId,
  contentType,
  contentKey,
  saved,
  offerDetails,
  templateId,
}: {
  title: string;
  description: string;
  icon: string;
  accentClass: string;
  clientId: string;
  contentType: string;
  contentKey: string;
  saved?: string;
  offerDetails: Record<string, string>;
  templateId: string;
}) {
  const [content, setContent] = useState(saved || "");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(!!saved);

  async function handleGenerate() {
    setGenerating(true);
    setExpanded(true);
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, contentKey, offerDetails, templateId }),
      });
      if (res.ok) {
        const { content: generated } = await res.json();
        setContent(generated);
        // Auto-save
        await saveGeneratedContent(clientId, contentType, contentKey, generated);
      }
    } catch (e) {
      console.error("Failed to generate:", e);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await saveGeneratedContent(clientId, contentType, contentKey, content);
    } finally {
      setSaving(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <button
          className="flex items-start gap-3 w-full text-left"
          onClick={() => setExpanded((e) => !e)}
        >
          <span className="text-xl">{icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{title}</CardTitle>
              {saved && (
                <Badge variant="secondary" className="text-xs">
                  Saved
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex-shrink-0">
            {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
        </button>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-3 pt-0">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-1" />
                  {content ? "Regenerate" : "Generate"}
                </>
              )}
            </Button>
            {content && (
              <>
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  {copied ? (
                    <><Check className="h-4 w-4 mr-1" />Copied</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-1" />Copy</>
                  )}
                </Button>
                <Button size="sm" variant="outline" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </div>

          {content && (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="font-mono text-sm"
            />
          )}

          {!content && !generating && (
            <div className={`rounded-lg border p-4 ${accentClass} text-sm text-muted-foreground text-center`}>
              Click Generate to create {title.toLowerCase()} using your offer details.
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
