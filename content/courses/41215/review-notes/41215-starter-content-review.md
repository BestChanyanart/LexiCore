# 41215 Starter Content Review Notes

ชุดไฟล์นี้สร้างขึ้นจากโครงรายวิชาและมาตราที่ระบุไว้ใน repo เพื่อใช้เป็น starter content สำหรับพัฒนาแอป

## ต้องตรวจทานก่อนใช้จริง

- ความถูกต้องขององค์ประกอบมาตรา
- ความเหมาะสมของโจทย์และคำใบ้
- ความเหมาะสมของคะแนนใน rubric
- ความสอดคล้องกับหนังสือ มสธ. เมื่อเพิ่มไฟล์ต้นทางครบ 15 บท

## Source Material Status

ไฟล์หนังสือต้นทางเคยใช้เพื่อสร้าง starter content แล้ว แต่ raw PDFs ไม่ถูก commit หลัง cleanup repo

ถ้าต้องตรวจทานกับต้นฉบับอีกครั้ง ให้วางไฟล์ไว้ใน `source-materials/raw/` เฉพาะเครื่อง local หรือ storage ที่มีสิทธิ์เข้าถึงจำกัด

ขั้นต่อไปควร extract/สรุปเป็น outline รายบท:

```text
source-materials/chapters/chapter-01-outline.md
source-materials/chapters/chapter-02-outline.md
...
source-materials/chapters/chapter-15-outline.md
```

จากนั้นจึงตรวจทาน statute notes, questions และ rubrics ให้ตรงกับเนื้อหาจากต้นฉบับที่ได้รับอนุญาต

## Trial Question Set v1

สร้างชุดโจทย์ทดลองใช้จริงแล้วที่:

```text
content-map/trial-question-set-41215.yaml
```

ชุดนี้ใช้หัวข้อที่ extract/เรียบเรียงจาก source material เดิม โดยเน้นหน่วย:

- หน่วย 1: ความรับผิดเพื่อละเมิดในการกระทำของตนเอง
- หน่วย 4: ค่าสินไหมทดแทนและนิรโทษกรรม
- หน่วย 5: จัดการงานนอกสั่งและลาภมิควรได้
- หน่วย 8: ทรัพยสิทธิและบุคคลสิทธิ
- หน่วย 9: กรรมสิทธิ์และกรรมสิทธิ์รวม
- หน่วย 12: สิทธิครอบครองและครอบครองปรปักษ์
- หน่วย 13: ภาระจำยอม
- หน่วย 14: ทรัพยสิทธิอื่น
- หน่วย 15: การได้มาซึ่งอสังหาริมทรัพย์หรือทรัพยสิทธิ

สถานะหลังเพิ่ม trial set:

- statute notes: 29 ไฟล์
- questions: 26 ไฟล์
- rubrics: 17 ไฟล์

เพิ่ม model answer สำหรับช่วงที่ยังไม่มี LLM แล้วใน:

```text
modules/module-01-torts-unjust-enrichment/model-answers/
```

สิ่งที่ควรให้ reviewer ตรวจ:

- โจทย์ trial set ตรงกับรายละเอียดใน PDF มากพอหรือไม่
- rubric สำหรับ subjective questions ให้คะแนนเหมาะสมหรือไม่
- คำใบ้ 3 ขั้นช่วยคิดโดยไม่เฉลยเร็วเกินไปหรือไม่
- ควรเพิ่มโจทย์จากหน่วยใดก่อนในรอบถัดไป
