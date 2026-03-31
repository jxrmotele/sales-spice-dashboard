"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { saveOfferDetails, saveLaunchPlan, KeyDates } from "@/lib/actions/launch";
import {
  OCT_ESSENTIALS,
  OCT_SECTIONS,
  OCT_ARENA_EXTRAS,
  MESSAGING_CODEX_SECTIONS,
  REQUIRED_OFFER_FIELDS,
} from "@/lib/setup-frameworks";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Zap,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const TEMPLATES = [
  {
    id: "arena",
    name: "Arena Launch",
    tagline: "Full conversion event launch",
    description:
      "The full launch framework: build your audience with a lead magnet, warm them up with content, run a live conversion event, then open and close cart.",
    color: "border-pink-400 bg-pink-50",
    badgeColor: "bg-pink-100 text-pink-800",
    keyDates: ["launchStart", "cartOpen", "cartClose"],
  },
  {
    id: "alpha",
    name: "Alpha Launch",
    tagline: "Waitlist-first launch",
    description:
      "Build a waitlist, nurture with daily emails, and open the cart to your most engaged subscribers first. Best for first launches or warm audiences.",
    color: "border-amber-400 bg-amber-50",
    badgeColor: "bg-amber-100 text-amber-800",
    keyDates: ["launchStart", "cartOpen", "cartClose"],
  },
];

const KEY_DATE_LABELS: Record<string, { arena: string; alpha: string }> = {
  launchStart: { arena: "Launch Start (lead magnet live)", alpha: "Waitlist Opens" },
  cartOpen: { arena: "Cart Open / Live Event", alpha: "Cart Open" },
  cartClose: { arena: "Cart Close", alpha: "Cart Close" },
};

const STEP_LABELS = ["Launch type", "Offer Clarity", "Your Messaging", "Key dates"];

interface Props {
  clientId: string;
  clientName: string;
  initialOfferDetails: Record<string, string>;
  initialLaunchPlan: {
    templateId: string;
    keyDates: KeyDates;
    taskCompletions: Record<string, boolean>;
    leadMagnetType: string | null;
  } | null;
}

