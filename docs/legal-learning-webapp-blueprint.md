# LexiCore Webapp Blueprint

เอกสารนี้เป็นโครงสร้างตั้งต้นสำหรับสร้างเว็บแอปฝึกตอบปัญหากฎหมายสำหรับนักเรียนกฎหมาย โดยเน้น 4 แกนหลัก:

- คลังโจทย์แยกตามรายวิชาและหัวข้อกฎหมาย
- การไล่ระดับความยากของโจทย์จากจำหลักไปสู่การวินิจฉัยซับซ้อน
- คำใบ้แบบค่อย ๆ เปิดเผย เพื่อช่วยคิดโดยไม่เฉลยทันที
- ระบบประเมินคำตอบที่วัดความเข้าใจจริงตามหลักกฎหมายและโครงสร้าง IRAC

## 1. Product Vision

LexiCore คือแอปฝึก “คิดแบบนักกฎหมาย” ไม่ใช่แค่จำมาตรา ผู้เรียนควรฝึกได้ตั้งแต่การระบุองค์ประกอบของมาตรา ไปจนถึงการอ่านโจทย์ยาว จับประเด็น แยกความรับผิด และเขียนคำตอบแบบหลักกฎหมาย -> วินิจฉัย/ปรับบท -> สรุป

กลุ่มผู้ใช้หลัก:

- นักศึกษานิติศาสตร์
- ผู้เตรียมสอบสนามกฎหมาย
- ผู้สอนหรือ tutor ที่ต้องการสร้างคลังโจทย์และ rubric

เป้าหมายของระบบ:

- ช่วยให้ผู้เรียนรู้ว่าตนเอง “พลาดตรงไหน” ไม่ใช่แค่รู้ว่าถูกหรือผิด
- ทำให้การทบทวนมาตรากฎหมายเป็นระบบผ่าน mastery, spaced repetition และ notes
- ลดความเสี่ยงของ AI grading ที่ตอบหลอน ด้วย rubric และ gold standard ที่ควบคุมจากฐานข้อมูลเนื้อหา

## 2. Recommended Tech Stack

โครงสร้างนี้ออกแบบให้เหมาะกับเว็บแอปสมัยใหม่ที่ขยายต่อได้ง่าย

- Frontend: Next.js หรือ React Router-based React app
- Backend: Next.js API routes, Hono, Fastify หรือ NestJS
- Database: PostgreSQL
- ORM: Prisma หรือ Drizzle
- Auth: Clerk, Auth.js หรือ Supabase Auth
- AI Provider Layer: service กลางสำหรับเรียก LLM API
- Content Format: Markdown + YAML/JSON สำหรับ seed content หรือ CMS ในอนาคต
- Testing: Vitest, Playwright, Testing Library

หากต้องการเริ่มเร็ว แนะนำ `Next.js + PostgreSQL + Prisma` เพราะทำ full-stack ได้ใน repo เดียว และเหมาะกับ dashboard, content management, API และ AI grading

## 3. Proposed Repo Structure

```text
LexiCore/
  README.md
  docs/
    legal-learning-webapp-blueprint.md
    ai-grading-contract.md
    content-authoring-guide.md
    ux-flows.md

  apps/
    web/
      app/
        (auth)/
        (dashboard)/
        practice/
        courses/
        codex/
        moot-court/
        api/
      components/
        dashboard/
        practice/
        evaluation/
        hints/
        codex/
        shared/
      lib/
        api/
        auth/
        content/
        grading/
        scoring/
        spaced-repetition/
      styles/
      tests/

  packages/
    core/
      src/
        courses/
        questions/
        hints/
        grading/
        mastery/
        legal-taxonomy/
      tests/
    db/
      prisma/
        schema.prisma
        migrations/
      src/
        client.ts
        seed.ts
    ai/
      src/
        providers/
        prompts/
        schemas/
        graders/
        safety/
      tests/
    ui/
      src/
        components/
        tokens/

  content/
    courses/
      41215/
        course.yaml
        modules/
          module-01-torts-unjust-enrichment/
            module.yaml
            statutes/
              420.md
              423.md
              425.md
              429.md
              433.md
              434.md
              437.md
            questions/
              level-1/
                q-420-elements.yaml
                q-1304-classification.yaml
              level-2/
                q-420-vase-negligence.yaml
                q-437-vehicle-control.yaml
              level-3/
                q-employer-tort-complex.yaml
            rubrics/
              r-420-basic.yaml
              r-425-employer-scope.yaml
          module-02-property/
            module.yaml
            statutes/
              1299.md
              1304.md
              1307.md
              1349.md
              1382.md
              1387.md
            questions/
              level-1/
              level-2/
              level-3/
            rubrics/

  scripts/
    validate-content.ts
    import-content.ts
    generate-question-index.ts

  tests/
    e2e/
    fixtures/
```

