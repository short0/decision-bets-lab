import { Badge } from "@/components/ui/badge";
import { Sparkles, Cpu } from "lucide-react";
import type { Mode } from "@/lib/lab-store";

export function ModeBadge({ mode }: { mode: Mode }) {
  if (mode === "live") {
    return (
      <Badge className="gap-1 bg-warning text-warning-foreground hover:bg-warning">
        <Cpu className="h-3 w-3" /> Live LLM
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1">
      <Sparkles className="h-3 w-3" /> Simulated
    </Badge>
  );
}
