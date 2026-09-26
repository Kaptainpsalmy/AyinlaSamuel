/**
 * One-off: turn the raw GAMEPICS images into square, web-sized puzzle tiles.
 * Square-crops (center) to 640x640 and writes optimized JPEGs into
 * public/images/puzzle. Run: node scripts/prep-puzzle-images.mjs
 */
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharpDir = readdirSync("node_modules/.pnpm").find((d) => d.startsWith("sharp@0.35"));
const sharp = require(resolve("node_modules/.pnpm", sharpDir, "node_modules/sharp/dist/index.cjs"));

const SRC = "C:/Users/Samuel/Desktop/MY PORTFOLIO/GAMEPICS";
const OUT = "public/images/puzzle";

// chosen images -> clean output name + human label
const picks = [
  ["WhatsApp Image 2026-09-20 at 11.41.56 AM.jpeg", "engineer.jpg", "PsalmNova, engineered"],
  ["WhatsApp Image 2026-09-20 at 11.41.55 AM.jpeg", "portrait.jpg", "PsalmNova"],
  ["WhatsApp Image 2026-09-20 at 11.41.56 AM (2).jpeg", "office.jpg", "At work"],
  ["WhatsApp Image 2026-09-20 at 11.41.56 AM (1).jpeg", "portrait2.jpg", "PsalmNova, again"],
  ["shubham-dhage-fwbUN8IYvQY-unsplash.jpg", "ai.jpg", "AI"],
  ["bayu-syaits-oYzjGQ7LCVE-unsplash.jpg", "code.jpg", "Late-night code"],
  ["engin-akyurt-7aWvQdR36Y0-unsplash.jpg", "money.jpg", "Show me the money"],
];

for (const [src, out, label] of picks) {
  await sharp(resolve(SRC, src))
    .resize(640, 640, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(resolve(OUT, out));
  console.log(`OK ${out}  (${label})`);
}
console.log("\nDone. Puzzle images in", OUT);
