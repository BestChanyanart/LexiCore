import type { QuestionHint } from "../questions/types";

export interface HintPenaltyPolicy {
  hint1: number;
  hint2: number;
  hint3: number;
}

export const defaultHintPenaltyPolicy: HintPenaltyPolicy = {
  hint1: 1,
  hint2: 2,
  hint3: 3
};

export function getNextHint(hints: QuestionHint[], usedHintCount: number): QuestionHint | null {
  return hints[usedHintCount] ?? null;
}

