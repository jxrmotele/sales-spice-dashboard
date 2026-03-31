"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient, updateClient, deleteClient } from "@/lib/actions/clients";

interface ClientFormProps {
  coaches: { id: string; name: string; email: string; role: string }[];
  currentUser: { id: string; name: string; role: string };
  client?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    packageTier: string;
    status: string;
    assignedCoachId: string;
  };
}

export function ClientForm({ coaches, currentUser, client }: ClientFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isEditing = !!client;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      if (isEditing) {
        formData.set("id", client.id);
        await updateClient(formData);
        router.push(`/clients/${client.id}`);
      } else {
        const result = await createClient(formData);
        if (result.success) {
          router.push(`/clients/${result.clientId}`);
        }
      }
    } catch (err) {
      setError("Failed to save. Please check your input.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!client || !confirm("Are you sure you want to delete this client? This cannot be undone.")) {
      return;
    }
    setSubmitting(true);
    try {
      await deleteClient(client.id);
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to delete client.");
      console.error(err);
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={client?.fullName}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={client?.email}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={client?.phone}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packageTier">Package / Tier</Label>
              <Input
                id="packageTier"
                name="packageTier"
                placeholder="e.g. Premium, Standard"
                defaultValue={client?.packageTier}
              />
            </div>

            {isEditing && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select name="status" defaultValue={client?.status || "ACTIVE"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PAUSED">Paused</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentUser.role === "ADMIN" && coaches.length > 0 ? (
              <div className="space-y-2">
                <Label>Assigned Coach *</Label>
                <Select
                  name="assignedCoachId"
                  defaultValue={client?.assignedCoachId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a coach" />
                  </SelectTrigger>
                  <SelectContent>
                    {coaches.map((coach) => (
                      <SelectItem key={coach.id} value={coach.id}>
                        {coach.name} ({coach.role.toLowerCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <input type="hidden" name="assignedCoachId" value={currentUser.id} />
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-between pt-2">
            <div>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={submitting}
                >
                  Delete Client
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Client"
                    : "Create Client"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