export function SetupWizard({ clientId, clientName, initialOfferDetails, initialLaunchPlan }: Props) {
  const router = useRouter();
  const isEdit = !!initialLaunchPlan;

  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    initialLaunchPlan?.templateId || ""
  );
  const [offerDetails, setOfferDetails] = useState<Record<string, string>>(initialOfferDetails || {});
  const [keyDates, setKeyDates] = useState<KeyDates>(initialLaunchPlan?.keyDates || {});
  const [saving, setSaving] = useState(false);
  const [generatingCodex, setGeneratingCodex] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  function updateField(key: string, value: string) {
    setOfferDetails((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSection(num: number) {
    setExpandedSections((prev) => ({ ...prev, [num]: !prev[num] }));
  }

  const canProceedStep1 = !!selectedTemplate;
  const canProceedStep2 = REQUIRED_OFFER_FIELDS.every((k) => !!offerDetails[k]?.trim());
  const canProceedStep3 = true; // messaging codex is optional
  const canFinish = !!(keyDates.launchStart && keyDates.cartOpen && keyDates.cartClose);

  async function handleGenerateCodex() {
    setGeneratingCodex(true);
    try {
      const res = await fetch("/api/generate-codex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerDetails }),
      });
      if (res.ok) {
        const generated = await res.json();
        setOfferDetails((prev) => ({ ...prev, ...generated }));
      }
    } catch (e) {
      console.error("Failed to generate codex:", e);
    } finally {
      setGeneratingCodex(false);
    }
  }

  async function handleSaveAndFinish() {
    setSaving(true);
    try {
      await saveOfferDetails(clientId, offerDetails);
      await saveLaunchPlan(clientId, selectedTemplate, keyDates);
      router.push(`/clients/${clientId}/launch`);
    } catch (e) {
      console.error("Failed to save:", e);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveStep() {
    // Auto-save offer details whenever moving between steps
    if (Object.keys(offerDetails).length > 0) {
      await saveOfferDetails(clientId, offerDetails);
    }
  }

  function goNext() {
    handleSaveStep();
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goPrev() {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/clients/${clientId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{isEdit ? "Edit Launch Setup" : "Launch Setup"}</h1>
          <p className="text-muted-foreground text-sm">{clientName}</p>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const active = step === num;
          const done = step > num;
          return (
            <div key={num} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium transition-colors
                  ${done ? "bg-primary text-primary-foreground" : active ? "bg-primary/10 text-primary border-2 border-primary" : "bg-muted text-muted-foreground"}`}
              >
                {done ? <Check className="h-4 w-4" /> : num}
              </div>
              <span className={`text-sm hidden sm:inline ${active ? "font-medium" : "text-muted-foreground"}`}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`h-px w-6 sm:w-12 ${done ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* ─── Step 1: Launch Type ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Choose your launch type</h2>
            <p className="text-sm text-muted-foreground">
              This determines the phases, tasks, and email sequences in the launch plan.
            </p>
          </div>
          <div className="grid gap-4">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedTemplate === t.id
                    ? t.color + " border-opacity-100"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={selectedTemplate === t.id ? t.badgeColor : ""} variant={selectedTemplate === t.id ? "secondary" : "outline"}>
                    {t.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{t.tagline}</span>
                  {selectedTemplate === t.id && (
                    <Check className="h-4 w-4 text-primary ml-auto" />
                  )}
                </div>
                <p className="text-sm">{t.description}</p>
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={goNext} disabled={!canProceedStep1}>
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ─── Step 2: Offer Clarity Template ──────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Offer Clarity Template</h2>
            <p className="text-sm text-muted-foreground">
              These answers become the placeholders used across all your launch content. Fill in as much as you can — the more specific, the better.
            </p>
          </div>

          {/* Essentials */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Essentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {OCT_ESSENTIALS.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <Label htmlFor={field.key}>
                      {field.label}
                      {field.required && <span className="text-destructive ml-1">*</span>}
                    </Label>
                    <Input
                      id={field.key}
                      placeholder={field.placeholder}
                      value={offerDetails[field.key] || ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">{field.hint}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* OCT Sections */}
          {OCT_SECTIONS.map((section) => {
            const isExpanded = expandedSections[section.number] !== false; // default open
            const filledCount = section.fields.filter((f) => !!offerDetails[f.key]?.trim()).length;
            return (
              <Card key={section.number}>
                <CardHeader className="pb-0">
                  <button
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => toggleSection(section.number)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                        {section.number}
                      </span>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                      {filledCount === section.fields.length && filledCount > 0 && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-3 space-y-4">
                    <p className="text-sm text-muted-foreground">{section.context}</p>
                    <div className="text-xs font-mono bg-muted px-3 py-2 rounded italic text-muted-foreground">
                      {section.templateText}
                    </div>
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-1">
                        <Label htmlFor={field.key}>
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {field.textarea ? (
                          <Textarea
                            id={field.key}
                            placeholder={field.placeholder}
                            value={offerDetails[field.key] || ""}
                            onChange={(e) => updateField(field.key, e.target.value)}
                            rows={3}
                          />
                        ) : (
                          <Input
                            id={field.key}
                            placeholder={field.placeholder}
                            value={offerDetails[field.key] || ""}
                            onChange={(e) => updateField(field.key, e.target.value)}
                          />
                        )}
                        {field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>}
                      </div>
                    ))}

                    {/* Arena extras after section 6 */}
                    {section.number === 6 && selectedTemplate === "arena" && (
                      <>
                        <Separator />
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Arena extras</p>
                        {OCT_ARENA_EXTRAS.map((field) => (
                          <div key={field.key} className="space-y-1">
                            <Label htmlFor={field.key}>{field.label}</Label>
                            <Input
                              id={field.key}
                              placeholder={field.placeholder}
                              value={offerDetails[field.key] || ""}
                              onChange={(e) => updateField(field.key, e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">{field.hint}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={goPrev}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={goNext} disabled={!canProceedStep2}>
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ─── Step 3: Messaging Codex ──────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Your Messaging</h2>
            <p className="text-sm text-muted-foreground">
              The persuasion elements that make your content convert. You can fill these in manually or generate a first draft using AI based on your offer details.
            </p>
          </div>

          {/* AI generate button */}
          <Card className="border-dashed">
            <CardContent className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium">Generate with AI</p>
                <p className="text-xs text-muted-foreground">
                  Claude will write a first draft of your messaging based on your offer clarity answers. You can edit any field afterwards.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleGenerateCodex}
                disabled={generatingCodex || !canProceedStep2}
              >
                {generatingCodex ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-1" />
                    Generate messaging
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {MESSAGING_CODEX_SECTIONS.map((section) => (
            <Card key={section.title}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{section.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{section.subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-1">
                    <Label htmlFor={`codex-${field.key}`}>{field.label}</Label>
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                    {field.textarea ? (
                      <Textarea
                        id={`codex-${field.key}`}
                        placeholder={field.placeholder}
                        value={offerDetails[field.key] || ""}
                        onChange={(e) => updateField(field.key, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <Input
                        id={`codex-${field.key}`}
                        placeholder={field.placeholder}
                        value={offerDetails[field.key] || ""}
                        onChange={(e) => updateField(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={goPrev}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={goNext}>
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* ─── Step 4: Key Dates ────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Key dates</h2>
            <p className="text-sm text-muted-foreground">
              All task due dates in the launch plan are calculated automatically from these three dates.
            </p>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-5">
              {(["launchStart", "cartOpen", "cartClose"] as const).map((key) => {
                const labels = KEY_DATE_LABELS[key];
                const label = selectedTemplate === "arena" ? labels.arena : labels.alpha;
                return (
                  <div key={key} className="space-y-1">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="date"
                      value={keyDates[key] || ""}
                      onChange={(e) => setKeyDates((prev) => ({ ...prev, [key]: e.target.value }))}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={goPrev}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button onClick={handleSaveAndFinish} disabled={saving || !canFinish}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  {isEdit ? "Save changes" : "Build launch plan"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
