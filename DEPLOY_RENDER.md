Render deployment instructions — Socket.IO server

Overview

- Deploy only the Socket.IO server (`server.ts`) to Render as a separate Web Service.
- Keep the Next.js app on Vercel (or existing host). Configure the frontend to connect to the Render service via `NEXT_PUBLIC_SOCKET_URL`.

Quick checklist

1. Ensure `DATABASE_URL` (Postgres) is available on Render.
2. Set `NEXT_PUBLIC_SOCKET_URL` to the public URL Render provides for this service (https://<your-service>.onrender.com).
3. Deploy using the `render.yaml` in the repo or create a new Web Service via the Render dashboard with the settings below.

Recommended Render service settings

- Environment: `Node` (latest LTS)
- Build command: `npm install`
- Start command: `npm start` (package.json `start` runs `tsx server.ts`)
- Health check path: `/api/health` (server.ts should implement this; if not, remove the health check)

Environment variables to set on Render

- `DATABASE_URL` — your Postgres connection string (required for Prisma).
- `NEXT_PUBLIC_SOCKET_URL` — the public URL for this Render service (e.g. https://helpdesk-socketio.onrender.com). Set this so the front-end clients can connect.
- Any other env vars used by `server.ts` (e.g., `JWT_SECRET`, `SMTP_*`, etc.)

Notes about `tsx`

- This repo uses `tsx` to run `server.ts` directly. `tsx` has been moved into `dependencies` so it's available in Render's production environment.

Running migrations

- Once `DATABASE_URL` is configured and reachable, run migrations against the same database (locally or via Render shell):

```bash
# from project root, with DATABASE_URL pointing to Render DB
npx prisma migrate deploy
```

Or, for local development:

```bash
# run locally (dev DB)
npx prisma migrate dev --name add_chat
```

Post-deploy steps

1. Note the Render service public URL (e.g. https://helpdesk-socketio.onrender.com).
2. Set `NEXT_PUBLIC_SOCKET_URL` in your Next.js app hosting (Vercel or other) to that URL.
3. Redeploy your Next.js frontend so clients pick up the new env var.

Troubleshooting

- If clients cannot connect, verify CORS and that the Socket.IO path matches `path: "/api/socketio"` (the client uses that path by default). The final socket URL will be e.g. `https://helpdesk-socketio.onrender.com` and client options include `path: "/api/socketio"`.
- If `tsx` is not found at runtime, verify `tsx` is present in `dependencies` (this repo places it in `dependencies`).
- For TLS (wss://) Render provides HTTPS by default on service URLs.

Optional: Deploy only the server folder

- If you prefer a minimal repo for the Socket server, create a small repo containing `server.ts`, `package.json`, and `package-lock.json` and deploy that to Render. Ensure `server.ts` points to the same production DB.

If you'd like, I can:

- Create a Render service for you (`render.yaml` is already added), or
- Run the migration commands (if you provide a reachable `DATABASE_URL` or allow me to run them locally).
