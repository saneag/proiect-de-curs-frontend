# Friendo frontend (Vite)

React 18 + TypeScript + Vite, with Tailwind CSS 3 and Sass.
Use Node.js 22.22.2 or newer; the Docker builder uses Node.js 24.

## Development

```bash
npm ci
npm run dev
```

Open the URL Vite prints, normally http://localhost:5173. Run the backend
on port 5000: Vite proxies /api and /uploads to http://127.0.0.1:5000.
Existing src-root imports are preserved; the redux/ alias excludes the
bare redux npm package.

## Configuration and builds

VITE_API_URL defaults to /api/hf. Keep it for Docker/Cloudflare: requests
stay on the same origin even if the tunnel hostname changes. To use a
separate API, put VITE_API_URL=https://api.example.com/api/hf in .env.local.
VITE_* values are public and baked into the build. Never put secrets there.
REACT_APP_API_URL is no longer used.

```bash
npm test
npm run build
npm run preview
```

The build runs TypeScript checking and outputs dist/. The preview and prod
scripts are for local previews. Production uses the Nginx Docker image,
including API/upload forwarding and client-side route fallback.

## Ubuntu deployment

Deploy beside proiect-de-curs-backend, using its compose.yaml. The build
argument is now VITE_API_URL; the entry point is 127.0.0.1:8082.
Follow [the Cloudflare deployment guide](https://github.com/saneag/proiect-de-curs-backend/blob/master/DEPLOYMENT.md),
which adapts the existing README-home-website.md setup.

## Integrity check, 2026-11-21

- TypeScript check and Vite production build passed.
- 11 frontend regression tests and 10 real API integration tests passed.
- API tests used a fresh temporary MongoDB 7.0.24, never a deployment database.
- Browser checks against the built frontend and real API/MongoDB passed
  registration, login, image post creation/display, reactions, comments,
  profile/avatar updates, deep links, reload/session restoration, and logout.
- Mobile login had no horizontal overflow. No browser errors/warnings were observed.
- Both final dependency audits reported zero known vulnerabilities.

Fixes include session startup/loading, the false image-error toast, avatar
removal routing, profile editing/submission, preserving the profile after a
failed update, offline logout cleanup, and duplicate editor extensions.
Backend fixes return 401 for invalid refresh tokens and derive reaction/comment
identity from the authenticated account. Nginx accepts multipart requests
large enough for the API's 5 MiB image limit.

Limits: Docker is unavailable on the verification machine. Image builds,
Compose MongoDB initialization, volume permissions/persistence, the actual
Cloudflare tunnel, and reboot behavior still need checking on Ubuntu.
The JS bundle is about 957 kB uncompressed and gives a size warning.
Existing incomplete features remain: Groups is empty and the post edit UI
is disabled. Access tokens renew on page load; after an hour-long session,
reload to renew them. This is not an exhaustive security audit or a guarantee
against every failure.