หลักการของโครงสร้าง:

- `apps/web` คือเว็บแอปที่ผู้ใช้เห็น
- `packages/core` เก็บ business logic ที่ไม่ควรผูกกับ UI เช่น scoring, mastery, hint progression
- `packages/ai` แยก prompt, schema, grader และ provider ออกจากหน้าเว็บ
- `content/courses` คือคลังเนื้อหาแยกตามรายวิชา ทุกวิชามี modules, statutes, questions และ rubrics ของตนเอง
- `docs` เก็บเอกสารออกแบบและคู่มือผู้เขียนเนื้อหา

## 4. Content Model

### 4.1 Course

ตัวอย่าง `content/courses/41215/course.yaml`

```yaml
id: 41215
title: กฎหมายแพ่ง: ละเมิดและทรัพย์สิน
code: "41215"
description: ฝึกวินิจฉัยกฎหมายลักษณะละเมิด จัดการงานนอกสั่ง ลาภมิควรได้ และทรัพย์สิน
modules:
  - module-01-torts-unjust-enrichment
  - module-02-property
```

### 4.2 Module

ตัวอย่าง `module.yaml`

```yaml
id: module-01-torts-unjust-enrichment
title: กฎหมายลักษณะละเมิด จัดการงานนอกสั่ง และลาภมิควรได้
topics:
  - id: tort-self-liability
    title: ความรับผิดเพื่อละเมิดในการกระทำของตนเอง
    statutes: ["420", "423", "428", "432"]
  - id: vicarious-liability
    title: ความรับผิดในการกระทำของบุคคลอื่น
    statutes: ["425", "429"]
  - id: liability-from-property
    title: ความรับผิดเกิดจากทรัพย์
    statutes: ["433", "434", "437"]
```

### 4.3 Statute Note

ตัวอย่าง `statutes/420.md`

```md
---
statute: "420"
title: ละเมิดทั่วไป
tags:
  - tort
  - intent
  - negligence
  - damage
key_elements:
  - การกระทำโดยจงใจหรือประมาทเลินเล่อ
  - กระทำต่อบุคคลอื่นโดยผิดกฎหมาย
  - เกิดความเสียหาย
  - มีความสัมพันธ์ระหว่างการกระทำและผลเสียหาย
common_misconceptions:
  - คิดว่าต้องมีเจตนาเท่านั้นจึงเป็นละเมิด
  - ลืมวิเคราะห์ความสัมพันธ์ระหว่างการกระทำและความเสียหาย
---

มาตรา 420 เป็นฐานละเมิดทั่วไป ใช้เมื่อผู้กระทำจงใจหรือประมาทเลินเล่อทำให้ผู้อื่นเสียหายโดยผิดกฎหมาย
```

### 4.4 Question

ตัวอย่างโจทย์ Level 2

