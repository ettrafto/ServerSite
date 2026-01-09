# Frontend Auth & CSRF Testing

## Setup
- Backend: `cd api-server && npm run dev` (or your normal start command).
- Frontend: `cd dashboard-web && npm run dev` (Vite dev server on http://localhost:3000 with `/api` proxy to backend).

## How the frontend talks to auth
- All auth calls use `fetch` with `credentials: 'include'`.
- CSRF flow:
  - `GET /api/auth/csrf` returns `{ csrfToken }` and sets `connect.sid` + `csrf_token` cookies.
  - Mutating calls (`/api/auth/login`, `/api/auth/logout`) send header `x-csrf: <token>`.
  - CSRF token is cached in-memory and refreshed once on a 403.
- Session is the source of truth (no localStorage flags).

## Manual browser flow (clean browser)
1) Visit `http://localhost:3000/login`.
2) Enter valid credentials (e.g., `admin@evantrafton.me` / `admin123` if seeded).
3) In DevTools Network tab, you should see:
   - `GET /api/auth/csrf`
   - `POST /api/auth/login` with `x-csrf` header and cookies sent/received.
   - `GET /api/auth/me` after redirect/guard check.
4) After login, the Topbar should show the user email; navigating/refreshing should keep you logged in.
5) Click Logout:
   - Network should show `POST /api/auth/logout` with `x-csrf`.
   - You should be redirected to `/login`, and `/api/auth/me` should return 401 thereafter.

## Auth Debug Panel (dev only)
- Route: `/auth-debug` (available only in development builds).
- Shows status, current user JSON, lets you:
  - Fetch CSRF token.
  - Call `/api/auth/me`.
  - Login as seeded admin (dev helper).
  - Logout / refresh user.

## Pain-point checks
- Backend down: UI should surface a friendly error on login/me.
- Missing/stale CSRF (403): login/logout should show a clear error; retry once happens automatically.
- Session expiry: refresh the page after session expiry; AuthGuard should redirect to `/login`.
- Guard flicker: ensure no redirect loops or noticeable flicker while status is `loading`.

## Automated tests
- Run from frontend root:
  - `npm test`
- Coverage (optional): `npm test -- --coverage`




