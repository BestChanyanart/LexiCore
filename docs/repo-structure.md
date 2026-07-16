# LexiCore Repo Structure

เอกสารนี้คือแผนที่ repo หลัง cleanup สำหรับคนที่จะเพิ่มโจทย์ ปรับเนื้อหา หรือเตรียม push ขึ้นใช้งานจริง

## Top Level

```text
apps/                 แอปผู้ใช้จริง
packages/             package กลางของระบบ
content/              source of truth ของรายวิชาและ question bank
docs/                 เอกสาร product, architecture, UX และ static trial page
scripts/              script สร้าง/ตรวจ content
tests/                test และ fixture ระดับ repo
.env.example          template env ที่ commit ได้
.gitignore            กติกากันไฟล์ local/generated/binary
```

## What To Commit

Commit เฉพาะไฟล์ที่ review ได้ง่ายและใช้ซ้ำได้:

- source code
- `.md`, `.yaml`, `.csv`
- course metadata
- statute summary CSVs
- question-bank CSVs
- docs และ templates
- `.gitkeep` สำหรับ folder ว่างที่ต้องคงไว้

ไม่ควร commit:

- `.env` หรือ secret จริง
- `.omx/`, logs, cache, dependency folders
- `outputs/`
- `.xlsx` working copies
- preview images
- `.inspect.ndjson`
- raw PDFs หรือ source files ที่อยู่ใน `source-materials/raw/`

## Content Layout

```text
content/
  README.md
  templates/
    level-1-question-bank-template.csv
    writing-question-table-template.csv
  courses/
    <course-id>/
      course.yaml
      content-map/
      modules/
      question-bank/
      review-notes/
      source-materials/
```

## Canonical Question Files

ตอนนี้ trial practice ใช้ CSV เป็น source of truth:

```text
content/courses/<course-id>/question-bank/level-1-question-bank-<course-code>-combined.csv
content/courses/<course-id>/question-bank/writing-question-table-<course-code>.csv
```

ไฟล์ `docs/trial-writing-question-table.js` เป็น generated static data สำหรับหน้า trial และสร้างใหม่จาก CSV ด้วย:

```sh
node scripts/build-writing-question-table-data.mjs
```

หลังแก้ CSV ให้เปิด:

```text
docs/trial-practice.html
```

เพื่อ smoke-test ข้อใหม่

## Adding Questions

1. เลือก course ให้ถูกใน `content/courses/`
2. เพิ่มแถวใน CSV ที่เหมาะสมใน `question-bank/`
3. ใช้ template จาก `content/templates/` ถ้าจะเริ่มตารางใหม่
4. ตั้ง `status=ready` เฉพาะข้อที่ตรวจแล้ว
5. รัน `node scripts/build-writing-question-table-data.mjs`
6. เปิด `docs/trial-practice.html` ตรวจการแสดงผล

### Level 1 CSV

ใช้สำหรับ MCQ, matching, drag/drop หรือ concept check

template:

```text
content/templates/level-1-question-bank-template.csv
```

### Writing CSV

ใช้สำหรับข้อเขียน/วินิจฉัย พร้อมแนวตอบ คำใบ้ และ criteria

template:

```text
content/templates/writing-question-table-template.csv
```

## Source Materials

`source-materials/raw/` เป็นที่พักไฟล์ต้นทาง local เท่านั้น ไฟล์จริงใน folder นี้ถูก ignore โดย `.gitignore`

Commit ได้:

- `source-materials/README.md`
- outline ที่สรุปเองใน `source-materials/chapters/`
- learning objectives ใน `source-materials/learning-objectives/`
- statute summary CSV เช่น `civil-law-sections-short-title.csv`

ไม่ commit:

- PDF หนังสือ
- scan
- downloaded source files
- ไฟล์ที่ไม่มีสิทธิเผยแพร่

## Scripts

```text
scripts/build-writing-question-table-data.mjs  สร้าง docs/trial-writing-question-table.js จาก CSV
scripts/apply-41215-civil-statutes.mjs        เติมตัวบท/summary ให้ question bank 41215
scripts/apply-41216-criminal-statutes.mjs     เติมตัวบท/summary ให้ question bank 41216
scripts/append-pasted-writing-questions.mjs   append CSV ข้อเขียนเข้า 41215
scripts/validate-content.ts                   placeholder สำหรับ validation pipeline
scripts/import-content.ts                     placeholder สำหรับ import pipeline
scripts/generate-question-index.ts            placeholder สำหรับ index generation
```

ทุก script ควรรันจาก repo root และต้องไม่ hard-code absolute path ของเครื่องใคร

## Environment

ใช้ `.env.example` เป็น template แล้วสร้าง `.env` เองในเครื่อง

```text
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lexicore"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
AUTH_SECRET="replace-with-a-long-random-string"
LLM_PROVIDER="openai"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-5.1-mini"
```

ห้าม commit `.env`, API key, database password, session secret หรือ credential ใด ๆ

## Static Trial Page

`docs/trial-practice.html` เป็นหน้า static สำหรับลอง question flow โดยยังไม่ต้องมี backend:

- เลือก course/level
- ค้นหาคำถาม
- filter ยังไม่ได้ทำ/ทำแล้ว
- hint 3 ขั้น
- ตรวจ MCQ/matching/drag/drop
- mock grading สำหรับข้อเขียน
- ปรับขนาดตัวอักษร
- highlight ข้อความและลบ highlight
- reset ข้อให้กลับไปอยู่ในยังไม่ได้ทำ

หน้านี้ควรเก็บไว้เบาและ dependency-free เพื่อให้เปิดจากไฟล์ได้ทันที

## Before Push

รันอย่างน้อย:

```sh
node scripts/build-writing-question-table-data.mjs
node -e "const fs=require('fs');const html=fs.readFileSync('docs/trial-practice.html','utf8');for(const s of [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\\s\\S]*?)<\\/script>/g)].map(m=>m[1])) new Function(s); console.log('trial html ok')"
```

แล้วตรวจว่าไม่มีไฟล์ local/generated หลุดมา:

```sh
git status --short --ignored
```
