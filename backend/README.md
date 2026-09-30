# RAISEN AI Backend

FastAPI service for the Raisen personal portfolio agent.

## Architecture

Browser → FastAPI → safe local utilities and portfolio RAG → Gemini

The portfolio knowledge base is stored in `knowledge.json` and indexed locally with a lightweight TF-IDF retriever. The agent sends only retrieved portfolio context plus recent conversation history to Gemini. Personal claims must be supported by that context; unknown personal details receive a clear fallback answer.

The Gemini key is read only by the backend from `GEMINI_API_KEY`. It is never sent to the browser or committed to the repository.

## Local run

From the repository root, enter `backend/`, create a virtual environment, and install `requirements.txt`. Copy `.env.example` to `.env` and set `GEMINI_API_KEY`. Then, from the `backend/` directory, run:

```bash
uvicorn app:app --reload --port 8000 --env-file .env
```

Health check: `GET /health`

Chat: `POST /chat`

Streaming chat: `POST /chat/stream` (Server-Sent Events). On Vercel, the same app exposes `POST /api/chat/stream`.

The streaming endpoint emits `state` events for `thinking`, `tool`, and `answer`, followed by text chunks. Safe utility tools currently provide the current India date and time.

## Vercel deployment

The repository includes `api/index.py` as the FastAPI entrypoint and a root `requirements.txt`. Configure these environment variables in the Vercel project settings:

- `GEMINI_API_KEY` — required, server-side secret.
- `GEMINI_MODEL` — optional; defaults to the backend's configured Gemini model.
- `ALLOWED_ORIGINS` — optional; include the exact public portfolio origin, for example `https://aryan24022007.github.io`.

Never put the Gemini key in frontend JavaScript, HTML, or a public environment file. After changing environment variables, redeploy the backend.
