---
name: fe-bug
description: Frontend bug workflow — reproduce the bug in a real browser, capture console/network evidence, decide whether it's a frontend or backend issue, find the root cause, apply the smallest safe fix, add a regression test, and write a PR note. Use when the developer runs /fe-bug or reports a UI/UX bug, broken screen, wrong data, layout issue, or QA/designer/user bug report.
---

# /fe-bug: reproduce → root cause → minimal fix → regression test

Arguments: the bug report (text, ticket, screenshot, video notes, steps), plus optionally the URL or route, a Figma link (for visual bugs) and the environment.

## Steps
1. **Understand (you).** Restate: the expected vs the actual behaviour, the steps, the environment, browser and device. If the steps are missing and can't be inferred, ask once.
2. **Reproduce.** Start the dev server. With Playwright, follow the steps at the reported viewport and browser. Capture **screenshots, console errors and failed or odd network calls** (status, payload, response). Load the `engineering:debug` skill if available and follow its reproduce-isolate-diagnose flow. If you **can't** reproduce it, report exactly what you tried and stop. Don't guess-fix.
3. **Classify:**
   - **Visual or layout:** compare with Figma using the **Design Fidelity Checker** (report-only) at that breakpoint.
   - **API or data:** compare the request and response with the spec. If the backend violates the contract, **don't patch around it**. Write the backend note with the exact request and response, and only add frontend defensive handling if it's sensible and say so.
   - **Logic or state:** isolate it with logs and breakpoints and narrow to the smallest failing case.
4. **Root cause.** State it in one or two sentences, with file:line. Check whether the same pattern exists elsewhere, list those places, and don't fix them silently.
5. **Write the regression test first.** Write a test (unit or Playwright) that **fails now**.
6. **Fix.** Make the smallest change that makes the test pass, yourself or with the **Minimal Change Engineer** agent for anything non-trivial. No refactors and no unrelated changes.
7. **Verify.** The new test passes, the existing tests pass, lint and types pass, and the bug no longer reproduces in the browser (take a screenshot). For UI bugs, re-check fidelity at the affected breakpoints. Run the `ui-leftover-scan` skill on the changed files.
8. **Hand-off.** Make a commit on a `fix/<ticket>-<slug>` branch, with a PR note: **Cause → Fix → How it was tested → Before/after screenshots → Risks**. Don't push or open a PR without the developer's yes.

## Report (under 250 words)
Reproduced (yes/no, with evidence), the classification, the root cause, the fix (files), the test added, the verification, the backend note if any, and related places to check.
