# Raisen — Personal Portfolio

A responsive, dark futuristic portfolio built with plain HTML, CSS and JavaScript. GitHub Pages hosts the public website; the Neural Console uses a separate FastAPI/Gemini backend.

## Live Demo

**[View the Raisen Portfolio →](https://Aryan24022007.github.io)**

Anyone can open the link above to view the website directly without downloading or cloning the project.

## Neural Console

The console represents Aryan's public portfolio. It retrieves personal facts from `backend/knowledge.json`, maintains recent conversation context, streams agent states and replies, and can answer current India date/time questions with a local utility. If a personal detail is missing from the knowledge base, the agent says so instead of guessing.

The Gemini key stays on the backend. Follow [backend setup](backend/README.md) to run the service locally or configure its Vercel environment variables.

## Keep the agent knowledge current

When a portfolio fact changes, update both the relevant page content in `index.html` and the corresponding fact in `backend/knowledge.json`. Do not put API keys in this repository or in frontend settings.

## Run the website locally

From the repository root, start a static server:

```bash
python -m http.server 5500
```

Open `http://localhost:5500`. For local AI answers, start the backend separately as described in [backend setup](backend/README.md). The frontend defaults to `http://127.0.0.1:8000` on a local host; a different backend URL can be set with the `raisenApiBase` browser local-storage value.

## Hosting

GitHub Pages serves the static portfolio. The AI console also needs the FastAPI backend deployed and configured with a server-side `GEMINI_API_KEY`. The repository includes `api/index.py` as the Vercel FastAPI entrypoint.