```yaml
id: q-420-vase-negligence
course_id: 41215
module_id: module-01-torts-unjust-enrichment
level: 2
type: subjective
title: แจกันตกใส่ศีรษะผู้เสียหาย
scenario: >
  นาย ก. ยกแจกันหนักจากชั้นสองโดยไม่ตรวจดูให้มั่นคง แจกันหลุดมือตกใส่ศีรษะนาย ข. ซึ่งเดินอยู่ด้านล่างจนได้รับบาดเจ็บ
question: >
  ให้วินิจฉัยว่านาย ก. ต้องรับผิดต่อนาย ข. ตามกฎหมายลักษณะละเมิดหรือไม่
statutes:
  - "420"
skills:
  - issue_spotting
  - element_matching
  - irac_application
hints:
  - level: 1
    kind: focus_area
    text: ข้อเท็จจริงนี้เกี่ยวข้องกับความรับผิดเพื่อละเมิดจากการกระทำของตนเอง
  - level: 2
    kind: key_elements
    text: มองหาองค์ประกอบเรื่องประมาทเลินเล่อ ความเสียหาย และเหตุสัมพันธ์ระหว่างการกระทำกับผล
  - level: 3
    kind: statute_number
    text: ลองพิจารณาประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 420
rubric_id: r-420-basic
scoring:
  max_score: 10
  hint_penalty:
    hint_1: 1
    hint_2: 2
    hint_3: 3
```

## 5. Difficulty Levels

### Level 1: Concept & Element Matching

เป้าหมาย:

- จำและเข้าใจองค์ประกอบของมาตรา
- แยกประเภทหลักกฎหมายที่ใกล้เคียงกัน
- ตรวจ common misconceptions เบื้องต้น

รูปแบบโจทย์:

- MCQ
- จับคู่
- เลือกองค์ประกอบที่ถูกต้อง
- เลือกมาตราที่เกี่ยวข้อง

ตัวอย่าง:

- แยกองค์ประกอบมาตรา 420
- จำแนกทรัพย์สินของแผ่นดินตามมาตรา 1304
- แยกภาระจำยอมกับทางจำเป็น

### Level 2: Basic Scenario-based

เป้าหมาย:

- อ่านข้อเท็จจริงสั้น
- จับประเด็น 1-2 ประเด็น
- ปรับบทเข้ากับองค์ประกอบของมาตรา

รูปแบบโจทย์:

- Scenario-based MCQ
- Short subjective answer
- Fill-in IRAC blocks

ตัวอย่าง:

- นาย ก. ทำแจกันตกใส่นาย ข. ให้วินิจฉัยตามมาตรา 420
- ผู้ครอบครองรถยนต์ทำให้เกิดความเสียหาย ให้วิเคราะห์มาตรา 437

### Level 3: Advanced Legal Synthesis

เป้าหมาย:

- อ่านโจทย์ยาว
- จับหลายประเด็นและหลายมาตรา
- เรียงลำดับการวินิจฉัย
- แยกความรับผิดของบุคคลหลายฝ่าย

รูปแบบโจทย์:

- Long subjective drafting
- Multi-issue issue spotting
- Moot court style answer

ตัวอย่าง:

- ครอบครองปรปักษ์ในที่ดินที่มีภาระจำยอม และเกิดการทำละเมิดในที่ดินนั้น
- นายจ้าง ลูกจ้าง บุคคลภายนอก และเจ้าของทรัพย์เกี่ยวข้องกันในเหตุเดียว

## 6. Progressive Hint System

คำใบ้ไม่ควรเฉลยทันที แต่ควรช่วยให้ผู้เรียนเดินต่อได้เอง

### Hint 1: Focus Area

บอกขอบเขตกฎหมายหรือชื่อเรื่อง

ตัวอย่าง:

> ข้อเท็จจริงนี้เกี่ยวข้องกับเรื่องความรับผิดเพื่อความเสียหายอันเกิดจากทรัพย์ ในหมวดละเมิด

### Hint 2: Key Elements

บอกองค์ประกอบหรือ keywords ที่ต้องมองหา

ตัวอย่าง:

> พิจารณาคำว่า ผู้ครอบครองหรือควบคุมดูแลยานพาหนะอันเดินด้วยกำลังเครื่องจักรกล

### Hint 3: Statute Number

บอกเลขมาตราโดยตรง

ตัวอย่าง:

> ลองเปิดอ่านประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 1382 ประกอบมาตรา 1299 วรรคสอง

### Hint Scoring

แนวทางคะแนน:

- ไม่ใช้ hint: ได้ bonus เต็ม
- ใช้ Hint 1: หัก bonus เล็กน้อย
- ใช้ Hint 2: หัก bonus ปานกลาง
- ใช้ Hint 3: หัก bonus มากที่สุด

