import { cn } from "@/lib/utils";

type Props = {
  decisionQuality: "good" | "poor";
  outcomeQuality: "good" | "poor";
};

export function ResultingMatrix({ decisionQuality, outcomeQuality }: Props) {
  const cells = [
    { d: "good", o: "good", label: "Deserved win", short: "Good / Good" },
    { d: "good", o: "poor", label: "Bad luck", short: "Good / Poor" },
    { d: "poor", o: "good", label: "Lucky win", short: "Poor / Good" },
    { d: "poor", o: "poor", label: "Earned loss", short: "Poor / Poor" },
  ] as const;

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Decision × Outcome
        </h4>
      </div>
      <div className="grid grid-cols-[auto_1fr_1fr] gap-1 text-xs">
        <div></div>
        <div className="px-2 py-1 text-center text-muted-foreground">Outcome good</div>
        <div className="px-2 py-1 text-center text-muted-foreground">Outcome poor</div>

        <div className="flex items-center px-1 text-muted-foreground">Decision good</div>
        {cells.slice(0, 2).map((c) => {
          const active = c.d === decisionQuality && c.o === outcomeQuality;
          return (
            <div
              key={c.short}
              className={cn(
                "rounded-md border p-2 text-center transition-colors",
                active
                  ? "border-foreground/40 bg-accent font-medium"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {c.label}
            </div>
          );
        })}

        <div className="flex items-center px-1 text-muted-foreground">Decision poor</div>
        {cells.slice(2).map((c) => {
          const active = c.d === decisionQuality && c.o === outcomeQuality;
          return (
            <div
              key={c.short}
              className={cn(
                "rounded-md border p-2 text-center transition-colors",
                active
                  ? "border-foreground/40 bg-accent font-medium"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {c.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
