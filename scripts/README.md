# Frontend scripts

## Template API tests

These scripts verify that the backend template endpoints return all templates and that the data shape is suitable for the frontend.

### 1. Node script (CLI)

Run from the **frontend** project root:

```bash
npm run test:templates
```

- Uses backend at `http://127.0.0.1:8000` by default.
- Override with env: `BACKEND_URL=http://localhost:8000 npm run test:templates` or `VITE_API_BASE_URL=... npm run test:templates`.

**Checks:**

- `GET /health` → 200
- `GET /api/v1/templates` → 200, response is an array of templates
- For each template: `GET /api/v1/templates/{slug}` → 200, has `latest_version.input_schema`
- `POST /api/v1/templates/lesson_planner/execute-stream` (or first slug) with minimal payload → 200 and stream

**Exit code:** 0 if all pass, 1 if any fail. Prints total template count and list of slugs so you can confirm “all templates from backend” and that the same list will show on the frontend `/templates` page.

### 2. Browser test page

With the dev server running (`npm run dev`), open:

```
http://localhost:5173/test-templates-browser.html
```

(or http://localhost:5174/ if Vite used that port). The page is served from `public/test-templates-browser.html`.

- Optionally set “Backend base” (e.g. `http://127.0.0.1:8000`).
- Click **Run tests** to call health, list, and detail for all templates.
- Shows the same list of templates the frontend receives so you can confirm they “get from backend and show” on the app’s `/templates` page.

**Note:** The app’s Templates Library page uses the same `GET /api/v1/templates` and displays every item returned; there is no client-side limit. So if this test shows N templates, the frontend will show N templates after a refresh.
