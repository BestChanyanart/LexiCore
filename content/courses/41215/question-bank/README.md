# Question Bank 41215

โฟลเดอร์นี้เป็น source of truth สำหรับโจทย์ทดลองของวิชา 41215 กฎหมายแพ่งว่าด้วยละเมิดและทรัพย์สิน

## ไฟล์ในโฟลเดอร์นี้

- `level-1-question-bank-41215-combined.csv`: คำถาม Level 1 เช่น MCQ, matching, drag/drop
- `writing-question-table-41215.csv`: คำถามข้อเขียน/วินิจฉัยที่พร้อมใช้
- `subjective-question-bank-41215.csv`: backlog ข้อเขียนที่ยังใช้เป็น reference ได้ แต่ไม่ใช่ source หลักของหน้า trial

## วิธีเพิ่ม/แก้ข้อสอบ

1. เพิ่มแถวใน CSV ที่เหมาะสม
2. ใส่ `question_id` ที่ไม่ซ้ำ แล้วเติม `level`, `module`, `source`, `statutes`, `title`, `scenario`, `question`, `model_answer`, `answer_steps`, และ hint ให้ครบตามชนิดคำถาม
3. ถ้าต้องการซ่อนข้อชั่วคราว ให้ตั้ง `status=archived`
4. ถ้าข้อมาจากไฟล์เก็งแต่ยังอ่าน/เรียบเรียงไม่ครบ ให้เก็บไว้ใน backlog และตั้ง `status=needs_manual_review`
5. รัน `node scripts/build-writing-question-table-data.mjs`
6. เปิด `docs/trial-practice.html` เพื่อตรวจการแสดงผล

## การนำตารางเข้าเว็บไซต์ทดลอง

หน้า `docs/trial-practice.html` โหลดข้อเขียนจาก `docs/trial-writing-question-table.js`

ไฟล์ `docs/trial-writing-question-table.js` ถูกสร้างจาก `writing-question-table-*.csv` ของทุกวิชาที่เปิดใช้ ด้วยคำสั่ง:

```bash
node scripts/build-writing-question-table-data.mjs
```

หน้าเว็บจะแสดงเฉพาะแถวที่ตั้ง `status=ready` เท่านั้น

## โครงสร้างคอลัมน์สำคัญในตารางพร้อมใช้

- `scenario` คือข้อเท็จจริง/อุทาหรณ์ที่จะแสดงให้ผู้เรียนอ่าน
- `question` คือคำสั่งให้ตอบ
- `model_answer` คือแนวเฉลยแบบย่อหน้าจริงที่ใช้ปุ่มดูเฉลย
- `answer_steps` คือโครงสร้างตอบทีละขั้น คั่นด้วย `|`
- `hint_1`, `hint_2`, `hint_3` คือ hint ไล่ระดับ
- `criteria` คือเกณฑ์ตรวจคำตอบแบบย่อ

## สถานะไฟล์เก็งและ source material

raw PDFs และ spreadsheet working files ไม่อยู่ใน git แล้ว ให้เก็บไว้เฉพาะในเครื่องหรือ storage ที่มีสิทธิ์เข้าถึงจำกัด

ถ้าต้องการเพิ่มข้อจากไฟล์เก็ง ให้คัดโจทย์และแนวตอบมาใส่แถวใหม่ด้วยมือ ตรวจถ้อยคำให้อ่านรู้เรื่อง แล้วจึงตั้ง `status=ready` และรัน:

```bash
node scripts/build-writing-question-table-data.mjs
```
