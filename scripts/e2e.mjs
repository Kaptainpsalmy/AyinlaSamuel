/**
 * End-to-end smoke test in a real (headless) Chrome, driven over the DevTools
 * protocol with a real clock. No test framework or extra dependencies: Node's
 * built-in WebSocket talks CDP directly.
 *
 *   node scripts/e2e.mjs [baseUrl]        default http://localhost:3100
 *   CHROME=/path/to/chrome node scripts/e2e.mjs
 *
 * Run it against a production build (`next build && next start -p 3100`): dev
 * mode's hot-reload client can reload the page mid-test. /api/py/* is not
 * proxied by `next start` locally, so API fetch failures are expected there and
 * are filtered out of the console check.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, existsSync, rmSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3100";
const PORT = 9333;
const CHROME =
  process.env.CHROME ??
  ["C:/Program Files/Google/Chrome/Application/chrome.exe", "/usr/bin/google-chrome", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].find(existsSync);
if (!CHROME) throw new Error("Chrome not found; set CHROME=/path/to/chrome");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  (${detail})` : ""}`);
};

// ---- launch Chrome + connect -------------------------------------------------
// Sweep profiles from earlier runs first: on Windows a profile can stay locked
// for a few seconds after Chrome exits, so a run cannot always delete its own.
for (const d of readdirSync(tmpdir())) {
  if (d.startsWith("psalmnova-e2e-")) try { rmSync(path.join(tmpdir(), d), { recursive: true, force: true }); } catch {}
}
const profile = mkdtempSync(path.join(tmpdir(), "psalmnova-e2e-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

let wsUrl;
for (let i = 0; i < 50 && !wsUrl; i++) {
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl; }
  catch { await sleep(200); }
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));

let nextId = 0;
const pending = new Map();
const listeners = [];
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  } else if (msg.method) listeners.forEach((fn) => fn(msg));
});
const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });

const { targetId } = await send("Target.createTarget", { url: "about:blank" });
const { sessionId: S } = await send("Target.attachToTarget", { targetId, flatten: true });
const cmd = (method, params) => send(method, params, S);
await cmd("Page.enable");
await cmd("Runtime.enable");
await cmd("Log.enable");
await cmd("Network.enable");
// A background tab gets its timers throttled to whole seconds, which would make
// timing checks (like the puzzle's 2.5s reward delay) flaky. Keep it in front.
await cmd("Page.bringToFront");

// Collect console errors/warnings and uncaught exceptions for every page.
let problems = [];
listeners.push((m) => {
  if (m.sessionId !== S) return;
  if (m.method === "Runtime.exceptionThrown") problems.push("exception: " + (m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text).split("\n")[0]);
  if (m.method === "Runtime.consoleAPICalled" && ["error", "warning", "assert"].includes(m.params.type))
    problems.push(`console.${m.params.type}: ` + m.params.args.map((a) => a.value ?? a.description ?? "").join(" ").slice(0, 200));
  if (m.method === "Log.entryAdded" && m.params.entry.level === "error") problems.push("log: " + m.params.entry.text.slice(0, 200) + " " + (m.params.entry.url ?? ""));
});
// /api/py is not proxied under a plain `next start` (build with API_PROXY=1 to
// proxy it), and the Vercel Analytics / Speed Insights scripts only exist on Vercel.
const expected = (p) => /\/api\/py\/|\/_vercel\//.test(p);

async function go(url, settle = 1500) {
  const loaded = new Promise((r) => listeners.push(function once(m) {
    if (m.sessionId === S && m.method === "Page.loadEventFired") { listeners.splice(listeners.indexOf(once), 1); r(); }
  }));
  await cmd("Page.navigate", { url: BASE + url });
  await loaded;
  await sleep(settle);
}
const js = async (expression) => {
  const r = await cmd("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
};
const viewport = (width, height, mobile = false) =>
  cmd("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
const reducedMotion = (on) =>
  cmd("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: on ? "reduce" : "no-preference" }] });

// Opacity of every [data-reveal] currently inside the viewport.
const revealsInView = `[...document.querySelectorAll('[data-reveal]')]
  .filter(e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.height > 0; })
  .map(e => +getComputedStyle(e).opacity)`;

try {
  await viewport(1440, 900);

  // 1. Every page loads with no console errors (desktop, EN).
  for (const p of ["/", "/projects", "/projects/sabrecwa", "/about", "/experience", "/skills", "/services", "/contact", "/notes", "/notes/idempotent-alerting", "/cv", "/licenses", "/play", "/lab"]) {
    problems = [];
    await go(p);
    const real = problems.filter((x) => !expected(x));
    check(`no console errors on ${p}`, real.length === 0, real.slice(0, 2).join(" | "));
  }

  // 2. Scroll reveals: visible after they animate in; below-fold ones reveal on scroll.
  await reducedMotion(false);
  await go("/about", 1500);
  let ops = await js(revealsInView);
  check("reveals in view become visible (normal motion)", ops.length > 0 && ops.every((o) => o > 0.99), `opacities ${ops.join(",")}`);
  await js("window.scrollTo(0, document.body.scrollHeight)");
  await sleep(1500);
  ops = await js(revealsInView);
  check("reveals below the fold appear after scrolling", ops.length > 0 && ops.every((o) => o > 0.99), `opacities ${ops.join(",")}`);

  // 3. Reduced motion: content visible immediately, hero is one static view.
  await reducedMotion(true);
  await go("/about", 400);
  ops = await js(revealsInView);
  check("reduced motion: reveals visible almost instantly", ops.length > 0 && ops.every((o) => o > 0.99), `opacities ${ops.join(",")}`);
  await go("/", 800);
  check("reduced motion: hero shows no terminal / toggle", await js(`!document.querySelector('[aria-label="Show terminal"]') && !document.body.innerText.includes('samuel@psalmnova')`));
  await reducedMotion(false);

  // 3b. No JavaScript: the <noscript> rule must force reveals visible, or the
  //     content would stay at opacity 0 forever.
  await cmd("Emulation.setScriptExecutionDisabled", { value: true });
  await go("/about", 500);
  ops = await js(`[...document.querySelectorAll('[data-reveal]')].map(e => +getComputedStyle(e).opacity)`);
  check("no JavaScript: all reveal content visible", ops.length > 0 && ops.every((o) => o > 0.99), `${ops.length} elements, min opacity ${Math.min(...ops)}`);
  await cmd("Emulation.setScriptExecutionDisabled", { value: false });

  // 4. Yoruba: lang attribute, translated chrome, localized date.
  await cmd("Network.setCookie", { name: "locale", value: "yo", url: BASE });
  await go("/notes", 800);
  check("yoruba: <html lang=yo>", (await js("document.documentElement.lang")) === "yo");
  check("yoruba: nav translated", await js(`document.body.innerText.includes('Àkọsílẹ̀')`));
  check("yoruba: dates localized", await js(`/Oṣù/.test(document.body.innerText)`));
  await cmd("Network.setCookie", { name: "locale", value: "en", url: BASE });
  await go("/notes", 500);
  check("english restored: <html lang=en>", (await js("document.documentElement.lang")) === "en");

  // 5. The puzzle: start, solve by swapping, see the ribbon then the reward.
  await go("/play", 800);
  check("page is visible (timers not throttled)", (await js("document.visibilityState")) === "visible");
  await js(`[...document.querySelectorAll('main button')].find(b => /Start/.test(b.textContent)).click()`);
  await sleep(300);
  const board = `document.querySelector('main [role=group][aria-label^="Picture puzzle"]')`;
  for (let pos = 0; pos < 9; pos++) {
    // selection sort: put tile (pos+1) at position pos
    const done = await js(`(() => {
      const tiles = [...${board}.querySelectorAll('button')];
      const want = tiles.findIndex(b => b.getAttribute('aria-label').replace(', picked up','') === 'Tile ${pos + 1}');
      if (want === ${pos}) return true;
      tiles[want].click(); return false; })()`);
    if (!done) { await sleep(60); await js(`${board}.querySelectorAll('button')[${pos}].click()`); await sleep(60); }
  }
  // textContent, not innerText: the reward heading is CSS-uppercased, and
  // innerText would return "DID YOU KNOW?" and make these checks meaningless.
  const boardText = `${board}.textContent`;
  await sleep(200);
  check("puzzle: solved ribbon shows first", await js(`${boardText}.includes('Solved in')`));
  check("puzzle: reward not shown yet (2.5s beat)", !(await js(`${boardText}.includes('Did you know?')`)));
  await sleep(2700);
  check("puzzle: 'Did you know?' reward pops up", await js(`${boardText}.includes('Did you know?')`));
  check("puzzle: best time saved", (await js(`localStorage.getItem('takeabreak.best')`)) !== null);

  // 6. Contact form: empty submit shows accessible errors, no request sent.
  await go("/contact", 600);
  await js(`document.querySelector('form button[type=submit]').click()`);
  await sleep(300);
  check("contact: empty submit shows 3 errors", (await js(`document.querySelectorAll('[aria-invalid=true]').length`)) === 3);
  check("contact: errors linked via aria-describedby", await js(`[...document.querySelectorAll('[aria-invalid=true]')].every(i => document.getElementById(i.getAttribute('aria-describedby')))`));

  // 7. Client-side navigation (with view transition) lands on the right page.
  await go("/projects", 800);
  problems = [];
  await js(`document.querySelector('a[href="/projects/sabrecwa"]').click()`);
  await sleep(1500);
  check("client nav: project page rendered", await js(`location.pathname === '/projects/sabrecwa' && /SabreCWA/.test(document.querySelector('h1').textContent)`));
  const navProblems = problems.filter((x) => !expected(x));
  check("client nav: no errors during transition", navProblems.length === 0, navProblems.join(" | "));

  // 8. Layout: no horizontal overflow; right nav for each width.
  const overflow = `document.documentElement.scrollWidth - document.documentElement.clientWidth`;
  for (const [w, h, label] of [[390, 844, "phone"], [1100, 800, "laptop"], [1440, 900, "desktop"]]) {
    await viewport(w, h, w < 500);
    await go("/", 800);
    check(`${label} ${w}px: no horizontal overflow`, (await js(overflow)) <= 0, `overflow ${await js(overflow)}px`);
  }
  await viewport(390, 844, true); await go("/", 500);
  check("phone: bottom nav visible, sidebar hidden", await js(`getComputedStyle(document.querySelector('nav[aria-label="Mobile primary"]')).display !== 'none' && getComputedStyle(document.querySelector('aside')).display === 'none'`));

  // 9. Top-bar links: always visible from tablet up (one row at xl, a second
  //    row of tabs below xl), never behind a menu button. On phones the menu
  //    button + bottom bar take over.
  const navState = `(() => {
    const ul = [...document.querySelectorAll('header nav ul')].find(u => u.offsetParent !== null);
    const menu = document.querySelector('button[aria-controls=nav-drawer]');
    if (!ul) return { links: 0, menu: !!menu?.offsetParent };
    const items = [...ul.querySelectorAll('a')];
    const shown = items.filter(a => { const r = a.getBoundingClientRect(); return r.width > 0 && r.left >= 0 && r.right <= innerWidth; });
    return { links: shown.length, total: items.length, fits: ul.scrollWidth <= ul.clientWidth + 1, need: ul.scrollWidth, have: ul.clientWidth, menu: !!menu?.offsetParent };
  })()`;
  const phone = await js(navState);
  check("phone 390px: menu button shown, links row hidden", phone.menu && phone.links === 0);
  for (const lang of ["en", "yo"]) {
    await cmd("Network.setCookie", { name: "locale", value: lang, url: BASE });
    // 768 = tablet (no sidebar), 1024 = tightest laptop (sidebar), 1279 = last
    // two-row width, 1280 = tightest one-row width, 1440 = desktop.
    for (const w of [768, 1024, 1279, 1280, 1440]) {
      await viewport(w, 800); await go("/", 400);
      const s = await js(navState);
      check(`${w}px ${lang}: all ${s.total ?? 8} links visible, no menu button`, s.links === 8 && !s.menu, `visible ${s.links}, menu ${s.menu}`);
      check(`${w}px ${lang}: link row fits without scrolling`, s.fits, `needs ${s.need}px, has ${s.have}px`);
    }
  }
  await cmd("Network.setCookie", { name: "locale", value: "en", url: BASE });

  // 10. The notes table of contents sticks fully below the (taller, two-row)
  //     header instead of sliding under it.
  await viewport(1100, 800); await go("/notes/building-a-production-rag-pipeline", 600);
  await js("window.scrollTo(0, 900)"); await sleep(300);
  const toc = await js(`(() => { const a = document.querySelector('aside.sticky'); const h = document.querySelector('header'); return { tocTop: Math.round(a.getBoundingClientRect().top), headerBottom: Math.round(h.getBoundingClientRect().bottom) }; })()`);
  check("1100px: sticky contents list clears the header", toc.tocTop >= toc.headerBottom, `toc top ${toc.tocTop}px, header bottom ${toc.headerBottom}px`);
  // Reading progress bar follows the scroll (CSS scroll timeline, no JS).
  const progressAt = async (frac) => {
    await js(`window.scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * ${frac}, behavior: "instant" })`); await sleep(300);
    return js(`new DOMMatrix(getComputedStyle(document.querySelector('.reading-progress')).transform).a`);
  };
  const [p0, pHalf, pEnd] = [await progressAt(0), await progressAt(0.5), await progressAt(1)];
  check("note: reading progress tracks the scroll", p0 < 0.05 && pHalf > 0.4 && pHalf < 0.6 && pEnd > 0.95, `0% -> ${p0.toFixed(2)}, 50% -> ${pHalf.toFixed(2)}, 100% -> ${pEnd.toFixed(2)}`);
  // Contents links glide to their heading (smooth scroll) and land below the header.
  await js("window.scrollTo({ top: 0, behavior: 'instant' })"); await sleep(200);
  check("note: smooth scrolling is on for in-page jumps", (await js("getComputedStyle(document.documentElement).scrollBehavior")) === "smooth");
  // 11. Command palette loads on first use: absent from the page until Ctrl/Cmd+K
  //     or the header button asks for it, then works like before.
  await viewport(1440, 900); await go("/", 800);
  problems = [];
  const paletteOpen = `!!document.querySelector('[cmdk-input]')`;
  const key = async (k, code, vk, modifiers = 0) => {
    await cmd("Input.dispatchKeyEvent", { type: "keyDown", key: k, code, windowsVirtualKeyCode: vk, modifiers });
    await cmd("Input.dispatchKeyEvent", { type: "keyUp", key: k, code, windowsVirtualKeyCode: vk, modifiers });
  };
  // Poll instead of sleeping a fixed time: how long it takes depends on the
  // network, so report it rather than fail on a slow run.
  const waitFor = async (expr, ms = 5000) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) { if (await js(expr)) return Date.now() - t0; await sleep(50); }
    return -1;
  };
  check("palette: not in the page before first use", await js(`!document.querySelector('[cmdk-root]')`));
  await key("k", "KeyK", 75, 2);
  let took = await waitFor(paletteOpen);
  check("palette: Ctrl+K loads and opens it", took >= 0, `opened in ${took}ms`);
  await key("Escape", "Escape", 27); await sleep(400);
  check("palette: Escape closes it", !(await js(paletteOpen)));
  await key("k", "KeyK", 75, 2);
  took = await waitFor(paletteOpen, 1000);
  check("palette: Ctrl+K opens it again once loaded", took >= 0, `opened in ${took}ms`);
  await key("Escape", "Escape", 27); await sleep(400);
  await go("/", 800);
  await js(`document.querySelector('header button[aria-label="Search and commands"]').click()`);
  took = await waitFor(paletteOpen);
  check("palette: header button loads and opens it", took >= 0, `opened in ${took}ms`);
  await key("Escape", "Escape", 27); await sleep(300);
  const palProblems = problems.filter((x) => !expected(x));
  check("palette: no errors while loading", palProblems.length === 0, palProblems.join(" | "));

  // 12. Sidebar puzzle loads on first click and opens straight into a shuffled game.
  await go("/", 800);
  const aside = `document.querySelector('aside')`;
  const asideBoard = `${aside}.querySelector('[role=group][aria-label^="Picture puzzle"]')`;
  const quickBtn = `[...${aside}.querySelectorAll('button')].find(b => b.textContent.includes('Play a quick puzzle'))`;
  check("sidebar puzzle: only the start button before the first click", await js(`!${asideBoard} && !!${quickBtn}`));
  await js(`${quickBtn}.click()`); await sleep(1500);
  const order = await js(`${asideBoard} ? [...${asideBoard}.querySelectorAll('button')].map(b => b.getAttribute('aria-label')).join(',') : ''`);
  const solvedOrder = [...Array(9)].map((_, i) => `Tile ${i + 1}`).join(",");
  check("sidebar puzzle: first click loads a shuffled board", order.split(",").length === 9 && order !== solvedOrder, order || "no board");

  // 13. Illustrations arrive when scrolled near, inlined (so they follow the theme).
  await go("/", 600);
  const art = `document.querySelector('.animate-float[aria-hidden=true]')`;
  await js(`${art}.scrollIntoView({ block: 'center' })`); await sleep(1500);
  check("illustration: loads when scrolled into view", await js(`!!${art}.querySelector('svg') && getComputedStyle(${art}).opacity === '1'`));
  check("illustration: inlined with theme colors, not an <img>", await js(`/currentColor|var\\(--color-/.test(${art}.innerHTML)`));
  const nf = await fetch(BASE + "/this-page-does-not-exist");
  check("404: unknown page returns status 404", nf.status === 404, `status ${nf.status}`);
  await go("/this-page-does-not-exist", 1500);
  check("404: page-not-found illustration loads", await js(`!!document.querySelector('[role=img][aria-label="Page not found"] svg')`));

  // 14. Server HTML is complete: no section is streamed in later as a hidden
  //     chunk (that hides content from no-JS visitors and shifts the layout).
  for (const p of ["/", "/about", "/projects/sabrecwa", "/notes/idempotent-alerting"]) {
    const html = await (await fetch(BASE + p)).text();
    check(`${p}: no streamed hidden sections in the HTML`, !html.includes('<div hidden id="S:'));
  }

  // 15. Tap targets: carousel and hero dots are at least 24x24 on a phone.
  await viewport(390, 844, true); await go("/", 1200);
  const dots = await js(`[...document.querySelectorAll('button[aria-label^="Go to project"], button[aria-label="Show API pulse"], button[aria-label="Show terminal"]')].map(b => { const r = b.getBoundingClientRect(); return Math.round(Math.min(r.width, r.height)); })`);
  check("phone: dot buttons are at least 24px", dots.length > 0 && dots.every((d) => d >= 24), `smallest ${Math.min(...dots)}px of ${dots.length}`);
  await viewport(1440, 900);

  // 16. SEO: every page has a title, a real description, a self canonical and a
  //     share image; structured data parses; crawl files and icons are served.
  const tag = (html, re) => (html.match(re) || [])[1];
  const home = await (await fetch(BASE + "/")).text();
  const site = tag(home, /<link rel="canonical" href="([^"]+)"/);
  const local = (u) => BASE + u.slice(site.length);
  for (const p of ["/", "/projects", "/about", "/experience", "/skills", "/services", "/contact", "/notes", "/cv", "/lab", "/play", "/licenses", "/projects/sabrecwa", "/notes/idempotent-alerting"]) {
    const html = await (await fetch(BASE + p)).text();
    const canonical = tag(html, /<link rel="canonical" href="([^"]+)"/);
    const desc = tag(html, /<meta name="description" content="([^"]+)"/) ?? "";
    const og = tag(html, /<meta property="og:image" content="([^"]+)"/) ?? "";
    const title = tag(html, /<title>([^<]+)<\/title>/) ?? "";
    check(`seo ${p}: title, description, self canonical, share image`,
      title.includes("PsalmNova") && desc.length >= 50 && canonical === (p === "/" ? site : site + p) && og.startsWith(site),
      `title "${title}", desc ${desc.length}ch, canonical ${canonical}, og ${og ? "yes" : "no"}`);
  }
  const ldTypes = async (p) => [...(await (await fetch(BASE + p)).text()).matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((m) => [].concat(JSON.parse(m[1]))).map((x) => x["@type"]).join("+");
  check("json-ld: home is Person + WebSite", (await ldTypes("/")) === "Person+WebSite");
  check("json-ld: project is SoftwareSourceCode + BreadcrumbList", (await ldTypes("/projects/sabrecwa")) === "SoftwareSourceCode+BreadcrumbList");
  check("json-ld: note is BlogPosting + BreadcrumbList", (await ldTypes("/notes/idempotent-alerting")) === "BlogPosting+BreadcrumbList");
  const projectOg = tag(await (await fetch(BASE + "/projects/sabrecwa")).text(), /<meta property="og:image" content="([^"]+)"/);
  const ogRes = await fetch(local(projectOg));
  const ogBytes = (await ogRes.arrayBuffer()).byteLength;
  check("project share card renders (PNG)", ogRes.status === 200 && ogRes.headers.get("content-type") === "image/png" && ogBytes > 10_000, `${ogRes.status} ${ogBytes}b`);
  const sitemap = await (await fetch(BASE + "/sitemap.xml")).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const velite = (f) => JSON.parse(readFileSync(new URL(`../.velite/${f}.json`, import.meta.url), "utf8")).length;
  check("sitemap: every page, project and note listed", locs.length === 12 + velite("projects") + velite("notes"), `${locs.length} urls`);
  const statuses = await Promise.all(locs.map(async (u) => (await fetch(local(u))).status));
  check("sitemap: every listed URL returns 200", statuses.every((s) => s === 200), `non-200: ${locs.filter((_, i) => statuses[i] !== 200).join(", ")}`);
  const robots = await (await fetch(BASE + "/robots.txt")).text();
  check("robots.txt: points to the sitemap, blocks styleguide and API", robots.includes(`Sitemap: ${site}/sitemap.xml`) && robots.includes("Disallow: /styleguide") && robots.includes("Disallow: /api/"));
  const sg = await (await fetch(BASE + "/styleguide")).text();
  check("styleguide: noindex with its own canonical", /<meta name="robots" content="noindex, nofollow"/.test(sg) && tag(sg, /<link rel="canonical" href="([^"]+)"/) === site + "/styleguide");
  const fav = await fetch(BASE + "/favicon.ico");
  check("favicon.ico is served", fav.status === 200 && /icon/.test(fav.headers.get("content-type") ?? ""), `${fav.status} ${fav.headers.get("content-type")}`);
  const manifest = await (await fetch(BASE + "/manifest.webmanifest")).json();
  const iconOk = await Promise.all(manifest.icons.map(async (i) => { const r = await fetch(BASE + i.src); return r.status === 200 && r.headers.get("content-type") === "image/png"; }));
  check("manifest: icons resolve to PNGs", manifest.icons.length >= 2 && iconOk.every(Boolean));
  const feed = await fetch(BASE + "/feed.xml");
  check("RSS feed is served with items", feed.status === 200 && (await feed.text()).includes("<item>"));
} catch (err) {
  check("harness ran to completion", false, err.message);
} finally {
  // Close Chrome through the protocol so its helper processes exit too (killing
  // the main process leaves them holding file locks on Windows), then delete
  // the throwaway profile so repeated runs do not pile up in the temp folder.
  const exited = new Promise((r) => chrome.once("exit", r));
  await Promise.race([send("Browser.close").catch(() => {}), sleep(3000)]);
  ws.close();
  await Promise.race([exited, sleep(5000)]);
  chrome.kill();
  // If it is still locked, the next run's sweep removes it.
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {}
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
