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


_STOP = {"the", "and", "for", "with", "what", "how", "did", "you", "your", "are",
         "was", "were", "have", "has", "about", "tell", "show", "does", "can",
         "built", "build", "work", "worked", "made", "make"}


def _keyword_score(q: str, chunk: dict) -> float:
    """Weighted keyword overlap. Matches in the source slug and the title (the
    chunk's first line) count for much more than matches deep in the body, so a
    query like "Sabre" surfaces the Sabre chunks first. An exact-phrase hit and
    a source-slug hit both get strong boosts. This is the retrieval path when the
    index has no embeddings (Groq offers no embeddings API)."""
    ql = q.lower()
    # strip surrounding punctuation so "sabre?" matches "sabre"
    words = [w.strip(".,!?;:'\"()[]") for w in ql.split()]
    terms = {w for w in words if len(w) > 2 and w not in _STOP}
    if not terms:
        return 0.0

    text = chunk.get("text", "")
    source = chunk.get("source", "").lower()
    title = text.split(".")[0].lower()          # first sentence ~= the title line
    body = text.lower()

    score = 0.0
    for w in terms:
        if w in source:
            score += 3.0                          # slug match: strongest signal
        if w in title:
            score += 2.0                          # title match: strong
        if w in body:
            score += 1.0                          # body match: baseline
    # exact multi-word phrase present verbatim
    if len(terms) > 1 and ql.strip() in body:
        score += 4.0
    # normalize by query size so long questions do not dominate short ones
    return score / len(terms)


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


# Relevance a chunk must clear to count as context. The bar depends on whether
# the question is about Samuel: a personal question ("your crypto projects")
# grounds on any positive match, so real work is not missed even when the query
# uses a synonym the chunk lacks. An impersonal question ("what is RAG") needs a
# strong match, so an incidental hit (e.g. "Nigeria" in the bio) does not ground
# it and it goes to general mode instead.
_KEYWORD_MIN_PERSONAL = 0.4
_KEYWORD_MIN_GENERAL = 2.0
_COSINE_MIN = 0.25

_PERSONAL = ("you", "your", "yours", "samuel", "psalmnova", "his", "he ", "him",
             "ayinla", "built", "build", "made", "project", "experience", "skill",
             "work", "cv", "resume")


def _is_personal(query: str) -> bool:
    q = f" {query.lower()} "
    return any(w in q for w in _PERSONAL)


# "Give me everything" style questions: list all projects, all skills, summarise
# his whole background. These need breadth, not the top-k most similar chunks.
_OVERVIEW = ("all", "every", "list", "everything", "overview", "full", "entire",
             "complete", "how many", "what projects", "which projects",
             "his projects", "your projects", "portfolio", "summarize", "summarise")


def _is_overview(query: str) -> bool:
    q = f" {query.lower()} "
    return any(w in q for w in _OVERVIEW)


def _catalog(chunks):
    """One title+summary line per project/note: the first chunk of each source.
    Lets the assistant answer 'list all his projects' completely instead of only
    from the handful that scored highest."""
    seen, out = set(), []
    for c in chunks:
        src = c.get("source", "")
        if (src.startswith("project:") or src.startswith("note:")) and src not in seen:
            seen.add(src)
            # first sentence ~= "Title. One-line summary."
            summary = ". ".join(c["text"].split(". ")[:2])
            out.append({"source": src, "text": summary})
    return out


async def _retrieve(query: str, k: int = 6):
    idx = _load_index()
    chunks = idx.get("chunks", [])
    if not chunks:
        return []

    # Overview questions get the full catalog (every project/note), so nothing is
    # left out of a "list everything" answer.
    if _is_overview(query) and _is_personal(query):
        return _catalog(chunks)

    if idx.get("dim", 0) > 0:
        qv = await _embed_query(query)
        if qv:
            scored = [(_cosine(qv, c["vector"]), c) for c in chunks if c.get("vector")]
            scored.sort(key=lambda x: x[0], reverse=True)
            return [c for s, c in scored[:k] if s >= _COSINE_MIN]
    # keyword fallback (weighted: slug + title + body, with a phrase boost)
    floor = _KEYWORD_MIN_PERSONAL if _is_personal(query) else _KEYWORD_MIN_GENERAL
    scored = [(_keyword_score(query, c), c) for c in chunks]
    scored.sort(key=lambda x: x[0], reverse=True)
    return [c for s, c in scored[:k] if s >= floor]


async def _stream_answer(query: str, context_chunks):
    """Two modes. When retrieval finds relevant chunks, answer from Samuel's own
    content and cite the sources (grounded mode). When it finds nothing, answer
    as an ordinary helpful assistant with no sources (general mode). This lets
    the assistant be genuinely useful without ever inventing facts about him."""
    key = settings.groq_api_key or os.getenv("GROQ_API_KEY")
    grounded = bool(context_chunks)
    sources = sorted({c["source"] for c in context_chunks})
    context = "\n\n".join(f"[{c['source']}] {c['text']}" for c in context_chunks)

    if not key:
        # No LLM key: still be useful in grounded mode by summarizing retrieval.
        if grounded:
            yield sse("Here is what I found in Samuel's work:\n\n" + "\n".join(f"- {c['text'][:160]}" for c in context_chunks))
            yield sse_sources(sources)
        else:
            yield sse("The assistant needs its language model configured to answer that. Ask about Samuel's projects, experience, or skills and I can still help from his work.")
        yield "data: [DONE]\n\n"
        return

    if grounded:
        system = (
            "You are the AI assistant on Ayinla Samuel Olorunwa's portfolio. The question is "
            "about his work. Answer from the provided context about him. Be concise and "
            "specific. Do not invent projects or facts about him that are not in the context."
        )
        user = f"Context about Samuel:\n{context}\n\nQuestion: {query}"
    else:
        system = (
            "You are the AI assistant on Ayinla Samuel Olorunwa's portfolio, a helpful and "
            "knowledgeable engineer's assistant. This question is general (not about Samuel's "
            "own projects), so answer it normally and helpfully, the way a capable AI would. "
            "Be concise. If it would help, you may note that you can also answer questions "
            "about Samuel's work."
        )
        user = query

    payload = {
        "model": "openai/gpt-oss-20b",
        "temperature": 0.4,
        "stream": True,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
    }
    try:
        async with httpx.AsyncClient(timeout=30) as c:
            async with c.stream("POST", "https://api.groq.com/openai/v1/chat/completions",
                                 headers={"Authorization": f"Bearer {key}"}, json=payload) as r:
                async for line in r.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    body = line[6:]
                    if body.strip() == "[DONE]":
                        break
                    try:
                        delta = json.loads(body)["choices"][0]["delta"].get("content")
                    except Exception:
                        continue
                    if delta:
                        yield sse(delta)
        # Sources only for grounded answers about his work.
        if grounded:
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
