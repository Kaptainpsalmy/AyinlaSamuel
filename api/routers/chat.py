"""RAG chat grounded in Samuel's own content.

Retrieval: cosine over a prebuilt index if it has vectors (built with an embedding
key), else keyword overlap. Generation: OpenRouter LLM streamed as SSE, answering
only from retrieved context and citing sources. Falls back to a retrieval-only
answer if no OPENROUTER_API_KEY.
"""
import json
import math
import os
from pathlib import Path
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
import httpx

from api.core.config import settings
from api.core.ratelimit import allow

router = APIRouter(tags=["chat"])

_INDEX_PATH = Path(__file__).resolve().parent.parent / "data" / "index.json"
_index = None


def _load_index():
    global _index
    if _index is None:
        try:
            _index = json.loads(_INDEX_PATH.read_text(encoding="utf-8"))
        except Exception:
            _index = {"chunks": [], "dim": 0}
    return _index


class ChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=1000)


def _keyword_score(q: str, text: str) -> float:
    qs = {w for w in q.lower().split() if len(w) > 2}
    if not qs:
        return 0.0
    ts = text.lower()
    return sum(1 for w in qs if w in ts) / len(qs)


def _cosine(a, b) -> float:
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a)) or 1
    nb = math.sqrt(sum(y * y for y in b)) or 1
    return dot / (na * nb)


async def _embed_query(text: str):
    if not (settings.__dict__.get("openrouter_api_key") or os.getenv("OPENROUTER_API_KEY")):
        return None
    key = os.getenv("OPENROUTER_API_KEY")
    try:
        async with httpx.AsyncClient(timeout=8) as c:
            r = await c.post("https://openrouter.ai/api/v1/embeddings",
                             headers={"Authorization": f"Bearer {key}"},
                             json={"model": "openai/text-embedding-3-small", "input": text})
            r.raise_for_status()
            return r.json()["data"][0]["embedding"]
    except Exception:
        return None


async def _retrieve(query: str, k: int = 4):
    idx = _load_index()
    chunks = idx.get("chunks", [])
    if not chunks:
        return []
    if idx.get("dim", 0) > 0:
        qv = await _embed_query(query)
        if qv:
            scored = [(_cosine(qv, c["vector"]), c) for c in chunks if c.get("vector")]
            scored.sort(key=lambda x: x[0], reverse=True)
            return [c for _, c in scored[:k]]
    # keyword fallback
    scored = [(_keyword_score(query, c["text"]), c) for c in chunks]
    scored.sort(key=lambda x: x[0], reverse=True)
    return [c for s, c in scored[:k] if s > 0][:k]


async def _stream_answer(query: str, context_chunks):
    key = settings.groq_api_key or os.getenv("GROQ_API_KEY")
    sources = sorted({c["source"] for c in context_chunks})
    context = "\n\n".join(f"[{c['source']}] {c['text']}" for c in context_chunks)

    if not key or not context_chunks:
        # retrieval-only fallback: summarize what we found
        if not context_chunks:
            yield sse("I could not find that in Samuel's work. Ask about his projects, experience, or skills.")
        else:
            yield sse("Here is what I found in Samuel's work:\n\n" + "\n".join(f"- {c['text'][:160]}" for c in context_chunks))
            yield sse_sources(sources)
        yield "data: [DONE]\n\n"
        return

    system = (
        "You are an assistant for Ayinla Samuel Olorunwa's portfolio. Answer ONLY from the "
        "provided context about his work. Be concise. If the context does not cover it, say so. "
        "Do not invent projects or facts."
    )
    payload = {
        "model": "openai/gpt-oss-20b",
        "temperature": 0.3,
        "stream": True,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"},
        ],
    }
    try:
        async with httpx.AsyncClient(timeout=30) as c:
            async with c.stream("POST", "https://api.groq.com/openai/v1/chat/completions",
                                 headers={"Authorization": f"Bearer {key}"}, json=payload) as r:
                async for line in r.aiter_lines():
                    if line.startswith("data: "):
                        body = line[6:]
                        if body.strip() == "[DONE]":
                            break
                        try:
                            delta = json.loads(body)["choices"][0]["delta"].get("content")
                            if delta:
                                yield sse(delta)
                        except Exception:
                            continue
        yield sse_sources(sources)
        yield "data: [DONE]\n\n"
    except Exception:
        yield sse("The assistant is briefly unavailable. Try again in a moment.")
        yield "data: [DONE]\n\n"


def sse(text: str) -> str:
    return f"data: {json.dumps({'text': text})}\n\n"


def sse_sources(sources) -> str:
    return f"data: {json.dumps({'sources': sources})}\n\n"


@router.post("/api/py/chat", summary="Ask the AI assistant about Samuel's work")
async def chat(data: ChatIn, request: Request):
    ip = request.client.host if request.client else "unknown"
    if not await allow(f"chat:{ip}", limit=20, window_s=3600):
        async def limited():
            yield sse("Rate limit reached. Please try again later.")
            yield "data: [DONE]\n\n"
        return StreamingResponse(limited(), media_type="text/event-stream")

    chunks = await _retrieve(data.message)
    return StreamingResponse(_stream_answer(data.message, chunks), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
