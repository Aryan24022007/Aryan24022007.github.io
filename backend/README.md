# RAISEN AI Backend

Phase 1 foundation for the Raisen personal AI companion.

## Architecture

Browser → FastAPI → utility tools / personal knowledge retrieval → LLM

The backend is intentionally separate from GitHub Pages. API keys stay server-side.

## Local run

Create a virtual environment, install requirements, copy `.env.example` to `.env`, add the Groq key, then:

```bash
uvicorn app:app --reload --port 8000
```

Health check:

```
GET /health
```

Chat:

```
POST /chat
```

## Next phases

- Replace the lightweight retrieval layer with proper hybrid RAG/Qdrant.
- Add streaming SSE responses.
- Connect the Raisen Neural Console.
- Add browser voice input/output.
- Connect 3D core listening/thinking/speaking states.
