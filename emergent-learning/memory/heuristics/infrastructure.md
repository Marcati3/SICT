# Heuristics: infrastructure

Generated from failures, successes, and observations in the **infrastructure** domain.

---

## H-1: ELF query module has no requirements.txt — install deps manually: python -m pip install peewee-aio aiofiles aiosqlite scipy pyyaml

**Confidence**: 0.95
**Source**: failure
**Created**: 2026-03-11

The query system failed on every conversation start due to missing Python packages. No requirements file exists for the query module. This went unrecorded across multiple sessions, violating Golden Rule #2. Always flag and record dependency failures immediately.

---

