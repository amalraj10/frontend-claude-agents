# How to use the Frontend Agent Kit

A step-by-step guide to installing the kit on your computer and using it on real frontend work.

- [1. Before you start](#1-before-you-start)
- [2. Install the kit](#2-install-the-kit)
- [3. Check that it works](#3-check-that-it-works)
- [4. Daily use](#4-daily-use)
- [5. Using one agent directly](#5-using-one-agent-directly)
- [6. Good inputs](#6-good-inputs)
- [7. Updating and removing](#7-updating-and-removing)
- [8. Troubleshooting](#8-troubleshooting)
- [9. Rules](#9-rules)

---

## 1. Before you start

| You need | How to check |
|---|---|
| **Claude Code**, signed in with your own account (VS Code extension or CLI) | Open the Claude Code panel in VS Code. It should accept a message |
| **Node.js 18 or newer** | In a terminal: `node --version` |
| **Git**, signed in to GitHub (only to install from GitHub) | `git --version`, and you can clone a private repo from our org |
| **Access to the kit repo** (only to install from GitHub) | Ask the kit owner to invite you |
| **The Figma connector** on your claude.ai account | claude.ai → Settings → Connectors → **Figma** → Connect. Use your work Figma account that can open our design files |

Playwright, MSW and other project tools aren't needed up front. The agents **ask before installing anything** in a project.

---

## 2. Install the kit

Type these commands into the **Claude Code chat box**, not a normal terminal.

### Option A: from GitHub (teammates)
```
/plugin marketplace add amalraj10/frontend-claude-agents
/plugin install frontend-agent-kit@frontend-agent-kit
```

### Option B: from a folder on your computer (the kit owner, or for testing changes)
Windows:
```
/plugin marketplace add C:\path\to\frontend-agent-kit
/plugin install frontend-agent-kit@frontend-agent-kit
```
macOS or Linux:
```
/plugin marketplace add ~/path/to/frontend-agent-kit
/plugin install frontend-agent-kit@frontend-agent-kit
```

After installing, **restart Claude Code** (in VS Code, close and reopen the Claude Code panel, or reload the window). The kit then works in **every project** you open.

---

## 3. Check that it works

1. Open any frontend project folder in VS Code.
2. In the Claude Code chat, type `/frontend-agent-kit:` and you should see `fe-ticket`, `fe-check` and `fe-bug` suggested.
3. Ask: *"List the agents from frontend-agent-kit."* You should get 10 agents (Figma Screen Builder, Design Fidelity Checker, API Integrator and so on).
4. Check Figma access: paste any Figma frame link and ask *"Describe this Figma frame."* If it can't open it, see [Troubleshooting](#8-troubleshooting).

---

## 4. Daily use

Always **open the project folder first** (the repo you're working in), then start Claude Code there. The agents read that project's `package.json`, components and theme, and match your stack automatically.

### A. New design to build: `/fe-ticket`
```
/frontend-agent-kit:fe-ticket <figma-link> [api-spec] [ticket]
```
Example:
```
/frontend-agent-kit:fe-ticket https://www.figma.com/design/AbC123/Checkout?node-id=12-345 https://api-dev.ourcompany.internal/swagger.json FE-482
```
What happens:
1. It creates a feature branch and a `TICKET.md` checklist.
2. **Figma Screen Builder** builds the screen with **our existing components and tokens**.
3. **API Integrator** adds typed API calls, validation and **mock data** (so you can work before the backend is ready), and wires loading, error and empty states.
4. ★ **You review it quickly.** It shows screenshots and asks whether the direction is right.
5. Checks run in parallel: **Figma vs website**, **API edge cases**, **security** and **accessibility**.
6. One fix pass, then **tests** (Playwright E2E and unit tests).
7. **Leftover scan**, **UI Quality Gate** and **Code Reviewer**.
8. ★ **It gives you a PR description**, including the note for the backend team and questions for the designer. **You** push and open the PR.

No API yet? Leave out the spec. You can run `/fe-ticket` again later with the spec, or just ask *"integrate these endpoints: <spec>"*.

### B. You wrote code yourself: `/fe-check`
```
/frontend-agent-kit:fe-check [figma-link]
```
Examples:
```
/frontend-agent-kit:fe-check
/frontend-agent-kit:fe-check https://www.figma.com/design/AbC123/Profile?node-id=40-12
```
It checks **only your changes** (the git diff against main) and **reports without editing anything**. When you want it to fix things:
```
/frontend-agent-kit:fe-check fix
```

### C. A bug was reported: `/fe-bug`
```
/frontend-agent-kit:fe-bug <what's wrong + steps + where>
```
Example:
```
/frontend-agent-kit:fe-bug On /orders, iPhone width (390px), the "Cancel order" button overlaps the price after the list loads. Expected: button below the price like Figma https://www.figma.com/design/AbC123/Orders?node-id=8-90
```
It **reproduces the bug in a browser** (screenshots plus console and network logs), finds the root cause, decides **frontend or backend**, writes a **test that fails**, makes the **smallest fix**, and checks the test passes. If it's a backend problem, it writes the exact note for the backend team instead of hiding it.

You can paste a screenshot of the bug into the chat as well.

---

## 5. Using one agent directly

You don't always need the full workflow. Ask for one agent by name:

| You want | Say |
|---|---|
| Build one component from Figma | *"Use the Figma Screen Builder to build this card: <figma-link>"* |
| Check a page against Figma | *"Use the Design Fidelity Checker on /settings against <figma-link> at 1440 and 390"* |
| Wire APIs only | *"Use the API Integrator for these endpoints: <spec link or pasted JSON>"* |
| Security check before release | *"Run the Frontend Security Checker on this repo"* |
| Accessibility check | *"Run the Accessibility Auditor on the signup flow"* |
| Write E2E tests | *"Use the Test Automation Engineer to add Playwright tests for checkout"* |
| Review my diff | *"Use the Code Reviewer on my current changes"* |
| Find leftover text | *"Run the ui-leftover-scan on src/"* |

---

## 6. Good inputs

- **Figma links:** copy the link to the **exact frame** (right-click the frame → Copy link), so it contains `node-id=`. Give **one frame per breakpoint** (desktop, tablet, mobile) for accurate checks.
- **API spec:** a Swagger/OpenAPI URL or file is best. A Postman collection or a doc with sample JSON also works. Ask the backend team for the spec **before** they finish the endpoints.
- **Dev environment:** tell it how to run the app (normally it finds `npm run dev` itself), and give **test account details through your local `.env` file**, never in the chat.
- **Ticket context:** the ticket ID plus the acceptance criteria give better results.

---

## 7. Updating and removing

| Task | Command |
|---|---|
| Get the latest version | `/plugin marketplace update frontend-agent-kit` |
| Remove the kit | `/plugin uninstall frontend-agent-kit@frontend-agent-kit` |
| Remove the marketplace entry | `/plugin marketplace remove frontend-agent-kit` |

Restart Claude Code after updating.

**Changing the kit (maintainers):** edit the files in `plugins/frontend-agent-kit/` (agents in `agents/`, commands in `skills/<name>/SKILL.md`), bump `version` in both `plugins/frontend-agent-kit/.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`, and open a PR to the kit repo.

---

## 8. Troubleshooting

| Problem | Fix |
|---|---|
| `/frontend-agent-kit:...` commands don't appear | Restart Claude Code. Run `/plugin` and check that the kit is **installed and enabled** |
| "Repository not found" when adding the marketplace | You don't have access to the private repo, or git isn't signed in. Ask the kit owner for access, and check that you can `git clone` it |
| The agent can't open the Figma link | Connect Figma in claude.ai → Settings → Connectors, using the account that can open that file. Make sure the link includes `node-id=` |
| It asks to install Playwright, MSW or zod | That's expected. Say yes if your team allows that package in this repo, or ask your lead first |
| Screenshots look different from Figma because of fonts | The project's web fonts must load locally. Check that the font files or URLs work in dev |
| A permission prompt appears for a command | Read it and approve it only if it's what you expect. The kit never needs admin rights |
| It stopped saying "agent budget reached" | Your personal setup has an agent limit. Finish the work in the main chat, or raise your own limit |
| Results seem generic or ignore our components | Make sure you opened the **project folder** before starting Claude Code, so the agents can read the codebase |

---

## 9. Rules

- Follow **our company's AI usage policy**. Only use the kit on code and designs we're allowed to share with Claude.
- **Never paste** API keys, tokens, passwords or real customer data into the chat, tickets or test files. Use dev or staging and test accounts, with secrets in your local `.env`.
- The kit **asks before** installing packages, pushing code or opening PRs. **Read the diff** before you approve.
- **You own what you merge.** The agents help, but the final review is yours.
