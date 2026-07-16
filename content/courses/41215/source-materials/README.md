# Source Materials

ไฟล์ใน folder นี้เป็นแหล่งอ้างอิงต้นทางของรายวิชา ไม่ใช่โจทย์ที่ระบบใช้โดยตรง

## Suggested Layout

```text
source-materials/
  raw/
    .gitkeep
  chapters/
    chapter-01-outline.md
    chapter-02-outline.md
  learning-objectives/
    chapter-01.yaml
    chapter-02.yaml
```

## Usage Rules

- ใช้ไฟล์ต้นทางเพื่อทำ outline, learning objectives, statute notes, questions และ rubrics
- ห้ามเผยแพร่ไฟล์ต้นฉบับผ่าน public app
- ห้าม commit ไฟล์ที่ไม่มีสิทธิเผยแพร่เข้า public repository
- ไฟล์ใน `raw/` เป็น local-only และถูก ignore โดย `.gitignore`; ให้ commit เฉพาะ `.gitkeep`
- ไม่ควรส่งไฟล์หนังสือทั้งบทให้ LLM ถ้าไม่จำเป็น ให้ส่งเฉพาะ excerpt, outline หรือข้อมูลที่ได้รับอนุญาตและจำเป็นต่อการสร้างโจทย์
