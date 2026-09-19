/* Build the RAG index over Samuel's own content.
   Chunks: project case studies, experience, skills, bio.
   Embeddings: OpenRouter (OPENROUTER_API_KEY) at build time. Falls back to a
   keyword-only index (no vectors) if no key, so chat still works via keyword match.
   Output: api/data/index.json  { model, dim, chunks: [{id, source, text, vector?}] } */
import fs from "node:fs";

const key = process.env.OPENROUTER_API_KEY;
const EMBED_MODEL = "openai/text-embedding-3-small";

function stripMdx(body) {
  // velite body is compiled JS; we chunk from the raw source instead
  return body;
}

// read raw content
const projects = JSON.parse(fs.readFileSync(".velite/projects.json", "utf8"));
const notes = JSON.parse(fs.readFileSync(".velite/notes.json", "utf8"));

const chunks = [];
let id = 0;
const add = (source, text) => { if (text && text.trim().length > 20) chunks.push({ id: id++, source, text: text.trim().slice(0, 1200) }); };

// projects: title + tagline + problem + solution + evidence
for (const p of projects) {
  add(`project:${p.slug}`, `${p.title}. ${p.tagline} Type: ${p.type}. Stack: ${p.stack.join(", ")}. Role: ${p.role}. Year: ${p.year}.`);
  if (p.problem) add(`project:${p.slug}`, `${p.title} problem: ${p.problem}`);
  if (p.solution) add(`project:${p.slug}`, `${p.title} solution: ${p.solution}`);
  if (p.evidence?.verified) add(`project:${p.slug}`, `${p.title} proof: ${p.evidence.verified}`);
}
// notes
for (const n of notes) add(`note:${n.slug}`, `${n.title}. ${n.excerpt}`);

// experience + bio from the raw TS (simple extraction)
const expTs = fs.readFileSync("content/experience.ts", "utf8");
for (const m of expTs.matchAll(/company:\s*"([^"]+)",\s*\n\s*role:\s*"([^"]+)",[\s\S]*?blurb:\s*\n?\s*"([^"]+)"/g)) {
  add("experience", `${m[2]} at ${m[1]}. ${m[3]}`);
}
const siteTs = fs.readFileSync("content/site.ts", "utf8");
for (const m of siteTs.matchAll(/"((?:I am|My experience|I enjoy)[^"]+)"/g)) add("bio", m[1]);

async function embed(texts) {
  const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: EMBED_MODEL, input: texts }),
  });
  if (!res.ok) throw new Error(`embed ${res.status}: ${await res.text()}`);
  return (await res.json()).data.map((d) => d.embedding);
}

let out = { model: null, dim: 0, chunks };
if (key) {
  console.log(`Embedding ${chunks.length} chunks via OpenRouter...`);
  const vectors = await embed(chunks.map((c) => c.text));
  chunks.forEach((c, i) => (c.vector = vectors[i]));
  out = { model: EMBED_MODEL, dim: vectors[0].length, chunks };
} else {
  console.log("No OPENROUTER_API_KEY: building keyword-only index (no vectors).");
}

fs.mkdirSync("api/data", { recursive: true });
fs.writeFileSync("api/data/index.json", JSON.stringify(out));
console.log(`Wrote api/data/index.json: ${chunks.length} chunks, dim=${out.dim}`);