ระบบควรเก็บ event ทุกครั้งที่กด hint เพื่อใช้วิเคราะห์ mastery และจุดที่ผู้เรียนติด

## 7. Deep Legal Evaluation System

ระบบประเมินควรแยกตามชนิดโจทย์

### 7.1 MCQ / Scenario-based MCQ

แต่ละตัวเลือกควรมี rationale โดยเฉพาะตัวเลือกผิดที่มาจากความเข้าใจผิดที่พบบ่อย

ตัวอย่าง choice model:

```yaml
choices:
  - id: a
    text: นาย ก. ไม่ต้องรับผิด เพราะไม่ได้จงใจทำให้แจกันตก
    is_correct: false
    misconception: คิดว่าละเมิดต้องเกิดจากเจตนาเท่านั้น
    rationale: มาตรา 420 ครอบคลุมทั้งการกระทำโดยจงใจและประมาทเลินเล่อ
  - id: b
    text: นาย ก. ต้องรับผิด หากพิสูจน์ได้ว่าการยกแจกันโดยไม่ระวังเป็นประมาทเลินเล่อและเป็นเหตุให้เกิดความเสียหาย
    is_correct: true
    rationale: คำตอบนี้ครบองค์ประกอบประมาทเลินเล่อ ความเสียหาย และเหตุสัมพันธ์ตามมาตรา 420
```

### 7.2 Subjective Drafting / AI Grader

AI grader ต้องประเมินคำตอบตาม rubric ที่ระบบส่งให้เท่านั้น ห้ามสร้างหลักกฎหมายหรือมาตราใหม่เอง

ตรวจอย่างน้อย 4 ด้าน:

- Issue: จับประเด็นถูกหรือไม่
- Rule: ยกหลักกฎหมายและมาตราถูกหรือไม่
- Application: นำข้อเท็จจริงมาปรับกับองค์ประกอบครบหรือไม่
- Conclusion: สรุปผลสอดคล้องกับการวินิจฉัยหรือไม่

## 8. LLM-as-a-Judge Contract

### 8.1 API Payload

Backend ควรส่ง payload อย่างน้อย 4 ส่วน

```json
{
  "scenario": "ข้อความโจทย์ข้อเท็จจริง",
  "gold_standard": {
    "statutes": ["420"],
    "issues": ["นาย ก. ต้องรับผิดฐานละเมิดหรือไม่"],
    "rule_summary": "มาตรา 420 ครอบคลุมการกระทำโดยจงใจหรือประมาทเลินเล่อ...",
    "expected_application": [
      "การยกแจกันโดยไม่ตรวจให้มั่นคงเป็นพฤติการณ์ที่อาจถือเป็นประมาทเลินเล่อ",
      "แจกันตกใส่นาย ข. จนบาดเจ็บเป็นความเสียหาย",
      "มีเหตุสัมพันธ์ระหว่างการกระทำของนาย ก. กับความเสียหาย"
    ],
    "expected_conclusion": "นาย ก. ต้องรับผิดต่อนาย ข. หากข้อเท็จจริงพิสูจน์ได้ตามองค์ประกอบ"
  },
  "grading_rubric": {
    "max_score": 10,
    "criteria": [
      {
        "id": "issue",
        "label": "จับประเด็นความรับผิดฐานละเมิด",
        "points": 2
      },
      {
        "id": "rule",
        "label": "ระบุมาตรา 420 และองค์ประกอบ",
        "points": 3
      },
      {
        "id": "application",
        "label": "ปรับข้อเท็จจริงเข้ากับองค์ประกอบ",
        "points": 4
      },
      {
        "id": "conclusion",
        "label": "สรุปผลถูกต้อง",
        "points": 1
      }
    ]
  },
  "user_answer": "คำตอบของผู้เรียน"
}
```

### 8.2 System Prompt Draft

