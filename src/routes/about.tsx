import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DECISION_VS_OUTCOME, RESULTING_DEFINITION } from "@/lib/mocked-insights";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Decision Bets Lab" },
      {
        name: "description",
        content:
          "Decision quality vs outcome quality, the resulting bias, and how to use Decision Bets Lab.",
      },
      { property: "og:title", content: "About Decision Bets Lab" },
      {
        property: "og:description",
        content: "Learn the difference between a good decision and a good outcome.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Decisions are bets.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          We rarely have full information. Every choice is a bet on a future we can't see clearly.
          The job isn't to be right — it's to bet well, then judge ourselves on the betting,
          not the spin of the wheel.
        </p>

        <Card className="mt-10 p-6">
          <h2 className="text-lg font-semibold">Decision quality vs outcome quality</h2>
          <p className="mt-2 text-sm text-muted-foreground">{DECISION_VS_OUTCOME}</p>
        </Card>

        <Card className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Resulting</h2>
          <p className="mt-2 text-sm text-muted-foreground">{RESULTING_DEFINITION}</p>
          <p className="mt-3 text-sm">
            A win can come from a sloppy bet. A loss can come from a great one. Resulting blurs
            those lines and teaches us the wrong lessons.
          </p>
        </Card>

        <Card className="mt-4 p-6">
          <h2 className="text-lg font-semibold">How to use the lab</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Pick a preset or open a blank lab.</li>
            <li>Edit outcomes and probabilities until they feel honest.</li>
            <li>Write the reasoning and what would change your mind.</li>
            <li>Pick what actually happened and review the resulting matrix.</li>
            <li>Use undo / redo to explore counterfactuals.</li>
          </ol>
        </Card>

        <div className="mt-8">
          <Button asChild>
            <Link to="/lab">Open the lab</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
