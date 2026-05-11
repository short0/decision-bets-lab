import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header";
import { useLabStore, type Mode } from "@/lib/lab-store";
import { PRESETS } from "@/data/presets";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Undo2, Redo2, RotateCcw } from "lucide-react";
import { ProbabilityBuilder } from "@/components/lab/probability-builder";
import { OutcomeReview } from "@/components/lab/outcome-review";
import { CompareScenarios } from "@/components/lab/compare-scenarios";
import { ModeBadge } from "@/components/lab/mode-badge";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Lab — Decision Bets Lab" },
      {
        name: "description",
        content:
          "Frame your decision as a bet, assign probabilities to outcomes, then review what actually happened.",
      },
      { property: "og:title", content: "The Lab — Decision Bets Lab" },
      {
        property: "og:description",
        content: "A sandbox for thinking in bets.",
      },
    ],
  }),
  component: LabPage,
});

function LabPage() {
  const state = useLabStore((s) => s.state);
  const apply = useLabStore((s) => s.apply);
  const loadPreset = useLabStore((s) => s.loadPreset);
  const setMode = useLabStore((s) => s.setMode);
  const undo = useLabStore((s) => s.undo);
  const redo = useLabStore((s) => s.redo);
  const reset = useLabStore((s) => s.reset);
  const past = useLabStore((s) => s.past);
  const future = useLabStore((s) => s.future);

  const preset = PRESETS.find((p) => p.id === state.presetId);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Sticky action bar */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <div className="flex items-center gap-2">
            <ModeBadge mode={state.mode} />
            {preset && (
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {preset.emoji} {preset.title}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={past.length === 0}
              aria-label="Undo"
            >
              <Undo2 className="mr-1 h-3.5 w-3.5" /> Undo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={future.length === 0}
              aria-label="Redo"
            >
              <Redo2 className="mr-1 h-3.5 w-3.5" /> Redo
            </Button>
            <Button variant="ghost" size="sm" onClick={reset} aria-label="Reset">
              <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left panel */}
          <aside className="space-y-4 lg:col-span-3">
            <Card className="space-y-4 p-4">
              <div>
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Preset
                </Label>
                <Select value={state.presetId} onValueChange={loadPreset}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.emoji} {p.title}
                      </SelectItem>
                    ))}
                    <SelectItem value="blank">✏️ Blank lab</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="decision" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Decision
                </Label>
                <Input
                  id="decision"
                  className="mt-1.5"
                  value={state.decision}
                  onChange={(e) => apply({ decision: e.target.value })}
                  placeholder="What are you betting on?"
                />
              </div>

              <div>
                <Label htmlFor="context" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Context
                </Label>
                <Textarea
                  id="context"
                  className="mt-1.5 min-h-24 text-sm"
                  value={state.context}
                  onChange={(e) => apply({ context: e.target.value })}
                  placeholder="What's the situation?"
                />
              </div>
            </Card>

            <Card className="space-y-3 p-4">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Mode
              </Label>
              <Tabs value={state.mode} onValueChange={(v) => setMode(v as Mode)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="simulated">Simulated</TabsTrigger>
                  <TabsTrigger value="live">Live LLM</TabsTrigger>
                </TabsList>
              </Tabs>
              <p className="text-xs text-muted-foreground">
                {state.mode === "simulated"
                  ? "All insights come from deterministic templates. Fast, free, offline."
                  : "Live mode would call an LLM. Not enabled in this build — falls back to simulated."}
              </p>
            </Card>

            {preset && preset.quickPrompts.length > 0 && (
              <Card className="space-y-2 p-4">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Quick prompts
                </Label>
                <ul className="space-y-1.5">
                  {preset.quickPrompts.map((p) => (
                    <li key={p}>
                      <button
                        onClick={() =>
                          apply({
                            reasoning: state.reasoning
                              ? `${state.reasoning}\n\n${p}\n— `
                              : `${p}\n— `,
                          })
                        }
                        className="w-full rounded-md border border-border px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-accent"
                      >
                        {p}
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </aside>

          {/* Center panel */}
          <section className="space-y-4 lg:col-span-5">
            <Card className="p-4">
              <ProbabilityBuilder />
            </Card>

            <Card className="space-y-3 p-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Confidence
                  </Label>
                  <span className="text-sm font-medium tabular-nums">{state.confidence}%</span>
                </div>
                <Slider
                  className="mt-2"
                  value={[state.confidence]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(v) => apply({ confidence: v[0] })}
                  aria-label="Confidence"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  How confident are you in your overall reasoning?
                </p>
              </div>
            </Card>

            <Card className="space-y-4 p-4">
              <h3 className="text-sm font-medium">Decision journal</h3>

              <div>
                <Label htmlFor="reasoning" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Reasoning
                </Label>
                <Textarea
                  id="reasoning"
                  className="mt-1.5 min-h-28 text-sm"
                  value={state.reasoning}
                  onChange={(e) => apply({ reasoning: e.target.value })}
                  placeholder="Why is this the right bet?"
                />
              </div>

              <div>
                <Label htmlFor="alternatives" className="text-xs uppercase tracking-wide text-muted-foreground">
                  Alternatives considered
                </Label>
                <Textarea
                  id="alternatives"
                  className="mt-1.5 min-h-20 text-sm"
                  value={state.alternatives}
                  onChange={(e) => apply({ alternatives: e.target.value })}
                  placeholder="What else could you do?"
                />
              </div>

              <div>
                <Label htmlFor="changeMyMind" className="text-xs uppercase tracking-wide text-muted-foreground">
                  What would change your mind
                </Label>
                <Textarea
                  id="changeMyMind"
                  className="mt-1.5 min-h-20 text-sm"
                  value={state.changeMyMind}
                  onChange={(e) => apply({ changeMyMind: e.target.value })}
                  placeholder="What signal would flip this decision?"
                />
              </div>
            </Card>
          </section>

          {/* Right panel */}
          <aside className="space-y-4 lg:col-span-4">
            <Card className="p-4">
              <OutcomeReview />
            </Card>
            <Card className="space-y-3 p-4">
              <h3 className="text-sm font-medium">Compare scenarios</h3>
              <p className="text-xs text-muted-foreground">
                Two cases people get wrong most often.
              </p>
              <CompareScenarios />
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
