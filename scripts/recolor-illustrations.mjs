/**
 * Recolor downloaded unDraw SVGs so they theme with the site in both light and
 * dark, while keeping human skin tones natural.
 *
 * unDraw illustrations use a small, predictable palette:
 *   - ONE accent hex (default #6c63ff)         -> currentColor (wrapper sets text-accent)
 *   - dark structural line-work (#2f2e41, ...)  -> var(--color-ink)   (readable in dark)
 *   - light gray fills (#e6e6e6, #f2f2f2, ...)  -> var(--color-card)  (no glare on dark)
 *   - mid navy/gray (#3f3d56, #d6d6e3, ...)     -> var(--color-muted) via mix
 *   - skin / hair / warm tones                  -> LEFT ALONE (stay human in both themes)
 *
 * The result is a single SVG file that adapts to the active theme, dropped into
 * a `text-accent` wrapper. Skin tones are intentionally preserved.
 *
 * Usage:  node scripts/recolor-illustrations.mjs
 * Reads:  public/illustrations/raw/*.svg
 * Writes: public/illustrations/themed/<name>.svg
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

const RAW = "public/illustrations/raw";
const OUT = "public/illustrations/themed";

// case-insensitive hex -> replacement. Order does not matter (exact-match map).
const MAP = new Map(
  Object.entries({
    // accent
    "#6c63ff": "currentColor",
    // dark line-work / clothing -> ink so it flips with the theme
    "#2f2e41": "var(--color-ink)",
    "#090814": "var(--color-ink)",
    "#3f3d56": "var(--color-muted)",
    // light structural fills -> card surface (dark-safe)
    "#f2f2f2": "var(--color-card)",
    "#f0f0f0": "var(--color-card)",
    "#e6e6e6": "var(--color-card)",
    "#e4e4e4": "var(--color-card)",
    "#d6d6e3": "var(--color-line)",
    "#b6b3c5": "var(--color-muted)",
    "#cacaca": "var(--color-line)",
  }).map(([k, v]) => [k.toLowerCase(), v]),
);

// Warm/human tones we deliberately keep (skin, lips, cheeks, Cloudflare brand orange).
const KEEP = new Set(
  [
    "#ffb6b6",
    "#9e616a",
    "#ed9da0",
    "#ff6584",
    "#fbad41",
    "#f6821f",
    "#000000",
    "#ffffff",
  ].map((h) => h.toLowerCase()),
);

async function main() {
  await mkdir(OUT, { recursive: true });
  let files;
  try {
    files = (await readdir(RAW)).filter((f) => f.toLowerCase().endsWith(".svg"));
  } catch {
    console.error(`No ${RAW} directory. Create it and add the raw SVGs first.`);
    process.exit(1);
  }
  if (files.length === 0) {
    console.error(`${RAW} is empty. Drop the downloaded SVGs there first.`);
    process.exit(1);
  }

  for (const file of files) {
    let svg = await readFile(join(RAW, file), "utf8");

    // Drop the fixed width/height so the wrapper controls size; keep viewBox.
    svg = svg.replace(/(<svg\b[^>]*?)\s(width|height)="[^"]*"/g, "$1");

    const unmapped = new Set();
    svg = svg.replace(/#[0-9a-fA-F]{6}/g, (hex) => {
      const key = hex.toLowerCase();
      if (MAP.has(key)) return MAP.get(key);
      if (KEEP.has(key)) return hex;
      unmapped.add(key);
      return hex; // leave anything unexpected untouched rather than guess
    });

    await writeFile(join(OUT, file), svg, "utf8");
    const note = unmapped.size
      ? `  (kept unmapped: ${[...unmapped].join(", ")})`
      : "";
    console.log(`OK ${file}${note}`);
  }
  console.log(`\nDone. Themed files in ${OUT}. Reference them in a text-accent wrapper.`);
}

main();
