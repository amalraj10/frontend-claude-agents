---
name: fe-ticket
description: Full frontend ticket workflow — from a Figma link (and optionally an API spec) to built, integrated, fidelity-checked, tested, secure, reviewed code ready for PR. Use when the developer runs /fe-ticket or asks to implement a Figma design end to end, with or without API integration.
---

# /fe-ticket: Figma (+ API) → reviewed, PR-ready code

Arguments: a Figma link (one or more frames), and optionally an API spec (Swagger/OpenAPI URL or file, Postman collection, or a doc) and a ticket ID or description. If the Figma link is missing, ask for it.

You (the main session) orchestrate. Subagents can't start other agents, so every launch comes from you. Plugin agents may appear with the prefix `frontend-agent-kit:`.

## Ground rules
- **Company code:** follow the team's AI policy. Never put secrets, tokens or real customer data in prompts or files. Work in **dev or staging** only.
- **Branch first:** create a feature branch (for example `feat/<ticket>-<slug>`) if you're on the default branch. Never push or open a PR without the developer's yes.
- **No surprise dependencies:** before installing any package (Playwright, MSW, zod and so on), list it with a reason and ask.
- **Token-light:** do small things yourself. Briefs to agents stay under 200 words: goal, links, files, constraints, report format. Run read-only checks in parallel, and do **one** fix pass after them. Two fix rounds at most per problem, then stop and show the error.
- **State in files:** keep `TICKET.md` (git-ignored, or in `.claude/tickets/`) updated with scope, checklist and results, so the work survives context compaction.

## Steps
**0. Intake (you).** Read the project basics (`package.json`, folder layout, existing screens). Read the Figma frames' structure briefly, and the API spec's relevant endpoints. Write `TICKET.md` with: the screens and states to build, the breakpoints, the endpoints, the acceptance checklist and open questions. If anything blocks building (for example a missing frame), ask now.

**1. Build UI.** Run the **Figma Screen Builder** agent on the frames.

**2. API.** If there's a spec, run the **API Integrator** agent (typed layer, mocks, wiring, contract check if the backend is reachable). It can run **in parallel with step 1** when the UI work and the API layer live in separate files. Otherwise run it after step 1.

**★ Checkpoint: quick review.** Show the developer the screenshots plus a summary, and ask if the direction is right before spending on checks.

**3. Parallel checks (read-only, one message, all at once):**
- **Design Fidelity Checker**: report only, no fixes, at every Figma breakpoint
- **API Tester**: edge cases (401/403/404/422/500, empty, slow, large) against the mocks, plus the real dev API if available
- **Frontend Security Checker**: report only for this pass
- **Accessibility Auditor**: keyboard, focus, labels, contrast, screen-reader names (WCAG 2.2 AA)

**4. One fix pass.** Merge all findings into one list (dedupe, order by severity), then fix them yourself if small, or with the **Minimal Change Engineer** if large. Re-run only the checks whose findings were fixed.

**5. Tests.** The **Test Automation Engineer** writes and runs E2E tests for the main user flow (Playwright, mocked API) and adds unit tests for the logic. All green.

**6. Final gate.** Run the `ui-leftover-scan` skill (0 HIGH, 0 MEDIUM), then the **UI Quality Gate**, then the **Code Reviewer** on the full diff. Fix any blocking review comments.

**7. Hand-off.** Commit in small conventional commits. Write a PR description: what changed, screenshots (Figma vs web), the fidelity verdict, the API contract notes for the backend team, test results, a11y and security results, and known gaps or design questions. **★ Stop:** the developer reviews, pushes and merges.

## Final report to the developer
The branch, files changed, a PASS/HOLD per check (fidelity, API, security, a11y, tests, leftover scan, review), the backend note (ready to paste), the designer questions, and the number of agents used.
