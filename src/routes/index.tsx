import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PRESETS } from "@/data/presets";
import { useLabStore } from "@/lib/lab-store";
import { ArrowRight, Dice5, ListChecks, Scale, Microscope, BookOpen } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Decision Bets Lab — Think clearly under uncertainty" },
      {
        name: "description",
        content:
          "A learning sandbox inspired by Thinking in Bets. Frame decisions as bets, assign probabilities, separate decision quality from outcome quality.",
      },
      { property: "og:title", content: "Decision Bets Lab" },
      {
        property: "og:description",
        content:
          "Frame decisions as bets. Assign probabilities. Tell skill from luck. A calm, minimalist learning lab.",
      },
    ],
  }),
  component: HomePage,
});

const STEPS = [
  { icon: Dice5, label: "Make a bet", desc: "Frame the decision." },
  { icon: Scale, label: "Assign odds", desc: "Probabilities for each outcome." },
  { icon: ListChecks, label: "Record reasoning", desc: "What would change your mind." },
  { icon: Microscope, label: "Review outcome", desc: "What actually happened." },
  { icon: BookOpen, label: "Learn", desc: "Tell skill from luck." },
];

function HomePage() {
  const loadPreset = useLabStore((s) => s.loadPreset);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Inspired by Thinking in Bets
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Make better decisions <span className="text-muted-foreground">under uncertainty.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
              Turn choices into explicit bets. Assign odds to outcomes. Then tell the difference
              between a good decision and a lucky one.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/lab">
                  Open the lab <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" onClick={() => loadPreset("blank")}>
                <Link to="/lab">Start blank</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Presets */}
        <section className="py-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Try a preset</h2>
              <p className="text-sm text-muted-foreground">Real decisions, preloaded with bets and reviews.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadPreset(preset.id)}
                className="group text-left"
              >
                <Link to="/lab" className="block">
                  <Card className="h-full p-5 transition-all hover:shadow-soft group-hover:border-foreground/20">
                    <div className="text-2xl" aria-hidden>
                      {preset.emoji}
                    </div>
                    <h3 className="mt-3 text-base font-medium">{preset.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {preset.context}
                    </p>
                    <div className="mt-4 flex items-center text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                      Open in lab <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </Card>
                </Link>
              </button>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <p className="mt-2 text-sm text-muted-foreground">Five small steps, repeated.</p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <li key={s.label}>
                <Card className="h-full p-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="tabular-nums">0{i + 1}</span>
                    <s.icon className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium">{s.label}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                </Card>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link to="/lab">Start with a preset</Link>
            </Button>
          </div>
        </section>

        <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
          Built for clearer thinking. No accounts, all local.
        </footer>
      </main>
    </div>
  );
}
