# Backend proxy for GenAI (Gemini)

This project now includes a minimal backend proxy to keep the Gemini/GenAI API key off the client bundle.

Location: `server/index.js`

Quick start (local):

1. Install dependencies for the backend

```bash
cd server
npm init -y
npm install express cors dotenv
```

2. Add your `GEMINI_API_KEY` to a `.env` file at the repository root or in `server`:

```
GEMINI_API_KEY=your_key_here
DEV_ORIGIN=http://localhost:3000
```

3. Run the server

```bash
node server/index.js
```

The server listens on port `4000` by default and exposes:

- `GET /health` - health check
- `POST /api/genai` - body: `{ prompt: string, model?: string }`

Vite dev server is configured to proxy `/api/*` to `http://localhost:4000` so the frontend can call `/api/genai` without exposing the key.

Example request from frontend:

```js
const res = await fetch('/api/genai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Write a haiku about tea.' }),
});
const json = await res.json();
```

Security notes:
- Keep `GEMINI_API_KEY` out of source control (include it only in local `.env` or secret manager).
- For production, deploy this backend as a secure serverless function or private server behind authentication.
