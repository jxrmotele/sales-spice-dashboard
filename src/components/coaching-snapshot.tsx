import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Flag, ArrowRight } from "lucide-react";

interface CoachingSnapshotProps {
  currentFocus: string;
  milestones: string;
  nextSteps: string;
  generatedAt?: Date | string;
  compact?: boolean;
}

export function CoachingSnapshot({
  currentFocus,
  milestones,
  nextSteps,
  generatedAt,
  compact = false,
}: CoachingSnapshotProps) {
  if (compact) {
    return (
      <div className="text-sm text-muted-foreground space-y-1">
        <p className="line-clamp-2">
          <span className="font-medium text-foreground">Focus:</span>{" "}
          {currentFocus}
        </p>
        <p className="line-clamp-1">
          <span className="font-medium text-foreground">Next:</span>{" "}
          {nextSteps}
        </p>
      </div>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Coaching Snapshot</h3>
          {generatedAt && (
            <Badge variant="outline" className="text-xs">
              Generated{" "}
              {new Date(generatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </Badge>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Target className="h-3.5 w-3.5" />
              Current Focus
            </div>
            <p className="text-sm">{currentFocus}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <Flag className="h-3.5 w-3.5" />
              Milestones
            </div>
            <p className="text-sm">{milestones}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
              <ArrowRight className="h-3.5 w-3.5" />
              Next Steps
            </div>
            <p className="text-sm">{nextSteps}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
