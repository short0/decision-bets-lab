import { useLabStore } from "@/lib/lab-store";
import { analyzeResulting, explainResult } from "@/lib/mocked-insights";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { ResultingMatrix } from "./resulting-matrix";

export function OutcomeReview() {
  const state = useLabStore((s) => s.state);
  const apply = useLabStore((s) => s.apply);
  const [explanation, setExplanation] = useState<string | null>(null);

  const analysis = analyzeResulting(state);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-medium">Outcome review</h2>
        <p className="text-xs text-muted-foreground">Pick what actually played out to review the bet.</p>
      </div>

      <RadioGroup
        value={state.selectedActualOutcomeId}
        onValueChange={(v) => {
          apply({ selectedActualOutcomeId: v });
          setExplanation(null);
        }}
        className="space-y-2"
      >
        {state.outcomes.map((o) => (
          <Label
            key={o.id}
            htmlFor={`out-${o.id}`}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/40 has-[[data-state=checked]]:border-foreground/30 has-[[data-state=checked]]:bg-accent"
          >
            <RadioGroupItem id={`out-${o.id}`} value={o.id} className="mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{o.label}</span>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {Math.round(o.probability)}%
                </span>
              </div>
              {o.description && (
                <p className="mt-1 text-xs text-muted-foreground">{o.description}</p>
              )}
            </div>
          </Label>
        ))}
      </RadioGroup>

      <ResultingMatrix
        decisionQuality={analysis.decisionQuality}
        outcomeQuality={analysis.outcomeQuality}
      />

      <Card className="space-y-2 p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Resulting analysis
          </span>
        </div>
        <h4 className="text-base font-semibold">{analysis.headline}</h4>
        <p className="text-sm text-muted-foreground">{analysis.body}</p>
        <p className="text-sm">
          <span className="font-medium">Lesson: </span>
          {analysis.lesson}
        </p>
      </Card>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setExplanation(explainResult(state))}
      >
        <Lightbulb className="mr-2 h-4 w-4" /> Explain this result
      </Button>

      {explanation && (
        <Card className="border-accent bg-accent/30 p-4">
          <p className="text-sm leading-relaxed">{explanation}</p>
        </Card>
      )}
    </div>
  );
}
