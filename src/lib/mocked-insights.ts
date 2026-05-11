import type { LabState } from "./lab-store";
import { PRESETS, type Preset } from "@/data/presets";

export type Quadrant = "good-good" | "good-bad" | "bad-good" | "bad-bad";

export type ResultingAnalysis = {
  decisionQuality: "good" | "poor";
  outcomeQuality: "good" | "poor";
  quadrant: Quadrant;
  headline: string;
  body: string;
  lesson: string;
};

function getPreset(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}

export function expectedConfidence(state: LabState): number {
  const top = [...state.outcomes].sort((a, b) => b.probability - a.probability)[0];
  return top ? Math.round(top.probability) : 0;
}

export function analyzeResulting(state: LabState): ResultingAnalysis {
  const preset = getPreset(state.presetId);
  // Use preset's curated decision quality if available, else infer from confidence.
  const decisionQuality: "good" | "poor" =
    preset?.decisionQuality ??
    (state.confidence >= 50 && state.reasoning.length > 20 ? "good" : "poor");

  // Outcome quality follows the chosen "actual" outcome's preset hint, or by index.
  const outcomeIdx = state.outcomes.findIndex(
    (o) => o.id === state.selectedActualOutcomeId,
  );
  const outcomeQuality: "good" | "poor" =
    preset && state.selectedActualOutcomeId === preset.actualOutcomeId
      ? preset.outcomeQuality
      : outcomeIdx <= 1
        ? "good"
        : "poor";

  const quadrant: Quadrant = `${decisionQuality === "good" ? "good" : "bad"}-${
    outcomeQuality === "good" ? "good" : "bad"
  }` as Quadrant;

  const map: Record<Quadrant, { headline: string; body: string; lesson: string }> = {
    "good-good": {
      headline: "Good decision, good outcome",
      body: "The process was sound and the result confirmed it. Be careful — sometimes the world rewards bad processes too. Re-examine what specifically made this a good bet.",
      lesson: "Repeat the process, not the result. Codify what worked.",
    },
    "good-bad": {
      headline: "Good decision, bad outcome",
      body: "The bet was reasonable given what you knew. The dice fell badly. This is the most-misjudged quadrant — people punish themselves for variance.",
      lesson: "Don't rewrite history. A bad outcome doesn't prove a bad decision.",
    },
    "bad-good": {
      headline: "Bad decision, good outcome",
      body: "You got lucky. The most dangerous quadrant — wins here teach the wrong lesson and encourage bigger bad bets next time.",
      lesson: "Resist the urge to feel smart. Fix the process before luck runs out.",
    },
    "bad-bad": {
      headline: "Bad decision, bad outcome",
      body: "The signals were there and the world cooperated with bad luck. Easy to learn from — but watch the urge to over-correct on the wrong variable.",
      lesson: "Separate the process flaw from the unlucky variance. Address the flaw.",
    },
  };

  return {
    decisionQuality,
    outcomeQuality,
    quadrant,
    ...map[quadrant],
  };
}

export function explainResult(state: LabState): string {
  const preset = getPreset(state.presetId);
  const outcome = state.outcomes.find(
    (o) => o.id === state.selectedActualOutcomeId,
  );
  const a = analyzeResulting(state);
  const base = preset?.lesson ?? a.lesson;
  const odds = outcome ? Math.round(outcome.probability) : 0;
  return `You assigned this outcome roughly ${odds}% probability. ${a.headline}. ${base} Remember: a single result is one sample from a distribution — judge the bet, not the spin of the wheel.`;
}

export function compareScenarios(state: LabState) {
  return [
    {
      title: "Good decision, bad outcome",
      example:
        "You evaluated the job offer carefully, took it for the right reasons, and got laid off in a downturn. Process was right; variance was unkind.",
      takeaway: "Don't punish the process for unlucky variance.",
    },
    {
      title: "Bad decision, good outcome",
      example:
        "You concentrated 8% of net worth into a single hot stock with no risk model and it tripled. The win hides a fragile process.",
      takeaway: "A win can be the most expensive lesson if it teaches the wrong rule.",
    },
  ];
}

export const RESULTING_DEFINITION =
  "Resulting is the cognitive bias of judging a decision by its outcome rather than by the quality of the decision-making process at the time it was made.";

export const DECISION_VS_OUTCOME =
  "Decision quality is about the process: the information you had, the reasoning, the alternatives weighed, and the bet sized. Outcome quality is about what actually happened. Good decisions can produce bad outcomes and vice versa — that's variance.";
