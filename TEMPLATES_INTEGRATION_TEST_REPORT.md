# Templates Feature – Frontend–Backend Integration Test Report

**Date:** 2026-03-07  
**Frontend:** 1ne-frontend (Vite)  
**Backend:** 1ne_backend (FastAPI, port 8000)  
**Frontend URL:** http://localhost:5174/templates (or 5173)

---

## Phase 1: Backend Verification – PASSED

### 1.1 Port check
- **Result:** Backend is listening on port 8000.
- **Command used (Windows):** `netstat -ano | findstr :8000`  
  Output: `TCP 0.0.0.0:8000 ... LISTENING`

### 1.2 Health endpoint
- **URL:** `http://127.0.0.1:8000/health`
- **Status:** 200 OK
- **Response:** `{"status":"ok","database":"connected"}`

### 1.3 Templates list API
- **URL:** `http://127.0.0.1:8000/api/v1/templates`
- **Status:** 200 OK
- **Auth:** No token required for list.
- **Response:** JSON array of templates with `id`, `slug`, `name`, `description`, `category`, `grade_bands_supported`, `is_hot`, `is_favorite`, `execution_count`, etc.

### 1.4 Template detail API
- **URL:** `http://127.0.0.1:8000/api/v1/templates/lesson_planner`
- **Status:** 200 OK
- **Response:** Full template with `latest_version` containing `input_schema`, `output_schema`, `stub_config`, etc.

### 1.5 Execute-stream API
- **URL:** `POST http://127.0.0.1:8000/api/v1/templates/lesson_planner/execute-stream`
- **Body:** `{"data": { "subject": "math", "grade": 5, "topic": "Fractions", "learning_objective": "...", "time_duration_minutes": 45, "bloom_level": "Understand" }}`
- **Status:** 200 OK (streaming response)

### 1.6 CORS
- Backend uses `CORSMiddleware`; when `ENVIRONMENT=dev` (default in `app/core/config.py`), `allow_origins=["*"]`.
- Non-dev: `localhost:5173`, `localhost:5174`, `127.0.0.1:5173`, `127.0.0.1:5174` are in the allowed list in `app/main.py`.

---

## Phase 2: Frontend Setup & Connection – PASSED

### 2.1 Local backend configuration
- **File:** `1ne-frontend/.env.local`
- **Content:** `VITE_USE_LOCAL=true`
- **Effect:** With this set, `src/config/api.ts` uses `LOCAL_BACKEND_URL = 'http://127.0.0.1:8000'` as the backend base.

### 2.2 API config
- **File:** `1ne-frontend/src/config/api.ts`
- **Logic:** `getBackendBaseUrl()` returns:
  - `VITE_API_BASE_URL` if set, else
  - base derived from `VITE_API_URL`, else
  - `http://127.0.0.1:8000` when `VITE_USE_LOCAL === 'true'`, else
  - Railway URL.
- **Exports:** `API_BASE_URL` (base without `/api`), `API_URL` = `${API_BASE_URL}/api`, `HEALTH_URL`.

### 2.3 How the frontend calls the backend
- **Redux (templates list, detail thunk, favorites):** `src/redux/constant.js` sets `baseURL = API_BASE_URL` (no `/api`). Axios in `http.js` uses this, so `get('/api/v1/templates')` → `http://127.0.0.1:8000/api/v1/templates`. Correct.
- **Template detail (TemplateRunner):** Uses `api/templates.ts` → `apiRequest` in `api/client.ts`. `buildUrl` uses `API_BASE_URL` in client, which is set from `API_URL` (with `/api`). So `apiRequest('/v1/templates/' + slug)` → `http://127.0.0.1:8000/api/v1/templates/{slug}`. Correct.
- **Execute-stream:** `useTemplateStream.ts` builds URL as `${API_URL}/v1/templates/${slug}/execute-stream` (after trimming trailing slash), i.e. `http://127.0.0.1:8000/api/v1/templates/{slug}/execute-stream`. Correct.

### 2.4 Starting the frontend
- **Command:** From `1ne-frontend`, run `npm run dev`.
- **Port:** Vite may use 5173 or 5174 (e.g. if 5173 is in use).
- **Note:** Ensure `.env.local` is present so local backend is used. Restart dev server after changing env.

---

## Phase 3: Template List Page – EXPECTED TO WORK

- **Route:** `/templates` → `TemplatesLibrary`.
- **Data flow:** On load (after Redux rehydration), `useEffect` dispatches `fetchTemplates(filters)`. Redux uses `axiosInstance.get('/api/v1/templates', { params })` → `http://127.0.0.1:8000/api/v1/templates?...`.
- **Response handling:** Backend returns an array; `templatesSlice` accepts both array and `response.data.items`, then maps with `transformTemplate`. No auth required for list.
- **If list is empty:** Ensure backend seed has been run: `python -m app.seed.cli --templates --force` from backend root (with deps installed).
- **If 401:** Backend templates list does not require auth; 401 would indicate a different endpoint or middleware. Check backend logs.
- **If CORS error:** Ensure backend is running with `ENVIRONMENT=dev` or that your frontend origin (e.g. `http://localhost:5174`) is in `cors_origins` in `app/main.py`.

---

## Phase 4: Template Detail & Stream – EXPECTED TO WORK

