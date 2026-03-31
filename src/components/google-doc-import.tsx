"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { importGoogleDoc } from "@/lib/actions/content";
import { FileDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface GoogleDocImportProps {
  clientId: string;
}

export function GoogleDocImport({ clientId }: GoogleDocImportProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setImporting(true);

    try {
      const result = await importGoogleDoc(clientId, url);
      if (result.success) {
        setOpen(false);
        setUrl("");
        router.refresh();
      } else {
        setError(result.error || "Import failed");
      }
    } catch {
      setError("Failed to import document");
    } finally {
      setImporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileDown className="h-4 w-4 mr-1" />
          Import Google Doc
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import from Google Docs</DialogTitle>
          <DialogDescription>
            Paste the URL of a Google Doc to import its content as a transcript.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleImport} className="space-y-4">
          <div className="space-y-2">
            <Label>Google Doc URL</Label>
            <Input
              placeholder="https://docs.google.com/document/d/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={importing}>
              {importing ? "Importing..." : "Import"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
