# Claude Code Configuration

## Session Startup (MANDATORY — every conversation, no exceptions)

Execute these steps IN ORDER before responding to the user:

**Step 0 — Sync config:**
```bash
cd ~/.claude && git pull --rebase origin master 2>/dev/null; cd -
bash ~/.claude/scripts/sync-projects.sh 2>/dev/null
```

**Step 1 — Query the building:**
```bash
python ~/.claude/emergent-learning/query/query.py --context
```
For domain-specific work, add `--domain [domain]`.

**Step 2 — Report findings to user:** golden rules, heuristics, pending CEO decisions, active experiments.

**Step 3 — Auto-start ELF dashboard (silently, never ask):**
```bash
bash ~/.claude/emergent-learning/dashboard-app/run-dashboard.sh 2>/dev/null &
```

**Step 4 — Read project docs:** If task relates to a project under `~/Claude/Projects/`, read ALL `.md` files in that project's root directory (CLAUDE.md, PROJECT-BRIEF.md, COPYWRITING.md, etc.). Subprojects have their own PROJECT-BRIEF.md — read those too.

**Step 5 — Apply knowledge:** Output paths, design conventions, and domain rules come from project docs. Follow them.

**Recovery:** If you realize mid-task you skipped any step — STOP, execute it now, adjust approach.

This startup sequence is enforced by hooks. Do not skip, reorder, or selectively apply it.

---

## Auto-Sync (Cross-Device)

This repo syncs automatically across Desktop (nights/weekends) and Tablet (weekdays/office):

- **SessionStart hook**: `git pull origin master --ff-only`
- **Stop hook**: `git add -A && commit && push`
- **Configured in**: `.claude/settings.json`

## Git Branching Rule

**ALWAYS commit and push directly to `master`. NEVER create feature branches.**

This is a personal config/project sync repo. All devices must stay on `master`.

- `git pull origin master` on start, `git push origin master` on checkout
- If on a different branch: `git checkout master && git merge <branch>` first
- **Only exception:** user explicitly asks for a new branch

## Package Manager

**Always use `bun`** instead of npm/yarn/node for JavaScript/TypeScript projects.

---

## The Building — Emergent Learning Framework

The building is institutional knowledge that persists across sessions. You are temporary; the building is permanent. It contains: golden rules, heuristics, failure/success records, active experiments, pending CEO decisions.

**Querying is REQUIRED every conversation — not conditional on task type, complexity, or user request.** Do not skip because "it's trivial" or "I already know." The query command is in the startup sequence above.

### Recording to the Building

- **Heuristic:** `python ~/.claude/emergent-learning/scripts/record-heuristic.py` (recommended, cross-platform)
- **Failure:** `~/.claude/emergent-learning/scripts/record-failure.sh`
- **Success:** Create file in `memory/successes/`
- **Experiment:** `~/.claude/emergent-learning/scripts/start-experiment.sh`
- **CEO Decision:** Create file in `ceo-inbox/`

Note: `record-failure.sh` and `record-heuristic.sh` require `sqlite3` CLI (not on PATH). Use the Python version.

### User Mentions of The Building

When the user says "check in", "check the building", "what does the building know", etc. — this is a reminder to query, but you should have already done so at session start.

### Checkin Hook

`/checkin` triggers a hook that reminds you to: analyze session for learnings, list potential heuristics, offer to record them. Ensures learnings are captured before session ends.

### Golden Rules

1. **Query at conversation start** — enforced by hooks
2. **Document failures immediately** — while context is fresh
3. **Extract heuristics, not just outcomes** — document the WHY
4. **Break it before shipping it** — test destructively
5. **Escalate uncertainty to CEO** — when in doubt, ask the human

---

## Multi-Agent Coordination

When spawning subagents:
1. Read: `~/.claude/skills/agent-coordination/SKILL.md`
2. Initialize: Copy templates to `.coordination/` in project root
3. For Claude Code subagents, use Basic Memory coordination:
   - `mcp__basic-memory__build_context url="coordination/*" project="[project]"`
   - `mcp__basic-memory__search_notes query="owned_by [x]" project="[project]"`

## Agent Personas

Read personality files at `~/.claude/emergent-learning/agents/` when needed:

| Agent | Role | Trigger |
|-------|------|---------|
| Researcher | Deep investigation | "We need to understand X" |
| Architect | System design | "How should we structure X" |
| Creative | Novel solutions | "We're stuck on X" |
| Skeptic | Breaking things, QA | "Is X ready?" |

## CEO Escalation

Escalate to human (create file in `ceo-inbox/`) when:
- High risk (production, data loss)
- Multiple valid approaches with significant tradeoffs
- Ethical considerations or resource commitments
- Uncertainty on important decisions

---

## Session Memory — Automatic Summarization

When you see `[SessionStart] SUMMARIZE_PREVIOUS: /path/to/session.jsonl`, spawn a background haiku agent to summarize:

```
Agent tool with:
- subagent_type: "general-purpose"
- model: "haiku"
- run_in_background: true
- prompt: "Summarize the session at [path]. Read the JSONL, extract messages.
  IMPORTANT: Include a 'Last Exchange' section with the final 3 user prompts
  and Claude responses verbatim. Write markdown summary to
  ~/.claude/emergent-learning/memory/sessions/YYYY-MM-DD-HH-MM-topic-slug.md"
```

Do NOT skip this. Session memory is how you remember previous sessions.
