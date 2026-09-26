/**
 * Translation guard. Runs before every build and fails it (exit 1) when:
 *   1. en.json and yo.json do not have exactly the same keys,
 *   2. any message is empty,
 *   3. a translation drops or renames an ICU placeholder ({count}, {role}, ...),
 *   4. code calls t("some.key") for a key that does not exist in en.json,
 *   5. a nav item in content/site.ts has no nav.<slug> label.
 *
 * Usage: node scripts/check-i18n.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const en = read("messages/en.json");
const yo = read("messages/yo.json");

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const fe = flatten(en);
const fy = flatten(yo);
const problems = [];

// 1 + 2: key parity and empty values
for (const k of Object.keys(fe)) if (!(k in fy)) problems.push(`missing in yo.json: ${k}`);
for (const k of Object.keys(fy)) if (!(k in fe)) problems.push(`missing in en.json: ${k}`);
for (const [k, v] of Object.entries({ ...fe })) if (typeof v !== "string" || !v.trim()) problems.push(`empty in en.json: ${k}`);
for (const [k, v] of Object.entries(fy)) if (typeof v !== "string" || !v.trim()) problems.push(`empty in yo.json: ${k}`);

// 3: placeholder parity. Matches {name} and {name, ...}; branch bodies such as
// "{# views}" start with # and are not variables.
const vars = (s) => new Set([...String(s).matchAll(/\{\s*(\w+)\s*[,}]/g)].map((m) => m[1]));
for (const k of Object.keys(fe)) {
  if (!(k in fy)) continue;
  const a = [...vars(fe[k])].sort().join(",");
  const b = [...vars(fy[k])].sort().join(",");
  if (a !== b) problems.push(`placeholder mismatch at ${k}: en {${a}} vs yo {${b}}`);
}

// 4: every literal t("key") in the code must exist in en.json.
const has = (dotted) => {
  let node = en;
  for (const part of dotted.split(".")) {
    if (!node || typeof node !== "object" || !(part in node)) return false;
    node = node[part];
  }
  return true;
};

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else if (/\.(tsx?|mjs)$/.test(entry.name)) files.push(p);
  }
  return files;
}

const declRe = /const\s+(\w+)\s*=\s*(?:await\s+)?(?:useTranslations|getTranslations)\(\s*["']([\w.]+)["']\s*\)/g;
let checkedCalls = 0;
for (const file of [...walk(path.join(ROOT, "app")), ...walk(path.join(ROOT, "components"))]) {
  const src = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);
  for (const [, v, ns] of src.matchAll(declRe)) {
    if (!has(ns)) problems.push(`${rel}: namespace "${ns}" not in en.json`);
    const callRe = new RegExp(`(?<![\\w.])${v}\\(\\s*(["'\`])((?:(?!\\1).)+)\\1`, "g");
    for (const [, , key] of src.matchAll(callRe)) {
      checkedCalls++;
      // Template keys like `type.${x}`: check the static prefix is a real group.
      const dyn = key.indexOf("${");
      const target = dyn === -1 ? key : key.slice(0, dyn).replace(/\.$/, "");
      if (target && !has(`${ns}.${target}`)) problems.push(`${rel}: ${v}("${key}") -> ${ns}.${target} not in en.json`);
    }
  }
}

// 6: every namespace a client component reads (useTranslations) must be in
// i18n/client-namespaces.ts, or it would not be sent to the browser.
const clientList = fs.readFileSync(path.join(ROOT, "i18n/client-namespaces.ts"), "utf8");
const clientNs = new Set([...clientList.slice(clientList.indexOf("[")).matchAll(/"([\w.]+)"/g)].map((m) => m[1]));
for (const ns of clientNs) if (!has(ns)) problems.push(`i18n/client-namespaces.ts: "${ns}" not in en.json`);
for (const file of [...walk(path.join(ROOT, "app")), ...walk(path.join(ROOT, "components")), ...walk(path.join(ROOT, "lib"))]) {
  const src = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file);
  for (const [, arg] of src.matchAll(/useTranslations\(\s*([^)]*?)\s*\)/g)) {
    const ns = arg.match(/^["']([\w.]+)["']$/)?.[1];
    if (!ns) problems.push(`${rel}: useTranslations(${arg}) must name a namespace (client messages are filtered)`);
    else if (!clientNs.has(ns.split(".")[0])) problems.push(`${rel}: namespace "${ns}" is not in i18n/client-namespaces.ts`);
  }
}

// 5: nav labels come from the nav array in content/site.ts.
const site = fs.readFileSync(path.join(ROOT, "content/site.ts"), "utf8");
for (const [, slug] of site.matchAll(/href:\s*"\/([\w-]+)"/g)) {
  if (!has(`nav.${slug}`)) problems.push(`content/site.ts nav "/${slug}" has no nav.${slug} label`);
}

// A file may declare the same translator twice (generateMetadata + the page),
// which would report each problem twice: keep one of each.
const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`i18n check failed (${unique.length}):`);
  for (const p of unique) console.error("  - " + p);
  process.exit(1);
}
console.log(`i18n check passed: ${Object.keys(fe).length} keys in en + yo, ${checkedCalls} t() calls verified.`);
