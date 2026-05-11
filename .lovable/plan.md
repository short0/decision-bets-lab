## Decision Bets Lab — Build Plan

A polished, minimalist web app inspired by *Thinking in Bets* that lets users frame decisions as bets, assign probabilities, journal reasoning, and review outcomes — with mocked content as the default so it works instantly.

### Routes (TanStack Start)

```
src/routes/
  __root.tsx        → shell: theme provider, header (logo, theme toggle, reset)
  index.tsx         → Home (hero, presets, how it works, CTA)
  lab.tsx           → Lab (3-panel desktop, stacked mobile)
  about.tsx         → Brief explainer of decision vs outcome quality
```

### Home screen (`/`)

- Hero: one-line definition of "thinking in bets" + subhead.
- Preset grid (4 cards): Switch jobs / Launch feature / Buy stock / Hire candidate.
- "How it works" 5-step strip: Bet → Odds → Reasoning → Review → Learn.
- CTAs: "Start with a preset" and "Open blank lab".

### Lab screen (`/lab`)

Desktop 3-panel layout, tablet 2-col with collapsible right, mobile stacked with sticky top action bar (Undo / Redo / Reset / Mode toggle).

- **Left panel — Setup**
  - Preset selector dropdown
  - Decision title + context textarea
  - Mode toggle: Simulated (default) vs Live LLM (badge clearly visible)
  - Settings: confidence scale, show explanations
- **Center panel — The Bet**
  - Probability builder: list of outcomes with sliders that auto-normalize to 100%
  - Alternative scenarios list (add/remove)
  - Confidence input (0–100%)
  - Decision journal: reasoning, what would change my mind, pre-mortem
- **Right panel — Review & Learn**
  - Outcome selector (which outcome happened)
  - "Resulting detector": compares decision quality vs outcome quality with a 2x2 matrix highlight
  - Decision-quality analysis card
  - "Explain this result" button → plain-language teaching note
  - Compare mode: good decision/bad outcome vs bad decision/good outcome side-by-side

### Presets (data file)

`src/data/presets.ts` — each preset preloads:
- Decision text + context
- 3–5 outcomes with probabilities
- Reasoning + alternatives
- Later outcome review
- Decision-quality vs outcome-quality summary
- 3–5 quick-action prompts

### State management

- Single `useLabStore` (Zustand) holding lab state.
- Undo/Redo via a history stack of state snapshots (cap ~50). Tracked actions: preset change, decision edit, probability edit, outcome selection, settings change, clear.
- Persistence: `localStorage` keys for `theme`, `mode`, `lab-state`, `recent-decisions`, `selected-preset`. Hydrate on mount.
- Reset to home: clears active session state but keeps presets and theme.

### Mocked vs Live mode

- **Simulated (default):** all "AI" outputs (explanations, resulting analysis, teaching notes) come from deterministic templates in `src/lib/mocked-insights.ts` keyed off the current state. Visual badge: subtle "Simulated" pill.
- **Live (optional):** behind a toggle; calls a server function that hits Lovable AI Gateway. Clear amber "Live" badge. Falls back to mocked on error. *Not enabled by default; no Cloud needed for v1 unless user opts in later.*

### Design system

- Light default + dark toggle stored in localStorage, applied via `.dark` class on `<html>`.
- Tokens in `src/styles.css` only — neutral palette (warm off-white bg, near-black text in light; deep slate in dark), single muted accent for primary actions, subtle borders, soft shadows, generous spacing, system + Inter typography.
- shadcn components: Button, Card, Slider, Tabs, Toggle, Dialog, Tooltip, Badge, Textarea, Select.

### Accessibility

- Semantic landmarks, single H1 per route, labelled controls.
- Visible focus rings via token, AA contrast in both themes, 44px tap targets on mobile.
- Keyboard: Cmd/Ctrl+Z undo, Cmd/Ctrl+Shift+Z redo, Esc closes dialogs.

### Technical notes

- Stack: TanStack Start + React 19 + Tailwind v4 + shadcn (already scaffolded).
- New deps: `zustand` (state + history). No backend in v1.
- File additions: `src/data/presets.ts`, `src/lib/mocked-insights.ts`, `src/lib/lab-store.ts`, `src/components/theme-provider.tsx`, `src/components/lab/*` (PresetPicker, ProbabilityBuilder, OutcomeReview, ResultingMatrix, CompareDrawer, ModeBadge), `src/components/site-header.tsx`.
- Each route sets its own `head()` with title + description + og tags.
- Live mode is gated behind a toggle and only wires up to AI Gateway if the user later asks to enable it; v1 ships fully functional without it.

### Out of scope for v1

- Authentication, multi-user, sync across devices.
- Real charts library (use simple CSS bars for probability viz to keep bundle small).
