import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const outputDir = path.join(repoRoot, "content/courses/41215/question-bank");
const csvPath = path.join(outputDir, "writing-question-table-41215.csv");
const sourcePath = process.argv[2];

const columns = [
  "question_id",
  "status",
  "course_id",
  "level",
  "module",
  "source",
  "statutes",
  "title",
  "scenario",
  "question",
  "model_answer",
  "answer_steps",
  "hint_1",
  "hint_2",
  "hint_3",
  "criteria",
  "source_note",
];

if (!sourcePath) {
  throw new Error("Usage: node scripts/append-pasted-writing-questions.mjs <source-csv>");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((record) => record.some((cellValue) => cellValue.trim()));
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function clean(value) {
  return String(value || "")
    .replace(/\s*\[cite:[^\]]*\]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanStatutes(value) {
  return clean(value)
    .replace(/^มาตรา\s*/u, "")
    .replace(/\s+/g, " ")
    .trim();
}

const topicTitles = [
  "เหตุสุดวิสัยกับความรับผิดอาคารถล่ม",
  "การปิดกั้นถนนในหมู่บ้านจัดสรร",
  "ผู้จัดสรรยกถนนเป็นทางสาธารณะ",
  "ผู้เยาว์เมาแล้วขับและความรับผิดรถยนต์",
  "นายจ้าง ลูกจ้าง และอุบัติเหตุยานพาหนะ",
  "ค่าสินไหมค่ารักษาพยาบาลเอกชน",
  "ละเมิดโดยจงใจนอกทางการที่จ้าง",
  "ความรับผิดนโยบายรัฐจากการละเว้นกำกับดูแล",
  "รบกวนการครอบครองที่ดินสาธารณะ",
  "ครอบครองปรปักษ์และการนับเวลาผู้รับโอน",
  "โอนสิทธิครอบครองที่ดิน น.ส.3",
  "ฟ้องเอาคืนการครอบครองภายในหนึ่งปี",
  "ทางผ่าน ภาระจำยอม และปลูกสร้างรุกล้ำ",
  "เจ้าของรวมกับการครอบครองปรปักษ์",
  "สิทธิอาศัยไม่จดทะเบียนและสิ่งปลูกสร้างรุกล้ำ",
  "สิทธิครอบครอง น.ส.3 กับการยึดทรัพย์",
  "ภาระจำยอมโดยอายุความกับผู้รับโอนสุจริต",
  "สิทธิเก็บกินไม่จดทะเบียนและที่ดินไม่มีเจ้าของ",
  "ครอบครองปรปักษ์กับผู้ซื้อทอดตลาด",
];

function titleFromQuestion(index) {
  return topicTitles[index] || `คำถามเขียนตอบ ${String(index + 1).padStart(2, "0")}`;
}

function splitQuestionPrompt(text) {
  const markers = [
    "ให้นักเรียนวินิจฉัย",
    "ให้วินิจฉัย",
    "วินิจฉัยว่า",
    "จะฟ้องได้หรือไม่",
    "ฟังขึ้นหรือไม่",
    "ได้หรือไม่",
  ];
  for (const marker of markers) {
    const index = text.lastIndexOf(marker);
    if (index > 40) {
      return {
        scenario: text.slice(0, index).trim(),
        question: text.slice(index).trim(),
      };
    }
  }
  return {
    scenario: text,
    question: "ให้นักเรียนเขียนตอบและวินิจฉัยตามประเด็นในโจทย์",
  };
}

function answerSteps(answer) {
  const parts = answer
    .split(/\n(?=(?:\([ก-ฮ]\)|\d+\.|สรุป|สำหรับ|ส่วน))/u)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return (parts.length > 1 ? parts : answer.split(/\n+/).map((part) => part.trim()).filter(Boolean)).join(" | ");
}

function toImportedRow(record, index) {
  const category = clean(record["หมวดวิชา"]);
  const fullQuestion = clean(record["คำถาม (Question)"]);
  const answer = clean(record["เฉลยคำตอบ (Answer)"]);
  const statutes = cleanStatutes(record["มาตราที่เกี่ยวข้อง (Sections)"]);
  const prompt = splitQuestionPrompt(fullQuestion);
  return {
    question_id: `q-writing-41215-import-${String(index).padStart(3, "0")}`,
    status: "ready",
    course_id: "41215",
    level: "3",
    module: category,
    source: "คำถามที่เขียนตอบ",
    statutes,
    title: titleFromQuestion(index, fullQuestion),
    scenario: prompt.scenario,
    question: prompt.question,
    model_answer: answer,
    answer_steps: answerSteps(answer),
    hint_1: `โจทย์นี้อยู่ในหมวด${category}`,
    hint_2: statutes ? `มาตราที่ควรพิจารณา: ${statutes}` : "ระบุมาตราที่เกี่ยวข้องจากข้อเท็จจริง",
    hint_3: "แยกประเด็นข้อเท็จจริง หลักกฎหมาย การปรับบท และสรุปผลให้ชัดเจน",
    criteria: "จับประเด็นข้อเท็จจริงสำคัญ (3 คะแนน) | ระบุหลักกฎหมายและมาตราที่เกี่ยวข้องถูกต้อง (4 คะแนน) | ปรับบทกับข้อเท็จจริงครบถ้วน (6 คะแนน) | สรุปผลและผู้รับผิดหรือสิทธิของคู่กรณีชัดเจน (2 คะแนน)",
    source_note: "นำเข้าจาก pasted-text.txt วันที่ 2026-07-16 และลบ citation แล้ว",
  };
}

function rowsToObjects(rows) {
  const [header, ...records] = rows;
  return records.map((record) => Object.fromEntries(header.map((column, index) => [column, record[index] || ""])));
}

async function main() {
  const existingRows = rowsToObjects(parseCsv(await fs.readFile(csvPath, "utf8")));
  const sourceRows = rowsToObjects(parseCsv(await fs.readFile(sourcePath, "utf8")));
  const importedRows = sourceRows.map(toImportedRow);
  const importedById = new Map(importedRows.map((row) => [row.question_id, row]));
  const rowsWithUpdates = existingRows.map((row) => importedById.get(row.question_id) || row);
  const existingIds = new Set(rowsWithUpdates.map((row) => row.question_id));
  const additions = importedRows.filter((row) => !existingIds.has(row.question_id));
  const rows = [...rowsWithUpdates, ...additions];
  const csv = [
    columns.join(","),
    ...rows.map((row) => columns.map((column) => csvEscape(clean(row[column]))).join(",")),
  ].join("\n");
  await fs.writeFile(csvPath, `${csv}\n`, "utf8");
  console.log(`existing=${existingRows.length} added=${additions.length} total=${rows.length}`);
}

await main();
