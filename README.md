# Friendo frontend

The React and TypeScript frontend for Friendo, a course project social media application. It provides registration and login, a searchable post feed, user profiles, image posts, comments, and like/dislike reactions.

The frontend now uses **Vite instead of Create React App**. The matching [backend](https://github.com/saneag/proiect-de-curs-backend) uses **PostgreSQL through Prisma instead of MongoDB**. Deploy matching versions: API records and frontend state use `id` instead of the old `_id` field.

## Contents

- [Technology and structure](#technology-and-structure)
- [Run locally](#run-locally)
- [Configuration](#configuration)
- [Commands and production build](#commands-and-production-build)
- [Deploy on an Ubuntu server](#deploy-on-an-ubuntu-server)
- [Testing and limitations](#testing-and-limitations)

## Technology and structure

| Area | Technology |
| --- | --- |
| UI | React 18 and TypeScript |
| Development and build | Vite |
| Routing and state | React Router and Redux Toolkit |
| Forms and HTTP | Formik, Yup, and Axios |
| Styling | Sass, Tailwind CSS 3, and styled-components |
| Rich text | Tiptap |
| Tests | Vitest and React Testing Library |
| Production | Nginx in Docker |

```text
src/components/   Shared UI, post cards, forms, and editor
src/pages/        Login, feed, profiles, and personal posts
src/redux/        Store and user/post state
src/services/     Axios API configuration
src/shared/       Shared TypeScript interfaces
src/utils/        Formatting, token, and HTML utilities
src/styles/       Global Sass styles
public/           Static files copied by Vite
vite.config.mts   Aliases and development proxy
nginx.conf        Production routes and API/upload proxy
Dockerfile        Vite build followed by Nginx serving
```

## Run locally

Use **Node.js 24** for consistency with the Docker builder. The package declares Node.js 22.22.2 or newer. From the frontend directory:

```bash
npm ci
npm run dev
```

Open the URL Vite prints, normally `http://localhost:5173`.

The app needs the matching backend and PostgreSQL. Follow the backend README to configure `DATABASE_URL` and JWT secrets, generate Prisma Client, and apply migrations. Run the backend on port **5000**, with `FRONTEND_ORIGIN=http://localhost:5173`, in another terminal.

Vite forwards `/api` and `/uploads` to `http://127.0.0.1:5000`. The frontend does not need MongoDB or database credentials.

## Configuration

The API URL defaults to `/api/hf`, which works with both the Vite development proxy and production Nginx. To customize it, create `.env.local`:

```dotenv
VITE_API_URL=/api/hf
```

`VITE_API_URL` replaces `REACT_APP_API_URL`; CRA environment variables are no longer read. Vite exposes configuration through `import.meta.env`.

`VITE_*` values are public and embedded during the build. Never put database credentials or JWT signing secrets there. Changing the deployed API URL requires rebuilding the frontend.

For a separate API host, set `VITE_API_URL=https://api.example.com/api/hf` and configure backend CORS. The image renderer derives its origin by removing `/api/hf` from this URL, so that API host must also serve `/uploads`. The documented deployment proxies both paths on the same origin.

## Commands and production build

| Command | Purpose |
| --- | --- |
| `npm run dev` / `npm start` | Start the Vite development server. |
| `npm run typecheck` | Check TypeScript without generating files. |
| `npm test` | Run Vitest once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run build` | Check TypeScript and create the production bundle in `dist/`. |
| `npm run preview` | Preview an existing build locally. |
| `npm run prod` | Build and start a local Vite preview. |

```bash
npm test
npm run build
```

Deploy **`dist/`**, not the old CRA `build/` directory. Vite preview is for local inspection; production uses Nginx. The development proxy does not configure the preview server, so API access during preview needs separate routing.

The Dockerfile builds with Node.js 24 and copies `dist/` into Nginx. Nginx forwards `/api/` and `/uploads/` to the API service and supports client-side routes with an `index.html` fallback. Source-root import aliases are configured in `vite.config.mts`.

## Deploy on an Ubuntu server

### 1. Prepare both repositories

Use Docker Engine with the Compose plugin, Git, Python 3, systemd, and `flock` on Ubuntu. No host Node.js installation is required for Docker builds. Keep the repositories beside each other:

```text
~/proiect-de-curs/
  proiect-de-curs-backend/
  proiect-de-curs-frontend/
```

For a new installation:

```bash
mkdir -p ~/proiect-de-curs
cd ~/proiect-de-curs
git clone https://github.com/saneag/proiect-de-curs-backend.git
git clone https://github.com/saneag/proiect-de-curs-frontend.git
cd proiect-de-curs-backend
cp .env.example .env
chmod 600 .env
```

For an existing installation, back up the database and uploads, stop writes, and update both repositories together. Preserve the existing environment file and data volumes.

### 2. Configure PostgreSQL and build

Edit the **backend** `.env`. Set matching `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and `DATABASE_URL`, plus two different JWT secrets of at least 32 characters. Inside Compose the database hostname is `postgres`. Set `FRONTEND_ORIGIN` to your public origin, or `http://localhost:5000` for access through SSH forwarding.

Use the backend README's complete environment example. Then run from the backend directory:

```bash
sudo docker compose config --quiet
sudo docker compose build migrate api frontend
sudo docker compose up -d postgres
sudo docker compose run --rm migrate
```

Compose builds the frontend with `VITE_API_URL=/api/hf`, keeping browser requests on the same origin. No separate frontend environment file is required for this setup.

If retaining MongoDB data, follow the backend's `BACKUP-IMPORT.md` **before starting the API**. Initialization does not import old records; transfer existing images separately too.

### 3. Start the frontend and backend

```bash
cd ~/proiect-de-curs/proiect-de-curs-backend
bash scripts/start-friendo.sh
```

The launcher starts the stack in the background and prints its URLs. It prefers frontend port **5000** and backend port **5001**, selecting another available pair when needed. Run the same command manually after a server restart. It does not rebuild images or import backups.

If you already created the documented shortcut, run:

```bash
~/bin/start-friendo
```

Both published ports bind to localhost on the server. Use a reverse proxy, Cloudflare Tunnel, or SSH forwarding. From your computer:

```bash
ssh -L 5000:127.0.0.1:5000 USER@SERVER
```

Open `http://localhost:5000`. If needed, replace the destination port with the frontend port printed by the launcher.

If `cloudflared` is installed, the launcher also starts a temporary public tunnel. Its URL can change on restart; a permanent hostname needs a named tunnel or reverse proxy. Find the temporary URL on the server with:

```bash
sudo journalctl -u friendo-tunnel -b --no-pager -o cat | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' | tail -1
```

For automatic startup at boot, install `friendo.service` using the backend deployment guide. After installation, `sudo systemctl restart friendo` runs the same startup logic.

### 4. Verify and update

From the backend directory:

```bash
sudo docker compose ps -a
sudo docker compose logs --tail=100 migrate api frontend
curl -I http://127.0.0.1:5000/
curl -i http://127.0.0.1:5001/api/hf/user
```

Use the printed ports if different. Expect frontend HTTP 200 and protected API HTTP 403 without authentication. Verify login, feed, profile updates, comments, reactions, uploads, deep links, and session restoration. Restart the stack and confirm records and images persist.

For updates, back up first, pull matching releases of both repositories, rebuild images, explicitly run the migration service, and rerun the launcher. Preserve the Compose project name and the `postgres_data` and `uploads_data` volumes.

See the backend [README](https://github.com/saneag/proiect-de-curs-backend#readme) for the full Ubuntu walkthrough and [DEPLOYMENT.md](https://github.com/saneag/proiect-de-curs-backend/blob/master/DEPLOYMENT.md) for the shortcut, boot service, tunnels, backups, and rollback.

## Testing and limitations

Frontend tests cover app startup, user/post state, and HTML sanitization. Run `npm test` and `npm run build` before deployment. PostgreSQL API and import tests live in the backend repository.

The production build currently emits a size warning for its main JavaScript chunk. Groups remains a placeholder and post-edit controls are disabled. Access tokens renew on page load; a session open beyond the token lifetime may need a reload.

Local tests and builds do not verify Docker startup, Ubuntu volume permissions, public routing, or reboot behavior. Complete the server smoke checks before switching live traffic.
