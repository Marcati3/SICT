# Heuristics: git

Generated from failures, successes, and observations in the **git** domain.

---

## H-5: Use git credential.helper store + PAT for Termux GitHub auth

**Confidence**: 0.9
**Source**: observation
**Created**: 2026-03-14

GitHub password auth is disabled. Termux needs a Personal Access Token with repo scope, stored via credential.helper store for persistence.

---

