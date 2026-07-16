export type QuestionLevel = 1 | 2 | 3;

export type QuestionType = "mcq" | "matching" | "drag_drop" | "subjective";

export type HintKind = "focus_area" | "key_elements" | "statute_number";

export interface QuestionHint {
  level: 1 | 2 | 3;
  kind: HintKind;
  text: string;
}

export interface LegalQuestion {
  id: string;
  courseId: string;
  moduleId: string;
  level: QuestionLevel;
  type: QuestionType;
  title: string;
  scenario: string;
  question: string;
  statutes: string[];
  hints: QuestionHint[];
  rubricId?: string;
}