```text
คุณเป็นผู้ตรวจคำตอบกฎหมายสำหรับนักเรียนกฎหมายไทย
ให้ตรวจเฉพาะจาก scenario, gold_standard และ grading_rubric ที่ได้รับเท่านั้น
ห้ามสร้างเลขมาตรา หลักกฎหมาย หรือข้อเท็จจริงใหม่ที่ไม่ได้อยู่ในข้อมูลอ้างอิง
ให้ประเมินตามโครงสร้าง IRAC: Issue, Rule, Application, Conclusion
ตอบกลับเป็น JSON ที่ตรง schema เท่านั้น
ใช้ภาษาไทยที่ชัดเจน สุภาพ และเน้นการสอน
```

### 8.3 Expected AI Response JSON

```json
{
  "score": 7,
  "max_score": 10,
  "confidence": "medium",
  "matched_elements": [
    {
      "criterion_id": "issue",
      "text": "จับประเด็นความรับผิดฐานละเมิดได้ถูกต้อง"
    }
  ],
  "missing_or_incorrect_elements": [
    {
      "criterion_id": "application",
      "text": "ยังอธิบายเหตุสัมพันธ์ระหว่างการยกแจกันกับความเสียหายไม่ชัดเจน"
    }
  ],
  "feedback": "คำตอบมีทิศทางถูกต้อง ควรเขียนเชื่อมข้อเท็จจริงเข้ากับองค์ประกอบประมาทเลินเล่อและเหตุสัมพันธ์ให้ชัดขึ้น",
  "recommended_review": [
    {
      "type": "statute",
      "id": "420",
      "reason": "ควรทบทวนองค์ประกอบของละเมิดทั่วไป"
    }
  ]
}
```

## 9. Core App Screens

### 9.1 Legal Dashboard

หน้าหลักหลังเข้าสู่ระบบ

ควรแสดง:

- ความคืบหน้ารายวิชา
- Statute Mastery Bar รายมาตรา
- มาตราที่ควรทบทวน
- โจทย์แนะนำวันนี้
- คะแนนและ streak
- จุดอ่อนจาก common misconceptions

### 9.2 Course Page

แสดงรายวิชาและ modules

ควรแสดง:

- รายชื่อ module
- จำนวนโจทย์แต่ละ level
- mastery เฉลี่ย
- ปุ่มเริ่มฝึก
- สถานะโจทย์ที่ยังไม่ผ่าน

### 9.3 Practice Screen

หน้าทำโจทย์

ควรมี:

- เนื้อเรื่องอุทาหรณ์
- คำถาม
- ช่องตอบหรือ choice
- ปุ่มขอคำใบ้
- แถบแสดงจำนวน hint ที่ใช้
- คะแนน bonus ที่เหลือ
- ปุ่มส่งคำตอบ

### 9.4 Evaluation Screen

หน้าผลประเมิน

ควรแสดง:

- คะแนน
- ประเด็นที่จับได้ถูก
- ประเด็นที่ขาดหรือผิด
- วิเคราะห์ทีละองค์ประกอบ
- มาตราที่แนะนำให้กลับไปทบทวน
- ปุ่มบันทึกลง My Codex
- ปุ่มทำโจทย์ถัดไป

ตัวอย่าง feedback:

```text
คุณจับประเด็นความรับผิดของนายจ้างได้ถูกต้อง
แต่การปรับบทเรื่อง "ทางการที่จ้าง" ยังคลาดเคลื่อน เพราะข้อเท็จจริงระบุว่าลูกจ้างทำนอกเวลาและนอกคำสั่งโดยสิ้นเชิง
แนะนำให้ทบทวนความแตกต่างระหว่างมาตรา 425 และมาตรา 427
```

### 9.5 My Codex

สมุดบันทึกส่วนตัวของผู้เรียน

ควรมี:

- note รายมาตรา
- ข้อผิดพลาดที่บันทึกจาก evaluation
- flashcard ส่วนตัว
- tag เช่น "จำสับสน", "ออกสอบบ่อย", "ต้องทบทวน"
- สรุปก่อนสอบ

### 9.6 Moot Court Mode

โหมดแข่งขันหรือฝึกแบบเร็ว

ควรมี:

- โจทย์สั้นจากคำพิพากษาหรือสถานการณ์จำลอง
- จับเวลา
- leaderboard
- challenge กับเพื่อน
- explanation หลังจบข้อ

