"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Check,
  Circle,
  Settings,
  Zap,
  ChevronDown,
  ChevronUp,
  Flame,
  BookOpen,
  Mic,
} from "lucide-react";
import { LaunchTemplate, LaunchTask, KeyDates, computeTaskDate } from "@/lib/launch-templates";
import { toggleTaskCompletion, saveLeadMagnetType } from "@/lib/actions/launch";

interface Props {
  clientId: string;
  clientName: string;
  template: LaunchTemplate;
  offerDetails: Record<string, string>;
  launchPlan: {
    templateId: string;
    keyDates: KeyDates;
    taskCompletions: Record<string, boolean>;
    leadMagnetType: string | null;
  };
}

const LEAD_MAGNET_TYPES = [
  {
    id: "training",
    name: "Pre-recorded Private Training",
    icon: Mic,
    description: "Follow the Superfans 60 framework exactly, but aim for 30–45 minutes when recording.",
  },
  {
    id: "playbook",
    name: "Playbook (Google Doc / Ebook)",
    icon: BookOpen,
    description: "7-chapter Google Doc written like an ebook/guide. Follow the same chapter structure as the Private Podcast series.",
    chapters: [
      "Ch 1 — Call out the big problem + why they're experiencing it",
      "Ch 2 — Paint the future of the other side of the transformation",
      "Ch 3 — Show how your specific skill or framework is the bridge",
      "Ch 4 — Tell client stories or your own transformation",
      "Ch 5 — Introduce the offer and your 3–5 Core Converting Concepts",
      "Ch 6 — Speak about tangible takeaways — features / deliverables",
      "Ch 7 — Support structure and next step (Waitlist, pre-sale or launch dates)",
    ],
  },
  {
    id: "podcast",
    name: "Private Podcast (7 episodes)",
    icon: Mic,
    description: "Take the listener on the buyer's journey. Each episode should include a CTA — don't over-teach and forget to sell!",
    episodes: [
      "Ep 1 — Call out the big problem + why they're experiencing it",
      "Ep 2 — Paint the 'future' of the other side of the transformation",
      "Ep 3 — Show how your specific skill or framework is the 'bridge'",
      "Ep 4 — Tell client stories or your own transformation / results",
      "Ep 5 — Introduce the offer and your 3–5 Core Converting Concepts",
      "Ep 6 — Speak about tangible takeaway — features / deliverables",
      "Ep 7 — Speak about how you support them and give the next step",
    ],
  },
];

const SUPERFANS_60_SECTIONS = [
  { section: "1. Hook", time: "1 min", description: "Bold/surprising/counterintuitive statement. Creates open loop. Earns right to their attention.", formula: '"What if everything you\'ve been taught about [topic] is wrong?" / "In the next 60 minutes I\'m going to show you [specific result]."', mistake: "Stalling, chatting, ignoring the room." },
  { section: "2. Symptom", time: "1 min", description: "\"You're here because…\" Name 2–3 escalating pain points they're experiencing. Goal: make them feel seen.", formula: null, mistake: "Being vague/too big picture." },
  { section: "3. Tease", time: "1 min", description: '"Before we dive in… if you stay until the end…" Offer something (Q&A, audit, resource) only for those who stay live. Remind at beginning, middle, and end.', formula: null, mistake: "Not repeating/reminding." },
  { section: "4. Promise", time: "1 min", description: '"By the end of this private training you\'ll have…" Paint the transformation they\'ll have just from watching.', formula: null, mistake: "Not being excited about it." },
  { section: "5. Position", time: "2–3 min", description: '"I used to…" Your expertise arc: I\'ve been where you are → tried common approach, it didn\'t work → discovered new way → here\'s where I am now.', formula: null, mistake: "Making it about you vs them. They need to see themselves in your struggle." },
  { section: "6. Shift", time: "2 min", description: '"You think your problem has been THIS… it\'s really THIS." Overcome their biggest objection / shift the belief blocking your solution.', formula: null, mistake: "Too many shifts — focus on THE ONE main shift." },
  { section: "7. 3 Strategies", time: "20 min", description: '"Now I\'m going to share the 3 strategies / steps / secrets to [TRANSFORMATION]." GET TO OFFER BEFORE 45 MINS! Per strategy: Introduce → Why similar strategies haven\'t worked → What really works → Before state → After state → Client story → Testimonial → Bridge back to how offer covers it.', formula: null, mistake: "Overteaching. Not bridging back to offer." },
  { section: "8. Lock-In", time: "1 min", description: '"So can you see…" Summarise what was covered. Make them see necessity of what you\'re sharing. Get chat reactions.', formula: null, mistake: "Skipping and going straight to offer." },
  { section: "9. Bridge", time: null, description: '"How many of you would like to [hear about how you can get this result yourself]?" Get consent to pitch.', formula: null, mistake: "Skipping. Apologising for the pitch. Telling people they can leave." },
  { section: "10. Offer", time: null, description: '"I want to introduce to you…" Reveal the offer anchored to the transformation. Do NOT reveal price yet — build perceived value first.', formula: null, mistake: "Going straight to curriculum/features." },
  { section: "11. Stack", time: null, description: '"Here\'s everything you\'re going to get…" Slide by slide. Let viewers mentally add up value. Show you\'ve over-invested in making results frictionless.', formula: null, mistake: "Jumping to price or putting full stack on 1–3 slides." },
  { section: "12. Bonuses", time: null, description: '"There\'s one more thing…" Bonus for live attendees only + 1–2 bonuses for joining within 48 hours.', formula: null, mistake: null },
  { section: "13. Close", time: null, description: "Direct CTA. Real urgency: cohort start date, bonus deadline, next launch date, price rising.", formula: null, mistake: "Just ending it without a proper close." },
  { section: "14. FAQs", time: null, description: '"I know you have Qs…" Frame objections as FAQs. Use WWWWWH pointers from Open Cart Content Plan. Position questions positively.', formula: null, mistake: "Reinforcing the objection." },
];

