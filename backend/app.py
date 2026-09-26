import json
import os
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
import asyncio
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from rag import load_retriever

BASE = Path(__file__).resolve().parent
with open(BASE / "knowledge.json", "r", encoding="utf-8") as f:
    KNOWLEDGE = json.load(f)

RETRIEVER = load_retriever(BASE / "knowledge.json")

ORIGINS = [
    x.strip()
    for x in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:8000,http://127.0.0.1:8000",
    ).split(",")
    if x.strip()
]

app = FastAPI(title="Raisen AI", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    conversation_history: list[dict[str, str]] = Field(default_factory=list)


def retrieve(query: str) -> tuple[str, list[dict]]:
    return RETRIEVER.context(query, top_k=3)


def local_tool(message: str) -> str | None:
    q = message.lower().strip()
    try:
        tz = ZoneInfo("Asia/Kolkata")
    except Exception:
        tz = None

    now = datetime.now(tz)

    if any(x in q for x in ["what time", "current time", "time now", "time is it"]):
        return f"It is {now.strftime('%I:%M %p')} in India right now."

    if any(x in q for x in ["today", "what date", "current date", "date today"]):
        return f"Today is {now.strftime('%A, %d %B %Y')}."

    return None


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "raisen-ai",
        "version": app.version,
        "ai_configured": bool(os.getenv("GROQ_API_KEY", "").strip()),
        "retriever": "local-hybrid-tfidf",
        "knowledge_documents": len(RETRIEVER.documents),
    }


@app.post("/chat")
async def chat(req: ChatRequest):
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required.")

    tool_answer = local_tool(message)
    if tool_answer:
        return {"reply": tool_answer, "route": "utility", "grounded": True}

    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        return {
            "reply": (
                "Raisen AI is connected to the site, but its language model is not "
                "configured yet. The local knowledge and time/date tools are ready."
            ),
            "route": "system",
            "grounded": True,
        }

    context, sources = retrieve(message)
    if not context:
        context = "No matching personal knowledge was retrieved."

    system = (
        "You are RAISEN, Aryan Kumar's personal portfolio AI companion. "
        "Answer naturally and concisely. Only make claims about Aryan that are "
        "supported by the supplied context. If the context does not contain an "
        "answer, say you do not have that information yet. Never invent "
        "achievements, skills, projects, experience, contact details, grades or "
        "personal history. You may answer general conversational questions, but "
        "do not pretend to be Aryan. "
        f"PERSONAL CONTEXT:\n{context}"
    )

    history = []
    for item in req.conversation_history[-8:]:
        role = item.get("role", "")
        content = item.get("content", "").strip()
        if role in {"user", "assistant"} and content:
            history.append({"role": role, "content": content[:4000]})

    messages = [{"role": "system", "content": system}]
    messages.extend(history)
    messages.append({"role": "user", "content": message})

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": os.getenv(
                        "GROQ_MODEL", "llama-3.3-70b-versatile"
                    ),
                    "messages": messages,
                    "temperature": 0.35,
                    "max_tokens": 350,
                },
            )
            response.raise_for_status()
            data = response.json()
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="AI provider timed out.")
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=502, detail="AI provider request failed.")
    except httpx.RequestError:
        raise HTTPException(status_code=502, detail="AI provider is unreachable.")
    except ValueError:
        raise HTTPException(status_code=502, detail="AI provider returned invalid data.")

    try:
        reply = data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, TypeError, AttributeError):
        raise HTTPException(status_code=502, detail="AI provider returned an unexpected response.")

    if not reply:
        raise HTTPException(status_code=502, detail="AI provider returned an empty response.")

    return {
        "reply": reply,
        "route": "rag",
        "grounded": bool(sources),
        "sources": [
            {"id": item["id"], "title": item["title"], "score": item["score"]}
            for item in sources
        ],
    }

async def stream_provider_response(messages: list[dict], api_key: str):
    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            async with client.stream(
                "POST",
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
                    "messages": messages,
                    "temperature": 0.35,
                    "max_tokens": 350,
                    "stream": True,
                },
            ) as response:
                if response.status_code >= 400:
                    await response.aread()
                    yield "event: error\ndata: AI provider request failed.\n\n"
                    return

                async for line in response.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    payload = line[5:].strip()
                    if payload == "[DONE]":
                        yield "event: done\ndata: [DONE]\n\n"
                        return
                    try:
                        data = json.loads(payload)
                        delta = data.get("choices", [{}])[0].get("delta", {}).get("content")
                    except (ValueError, KeyError, IndexError, TypeError):
                        continue
                    if delta:
                        yield f"data: {json.dumps(delta, ensure_ascii=False)}\\n\\n"
    except httpx.TimeoutException:
        yield "event: error\\ndata: AI provider timed out.\\n\\n"
    except httpx.RequestError:
        yield "event: error\\ndata: AI provider is unreachable.\\n\\n"


@app.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required.")

    tool_answer = local_tool(message)
    if tool_answer:
        async def utility_stream():
            yield f"data: {json.dumps(tool_answer, ensure_ascii=False)}\\n\\n"
            yield "event: done\\ndata: [DONE]\\n\\n"
        return StreamingResponse(
            utility_stream(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )

    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        async def unconfigured_stream():
            reply = "Raisen AI is connected to the site, but its language model is not configured yet. The local knowledge and time/date tools are ready."
            yield f"data: {json.dumps(reply, ensure_ascii=False)}\\n\\n"
            yield "event: done\\ndata: [DONE]\\n\\n"
        return StreamingResponse(
            unconfigured_stream(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
        )

    context, sources = retrieve(message)
    if not context:
        context = "No matching personal knowledge was retrieved."

    system = (
        "You are RAISEN, Aryan Kumar's personal portfolio AI companion. "
        "Answer naturally and concisely. Only make claims about Aryan that are "
        "supported by the supplied context. If the context does not contain an "
        "answer, say you do not have that information yet. Never invent "
        "achievements, skills, projects, experience, contact details, grades or "
        "personal history. You may answer general conversational questions, but "
        "do not pretend to be Aryan. "
        f"PERSONAL CONTEXT:\\n{context}"
    )

    history = []
    for item in req.conversation_history[-8:]:
        role = item.get("role", "")
        content = item.get("content", "").strip()
        if role in {"user", "assistant"} and content:
            history.append({"role": role, "content": content[:4000]})

    messages = [{"role": "system", "content": system}]
    messages.extend(history)
    messages.append({"role": "user", "content": message})

    return StreamingResponse(
        stream_provider_response(messages, api_key),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "X-Raisen-Grounded": "true" if sources else "false",
        },
    )

