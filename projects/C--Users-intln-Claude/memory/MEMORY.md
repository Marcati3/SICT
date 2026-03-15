# Memory - Operational Rules

## MANDATORY SESSION STARTUP SEQUENCE (DO NOT SKIP)

Every conversation must execute these steps IN ORDER before any work:

1. **Query the building** — `python ~/.claude/emergent-learning/query/query.py --context`
2. **Report query results** — Show user relevant golden rules, heuristics, pending CEO decisions, active experiments
3. **Auto-start ELF dashboard** — Launch silently (never ask). Use: `bash ~/.claude/emergent-learning/dashboard-app/run-dashboard.sh 2>/dev/null &`
4. **Identify the project** — If task relates to a project under `~/Claude/Projects/`, read ALL `.md` files in that project root
5. **Apply project rules** — Output paths, design conventions, RAG logic, etc. come from project docs

**This sequence has been violated 3 sessions in a row. It is non-negotiable.**

## Project Startup Protocol

**Before starting ANY task in a project, read ALL `.md` files in that project's root directory — not just CLAUDE.md.**

These files contain briefs, style guides, copywriting rules, and domain context that must inform all work. This applies to every project under `~/Claude/Projects/`.

Current project `.md` files:
- **Business-SICT:** CLAUDE.md, COPYWRITING.md, MARKETING GENIUS.md, PROJECT-BRIEF.md
- **FFHA:** CLAUDE.md, PROJECT-BRIEF.md
- **Health:** CLAUDE.md, PROJECT-BRIEF.md
- **Italy-Travel:** CLAUDE.md, PROJECT-BRIEF.md
- **LinkedIn-Writing:** CLAUDE.md, COPYWRITING.md, MARKETING GENIUS.md, PROJECT-BRIEF.md
- **Personal-Finance:** CLAUDE.md, PROJECT-BRIEF.md
- **Ratchada-Reapers:** CLAUDE.md, PROJECT-BRIEF.md
- **SIC-Dashboards:** PROJECT.md
- **Thai-Holding-Company:** CLAUDE.md, PROJECT-BRIEF.md
- **Business-SICT/Ontario-Partnership:** Ontario Partnership docs (subproject)
- **Business-SICT/US-Trip-May2026:** CLAUDE.md, PROJECT-BRIEF.md (subproject)

## SIC-Dashboards Project Rules (from PROJECT.md)

- **Output directory:** `~/Claude/Projects/SIC-Dashboards/` — NEVER save outputs to Downloads
- **Subdirectory structure:** `sales/`, `cae/`, `marketing/`, `npd/`, `docs/`
- **Source data drops:** go into `{dashboard}/data/`
- **Design format:** Single-file HTML preferred (no server, no build step), Excel acceptable when requested
- **RAG Logic:** Trajectory vs Plan — Green=on track at this point in year, Amber=behind but recoverable, Red=structurally off-plan
- **No Orphan Reds:** Every amber/red KPI must answer: What's off, Why, Action (owner + timeframe)
- **Design principles:** Lean (no clutter), visually obvious (readable in 5 seconds), consistent design system

## ELF Preferences

- **Dashboard auto-start:** Always start the ELF dashboard automatically — never ask "Start Dashboard? [Y/n]". Just launch it silently.
- **ELF query report:** After querying, ALWAYS report findings to user (golden rules, heuristics, pending decisions)
- **Windows path fix:** `run-dashboard.sh` updated to detect `venv/Scripts/` (Windows) vs `venv/bin/` (Linux/macOS)

## Sync Script Rules

- `sync-projects.sh` syncs ALL files (not just .md) between `~/Claude/Projects/` and `~/.claude/projects/`
- User works across desktop (Claude Code) and tablet (Claude cowork) — always sync and push ALL files
- Ontario Partnership conversation lives in Claude desktop cowork app; outputs are synced to repo
- Cowork session data stored at `AppData/Roaming/Claude/local-agent-mode-sessions/`

## ELF Infrastructure

- ELF query module has no requirements.txt. If deps are missing, install manually:
  `python -m pip install peewee-aio aiofiles aiosqlite scipy pyyaml`
- `record-failure.sh` requires `sqlite3` CLI (not on PATH). Use `record-heuristic.py` instead.

## Repeated Violation Log

| Date | Violation | Times | Status |
|------|-----------|-------|--------|
| 2026-03-12 | Output saved to Downloads instead of project dir | 3 sessions | FIXED — path corrected, rule documented |
| 2026-03-12 | Project .md files not read before starting work | 3 sessions | FIXED — startup sequence enforced |
| 2026-03-12 | ELF dashboard prompt shown instead of auto-start | 2 sessions | FIXED — preference documented |
| 2026-03-12 | ELF query results not reported to user | 2 sessions | FIXED — report step added to sequence |
| 2026-03-12 | RAG logic and No Orphan Reds not applied | 1 session | FIXED — PROJECT.md rules cached here |
