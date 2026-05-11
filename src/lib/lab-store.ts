import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRESETS, BLANK_PRESET, type Preset, type Outcome } from "@/data/presets";

export type Mode = "simulated" | "live";

export type LabState = {
  presetId: string;
  decision: string;
  context: string;
  outcomes: Outcome[];
  confidence: number;
  reasoning: string;
  alternatives: string;
  changeMyMind: string;
  selectedActualOutcomeId: string;
  mode: Mode;
};

type Snapshot = LabState;

type LabStore = {
  state: LabState;
  past: Snapshot[];
  future: Snapshot[];
  hydrated: boolean;
  setHydrated: () => void;
  apply: (partial: Partial<LabState>) => void;
  loadPreset: (presetId: string) => void;
  setMode: (mode: Mode) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

const HISTORY_LIMIT = 50;

function fromPreset(preset: Preset, mode: Mode = "simulated"): LabState {
  return {
    presetId: preset.id,
    decision: preset.decision,
    context: preset.context,
    outcomes: preset.outcomes.map((o) => ({ ...o })),
    confidence: preset.confidence,
    reasoning: preset.reasoning,
    alternatives: preset.alternatives,
    changeMyMind: preset.changeMyMind,
    selectedActualOutcomeId: preset.actualOutcomeId,
    mode,
  };
}

const INITIAL: LabState = fromPreset(PRESETS[0]);

export const useLabStore = create<LabStore>()(
  persist(
    (set, get) => ({
      state: INITIAL,
      past: [],
      future: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      apply: (partial) => {
        const { state, past } = get();
        const next: LabState = { ...state, ...partial };
        set({
          state: next,
          past: [...past.slice(-HISTORY_LIMIT + 1), state],
          future: [],
        });
      },
      loadPreset: (presetId) => {
        const preset =
          presetId === "blank"
            ? BLANK_PRESET
            : PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];
        const { state, past } = get();
        set({
          state: fromPreset(preset, state.mode),
          past: [...past.slice(-HISTORY_LIMIT + 1), state],
          future: [],
        });
      },
      setMode: (mode) => {
        const { state, past } = get();
        if (state.mode === mode) return;
        set({
          state: { ...state, mode },
          past: [...past.slice(-HISTORY_LIMIT + 1), state],
          future: [],
        });
      },
      undo: () => {
        const { past, state, future } = get();
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        set({
          state: previous,
          past: past.slice(0, -1),
          future: [state, ...future].slice(0, HISTORY_LIMIT),
        });
      },
      redo: () => {
        const { past, state, future } = get();
        if (future.length === 0) return;
        const next = future[0];
        set({
          state: next,
          past: [...past, state].slice(-HISTORY_LIMIT),
          future: future.slice(1),
        });
      },
      reset: () => {
        set({ state: INITIAL, past: [], future: [] });
      },
      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,
    }),
    {
      name: "decision-bets-lab",
      partialize: (s) => ({ state: s.state }),
      onRehydrateStorage: () => (s) => {
        s?.setHydrated();
      },
    },
  ),
);

export function normalizeProbabilities(outcomes: Outcome[]): Outcome[] {
  const sum = outcomes.reduce((a, o) => a + o.probability, 0);
  if (sum === 0) {
    const even = 100 / outcomes.length;
    return outcomes.map((o) => ({ ...o, probability: even }));
  }
  return outcomes.map((o) => ({ ...o, probability: (o.probability / sum) * 100 }));
}
