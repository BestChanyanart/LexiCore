# Content Authoring Guide

Legal content is stored under `content/courses`. Each course owns its modules, statutes, questions, and rubrics.

Use CSV files in `question-bank/` as the canonical authoring surface for trial practice questions. Spreadsheet files, preview images, inspect dumps, and raw PDFs are local working artifacts and should not be committed.

## Course

```yaml
id: 41215
title: กฎหมายแพ่ง: ละเมิดและทรัพย์สิน
code: "41215"
description: ฝึกวินิจฉัยกฎหมายลักษณะละเมิดและทรัพย์สิน
modules:
  - module-01-torts-unjust-enrichment
  - module-02-property
```

## Question Rules

Every question should include:

- `id`
- `course_id`
- `module_id`
- `level`
- `type`
- `scenario`
- `question`
- `statutes`
- `hints`
- `rubric_id` when subjective grading is needed

## Question Bank CSVs

Use the templates in `content/templates/` when creating a new table:

- `level-1-question-bank-template.csv` for MCQ, matching, and drag/drop concept checks
- `writing-question-table-template.csv` for written-answer questions

For an existing course, edit the matching file under:

```text
content/courses/<course_id>/question-bank/
```

For questions exported from the web authoring form, keep them as separate CSV batches under:

```text
content/courses/<course_id>/question-bank/imports/
```

The trial-data build reads the main `writing-question-table-<course_id>.csv` file first, then appends every `imports/*.csv` file in filename order. This keeps the curated table small and makes it easy to remove or replace a whole imported batch.

After editing CSV content, rebuild the static trial data:

```sh
node scripts/build-writing-question-table-data.mjs
```

Then open `docs/trial-practice.html` and smoke-test the new questions.

`pnpm build:trial-data` is also available once dependencies are installed, but the Node command above works without installing extra packages.

## Repository Hygiene

Commit:

- CSV/YAML/MD source content
- approved `question-bank/imports/*.csv` batches
- course/module metadata
- statute summary CSVs
- `.gitkeep` files that preserve empty folders

Do not commit:

- `.xlsx` working copies
- preview PNGs
- `.inspect.ndjson` dumps
- raw PDFs or downloaded source files in `source-materials/raw/`
- generated files under `outputs/`

## Hint Rules

Use three progressive hint levels:

- Level 1: focus area
- Level 2: key elements
- Level 3: statute number

Hints should help the learner think. They should not reveal the full analysis before the final hint.

## Rubric Rules

Rubrics should be written so both a human and an AI grader can evaluate the same answer consistently.

Each rubric should include:

- expected issues
- relevant statutes
- rule summary
- expected application points
- expected conclusion
- point allocation
