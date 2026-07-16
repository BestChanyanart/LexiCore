import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const statutesPath = path.join(
  repoRoot,
  "content/courses/41216/source-materials/criminal-code-sections-short-title.csv",
);
const questionsPath = path.join(
  repoRoot,
  "content/courses/41216/question-bank/writing-question-table-41216.csv",
);
const lawBlockHeading = "ตัวบทมาตราเต็ม";

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

  return rows.filter((record) => record.some((cellValue) => String(cellValue || "").trim()));
}

function toObjects(rows) {
  const [header, ...records] = rows;
  return records.map((record) =>
    Object.fromEntries(header.map((column, index) => [column.replace(/^\uFEFF/, ""), record[index] || ""])),
  );
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function sectionKey(value) {
  const match = String(value || "").match(/\d{1,4}/);
  return match ? match[0] : "";
}

function thaiNumberToInt(value) {
  const normalized = String(value || "").trim();
  const map = {
    แรก: 1,
    หนึ่ง: 1,
    1: 1,
    สอง: 2,
    2: 2,
    สาม: 3,
    3: 3,
    สี่: 4,
    4: 4,
    ห้า: 5,
    5: 5,
    หก: 6,
    6: 6,
    เจ็ด: 7,
    7: 7,
    แปด: 8,
    8: 8,
    เก้า: 9,
    9: 9,
    สิบ: 10,
    10: 10,
  };
  return map[normalized] || null;
}

function sectionRefs(value) {
  const seen = new Set();
  return String(value || "")
    .split(",")
    .map((raw) => {
      const label = raw.trim();
      const section = sectionKey(label);
      if (!section) return null;
      const paragraph = thaiNumberToInt(label.match(/วรรค\s*([^\s()]+)/u)?.[1]);
      const item = Number(label.match(/\((\d{1,2})\)/)?.[1]) || null;
      const key = `${section}:${paragraph || ""}:${item || ""}:${label}`;
      if (seen.has(key)) return null;
      seen.add(key);
      return { section, label, paragraph, item };
    })
    .filter(Boolean);
}

function removeExistingLawBlock(value) {
  const [beforeHeading] = String(value || "").split(`\n\n${lawBlockHeading}:`);
  return beforeHeading.trim();
}

function splitStatuteParagraphs(content) {
  return String(content || "")
    .replace(/\s+(กระทำโดยเจตนา ได้แก่)/gu, "\n$1")
    .replace(/\s+(ถ้าผู้กระทำมิได้รู้ข้อเท็จจริง)/gu, "\n$1")
    .replace(/\s+(กระทำโดยประมาท ได้แก่)/gu, "\n$1")
    .replace(/\s+(การกระทำ ให้หมายความรวมถึง)/gu, "\n$1")
    .replace(/\s+(ถ้าตามกฎหมายที่บัญญัติในภายหลัง)/gu, "\n$1")
    .replace(/\s+(แต่ในกรณีที่คดีถึงที่สุดแล้ว)/gu, "\n$1")
    .replace(/\s+(ผู้ใดพยายามกระทำความผิด)/gu, "\n$1")
    .replace(/\s+(ถ้าการกระทำความผิดดังกล่าว)/gu, "\n$1")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function itemExcerpt(content, item) {
  if (!item) return "";
  const text = String(content || "");
  const pattern = new RegExp(`\\(${item}\\)\\s*([\\s\\S]*?)(?=\\s*\\(${item + 1}\\)\\s|$)`);
  return text.match(pattern)?.[0]?.trim() || "";
}

function contentForRef(entry, ref) {
  const item = itemExcerpt(entry.content, ref.item);
  if (item) return item;

  const paragraphs = splitStatuteParagraphs(entry.content);
  if (ref.paragraph && paragraphs[ref.paragraph - 1]) {
    return paragraphs[ref.paragraph - 1];
  }

  return paragraphs.join("\n");
}

function lawBlockFor(refs, statuteBySection) {
  const entries = refs
    .map((ref) => {
      const entry = statuteBySection.get(ref.section);
      if (!entry) return null;
      return { ...entry, ref, content: contentForRef(entry, ref) };
    })
    .filter(Boolean);

  if (!entries.length) return "";

  return `${lawBlockHeading}:\n${entries
    .map((entry) => `มาตรา ${entry.ref.label}: ${entry.shortTitle}\n${entry.content}`)
    .join("\n\n")}`;
}

const statuteRows = toObjects(parseCsv(await fs.readFile(statutesPath, "utf8")));
const statuteBySection = new Map(
  statuteRows
    .map((row) => ({
      section: sectionKey(row.Section),
      shortTitle: row.Short_Title || "",
      content: row.Content || "",
    }))
    .filter((row) => row.section)
    .map((row) => [row.section, row]),
);

const questionRows = toObjects(parseCsv(await fs.readFile(questionsPath, "utf8")));
let updatedRows = 0;

const updated = questionRows.map((row) => {
  const refs = sectionRefs(row.statutes);
  const lawBlock = lawBlockFor(refs, statuteBySection);
  if (!lawBlock) return row;

  updatedRows += 1;
  const hintBase = removeExistingLawBlock(row.hint_2 || `มาตราที่ควรพิจารณา: ${refs.map((ref) => ref.label).join(", ")}`);
  const answerBase = removeExistingLawBlock(row.model_answer);

  return {
    ...row,
    hint_2: `${hintBase}\n\n${lawBlock}`,
    model_answer: `${answerBase}\n\n${lawBlock}`,
  };
});

const csv = [
  columns.join(","),
  ...updated.map((row) => columns.map((column) => csvEscape(row[column])).join(",")),
].join("\n");

await fs.writeFile(questionsPath, `${csv}\n`, "utf8");
console.log(`updated writing rows=${updatedRows}`);
