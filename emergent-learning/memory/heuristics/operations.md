# Heuristics: operations

Generated from failures, successes, and observations in the **operations** domain.

---

## H-2: Before starting any task relating to a project under ~/Claude/Projects/, read ALL .md files in that project root FIRST. Extract output paths, design conventions, RAG logic, formatting rules. Never save outputs to Downloads — use project directory structure. This was violated 3 sessions in a row.

**Confidence**: 0.95
**Source**: observation
**Created**: 2026-03-12

Repeatedly saved SIC dashboard output to Downloads instead of Projects/SIC-Dashboards/. Repeatedly failed to read PROJECT.md which defines output structure, RAG logic, and No Orphan Reds rule.

---

## H-9: Output folder rules must live in each project CLAUDE.md, not just in memory or global config

**Confidence**: 0.95
**Source**: observation
**Created**: 2026-03-20

Memory files and global CLAUDE.md are not reliably loaded when sessions start from project directories. Project CLAUDE.md is the only file guaranteed in context. Rules only in memory got violated 4+ sessions in a row.

---

