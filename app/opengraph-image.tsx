import { renderOg, ogSize, ogContentType } from "@/lib/og";

// Default share card for every page without its own (home, about, lists...).
export const alt = "Ayinla Samuel Olorunwa, full-stack software engineer focused on backend and AI";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({
    kicker: "Full-stack engineer / backend + AI",
    title: "Ayinla Samuel Olorunwa",
    subtitle: "I build the API, the model, and the pipeline in between. FastAPI, RAG, and agentic systems, shipped end to end.",
  });
}
