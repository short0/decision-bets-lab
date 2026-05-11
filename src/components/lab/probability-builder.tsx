import { useLabStore, normalizeProbabilities } from "@/lib/lab-store";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Scale } from "lucide-react";

export function ProbabilityBuilder() {
  const state = useLabStore((s) => s.state);
  const apply = useLabStore((s) => s.apply);

  const total = Math.round(state.outcomes.reduce((a, o) => a + o.probability, 0));
  const isBalanced = Math.abs(total - 100) <= 1;

  const updateOutcome = (id: string, patch: Partial<{ label: string; probability: number }>) => {
    apply({
      outcomes: state.outcomes.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    });
  };

  const addOutcome = () => {
    const nextId = String.fromCharCode(97 + state.outcomes.length);
    apply({
      outcomes: [
        ...state.outcomes,
        { id: nextId, label: `Outcome ${nextId.toUpperCase()}`, probability: 10 },
      ],
    });
  };

  const removeOutcome = (id: string) => {
    if (state.outcomes.length <= 2) return;
    apply({
      outcomes: state.outcomes.filter((o) => o.id !== id),
      selectedActualOutcomeId:
        state.selectedActualOutcomeId === id
          ? state.outcomes.find((o) => o.id !== id)!.id
          : state.selectedActualOutcomeId,
    });
  };

  const normalize = () => {
    apply({ outcomes: normalizeProbabilities(state.outcomes) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Probability builder</h3>
          <p className="text-xs text-muted-foreground">
            Total: <span className={isBalanced ? "text-success" : "text-warning"}>{total}%</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={normalize}>
            <Scale className="mr-1 h-3.5 w-3.5" /> Normalize
          </Button>
          <Button size="sm" variant="outline" onClick={addOutcome}>
            <Plus className="mr-1 h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {state.outcomes.map((o) => (
          <div
            key={o.id}
            className="rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-soft"
          >
            <div className="flex items-center gap-2">
              <Input
                value={o.label}
                onChange={(e) => updateOutcome(o.id, { label: e.target.value })}
                className="h-8 flex-1 text-sm"
                aria-label="Outcome label"
              />
              <span className="w-12 text-right text-sm font-medium tabular-nums">
                {Math.round(o.probability)}%
              </span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => removeOutcome(o.id)}
                disabled={state.outcomes.length <= 2}
                aria-label="Remove outcome"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="mt-2">
              <Slider
                value={[o.probability]}
                min={0}
                max={100}
                step={1}
                onValueChange={(v) => updateOutcome(o.id, { probability: v[0] })}
                aria-label={`${o.label} probability`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
