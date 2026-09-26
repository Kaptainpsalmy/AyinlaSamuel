/* Content report: counts + [VERIFY] flags + broken image refs. Run: node scripts/content-report.mjs */
import fs from "node:fs";
import path from "node:path";

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const projects = read(".velite/projects.json");
const notes = read(".velite/notes.json");

// TS data modules: count by parsing (cheap, avoids a TS build step)
const countIn = (file, marker) =>
  (fs.readFileSync(file, "utf8").match(new RegExp(marker, "g")) || []).length;

const experience = (fs.readFileSync("content/experience.ts","utf8").match(/^    role:/gm)||[]).length;
// Count real groups only (each starts with `  {` then a `label:`), not the type
// definition's own `label:` field.
const skills = (fs.readFileSync("content/skills.ts","utf8").match(/^  \{\n\s*(?:\/\/[^\n]*\n\s*)?label:/gm)||[]).length;
const skillItems = (fs.readFileSync("content/skills.ts", "utf8").match(/"/g) || []).length; // rough
const services = (fs.readFileSync("content/services.ts","utf8").match(/^  \{ icon:/gm)||[]).length;
const certs = (fs.readFileSync("content/certifications.ts","utf8").match(/^  \{ title:/gm)||[]).length;

console.log("=== CONTENT REPORT ===\n");
console.log(`Projects:       ${projects.length}`);
console.log(`Notes:          ${notes.length}`);
console.log(`Experience:     ${experience} roles`);
console.log(`Skill groups:   ${skills}`);
console.log(`Services:       ${services}`);
console.log(`Certifications: ${certs}`);

// featured
const featured = projects.filter((p) => p.featured).map((p) => p.title);
console.log(`\nFeatured (${featured.length}):`);
featured.forEach((t) => console.log("  * " + t));

// engineering domain distribution (drives the Phase 4 projects filter)
const domains = projects.reduce((a, p) => ((a[p.domain] = (a[p.domain] || 0) + 1), a), {});
console.log(`\nDomains: ${Object.entries(domains).map(([k, v]) => `${k} ${v}`).join(" · ")}`);

// VERIFY flags: frontmatter verify:true, inline [VERIFY], or evidence.verified present
console.log("\n=== NEEDS SAMUEL'S REVIEW ([VERIFY] / verify:true) ===");
let vcount = 0;
for (const p of projects) {
  if (p.verify) { console.log(`  project/${p.slug}: verify:true (case study drafted from evidence)`); vcount++; }
}
for (const n of notes) {
  if (n.verify) { console.log(`  note/${n.slug}: verify:true (drafted)`); vcount++; }
}
// inline [VERIFY] in data modules
for (const f of ["content/experience.ts"]) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  lines.forEach((l, i) => { if (l.includes("[VERIFY")) { console.log(`  ${f}:${i + 1}: ${l.trim()}`); vcount++; } });
}
console.log(`\n  ${vcount} items flagged for review before launch.`);

// broken image refs
console.log("\n=== IMAGE REFERENCE CHECK ===");
let broken = 0;
for (const p of projects) {
  for (const src of p.screenshots || []) {
    const fp = path.join("public", src.replace(/^\//, ""));
    if (!fs.existsSync(fp)) { console.log(`  MISSING: ${p.slug} -> ${src}`); broken++; }
  }
}
console.log(broken === 0 ? "  All screenshot references resolve." : `  ${broken} broken references.`);

// stock-photo guard
console.log("\n=== STOCK PHOTO GUARD ===");
const allContent = [...projects, ...notes].map((x) => JSON.stringify(x)).join("");
const stock = /unsplash|istockphoto|pexels/.test(allContent);
console.log(stock ? "  WARNING: stock photo URL found in content" : "  No stock photo URLs. Clean.");

process.exit(broken > 0 ? 1 : 0);