function fill(text: string, od: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => od[key] || `{{${key}}}`);
}

function formatDate(d: Date | null): string {
  if (!d) return "TBD";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function LaunchPlanContent({ clientId, clientName, template, offerDetails, launchPlan }: Props) {
  const router = useRouter();
  const [completions, setCompletions] = useState<Record<string, boolean>>(
    launchPlan.taskCompletions || {}
  );
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>(
    Object.fromEntries(template.phases.map((p) => [p.id, true]))
  );
  const [leadMagnetType, setLeadMagnetType] = useState<string | null>(launchPlan.leadMagnetType);

  const totalTasks = template.phases.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedCount = Object.values(completions).filter(Boolean).length;

  async function handleToggle(taskId: string, checked: boolean) {
    setCompletions((prev) => ({ ...prev, [taskId]: checked }));
    await toggleTaskCompletion(clientId, taskId, checked);
  }

  async function handleLeadMagnetType(type: string) {
    setLeadMagnetType(type);
    await saveLeadMagnetType(clientId, type);
    router.refresh();
  }

  function toggleTask(taskId: string) {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  }

  function togglePhase(phaseId: number) {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/clients/${clientId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Launch Plan</h1>
              <Badge variant="outline">{template.name}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{clientName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {completedCount}/{totalTasks} complete
          </span>
          <Link href={`/clients/${clientId}/content`}>
            <Button variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-1" />
              Generate content
            </Button>
          </Link>
          <Link href={`/clients/${clientId}/setup`}>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Edit setup
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%` }}
        />
      </div>

      {/* Key dates */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(template.keyDateLabels).map(([key, label]) => (
          <Card key={key} className="text-center">
            <CardContent className="pt-3 pb-3">
              <p className="text-xs text-muted-foreground">{label.label}</p>
              <p className="text-sm font-medium">
                {launchPlan.keyDates[key as keyof KeyDates]
                  ? new Date(launchPlan.keyDates[key as keyof KeyDates]!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                  : "Not set"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Phases */}
      {template.phases.map((phase) => {
        const phaseComplete = phase.tasks.every((t) => completions[t.id]);
        const phaseCount = phase.tasks.filter((t) => completions[t.id]).length;
        const isExpanded = expandedPhases[phase.id] !== false;

        return (
          <div key={phase.id} className="space-y-2">
            <button
              className="w-full flex items-center gap-3 text-left group"
              onClick={() => togglePhase(phase.id)}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: phase.color }}
              />
              <span className="font-semibold">
                Phase {phase.id}: {phase.name}
              </span>
              <span className="text-xs text-muted-foreground">{phase.tagline}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {phaseCount}/{phase.tasks.length}
              </span>
              {phaseComplete && <Check className="h-4 w-4 text-green-600" />}
              {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {isExpanded && (
              <div className="space-y-2 ml-5">
                {phase.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    completed={!!completions[task.id]}
                    expanded={!!expandedTasks[task.id]}
                    keyDates={launchPlan.keyDates}
                    offerDetails={offerDetails}
                    leadMagnetType={leadMagnetType}
                    onToggle={(checked) => handleToggle(task.id, checked)}
                    onExpand={() => toggleTask(task.id)}
                    onLeadMagnetType={handleLeadMagnetType}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TaskCard({
  task,
  completed,
  expanded,
  keyDates,
  offerDetails,
  leadMagnetType,
  onToggle,
  onExpand,
  onLeadMagnetType,
}: {
  task: LaunchTask;
  completed: boolean;
  expanded: boolean;
  keyDates: KeyDates;
  offerDetails: Record<string, string>;
  leadMagnetType: string | null;
  onToggle: (checked: boolean) => void;
  onExpand: () => void;
  onLeadMagnetType: (type: string) => void;
}) {
  const dueDate = computeTaskDate(task, keyDates);
  const od = offerDetails;

  const badges = [];
  if (task.sequence) badges.push(task.sequence.replace(/-/g, " "));
  if (task.leadMagnetPicker) badges.push("lead magnet");
  if (task.salesPageBuilder) badges.push("sales page");
  if (task.superfans60Script) badges.push("superfans 60");

  return (
    <Card className={`transition-colors ${completed ? "opacity-60" : ""}`}>
      <CardContent className="pt-3 pb-3">
        <div className="flex items-start gap-3">
          <button
            className="mt-0.5 flex-shrink-0"
            onClick={() => onToggle(!completed)}
          >
            {completed ? (
              <Check className="h-5 w-5 text-green-600 bg-green-100 rounded-full p-0.5" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <button
              className="flex items-center gap-2 w-full text-left"
              onClick={onExpand}
            >
              <span className={`text-sm font-medium ${completed ? "line-through text-muted-foreground" : ""}`}>
                {task.name}
              </span>
              {badges.map((b) => (
                <Badge key={b} variant="outline" className="text-xs hidden sm:inline-flex">
                  {b}
                </Badge>
              ))}
              <span className="ml-auto text-xs text-muted-foreground flex-shrink-0">
                {formatDate(dueDate)}
              </span>
              {expanded ? (
                <ChevronUp className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            {expanded && (
              <div className="mt-3 space-y-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {fill(task.description, od)}
                </p>

                {/* Lead Magnet Picker */}
                {task.leadMagnetPicker && (
                  <LeadMagnetPicker
                    selected={leadMagnetType}
                    onSelect={onLeadMagnetType}
                  />
                )}

                {/* Superfans 60 Script */}
                {task.superfans60Script && <Superfans60Script offerDetails={od} />}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeadMagnetPicker({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (type: string) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(selected);

  return (
    <div className="space-y-2 border rounded-lg p-3 bg-muted/30">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Choose your lead magnet format
      </p>
      {LEAD_MAGNET_TYPES.map((type) => {
        const Icon = type.icon;
        const isSelected = selected === type.id;
        const isOpen = expanded === type.id;
        return (
          <div key={type.id} className={`border rounded-lg bg-background transition-colors ${isSelected ? "border-primary" : ""}`}>
            <button
              className="w-full flex items-center gap-3 p-3 text-left"
              onClick={() => {
                onSelect(type.id);
                setExpanded(isOpen ? null : type.id);
              }}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium flex-1">{type.name}</span>
              {isSelected && <Check className="h-4 w-4 text-primary" />}
              {isOpen ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
            </button>
            {isOpen && (
              <div className="px-3 pb-3 space-y-2 border-t pt-3">
                <p className="text-sm text-muted-foreground">{type.description}</p>
                {type.chapters && (
                  <ul className="space-y-1">
                    {type.chapters.map((ch, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="flex-shrink-0 font-medium">{i + 1}.</span>
                        <span>{ch.replace(/^Ch \d+ — /, "")}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {type.episodes && (
                  <ul className="space-y-1">
                    {type.episodes.map((ep, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="flex-shrink-0 font-medium">Ep {i + 1}.</span>
                        <span>{ep.replace(/^Ep \d+ — /, "")}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Superfans60Script({ offerDetails }: { offerDetails: Record<string, string> }) {
  const [openSection, setOpenSection] = useState<number | null>(null);
  const od = offerDetails;

  return (
    <div className="space-y-2 border rounded-lg p-3 bg-muted/30">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="h-4 w-4 text-orange-500" />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Superfans 60 — Live Event Script Framework
        </p>
      </div>
      {SUPERFANS_60_SECTIONS.map((s, i) => {
        const isOpen = openSection === i;
        return (
          <div key={i} className="border rounded-lg bg-background">
            <button
              className="w-full flex items-center gap-3 p-3 text-left"
              onClick={() => setOpenSection(isOpen ? null : i)}
            >
              <span className="text-sm font-medium flex-1">{s.section}</span>
              {s.time && <Badge variant="outline" className="text-xs">{s.time}</Badge>}
              {isOpen ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
            </button>
            {isOpen && (
              <div className="px-3 pb-3 border-t pt-3 space-y-2">
                <p className="text-sm">{fill(s.description, od)}</p>
                {s.formula && (
                  <div className="text-xs font-mono bg-muted rounded px-3 py-2 italic">
                    {fill(s.formula, od)}
                  </div>
                )}
                {s.mistake && (
                  <div className="flex items-start gap-2 text-xs text-destructive bg-destructive/5 rounded px-3 py-2">
                    <span className="font-medium flex-shrink-0">Mistake:</span>
                    <span>{s.mistake}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
