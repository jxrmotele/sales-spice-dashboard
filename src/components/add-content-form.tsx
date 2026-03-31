"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addContent } from "@/lib/actions/content";

interface AddContentFormProps {
  clientId: string;
  onSuccess: () => void;
}

export function AddContentForm({ clientId, onSuccess }: AddContentFormProps) {
  const [contentType, setContentType] = useState<string>("NOTE");
  const [sourceLabel, setSourceLabel] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [regenerate, setRegenerate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await addContent({
        clientId,
        contentType: contentType as "FORM" | "TRANSCRIPT" | "THREAD" | "NOTE",
        contentBody,
        sourceLabel,
        regenerateSummary: regenerate,
      });
      onSuccess();
    } catch (err) {
      setError("Failed to add content. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Add Content</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FORM">Form Submission</SelectItem>
                  <SelectItem value="TRANSCRIPT">Call Transcript</SelectItem>
                  <SelectItem value="THREAD">Chat Thread</SelectItem>
                  <SelectItem value="NOTE">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Source Label</Label>
              <Input
                placeholder='e.g. "Zoom Call — 14 Feb 2026"'
                value={sourceLabel}
                onChange={(e) => setSourceLabel(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              placeholder="Paste the content here..."
              rows={8}
              value={contentBody}
              onChange={(e) => setContentBody(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="regenerate"
              checked={regenerate}
              onChange={(e) => setRegenerate(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="regenerate" className="text-sm font-normal">
              Regenerate AI summary after saving
            </Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Content"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
