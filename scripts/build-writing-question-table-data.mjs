import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();

const courses = [
  {
    code: "41215",
    globalName: "LEXICORE_WRITING_QUESTIONS_41215",
    csvPath: "content/courses/41215/question-bank/writing-question-table-41215.csv",
    importDirPath: "content/courses/41215/question-bank/imports",
    statuteCsvPath: "content/courses/41215/source-materials/civil-law-sections-short-title.csv",
    statuteGlobalName: "LEXICORE_STATUTES_41215",
    extraTables: [
      {
        globalName: "LEXICORE_LEVEL1_QUESTIONS_41215",
        csvPath: "content/courses/41215/question-bank/level-1-question-bank-41215-combined.csv",
      },
    ],
  },
  {
    code: "41216",
    globalName: "LEXICORE_WRITING_QUESTIONS_41216",
    csvPath: "content/courses/41216/question-bank/writing-question-table-41216.csv",
    importDirPath: "content/courses/41216/question-bank/imports",
    statuteCsvPath: "content/courses/41216/source-materials/criminal-code-sections-short-title.csv",
    statuteGlobalName: "LEXICORE_STATUTES_41216",
    extraTables: [
      {
        globalName: "LEXICORE_LEVEL1_QUESTIONS_41216",
        csvPath: "content/courses/41216/question-bank/level-1-question-bank-41216-combined.csv",
      },
    ],
  },
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

async function loadRows(csvPath) {
  const absolutePath = path.join(repoRoot, csvPath);
  let csv;
  try {
    csv = await fs.readFile(absolutePath, "utf8");
  } catch (error) {
    throw new Error(`Missing content CSV: ${csvPath}`, { cause: error });
  }
  const [header, ...records] = parseCsv(csv);
  return records.map((record) =>
    Object.fromEntries(header.map((column, index) => [column.replace(/^\uFEFF/, ""), record[index] || ""])),
  );
}

async function listCsvFiles(dirPath) {
  const absolutePath = path.join(repoRoot, dirPath);
  let entries;
  try {
    entries = await fs.readdir(absolutePath, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw new Error(`Unable to read import directory: ${dirPath}`, { cause: error });
  }
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".csv"))
    .map((entry) => path.posix.join(dirPath, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

async function loadRowsWithImports(csvPath, importDirPath) {
  const rows = await loadRows(csvPath);
  const importCsvPaths = importDirPath ? await listCsvFiles(importDirPath) : [];
  const importRowsByPath = [];
  for (const importCsvPath of importCsvPaths) {
    const importRows = await loadRows(importCsvPath);
    importRowsByPath.push({ csvPath: importCsvPath, rows: importRows });
    rows.push(...importRows);
  }
  return { rows, importRowsByPath };
}

function splitList(value, delimiter) {
  return String(value || "")
    .split(delimiter)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSectionKey(value) {
  const match = String(value || "").match(/\d{1,4}/);
  return match ? match[0] : "";
}

function rowToWebsiteData(row) {
  return {
    question_id: row.question_id,
    status: row.status,
    course_id: row.course_id,
    level: Number(row.level),
    module: row.module,
    source: row.source,
    statutes: splitList(row.statutes, ","),
    title: row.title,
    scenario: row.scenario,
    question: row.question,
    model_answer: row.model_answer,
    answer_steps: splitList(row.answer_steps, "|"),
    hint_1: row.hint_1,
    hint_2: row.hint_2,
    hint_3: row.hint_3,
    criteria: row.criteria,
    source_note: row.source_note,
  };
}

async function loadStatuteRows(csvPath) {
  const rows = await loadRows(csvPath);
  return rows
    .map((row) => ({
      section: normalizeSectionKey(row.Section),
      shortTitle: row.Short_Title || row.Short_title || "",
      content: row.Content || "",
    }))
    .filter((row) => row.section);
}

const blocks = [];
for (const course of courses) {
  if (course.statuteCsvPath && course.statuteGlobalName) {
    const statuteRows = await loadStatuteRows(course.statuteCsvPath);
    blocks.push(`// Generated from ${course.statuteCsvPath}
window.${course.statuteGlobalName} = ${JSON.stringify(statuteRows, null, 2)};`);
    console.log(`${course.code} statute rows=${statuteRows.length}`);
  }

  const { rows, importRowsByPath } = await loadRowsWithImports(course.csvPath, course.importDirPath);
  const data = rows.map(rowToWebsiteData);
  const sourceComment = [
    course.csvPath,
    ...importRowsByPath.map((importTable) => importTable.csvPath),
  ].join(", ");
  const importRowCount = importRowsByPath.reduce((total, table) => total + table.rows.length, 0);
  blocks.push(`// Generated from ${sourceComment}
window.${course.globalName} = ${JSON.stringify(data, null, 2)};`);
  console.log(`${course.code} writing question rows=${data.length} base=${rows.length - importRowCount} imports=${importRowCount}`);
  for (const importTable of importRowsByPath) {
    console.log(`${course.code} import rows ${importTable.csvPath}=${importTable.rows.length}`);
  }

  for (const table of course.extraTables || []) {
    const extraRows = await loadRows(table.csvPath);
    blocks.push(`// Generated from ${table.csvPath}
window.${table.globalName} = ${JSON.stringify(extraRows, null, 2)};`);
    console.log(`${course.code} extra rows ${table.globalName}=${extraRows.length}`);
  }
}

const output = `// Generated by scripts/build-writing-question-table-data.mjs.
// Rebuild after editing supported content/courses/*/question-bank/*.csv source tables.
${blocks.join("\n\n")}
`;

await fs.writeFile(path.join(repoRoot, "docs/trial-writing-question-table.js"), output, "utf8");
