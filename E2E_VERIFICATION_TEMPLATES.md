# E2E verification: backend templates integration

Use this checklist after running the backend template seed and starting both backend and frontend.

## 1. Backend seed

From the backend project root (with your Python env active):

```bash
python -m app.seed.cli --templates --force
```

Confirm output shows templates/versions created or updated. With `--force`, existing templates get updated `input_schema`, `output_schema`, `stub_config`, and `prompt_definition`.

## 2. List

- Open `/templates` in the app.
- Confirm all expected backend templates appear (no 404s, correct names/descriptions).
- Count should match the number of templates in `1ne_backend/app/seed/seed_templates.py` (e.g. 20).

## 3. Detail and form

- Click a template (e.g. "General Lesson Planner" or any card).
- Confirm URL is `/templates/<slug>` with backend slug (e.g. `lesson_planner`).
- Confirm the form reflects `input_schema` (required and main optional fields present).
- For templates with array inputs (e.g. materials), confirm a textarea and that you can enter one item per line or comma-separated.

## 4. Execute and output

- Fill required fields and submit.
- Confirm stream starts (loading/streaming state) and no 4xx/5xx from `execute-stream`.
- Confirm output appears and that sections render correctly:
  - Title (if present)
  - Overview
  - Learning objectives
  - Lesson flow (phase, minutes, activity)
  - Standards alignment (if present)
  - Bloom alignment (including `note` when used)

## 5. Regression

- Open a fixed route (e.g. `/templates/general-lesson-planner`) and confirm it still works.
- Open a dynamic slug (e.g. `/templates/lesson_planner`) and confirm TemplateRunner loads and runs.
