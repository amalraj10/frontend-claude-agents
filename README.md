# Frontend Agent Kit for Claude Code

AI agents and workflows that follow our frontend flow: **Figma design → UI code → API integration → checks → PR**.

You stay in control: the kit builds, checks and fixes, and **you review and merge**.

## What's inside

### Commands
| Command | Use it when | What happens |
|---|---|---|
| `/frontend-agent-kit:fe-ticket <figma-link> [api-spec]` | You get a new design (and APIs) to build | Builds the screen with our components → wires the APIs (with mocks if the backend isn't ready) → checks Figma vs website, API edge cases, security and accessibility → fixes → tests → code review → PR description |
| `/frontend-agent-kit:fe-check [figma-link]` | You wrote code yourself and want it checked before a PR | Runs all checks on your changes and reports. It **doesn't edit** unless you say "fix it" |
| `/frontend-agent-kit:fe-bug <bug report>` | QA, a designer or a user reports a bug | Reproduces it in a browser → finds the root cause (frontend or backend?) → smallest fix → regression test → PR note |

### Agents
You can also ask for any agent by name, for example: *"Use the Design Fidelity Checker on /checkout against <figma-link>"*.

| Agent | Job |
|---|---|
| **Figma Screen Builder** | Figma → code using **our existing components and tokens** (detects the stack automatically) |
| **Design Fidelity Checker** | Compares the website with Figma: pixel diff plus measured spacing, type, colour, radius and states, at each breakpoint |
| **API Integrator** | Typed API calls + validation + mocks + loading/error/empty states + contract check, and writes the note for the backend team |
| **Frontend Security Checker** | XSS, secrets in the bundle, token storage, open redirects, route guards, CSP, vulnerable packages |
| **API Tester** | API edge cases: 401, 403, 404, 422, 500, empty, slow |
| **Accessibility Auditor** | Keyboard, focus, labels, contrast, screen readers (WCAG 2.2 AA) |
| **Test Automation Engineer** | Playwright E2E and unit tests |
| **UI Quality Gate** | Removes template look and leftover or placeholder text |
| **Code Reviewer** | Reviews correctness, maintainability and security |
| **Minimal Change Engineer** | The smallest safe fix, with no unrelated refactors |

Skill: **ui-leftover-scan** finds lorem ipsum, "test" strings, TODOs, `href="#"`, starter boilerplate and similar leftovers.

## Setup (one time, about 5 minutes)

**You need:**
1. **Claude Code** (VS Code extension or CLI), signed in with your own account
2. **Access to this private GitHub repo**, with git signed in on your machine
3. **The Figma connector** on your claude.ai account (claude.ai → Settings → Connectors → Figma), so agents can read designs
4. **Node.js 18+**

**Install:** in the Claude Code chat, run:
```
/plugin marketplace add <org>/frontend-agent-kit
/plugin install frontend-agent-kit@frontend-agent-kit
```
Restart Claude Code. The commands and agents are now available in every project you open.

**Optional: auto-offer in a repo.** Add this to the frontend repo's `.claude/settings.json`, so teammates who open that repo are offered the kit (they still need access to this repo):
```json
{
  "extraKnownMarketplaces": {
    "frontend-agent-kit": { "source": { "source": "github", "repo": "<org>/frontend-agent-kit" } }
  },
  "enabledPlugins": { "frontend-agent-kit@frontend-agent-kit": true }
}
```

## Daily use
1. Open **the project folder** in VS Code and start Claude Code there.
2. Run a command, for example:
   ```
   /frontend-agent-kit:fe-ticket https://www.figma.com/design/<file>/...?node-id=12-345 https://api-dev.example.internal/swagger.json
   ```
3. Answer the checkpoints (a quick UI review, then the final review). Push and merge yourself.

**Tips**
- Give one Figma frame per breakpoint (desktop, tablet, mobile) for the best fidelity checks.
- Ask the backend for the **API spec first**, so you can build against mocks before the endpoints exist.
- Results and screenshots go to git-ignored folders (`fidelity-report/`, `.claude/tickets/`).

## Rules (read this)
- Follow **our company's AI usage policy**. Use the kit only on code and designs we're allowed to share with Claude.
- **Never** put API keys, tokens, passwords or real customer data in prompts, tickets or test files. Use dev or staging and test accounts.
- The kit **asks before** installing packages, pushing, or opening PRs. Read diffs before you approve them.
- You own what you merge.

## Updates and removal
- Get the latest version: `/plugin marketplace update frontend-agent-kit`
- Remove it: `/plugin uninstall frontend-agent-kit@frontend-agent-kit`
- Improve the kit: edit the files in `plugins/frontend-agent-kit/` (agents are in `agents/`, commands in `skills/`), bump `version` in `.claude-plugin/plugin.json` and `marketplace.json`, then open a PR to this repo.

## Credits
These agents are adapted from [agency-agents](https://github.com/msitarzewski/agency-agents) (MIT License, © AgentLand Contributors): API Tester, Accessibility Auditor, Test Automation Engineer, Code Reviewer and Minimal Change Engineer. See `THIRD_PARTY_LICENSE-agency-agents.txt`. The other files are licensed under this repo's `LICENSE`.
