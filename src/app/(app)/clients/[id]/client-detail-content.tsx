"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CoachingSnapshot } from "@/components/coaching-snapshot";
import { AddContentForm } from "@/components/add-content-form";
import { GoogleDocImport } from "@/components/google-doc-import";
import { regenerateSummary } from "@/lib/actions/content";
import { formatDateTime, timeAgo } from "@/lib/utils";
import {
  ArrowLeft,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  User,
  Package,
  FileText,
  MessageSquare,
  StickyNote,
  Mic,
  Clock,
  AlertCircle,
  History,
  Rocket,
  Settings,
  Zap,
} from "lucide-react";

type ContentEntry = {
  id: string;
  contentType: string;
  contentBody: string;
  sourceLabel: string;
  matchMethod: string | null;
  createdAt: Date;
};

type AiSummary = {
  id: string;
  currentFocus: string;
  milestones: string;
  nextSteps: string;
  generatedAt: Date;
};

type ActivityLogEntry = {
  id: string;
  action: string;
  source: string;
  matchMethod: string | null;
  createdAt: Date;
};

type ClientFull = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  startDate: Date;
  packageTier: string | null;
  status: string;
  assignedCoach: { id: string; name: string; email: string };
  contentEntries: ContentEntry[];
  aiSummaries: AiSummary[];
  activityLogs: ActivityLogEntry[];
};

interface ClientDetailContentProps {
  client: ClientFull;
  coaches: { id: string; name: string; email: string; role: string }[];
  currentUser: { id: string; name: string; role: string };
}

const contentTypeIcons: Record<string, React.ElementType> = {
  FORM: FileText,
  TRANSCRIPT: Mic,
  THREAD: MessageSquare,
  NOTE: StickyNote,
};

const contentTypeLabels: Record<string, string> = {
  FORM: "Form Submission",
  TRANSCRIPT: "Call Transcript",
  THREAD: "Chat Thread",
  NOTE: "Note",
};

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-gray-100 text-gray-800",
};

export function ClientDetailContent({
  client,
  coaches: _coaches,
  currentUser: _currentUser,
}: ClientDetailContentProps) {
  const router = useRouter();
  const [regenerating, setRegenerating] = useState(false);
  const [showAddContent, setShowAddContent] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const latestSummary = client.aiSummaries[0];
  const latestContent = client.contentEntries[0];
  const hasNewContent =
    latestContent &&
    latestSummary &&
    new Date(latestContent.createdAt) > new Date(latestSummary.generatedAt);

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      await regenerateSummary(client.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to regenerate:", error);
    } finally {
      setRegenerating(false);
    }
  }

  const filteredEntries =
    activeTab === "all"
      ? client.contentEntries
      : client.contentEntries.filter(
          (e) => e.contentType === activeTab.toUpperCase()
        );

  return (
    <div className="space-y-6">
      {/* Back link & header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/clients/${client.id}/setup`}>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Launch Setup
            </Button>
          </Link>
          <Link href={`/clients/${client.id}/launch`}>
            <Button variant="outline" size="sm">
              <Rocket className="h-4 w-4 mr-1" />
              Launch Plan
            </Button>
          </Link>
          <Link href={`/clients/${client.id}/content`}>
            <Button variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-1" />
              Content
            </Button>
          </Link>
        </div>
      </div>

      {/* Client Profile Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{client.fullName}</CardTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge
                  variant="secondary"
                  className={statusColors[client.status]}
                >
                  {client.status.toLowerCase()}
                </Badge>
                {client.packageTier && (
                  <Badge variant="outline">{client.packageTier}</Badge>
                )}
              </div>
            </div>
            <Link href={`/clients/${client.id}/edit`}>
              <Button variant="outline" size="sm">
                Edit Client
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Started{" "}
                {new Date(client.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Coach: {client.assignedCoach.name}</span>
            </div>
            {client.packageTier && (
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>{client.packageTier}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Coaching Snapshot */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Coaching Snapshot</h2>
          <div className="flex items-center gap-2">
            {hasNewContent && (
              <span className="flex items-center gap-1 text-xs text-amber-600">
                <AlertCircle className="h-3 w-3" />
                New content since last summary
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating}
            >
              <RefreshCw
                className={`h-4 w-4 mr-1 ${regenerating ? "animate-spin" : ""}`}
              />
              {regenerating ? "Generating..." : "Regenerate"}
            </Button>
          </div>
        </div>

        {latestSummary ? (
          <CoachingSnapshot
            currentFocus={latestSummary.currentFocus}
            milestones={latestSummary.milestones}
            nextSteps={latestSummary.nextSteps}
            generatedAt={latestSummary.generatedAt}
          />
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground mb-3">
                No AI summary generated yet.
              </p>
              <Button onClick={handleRegenerate} disabled={regenerating}>
                <RefreshCw
                  className={`h-4 w-4 mr-1 ${regenerating ? "animate-spin" : ""}`}
                />
                Generate Summary
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Content Entries */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold">Client Record</h2>
          <div className="flex gap-2">
            <GoogleDocImport clientId={client.id} />
            <Button size="sm" onClick={() => setShowAddContent(!showAddContent)}>
              {showAddContent ? "Cancel" : "Add Content"}
            </Button>
          </div>
        </div>

        {showAddContent && (
          <AddContentForm
            clientId={client.id}
            onSuccess={() => {
              setShowAddContent(false);
              router.refresh();
            }}
          />
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All ({client.contentEntries.length})
            </TabsTrigger>
            <TabsTrigger value="form">
              Forms (
              {
                client.contentEntries.filter((e) => e.contentType === "FORM")
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="transcript">
              Transcripts (
              {
                client.contentEntries.filter(
                  (e) => e.contentType === "TRANSCRIPT"
                ).length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="thread">
              Threads (
              {
                client.contentEntries.filter((e) => e.contentType === "THREAD")
                  .length
              }
              )
            </TabsTrigger>
            <TabsTrigger value="note">
              Notes (
              {
                client.contentEntries.filter((e) => e.contentType === "NOTE")
                  .length
              }
              )
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {filteredEntries.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No {activeTab === "all" ? "content" : `${activeTab}s`} yet.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredEntries.map((entry) => {
                  const Icon = contentTypeIcons[entry.contentType] || FileText;
                  return (
                    <Card key={entry.id}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-md bg-muted p-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {contentTypeLabels[entry.contentType]}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {entry.sourceLabel}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDateTime(entry.createdAt)}
                                {entry.matchMethod && (
                                  <Badge variant="outline" className="text-xs">
                                    via {entry.matchMethod.toLowerCase()}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">
                              {entry.contentBody}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Separator />

      {/* AI Summary History */}
      {client.aiSummaries.length > 1 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Summary History
          </h2>
          <div className="space-y-3">
            {client.aiSummaries.slice(1).map((summary) => (
              <Card key={summary.id} className="border-dashed">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground mb-2">
                    Generated {formatDateTime(summary.generatedAt)}
                  </p>
                  <div className="grid gap-2 md:grid-cols-3 text-sm">
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        Focus
                      </p>
                      <p>{summary.currentFocus}</p>
                    </div>
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        Milestones
                      </p>
                      <p>{summary.milestones}</p>
                    </div>
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        Next Steps
                      </p>
                      <p>{summary.nextSteps}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Activity Log</h2>
        {client.activityLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <div className="space-y-1">
            {client.activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 py-2 text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-muted-foreground"> — {log.source}</span>
                  {log.matchMethod && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {log.matchMethod.toLowerCase()}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {timeAgo(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
