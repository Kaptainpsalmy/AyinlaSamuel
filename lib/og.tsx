/**
 * Shared renderer for share-preview images (the card shown when a link is
 * posted on WhatsApp, LinkedIn, X, Slack...). 1200x630, dark Kinetic Minimal
 * palette, brand fonts. Rendered with next/og at build time, so reading local
 * fonts and screenshots from disk is fine.
 *
 * Satori (the renderer) supports flexbox only: every element with more than
 * one child needs display:flex.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { site } from "@/content/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const C = {
  bg: "#0e0e10",
  card: "#1c1c1f",
  ink: "#f2f2f0",
  muted: "#9a9a9c",
  accent: "#5b5bff",
  line: "rgba(255,255,255,0.10)",
};

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 700; style: "normal" }[]> | null = null;
function loadFonts() {
  fonts ??= Promise.all([
    readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/JetBrainsMono-Regular.ttf")),
  ]).then(([display, mono]) => [
    { name: "Space Grotesk", data: display, weight: 700 as const, style: "normal" as const },
    { name: "JetBrains Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ]);
  return fonts;
}

// Screenshot slot on the card (and 2x that, so it stays crisp on retina).
const SHOT = { w: 374, h: 420 };

/**
 * Reads a /public image, crops it to the card's screenshot slot (top of the
 * page, where the interesting part is), and returns a small JPEG data URL.
 * Resizing first matters: some covers are full-page captures (one is
 * 2880x11850, 15MB) and embedding those raw overflows the renderer.
 * Returns null if the file is missing or unreadable.
 */
async function publicImage(path?: string): Promise<string | null> {
  if (!path) return null;
  try {
    const buf = await sharp(join(process.cwd(), "public", path))
      .resize(SHOT.w * 2, SHOT.h * 2, { fit: "cover", position: "top" })
      .jpeg({ quality: 82 })
      .toBuffer();
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

const clip = (s: string, max: number) => (s.length > max ? s.slice(0, max - 1).trimEnd() + "..." : s);

export async function renderOg({
  kicker,
  title,
  subtitle,
  image,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  /** optional /public path shown on the right (project screenshot) */
  image?: string;
}) {
  const shot = await publicImage(image);
  const titleSize = title.length > 40 ? 56 : title.length > 24 ? 66 : 78;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.bg, color: C.ink, fontFamily: "Space Grotesk" }}>
        {/* accent rail */}
        <div style={{ width: 12, height: "100%", background: C.accent }} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 64px 56px 60px" }}>
          <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 26, letterSpacing: 6 }}>
            <span>PSALMNOVA</span>
            <span style={{ color: C.accent }}>.</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 22, color: C.accent, letterSpacing: 3, textTransform: "uppercase" }}>
              {kicker}
            </div>
            <div style={{ display: "flex", marginTop: 18, fontSize: titleSize, fontWeight: 700, lineHeight: 1.04, letterSpacing: -2 }}>
              {clip(title, 70)}
            </div>
            {subtitle && (
              <div style={{ display: "flex", marginTop: 22, fontSize: 28, lineHeight: 1.35, color: C.muted, maxWidth: shot ? 560 : 900 }}>
                {clip(subtitle, shot ? 110 : 150)}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${C.line}`, paddingTop: 22, fontFamily: "JetBrains Mono", fontSize: 20, color: C.muted }}>
            <span>{site.name}</span>
            <span>psalmnova.vercel.app</span>
          </div>
        </div>

        {shot && (
          <div style={{ width: 430, display: "flex", alignItems: "center", paddingRight: 56 }}>
            <div style={{ display: "flex", width: SHOT.w, height: SHOT.h, borderRadius: 22, overflow: "hidden", border: `1px solid ${C.line}`, background: C.card }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain img */}
              <img src={shot} width={SHOT.w} height={SHOT.h} style={{ objectFit: "cover", objectPosition: "top" }} alt="" />
            </div>
          </div>
        )}
      </div>
    ),
    { ...ogSize, fonts: await loadFonts() },
  );
}
