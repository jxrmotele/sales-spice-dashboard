"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignUnmatchedEntry,
  deleteUnmatchedEntry,
} from "@/lib/actions/unmatched";
import { formatDateTime } from "@/lib/utils";
import { Inbox, Trash2, UserPlus } from "lucide-react";

type UnmatchedEntry = {
  id: string;
  email: string | null;
  fullName: string | null;
  contentType: string;
  contentBody: string;
  sourceLabel: string;
  suggestedClientIds: string; // JSON string of client IDs
  matchAttemptDetails: string | null;
  createdAt: Date;
};

type ClientOption = {
  id: string;
  fullName: string;
  email: string;
};

interface InboxContentProps {
  entries: UnmatchedEntry[];
  clients: ClientOption[];
}

const contentTypeLabels: Record<string, string> = {
  FORM: "Form",
  TRANSCRIPT: "Transcript",
  THREAD: "Thread",
  NOTE: "Note",
};

export function InboxContent({ entries, clients }: InboxContentProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Unmatched Inbox</h1>
        <p className="text-muted-foreground">
          {entries.length} item{entries.length !== 1 ? "s" : ""} waiting for
          assignment
        </p>
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No unmatched items. All incoming content has been matched to
              clients.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <UnmatchedEntryCard
              key={entry.id}
              entry={entry}
              clients={clients}
              onAction={() => router.refresh()}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function UnmatchedEntryCard({
  entry,
  clients,
  onAction,
}: {
  entry: UnmatchedEntry;
  clients: ClientOption[];
  onAction: () => void;
}) {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [regenerate, setRegenerate] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Parse suggested client IDs from JSON string
  const suggestedIds: string[] = (() => {
    try { return JSON.parse(entry.suggestedClientIds); } catch { return []; }
  })();

  // Put suggested clients first
  const sortedClients = [...clients].sort((a, b) => {
    const aIsSuggested = suggestedIds.includes(a.id);
    const bIsSuggested = suggestedIds.includes(b.id);
    if (aIsSuggested && !bIsSuggested) return -1;
    if (!aIsSuggested && bIsSuggested) return 1;
    return a.fullName.localeCompare(b.fullName);
  });

  async function handleAssign() {
    if (!selectedClientId) return;
    setAssigning(true);
    try {
      await assignUnmatchedEntry(entry.id, selectedClientId, regenerate);
      onAction();
    } catch (err) {
      console.error("Failed to assign:", err);
    } finally {
      setAssigning(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Discard this unmatched item? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteUnmatchedEntry(entry.id);
      onAction();
    } catch (err) {
      console.error("Failed to delete:", err);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {contentTypeLabels[entry.contentType] || entry.contentType}
            </Badge>
            <span className="text-sm font-medium">{entry.sourceLabel}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDateTime(entry.createdAt)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Identity info */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          {entry.email && <span>Email: {entry.email}</span>}
          {entry.fullName && <span>Name: {entry.fullName}</span>}
        </div>

        {/* Match attempt details */}
        {entry.matchAttemptDetails && (
          <p className="text-xs text-muted-foreground bg-muted rounded px-3 py-2">
            {entry.matchAttemptDetails}
          </p>
        )}

        {/* Content preview */}
        <div className="text-sm bg-muted/50 rounded p-3 max-h-40 overflow-y-auto whitespace-pre-wrap">
          {entry.contentBody.length > 500
            ? entry.contentBody.substring(0, 500) + "..."
            : entry.contentBody}
        </div>

        {/* Assignment controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 pt-2 border-t">
          <div className="flex-1 w-full sm:w-auto space-y-2">
            <label className="text-sm font-medium">Assign to client</label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a client..." />
              </SelectTrigger>
              <SelectContent>
                {sortedClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.fullName} ({client.email})
                    {suggestedIds.includes(client.id) &&
                      " — suggested"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`regen-${entry.id}`}
              checked={regenerate}
              onChange={(e) => setRegenerate(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor={`regen-${entry.id}`} className="text-xs">
              Regenerate summary
            </label>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAssign}
              disabled={!selectedClientId || assigning}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {assigning ? "Assigning..." : "Assign"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Discard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
