export type Outcome = {
  id: string;
  label: string;
  probability: number; // 0..100
  description?: string;
};

export type Preset = {
  id: string;
  emoji: string;
  title: string;
  decision: string;
  context: string;
  outcomes: Outcome[];
  confidence: number;
  reasoning: string;
  alternatives: string;
  changeMyMind: string;
  /** Index of the outcome that "actually happened" in the preloaded review */
  actualOutcomeId: string;
  /** Subjective rating of the decision quality regardless of outcome */
  decisionQuality: "good" | "poor";
  outcomeQuality: "good" | "poor";
  review: string;
  lesson: string;
  quickPrompts: string[];
};

export const PRESETS: Preset[] = [
  {
    id: "switch-jobs",
    emoji: "💼",
    title: "Should I switch jobs?",
    decision: "Accept the senior role at the Series B startup.",
    context:
      "Current job is stable but plateauing. New offer is +20% comp, more scope, equity that may or may not be worth anything in 4 years.",
    outcomes: [
      { id: "a", label: "Thrive — promoted within 18 months", probability: 30, description: "You grow fast, equity becomes meaningful." },
      { id: "b", label: "Steady — fine, not transformative", probability: 40, description: "Solid role, equity ends up roughly nothing." },
      { id: "c", label: "Layoff within 12 months", probability: 20, description: "Runway ends, you job-hunt in a soft market." },
      { id: "d", label: "Hate it, leave in 6 months", probability: 10, description: "Culture mismatch, reset your search." },
    ],
    confidence: 65,
    reasoning:
      "The expected value is positive even after discounting equity. The optionality of learning at a smaller company outweighs short-term security. I am underweighting layoff risk because I find the founders compelling.",
    alternatives:
      "Stay, ask for a counter, or take a third interview elsewhere. Counter-offer rarely changes the underlying plateau.",
    changeMyMind:
      "If the company missed last quarter or if my would-be manager left, I would not take it.",
    actualOutcomeId: "c",
    decisionQuality: "good",
    outcomeQuality: "poor",
    review:
      "You took the job. The company hit a downturn and laid off 20% nine months in. You landed a comparable role within seven weeks.",
    lesson:
      "A bad outcome here doesn't make this a bad bet. Given what you knew, a 20% layoff probability was a reasonable risk to accept for the upside. Don't rewrite history just because the dice fell badly — this is classic 'resulting'.",
    quickPrompts: [
      "What signal would have flipped my decision?",
      "How would I size this bet differently next time?",
      "What did I learn that wasn't outcome-driven?",
      "Could I have negotiated better downside protection?",
    ],
  },
  {
    id: "launch-feature",
    emoji: "🚀",
    title: "Should I launch this feature?",
    decision: "Ship the AI summarization feature to all users next Tuesday.",
    context:
      "Beta tested with 200 power users. NPS bump is modest. Engineering is confident but support is nervous about edge cases.",
    outcomes: [
      { id: "a", label: "Hit — clear retention lift", probability: 25 },
      { id: "b", label: "Mild — small lift, no harm", probability: 45 },
      { id: "c", label: "Flat — no measurable change", probability: 20 },
      { id: "d", label: "Backfire — confusion, churn spike", probability: 10 },
    ],
    confidence: 70,
    reasoning:
      "Beta data is directionally positive. Cost of shipping is low; cost of not shipping is competitors closing the gap.",
    alternatives:
      "Gradual rollout to 10% then 50%. Hold for one more sprint to harden edge cases. Ship behind a feature flag.",
    changeMyMind:
      "If beta error rate exceeded 2% or support tickets doubled, delay.",
    actualOutcomeId: "a",
    decisionQuality: "good",
    outcomeQuality: "good",
    review:
      "You shipped behind a flag, ramped over 10 days, and saw a 6% retention lift on weekly actives.",
    lesson:
      "Process matters as much as result. The flagged rollout is what made this safely good — without it, the same launch could have been the 10% backfire scenario.",
    quickPrompts: [
      "Which part of the process was the real win?",
      "What would I do the same with worse luck?",
      "How do I tell luck from skill here?",
      "What's the next bet to size?",
    ],
  },
  {
    id: "buy-stock",
    emoji: "📈",
    title: "Should I buy this stock?",
    decision: "Put 8% of portfolio into a single semiconductor company.",
    context:
      "Strong recent earnings, narrative momentum, but valuation is rich and the cycle is mature.",
    outcomes: [
      { id: "a", label: "+50% in 12 months", probability: 20 },
      { id: "b", label: "Roughly flat", probability: 35 },
      { id: "c", label: "-20% drawdown", probability: 30 },
      { id: "d", label: "-50% blow-up", probability: 15 },
    ],
    confidence: 45,
    reasoning:
      "I like the company. I am also aware I like the story more than the math. 8% is concentrated for a single name.",
    alternatives:
      "Buy half-size. Buy the sector ETF. Wait for a 15% pullback. Sell puts instead of buying shares.",
    changeMyMind:
      "Position size > 5% of liquid net worth or guidance cut at next earnings.",
    actualOutcomeId: "a",
    decisionQuality: "poor",
    outcomeQuality: "good",
    review:
      "Stock ripped +60%. You feel like a genius.",
    lesson:
      "Bad decision, good outcome. Putting 8% on one name with a 15% blow-up probability is poor sizing regardless of what happened. Don't let the win convince you to repeat the process.",
    quickPrompts: [
      "Was my position size justified by the odds?",
      "What would I do at the next 'sure thing'?",
      "How do I separate skill from luck here?",
      "What rule should I write for next time?",
    ],
  },
  {
    id: "hire-candidate",
    emoji: "🤝",
    title: "Should I hire this candidate?",
    decision: "Extend an offer to the senior engineer with mixed references.",
    context:
      "Strong technical loop. One reference glowing, one lukewarm citing 'communication friction'.",
    outcomes: [
      { id: "a", label: "Star hire — top quartile in 6 months", probability: 30 },
      { id: "b", label: "Solid contributor", probability: 35 },
      { id: "c", label: "Underperforms, manage out in a year", probability: 25 },
      { id: "d", label: "Toxic, regret immediately", probability: 10 },
    ],
    confidence: 55,
    reasoning:
      "Skills clear the bar. Reference signal is mixed but explainable. Replacement cost of leaving role open another two months is high.",
    alternatives:
      "Keep searching. Hire as contractor first. Pair them with a strong manager for the trial period.",
    changeMyMind:
      "If a third backchannel reference repeats the same friction theme, pass.",
    actualOutcomeId: "d",
    decisionQuality: "poor",
    outcomeQuality: "poor",
    review:
      "Candidate was hired, clashed with two teammates within a month, and was let go after eight weeks. Team morale dipped.",
    lesson:
      "Bad decision, bad outcome — don't conflate the two. The mixed reference was a signal you discounted because of urgency. The lesson is about your search process under time pressure, not about hiring in general.",
    quickPrompts: [
      "What did I ignore that I shouldn't have?",
      "How does urgency distort my decisions?",
      "What's a cheaper way to test next time?",
      "What hiring rule should I codify?",
    ],
  },
];

export const BLANK_PRESET: Preset = {
  id: "blank",
  emoji: "✏️",
  title: "Blank lab",
  decision: "",
  context: "",
  outcomes: [
    { id: "a", label: "Outcome A", probability: 50 },
    { id: "b", label: "Outcome B", probability: 50 },
  ],
  confidence: 50,
  reasoning: "",
  alternatives: "",
  changeMyMind: "",
  actualOutcomeId: "a",
  decisionQuality: "good",
  outcomeQuality: "good",
  review: "",
  lesson: "",
  quickPrompts: [],
};
