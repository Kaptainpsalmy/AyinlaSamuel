/**
 * The PsalmNova mark: a bold "P" with the accent dot, on the dark canvas. Used
 * for the favicon, the Apple touch icon, and the web manifest icons.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function renderMark(size: number) {
  const font = await readFile(join(process.cwd(), "assets/fonts/SpaceGrotesk-Bold.ttf"));
  const radius = Math.round(size * 0.22);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0e10",
          borderRadius: radius,
          fontFamily: "Space Grotesk",
          fontSize: size * 0.68,
          fontWeight: 700,
          color: "#f2f2f0",
          letterSpacing: -size * 0.02,
        }}
      >
        <span style={{ marginTop: -size * 0.06 }}>P</span>
        <span style={{ color: "#5b5bff", marginTop: size * 0.2 }}>.</span>
      </div>
    ),
    { width: size, height: size, fonts: [{ name: "Space Grotesk", data: font, weight: 700, style: "normal" }] },
  );
}
