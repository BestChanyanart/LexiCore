# LexiCore Content

Course content lives in `content/courses/<course_id>`.

## Canonical Files

Keep these in git:

- `course.yaml`
- `content-map/*.yaml`
- `modules/**/*.yaml`
- `modules/**/*.md`
- `question-bank/*.csv`
- `source-materials/*.csv`
- `source-materials/**/*.md`

Keep these out of git:

- raw PDFs or downloaded source files in `source-materials/raw/`
- spreadsheet working copies such as `.xlsx`
- preview images
- inspect/export dumps
- generated files under `outputs/`

## Add Questions

1. Pick the course folder, for example `content/courses/41216`.
2. Edit the CSV in `question-bank/`.
3. Use the templates in `content/templates/` when starting a new bank.
4. Run `pnpm build:trial-data` to refresh `docs/trial-writing-question-table.js`.
5. Open `docs/trial-practice.html` to smoke-test the questions.

## CSV Types

- Level 1: use `level-1-question-bank-<course-code>-combined.csv`.
- Writing/subjective: use `writing-question-table-<course-code>.csv`.

Prefer CSV for repo changes because it is diffable and reviewable.
