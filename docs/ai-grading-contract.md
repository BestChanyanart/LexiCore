# AI Grading Contract

AI grading must be rubric-controlled. The model should evaluate answers only against the scenario, gold standard, and grading rubric supplied by the application.

The current `docs/trial-practice.html` page does not call an LLM. It uses a local keyword/rubric mock so the learning flow can be tested without backend credentials. This contract applies when the backend AI grader is implemented.

## Request Payload

```json
{
  "question_id": "q-420-vase-negligence",
  "attempt_id": "attempt_generated_id",
  "scenario": "Question scenario",
  "gold_standard": {
    "statutes": ["420"],
    "issues": ["Whether the actor is liable in tort"],
    "rule_summary": "Authoritative rule summary from reviewed content",
    "expected_application": ["Fact-to-element analysis expected from the learner"],
    "expected_conclusion": "Expected conclusion"
  },
  "grading_rubric": {
    "max_score": 10,
    "criteria": [
      {
        "id": "issue",
        "label": "Issue spotting",
        "points": 2
      }
    ]
  },
  "user_answer": "Learner answer"
}
```

## System Prompt

```text
คุณเป็นผู้ตรวจคำตอบกฎหมายสำหรับนักเรียนกฎหมายไทย
ให้ตรวจเฉพาะจาก scenario, gold_standard และ grading_rubric ที่ได้รับเท่านั้น
ห้ามสร้างเลขมาตรา หลักกฎหมาย หรือข้อเท็จจริงใหม่ที่ไม่ได้อยู่ในข้อมูลอ้างอิง
ให้ประเมินตามโครงสร้าง IRAC: Issue, Rule, Application, Conclusion
ตอบกลับเป็น JSON ที่ตรง schema เท่านั้น
ใช้ภาษาไทยที่ชัดเจน สุภาพ และเน้นการสอน
```

## Response Schema

```json
{
  "score": 7,
  "max_score": 10,
  "confidence": "medium",
  "matched_elements": [
    {
      "criterion_id": "issue",
      "text": "จับประเด็นได้ถูกต้อง"
    }
  ],
  "missing_or_incorrect_elements": [
    {
      "criterion_id": "application",
      "text": "ยังปรับข้อเท็จจริงเข้ากับองค์ประกอบไม่ครบ"
    }
  ],
  "feedback": "คำแนะนำเพื่อพัฒนาคำตอบ",
  "recommended_review": [
    {
      "type": "statute",
      "id": "420",
      "reason": "ควรทบทวนองค์ประกอบละเมิดทั่วไป"
    }
  ]
}
```

## Safety Rules

- Do not ask the model to determine the law from memory.
- Always provide reviewed gold standards and rubrics.
- Reject malformed JSON responses.
- Store raw grading results for audit.
- Show AI feedback as learning support, not legal advice.
- Never send API keys, session cookies, private notes, or raw copyrighted course files to the model.