ใน MVP อาจเก็บเป็นโหมดทดลองไว้ก่อน เพราะต้องดูแลคุณภาพโจทย์และความยุติธรรมของคะแนน

## 10. Data Model Draft

ตารางหลัก:

- `users`
- `courses`
- `modules`
- `topics`
- `statutes`
- `questions`
- `question_choices`
- `question_hints`
- `rubrics`
- `rubric_criteria`
- `attempts`
- `attempt_evaluations`
- `mastery_records`
- `codex_notes`
- `moot_court_matches`
- `leaderboard_entries`

ความสัมพันธ์หลัก:

- Course มีหลาย Module
- Module มีหลาย Topic
- Topic ผูกกับหลาย Statute
- Question ผูกกับ Course, Module, Topic และ Statute หลายมาตรา
- Question มี Hints และ Rubric
- User มี Attempts
- Attempt มี Evaluation
- User มี MasteryRecord ต่อ statute/topic

## 11. Mastery & Spaced Repetition

ระบบควรคำนวณ mastery จากหลายสัญญาณ ไม่ใช่แค่ถูก/ผิด

สัญญาณที่ควรใช้:

- ตอบถูกหรือผิด
- ใช้ hint กี่ขั้น
- ใช้เวลานานแค่ไหน
- พลาด criterion ใดใน rubric
- พลาด common misconception ใด
- เคยตอบถูกซ้ำในระยะเวลาห่างกันหรือไม่

ตัวอย่าง mastery dimensions:

- `statute_recognition`: จำมาตราได้
- `element_understanding`: เข้าใจองค์ประกอบ
- `fact_application`: ปรับข้อเท็จจริงได้
- `issue_spotting`: จับประเด็นได้
- `legal_writing`: เขียน IRAC ได้ชัดเจน

## 12. MVP Scope

แนะนำให้เริ่ม MVP ด้วยขอบเขตนี้

### Must Have

- Course/module/content folder structure
- Question player สำหรับ Level 1 และ Level 2
- Progressive hints 3 ขั้น
- MCQ rationale
- Subjective answer submission
- AI grading ด้วย rubric-controlled payload
- Evaluation screen
- Basic mastery per statute
- My Codex notes แบบง่าย

### Should Have

- Level 3 long scenario
- Spaced repetition queue
- Dashboard รายมาตรา
- Content validation script

### Later

- Moot Court Mode
- Leaderboard
- Teacher/admin authoring UI
- Import คำพิพากษา
- Collaborative study room

## 13. Implementation Phases

### Phase 1: Foundation

- ตั้ง monorepo structure
- ตั้ง `apps/web`, `packages/core`, `packages/db`, `packages/ai`
- สร้าง content schema สำหรับ course/module/statute/question/rubric
- สร้าง script validate content

### Phase 2: Practice MVP

- สร้าง dashboard เบื้องต้น
- สร้าง course/module page
- สร้าง practice screen
- รองรับ Level 1 MCQ และ Level 2 subjective
- สร้าง hint progression และ hint penalty

### Phase 3: Evaluation

- สร้าง MCQ rationale engine
- สร้าง AI grading service
- บังคับ JSON schema response
- เก็บ attempt และ evaluation
- แสดง Evaluation Screen

### Phase 4: Mastery

- คำนวณ mastery รายมาตรา
- สร้าง spaced repetition queue
- แนะนำโจทย์ตามจุดอ่อน
- สร้าง My Codex notes

### Phase 5: Advanced Modes

- เพิ่ม Level 3 long scenario
- เพิ่ม Moot Court Mode
- เพิ่ม leaderboard
- เพิ่ม teacher/admin tools

## 14. Content Modules Starter

### Module 1: กฎหมายลักษณะละเมิด จัดการงานนอกสั่ง และลาภมิควรได้

หัวข้อ:

- ความรับผิดเพื่อละเมิดในการกระทำของตนเอง: ม. 420, 423, 428, 432
- ความรับผิดในการกระทำของบุคคลอื่น: ม. 425, 429
- ความรับผิดเกิดจากทรัพย์: ม. 433, 434, 437
- การเรียกค่าสินไหมทดแทนและการยกเว้นความรับผิด

