import json
import os
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE = Path(__file__).resolve().parent
with open(BASE / "knowledge.json", "r", encoding="utf-8") as f:
    KNOWLEDGE = json.load(f)

ORIGINS = [x.strip() for x in os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:8000,http://127.0.0.1:8000"
).split(",") if x.strip()]

app = FastAPI(title="Raisen AI", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    conversation_history: list[dict[str, str]] = []

def knowledge_text() -> str:
    return json.dumps(KNOWLEDGE, ensure_ascii=False, indent=2)

def retrieve(query: str) -> str:
    q = query.lower()
    sections = []
    if any(k in q for k in ["who", "aryan", "study", "college", "education", "student"]):
        sections.append(KNOWLEDGE["identity"])
    if any(k in q for k in ["skill", "know", "python", "c++", "c programming", "dsa", "ai", "genai"]):
        sections.append(KNOWLEDGE["skills"])
    if any(k in q for k in ["project", "built", "portfolio", "tic", "leetcode"]):
        sections.append(KNOWLEDGE["projects"])
    if not sections:
        sections.append(KNOWLEDGE["personality"])
    return json.dumps(sections, ensure_ascii=False)

def local_tool(message: str):
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
    return {"status": "ok", "service": "raisen-ai", "ai_configured": bool(os.getenv("GROQ_API_KEY"))}

@app.post("/chat")
async def chat(req: ChatRequest):
    message = req.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message is required.")

    tool_answer = local_tool(message)
    if tool_answer:
        return {"reply": tool_answer, "route": "utility", "grounded": True}

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {
            "reply": "Raisen AI is connected to the site, but its language model is not configured yet. The local knowledge and time/date tools are ready.",
            "route": "system",
            "grounded": True
        }

    context = retrieve(message)
    system = (
        "You are RAISEN, Aryan Kumar's personal portfolio AI companion. "
        "Answer naturally and concisely. Only make claims about Aryan that are supported by the supplied context. "
        "If the context does not contain an answer, say you do not have that information yet. "
        "Never invent achievements, skills, projects, experience, contact details, grades or personal history. "
        "You may answer general conversational questions, but do not pretend to be Aryan. "
        f"PERSONAL CONTEXT:\n{context}"
    )
    history = req.conversation_history[-8:]
    messages = [{"role": "system", "content": system}]
    messages.extend(
        {"role": m.get("role", "user"), "content": m.get("content", "")}
        for m in history
        if m.get("role") in {"user", "assistant"} and m.get("content")
    )
    messages.append({"role": "user", "content": message})

    async with httpx.AsyncClient(timeout=25) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
                "messages": messages,
                "temperature": 0.35,
                "max_tokens": 350
            }
        )
    if response.status_code >= 400:
        raise HTTPException(status_code=502, detail="AI provider request failed.")
    data = response.json()
    reply = data["choices"][0]["message"]["content"].strip()
    return {"reply": reply, "route": "rag", "grounded": True}
