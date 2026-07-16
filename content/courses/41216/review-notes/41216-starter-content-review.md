# 41216 Starter Content Review Notes

สร้างโครง folder พื้นฐานสำหรับรายวิชา 41216 กฎหมายอาญาแล้ว

## ยังต้องเติม

- ไฟล์หนังสือต้นทางใน `source-materials/raw/` เฉพาะ local หรือ storage ที่มีสิทธิ์เข้าถึงจำกัด
- outline รายบทใน `source-materials/chapters/`
- learning objectives ใน `source-materials/learning-objectives/`
- modules
- statute notes
- questions
- rubrics

## สถานะหลัง cleanup

- question bank ที่ใช้กับหน้า trial อยู่ใน `question-bank/*.csv`
- statute summary อยู่ใน `source-materials/criminal-code-sections-short-title.csv`
- raw source files ไม่ควร commit เข้า repo
- หลังแก้ CSV ให้รัน `node scripts/build-writing-question-table-data.mjs`
