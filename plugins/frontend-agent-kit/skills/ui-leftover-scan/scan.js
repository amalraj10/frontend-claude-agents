#!/usr/bin/env node
// Scans a project's UI source for leftover / unwanted / template text.
// Usage: node ui-leftover-scan.js <project-folder>
// Exit code 1 if any HIGH finding, else 0. Prints file:line findings.
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2] || ".");
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", "out", "coverage",
  ".vercel", ".turbo", "vendor", "__tests__", "tests", "test", "e2e", "cypress", "playwright-report",
  "storybook-static", ".venv", "venv", "__pycache__"]);
const EXT = new Set([".html", ".htm", ".jsx", ".tsx", ".js", ".ts", ".vue", ".svelte", ".astro",
  ".md", ".mdx", ".json", ".css", ".scss"]);
const SKIP_FILE = /(\.test\.|\.spec\.|\.stories\.|package(-lock)?\.json$|tsconfig|\.d\.ts$|\.config\.|lock)/i;

// [severity, label, regex]
const RULES = [
  ["HIGH", "Lorem ipsum filler", /\blorem\s+ipsum\b|\bdolor\s+sit\s+amet\b/i],
  ["HIGH", "Framework starter boilerplate", /Vite\s*\+\s*React|Edit\s+<code>src\/|Get started by editing|Welcome to (Next\.js|React|Vue|Astro|SvelteKit)|count is \{count\}|Learn React|Click on the Vite and React logos|Deploy now|Read our docs/i],
  ["HIGH", "Default starter assets", /\b(vite|next|vercel|react)\.svg\b|favicon\.ico.*default/i],
  ["HIGH", "Placeholder people / companies", /\b(John|Jane)\s+Doe\b|\bAcme\s+(Inc|Corp|Co)\b|\bYour\s+(Company|Brand|Name|Logo)\s*(Here)?\b|\bCompany\s+Name\b/i],
  ["HIGH", "Placeholder text left in UI", /\b(placeholder text|sample text|dummy text|insert (text|content) here|text goes here|content goes here|title goes here|tbd|tba)\b/i],
  ["HIGH", "Test / debug strings in UI", />\s*(test|testing|test123|asdf|foo|bar|hello world|debug)\s*</i],
  ["MEDIUM", "Generic AI-template headline", /\b(Unlock|Supercharge|Elevate|Revolutionize|Transform)\s+your\b|\bseamless(ly)?\b|\bnext[- ]level\b|\bcutting[- ]edge\b|\bgame[- ]chang(er|ing)\b|\bempower(s|ing)? (you|your)\b|\ball[- ]in[- ]one (platform|solution)\b/i],
  ["MEDIUM", "Unfinished work markers", /\b(TODO|FIXME|XXX|HACK)\b|coming soon/i],
  ["MEDIUM", "Example / fake links", /https?:\/\/(www\.)?example\.(com|org)|href=["']#["']|href=["']javascript:/i],
  ["MEDIUM", "Generic button text", />\s*(Click (me|here)|Button|Submit|Learn more|Get started)\s*</i],
  ["LOW", "Debug logging", /\bconsole\.(log|debug)\(|\bdebugger;/],
  ["LOW", "Stock / random placeholder images", /(via\.placeholder\.com|placehold\.(co|it)|picsum\.photos|source\.unsplash\.com\/random|dummyimage\.com)/i],
];

const findings = [];
function walk(dir) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name) && !e.name.startsWith(".")) walk(p); continue; }
    if (!EXT.has(path.extname(e.name).toLowerCase()) || SKIP_FILE.test(e.name)) continue;
    let text;
    try { text = fs.readFileSync(p, "utf8"); } catch { continue; }
    if (text.length > 2_000_000) continue;
    text.split(/\r?\n/).forEach((line, i) => {
      for (const [sev, label, re] of RULES) {
        if (re.test(line)) findings.push({ sev, label, file: path.relative(root, p), line: i + 1, text: line.trim().slice(0, 120) });
      }
    });
  }
}
walk(root);

const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
findings.sort((a, b) => order[a.sev] - order[b.sev] || a.file.localeCompare(b.file) || a.line - b.line);
const count = (s) => findings.filter((f) => f.sev === s).length;
console.log(`UI leftover scan: ${root}`);
console.log(`HIGH ${count("HIGH")} | MEDIUM ${count("MEDIUM")} | LOW ${count("LOW")}`);
for (const f of findings.slice(0, 200)) console.log(`[${f.sev}] ${f.label}  ${f.file}:${f.line}  ${f.text}`);
if (findings.length > 200) console.log(`... ${findings.length - 200} more`);
if (!findings.length) console.log("Clean: no leftover or template text found.");
process.exit(count("HIGH") ? 1 : 0);