- **Route:** `/templates/:slug` (e.g. `/templates/lesson_planner`) → `TemplateRunner`.
- **Detail:** `TemplateRunner` uses `fetchTemplateDetail(slug)` from `api/templates.ts` (not Redux). Response is mapped to include `inputSchema: detail.latest_version?.input_schema`. Form fields are derived from `inputSchema` (JSON Schema).
- **Stream:** On submit, `startStream(slug, payload)` in `useTemplateStream` POSTs to `http://127.0.0.1:8000/api/v1/templates/{slug}/execute-stream` with `body: JSON.stringify({ data })`. Events are consumed as SSE.
- **Payload:** Must match backend `input_schema` (e.g. required fields for `lesson_planner`: subject, grade, topic, learning_objective, time_duration_minutes, bloom_level). Array fields (e.g. materials) are sent as arrays (frontend splits textarea by newline/comma).

---

## Phase 5: Error Diagnosis & Fixes

### Backend

| Issue | What to do |
|-------|------------|
| **ModuleNotFoundError (e.g. sqlalchemy)** | Install deps: `pip install -r requirements.txt` in backend root, or use venv/Poetry. |
| **Port 8000 in use** | Change port: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8001` and set frontend to `VITE_API_BASE_URL=http://127.0.0.1:8001` (or `VITE_USE_LOCAL=true` and update `LOCAL_BACKEND_URL` in code if you use a different port). |
| **Seed not run / empty list** | From backend root: `python -m app.seed.cli --templates --force`. |

### Frontend

| Issue | What to do |
|-------|------------|
| **Wrong API URL** | Ensure `1ne-frontend/.env.local` has `VITE_USE_LOCAL=true` (or set `VITE_API_BASE_URL` / `VITE_API_URL` explicitly). Restart `npm run dev` after changing .env. |
| **CORS errors** | Backend allows `*` in dev. For non-dev, ensure `http://localhost:5174` and `http://127.0.0.1:5174` are in `cors_origins` in `app/main.py` (they are). |
| **401 on templates** | List/detail do not require auth. If you see 401, check that the request is going to the correct host and path and that no global auth middleware is rejecting unauthenticated requests for these routes. |

### Connection

| Issue | What to do |
|-------|------------|
| **Backend not reachable** | Confirm process is running (e.g. `netstat -ano | findstr :8000` on Windows). Start with `python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`. |
| **Wrong port** | If backend runs on another port, set `VITE_API_BASE_URL=http://127.0.0.1:PORT` in `.env.local` (no trailing slash). |

---

## Phase 6: Template Output Rendering

After a successful stream, the frontend formats the parsed JSON in `useTemplateStream.ts` (`buildFormattedFromParsed` and loose parser). It supports:

- **Title** – `# {title}` at the top.
- **Learning objectives** – from `learning_objectives` or `learning_goals`.
- **Lesson flow** – section with phase, minutes, activity per item.
- **Standards alignment** – section when present.
- **Bloom alignment** – `level` and `note` (or `description`).
- **Generic fallback** – other top-level keys rendered as sections.

If a backend template uses different output keys, they will either be handled by the generic fallback or can be added explicitly in `buildFormattedFromParsed` and the loose parser.

---

## Newly added templates not showing (only 12 visible)

**Cause:** The frontend shows every template returned by the API; the API returns all templates in the database. If you see only 12 templates, the database currently has 12. The seed file (`1ne_backend/app/seed/seed_templates.py`) defines 20 templates; the missing ones have not been seeded yet.

**Fix – update the backend:**

1. From the backend project root (`1ne_backend`), with your Python environment active and dependencies installed:
   ```bash
   python -m app.seed.cli --templates --force
   ```
   - `--force` updates existing templates (schemas) and creates any new ones.
   - Without `--force`, only new templates (new slugs) are created; existing ones are skipped.

2. Or use the helper scripts from repo root:
   - **Windows (PowerShell):** `.\1ne_backend\scripts\seed_templates.ps1 -Force`
   - **Windows (CMD):** `1ne_backend\scripts\seed_templates.bat --force`

3. If you get `ModuleNotFoundError` (e.g. sqlalchemy), install dependencies first:
   ```bash
   pip install -r requirements.txt
   ```
   or use your venv/Poetry environment.

4. After seeding, refresh the frontend `/templates` page (or restart the backend if it caches). You should see all 20 templates (or however many are in the seed file), with the same card structure as before.

---

## Summary

### Working as expected
- Backend health, templates list, template detail, and execute-stream return 200 when called with the expected URLs and payload.
- Frontend is configured to use the local backend when `VITE_USE_LOCAL=true` in `.env.local`.
- Redux list, `api/templates` detail, and `useTemplateStream` stream URL all resolve to `http://127.0.0.1:8000/api/v1/...`.
- CORS is set up for dev and for localhost:5173/5174.
- Output formatter supports title, learning_objectives, lesson_flow, standards_alignment, bloom note, and unknown keys.

### No errors found during automated checks
- No configuration or URL mismatches were found.
- Backend was verified with direct HTTP requests; no auth was required for list/detail/execute-stream in the tested setup.

### Configuration checklist
- [x] `.env.local` has `VITE_USE_LOCAL=true` for local backend.
- [x] Backend runs on port 8000 and responds on `/health` and `/api/v1/templates`.
- [x] Backend seeded (templates list returns multiple items).
- [ ] Start frontend with `npm run dev` and open `http://localhost:5173` or `http://localhost:5174/templates`.
- [ ] In browser: Network tab shows requests to `http://127.0.0.1:8000/api/v1/templates` and, on template open, to `http://127.0.0.1:8000/api/v1/templates/{slug}`; on Generate, POST to `.../execute-stream` with 200 and SSE.

### Full flow verification (manual)
1. Open http://localhost:5174/templates (or 5173).
2. Confirm template cards load (no console/network errors).
3. Click a template (e.g. "General Lesson Planner") → URL `/templates/lesson_planner`, form loads.
4. Fill required fields and click Generate → stream starts, output appears with title, objectives, lesson flow, etc. as implemented in `buildFormattedFromParsed`.
