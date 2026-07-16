# UX Flows

## Practice Flow

Current static trial page:

1. Learner opens `docs/trial-practice.html`.
2. Learner chooses course, level, and question status.
3. Learner reads the question with optional font-size controls.
4. Learner can highlight useful text and remove highlights.
5. Learner can request hints one step at a time.
6. Learner submits an answer.
7. The page evaluates objective questions locally and uses a local rubric/keyword mock for written answers.
8. Learner can reset a question; reset removes the completed state and returns the item to "ยังไม่ได้ทำ".

Future app flow:

1. Learner opens the dashboard.
2. The app recommends questions based on weak statutes and spaced repetition.
3. Learner opens a practice question.
4. Learner submits an answer.
5. Backend evaluates the answer and updates mastery.

## Evaluation Flow

The evaluation screen should show:

- Score
- Matched legal elements
- Missing or incorrect elements
- IRAC-specific feedback
- Recommended statutes to review
- Button to save mistake to My Codex
- Button for next practice question

For the current static page, evaluation is intentionally lightweight and local. Backend grading, attempt history, and mastery updates are future app behavior.

## My Codex Flow

Learner can save:

- Personal notes
- Common mistakes
- Confusing statute pairs
- Exam reminders
- Short summaries before review sessions