โจทย์เริ่มต้นที่ควรมี:

- Level 1: องค์ประกอบมาตรา 420
- Level 1: จับคู่มาตรากับฐานความรับผิดจากทรัพย์
- Level 2: แจกันตกใส่ศีรษะ
- Level 2: ลูกจ้างทำละเมิดในทางการที่จ้าง
- Level 3: เหตุหลายฝ่ายที่มีนายจ้าง ลูกจ้าง เจ้าของทรัพย์ และผู้เสียหาย

### Module 2: กฎหมายลักษณะทรัพย์สิน

หัวข้อ:

- ประเภทของทรัพย์สิน
- ทรัพย์สินของแผ่นดิน: ม. 1304 - 1307
- การได้มาซึ่งทรัพยสิทธิ/กรรมสิทธิ์: ม. 1299, 1300, 1382
- ข้อจำกัดสิทธิของเจ้าของอสังหาริมทรัพย์: ทางจำเป็น ม. 1349
- ทรัพยสิทธิอื่น: ภาระจำยอม ม. 1387, สิทธิอาศัย, สิทธิเหนือพื้นดิน

โจทย์เริ่มต้นที่ควรมี:

- Level 1: จำแนกอสังหาริมทรัพย์ สังหาริมทรัพย์ ส่วนควบ อุปกรณ์ และดอกผล
- Level 1: จำแนกทรัพย์สินของแผ่นดินตามมาตรา 1304
- Level 2: ทางจำเป็นกับภาระจำยอม
- Level 2: การได้มาซึ่งกรรมสิทธิ์ในอสังหาริมทรัพย์
- Level 3: ครอบครองปรปักษ์ในที่ดินที่มีภาระจำยอมและเกิดละเมิดในพื้นที่เดียวกัน

## 15. Guardrails for Legal AI

เพื่อควบคุมคุณภาพ AI grading:

- ห้าม AI ใช้ความรู้กฎหมายจากความจำของตนเองเป็นหลัก
- ต้องส่ง gold standard และ rubric ทุกครั้ง
- ต้องให้ AI ตอบเป็น JSON ตาม schema
- ต้องเก็บ raw evaluation ไว้ตรวจสอบย้อนหลัง
- ต้องมี confidence และ fallback หากคำตอบไม่แน่ชัด
- ต้องมีข้อความเตือนว่า feedback เป็นเครื่องมือช่วยเรียน ไม่ใช่คำปรึกษากฎหมาย
- ต้องมี human-reviewed content สำหรับโจทย์และ rubric สำคัญ

## 16. Success Metrics

ตัวชี้วัดด้านการเรียน:

- ผู้เรียนทำโจทย์ซ้ำแล้วคะแนนดีขึ้น
- จำนวน hint ที่ใช้ลดลงในมาตราเดิม
- mastery รายมาตราเพิ่มขึ้น
- common misconceptions ลดลง
- คำตอบ subjective มี IRAC ครบขึ้น

ตัวชี้วัดด้านผลิตภัณฑ์:

- completion rate ของ practice session
- daily active learners
- notes created in My Codex
- repeat practice rate
- retention ก่อนสอบ

## 17. First Build Checklist

รายการเริ่มต้นสำหรับสร้าง repo:

- [ ] สร้าง monorepo structure ตามเอกสารนี้
- [ ] เพิ่ม `content/courses/41215/course.yaml`
- [ ] เพิ่ม module 1 และ module 2
- [ ] เพิ่ม statute notes ชุดแรก
- [ ] เพิ่มโจทย์ Level 1 อย่างน้อย 5 ข้อ
- [ ] เพิ่มโจทย์ Level 2 อย่างน้อย 3 ข้อ
- [ ] เพิ่ม rubric สำหรับ subjective grading
- [ ] เพิ่ม schema validation สำหรับ content
- [ ] สร้างหน้า practice screen
- [ ] สร้าง endpoint `/api/grade`
- [ ] สร้าง JSON schema สำหรับ AI grading response
- [ ] สร้าง evaluation screen

