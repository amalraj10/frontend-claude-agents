---
name: ui-leftover-scan
description: Scan a frontend project for leftover, placeholder or template text in the UI source (lorem ipsum, "test"/"asdf" strings, John Doe/Acme, TODO, "Coming soon", href="#", example.com, console.log, starter boilerplate like "Vite + React", generic AI headlines like "Unlock your"/"Seamless", placeholder images). Use before calling any UI done, in /fe-check and /fe-ticket, or when asked to check for leftover or placeholder content.
---

# UI leftover scan

Run the bundled scanner from **this skill's base directory** (shown above as "Base directory for this skill"). Pass the project root, or a subfolder like `src`:

```bash
node "<base directory>/scan.js" "<project folder>"
```

It prints HIGH, MEDIUM and LOW findings as `file:line`, and exits with code 1 if any HIGH finding exists. It skips `node_modules`, build output, test and spec files, and lockfiles.

## How to act on results
- **HIGH and MEDIUM:** fix them all with real, product-specific content taken from the Figma design, the ticket or the API data. Don't invent copy. If the real text is unknown, ask the developer, or use the exact text from the Figma frame.
- **False positive:** if the flagged text is genuine content that belongs there (for example a product literally called "Seamless"), leave it and say why.
- **LOW** (`console.log`, placeholder image hosts): remove them from production code paths.
- Re-run until it reports **0 HIGH and 0 MEDIUM**.
