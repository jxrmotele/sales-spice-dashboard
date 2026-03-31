"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoachingSnapshot } from "@/components/coaching-snapshot";
import { timeAgo } from "@/lib/utils";
import {
  Users,
  Plus,
  Search,
  AlertCircle,
  Clock,
} from "lucide-react";
import { useState } from "react";

type ClientWithRelations = {
  id: string;
  fullName: string;
  email: string;
  status: string;
  packageTier: string | null;
  updatedAt: Date;
  assignedCoach: { id: string; name: string; email: string };
  aiSummaries: {
    id: string;
    currentFocus: string;
    milestones: string;
    nextSteps: string;
    generatedAt: Date;
  }[];
  contentEntries: { createdAt: Date }[];
};

interface DashboardContentProps {
  clients: ClientWithRelations[];
  coaches: { id: string; name: string; email: string; role: string }[];
  currentUser: { id: string; name: string; role: string };
  filters: { coach?: string; status?: string; search?: string };
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  PAUSED: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-gray-100 text-gray-800",
};

export function DashboardContent({
  clients,
  coaches,
  currentUser,
  filters,
}: DashboardContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search || "");

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/dashboard?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("search", searchValue);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            {clients.length} client{clients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/clients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-9"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="hidden sm:flex">
            Search
          </Button>
        </form>

        <Select
          value={filters.status || "all"}
          onValueChange={(v) => updateFilter("status", v)}
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PAUSED">Paused</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>

        {currentUser.role === "ADMIN" && coaches.length > 0 && (
          <Select
            value={filters.coach || "all"}
            onValueChange={(v) => updateFilter("coach", v)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Coach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All coaches</SelectItem>
              {coaches.map((coach) => (
                <SelectItem key={coach.id} value={coach.id}>
                  {coach.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Client Cards */}
      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No clients found. Create your first client to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => {
            const latestSummary = client.aiSummaries[0];
            const latestContent = client.contentEntries[0];
            const hasNewContent =
              latestContent &&
              latestSummary &&
              new Date(latestContent.createdAt) >
                new Date(latestSummary.generatedAt);

            return (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-semibold">{client.fullName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {client.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant="secondary"
                          className={statusColors[client.status]}
                        >
                          {client.status.toLowerCase()}
                        </Badge>
                        {client.packageTier && (
                          <Badge variant="outline">{client.packageTier}</Badge>
                        )}
                        {currentUser.role === "ADMIN" && (
                          <Badge variant="outline" className="text-xs">
                            {client.assignedCoach.name}
                          </Badge>
                        )}

                        {/* Summary freshness indicator */}
                        {latestSummary && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              Summary {timeAgo(latestSummary.generatedAt)}
                            </span>
                            {hasNewContent && (
                              <span className="flex items-center gap-0.5 text-amber-600">
                                <AlertCircle className="h-3 w-3" />
                                new content
                              </span>
                            )}
                          </div>
                        )}
                        {!latestSummary && (
                          <span className="text-xs text-muted-foreground italic">
                            No summary yet
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {latestSummary ? (
                      <CoachingSnapshot
                        currentFocus={latestSummary.currentFocus}
                        milestones={latestSummary.milestones}
                        nextSteps={latestSummary.nextSteps}
                        compact
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Generate an AI summary to see the coaching snapshot.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
