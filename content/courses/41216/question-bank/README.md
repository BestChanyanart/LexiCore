# Question Bank 41216

โฟลเดอร์นี้เป็น source of truth สำหรับโจทย์ทดลองของวิชา 41216 กฎหมายอาญา

## Files

- `level-1-question-bank-41216-combined.csv`: คำถาม Level 1 เช่น MCQ, matching, drag/drop
- `writing-question-table-41216.csv`: คำถามข้อเขียน/วินิจฉัยที่พร้อมใช้

## Update Flow

1. แก้ CSV ที่เกี่ยวข้อง หรือวางไฟล์ export จากหน้าเว็บไว้ใน `imports/*.csv`
2. ใช้ `question_id` ที่ไม่ซ้ำ
3. ตั้ง `status=ready` เฉพาะข้อที่ตรวจแล้ว
4. รัน `node scripts/build-writing-question-table-data.mjs`
5. เปิด `docs/trial-practice.html` เพื่อตรวจคำถาม

สำหรับโจทย์ที่ export จากหน้าเว็บ ให้เก็บแยกเป็น batch เช่น:

```text
content/courses/41216/question-bank/imports/2026-07-16-extra-drafts.csv
```

script จะรวม `writing-question-table-41216.csv` กับ `imports/*.csv` โดยอัตโนมัติ จึงไม่ต้อง paste แถวเข้าไฟล์หลัก

## Templates

เริ่มตารางใหม่จาก:

```text
content/templates/level-1-question-bank-template.csv
content/templates/writing-question-table-template.csv
```

อย่า commit `.xlsx`, preview images หรือ inspect dumps
