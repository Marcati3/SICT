# Memory Index

## Project Docs Rule

Before starting ANY task in a project, read ALL `.md` files in that project's root directory — not just CLAUDE.md. These contain briefs, style guides, copywriting rules, and domain context. Subprojects (nested folders with their own PROJECT-BRIEF.md) get the same treatment.

## Output Path Rules

- **Business-SICT:** Outputs go into **department subfolders** (IT/, Marketing/, HR/, Sales/, Competitive-Intel/, Opportunities/), never the project root. Match output to the responsible team. Create a descriptive subfolder for the workstream (e.g., `IT/SEO-Audit/`). Every new output folder gets a `PROJECT-BRIEF.md`.
- **SIC-Dashboards:** Outputs go into `~/Claude/Projects/Business-SICT/SIC-Dashboards/{department}/` — never Downloads. Rules are in that folder's `PROJECT.md`.
- **All projects:** Never save outputs to Downloads. Always use the project directory.

## Sync Rules

- `sync-projects.sh` syncs ALL files from: Cowork (desktop app) → CLAUDE OUTPUTS → Projects ↔ Repo
- User works desktop (Claude Code + Cowork) at night/weekends, tablet during the day
- When user says "sync", "push", or "repo": run sync script + git commit + git push
- New cowork sessions: add mapping to `~/.claude/scripts/cowork-map.txt`
- Cowork session data: `AppData/Roaming/Claude/local-agent-mode-sessions/`
- At END of every session: auto-sync + push so tablet has latest

## Context Management

- **Warn before compaction:** When a conversation is getting long and approaching context limits, proactively warn the user: "We're approaching the context limit. Want to wrap up here and continue in a new session?" Let them decide rather than being surprised.

## ELF Infrastructure Notes

- ELF query module has no requirements.txt. If deps missing: `python -m pip install peewee-aio aiofiles aiosqlite scipy pyyaml`
- Use `record-heuristic.py` (Python) instead of `.sh` versions — `sqlite3` CLI is not on PATH on Windows
- `run-dashboard.sh` detects `venv/Scripts/` (Windows) vs `venv/bin/` (Linux/macOS) automatically

## Feedback Memories

- [SICT Output Folder Convention](feedback_sict_folder_convention.md) — Department subfolder rule details
- [Warn Before Context Compaction](feedback_context_compaction_warning.md) — Exact warning phrasing
