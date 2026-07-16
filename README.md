# LexiCore

LexiCore is a legal learning webapp for Thai law students. It helps learners practice issue spotting, statute matching, legal reasoning, and IRAC-style answer drafting through progressive question levels, smart hints, rubric-based feedback, and AI-assisted grading.

## Project Shape

```text
apps/web        User-facing web application
packages/core   Domain logic for courses, questions, hints, mastery, and scoring
packages/db     Database schema, migrations, seed/import helpers
packages/ai     LLM grading prompts, schemas, provider adapters, and safety checks
packages/ui     Shared UI components and design tokens
content         Course content, modules, statutes, questions, and rubrics
docs            Product, architecture, grading, authoring, and UX documentation
scripts         Content validation/import/indexing scripts
tests           Cross-package and end-to-end fixtures
```

## Current Content

Current courses:

- `41215`: กฎหมายแพ่ง: ละเมิดและทรัพย์สิน
- `41216`: กฎหมายอาญา

Trial questions are authored as CSV under each course:

```text
content/courses/<course-id>/question-bank/
```

Use `content/templates/` when starting a new question table.

## Local Trial Page

Open this file in a browser for the static practice prototype:

```text
docs/trial-practice.html
```

After editing question CSVs, rebuild the static data:

```sh
node scripts/build-writing-question-table-data.mjs
```

## Vercel Deploy

Deploy the learner-facing app from the monorepo with these Vercel settings:

```text
Framework Preset: Next.js
Root Directory: apps/web
Install Command: pnpm install
Build Command: pnpm build
Output Directory: leave empty
```

The web build runs `apps/web/scripts/prepare-static-assets.mjs` first. That script rebuilds the trial question data and copies the current trial prototype into `apps/web/public/`, so the deployed root page can serve it through the Next.js app shell.

## Repo Hygiene

Commit CSV/YAML/MD/source files. Do not commit `.env`, raw PDFs, spreadsheet working files, preview images, inspect dumps, `outputs/`, caches, or local runtime state.

## Next Implementation Steps

1. Implement schema validation for the canonical CSV/YAML content.
2. Move the static trial flow into the web app when the frontend stack is ready.
3. Import reviewed content into the database.
4. Add rubric-controlled AI grading.
5. Add mastery tracking and spaced repetition.
