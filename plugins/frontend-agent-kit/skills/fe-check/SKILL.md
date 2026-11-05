---
name: fe-check
description: Quality-check frontend changes the developer already wrote, before a PR — Figma fidelity (if a Figma link is given), API contract and edge cases, frontend security, accessibility, leftover/placeholder text, tests and code review. Use when the developer runs /fe-check or asks "check my changes", "is this PR ready", "review my UI work".
---

# /fe-check: is my frontend work PR-ready?

Arguments (all optional): Figma link(s), an API spec, a base branch (default: the repo's main branch), and a path filter.

## Steps
1. **Scope (you).** Run `git diff <base>...HEAD --stat` plus the uncommitted changes to find the changed files and the affected routes and components. If nothing has changed, say so and stop.
2. **Parallel read-only checks** (one message). Only include the relevant ones:
   - **Design Fidelity Checker**: only if a Figma link was given, on the affected pages
   - **API Tester**: only if API code changed or a spec was given
   - **Frontend Security Checker**: always
   - **Accessibility Auditor**: if UI changed
   - Meanwhile, run yourself: lint, type check, unit tests, and the `ui-leftover-scan` skill on the changed folders
3. **Code Reviewer** on the diff (it can run in the same parallel batch).
4. **Report first, fix on request.** This is the developer's own code, so **don't edit anything** unless they say "fix it" (or ran `/fe-check fix`). Then fix with the smallest changes and re-run only the affected checks.

## Report
A table of each check → PASS / ISSUES (count by severity), then the top issues with file:line and a suggested fix, then **"PR-ready: yes/no"** with the blocking items. Under 350 words. Keep the raw details in `fe-check-report.md` (git-ignored) if they're long.
