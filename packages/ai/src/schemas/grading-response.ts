export type GradingConfidence = "low" | "medium" | "high";

export interface GradingFeedbackItem {
  criterion_id: string;
  text: string;
}

export interface RecommendedReviewItem {
  type: "statute" | "topic" | "question";
  id: string;
  reason: string;
}

export interface GradingResponse {
  score: number;
  max_score: number;
  confidence: GradingConfidence;
  matched_elements: GradingFeedbackItem[];
  missing_or_incorrect_elements: GradingFeedbackItem[];
  feedback: string;
  recommended_review: RecommendedReviewItem[];
}

