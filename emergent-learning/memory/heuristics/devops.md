# Heuristics: devops

Generated from failures, successes, and observations in the **devops** domain.

---

## H-6: Self-propagating config: put sync rules inside the synced repo so they auto-deploy to all devices

**Confidence**: 0.9
**Source**: observation
**Created**: 2026-03-14

CLAUDE.md contains git pull on startup and checkout.md contains git push on close. Since both files are in the synced repo, any device that clones it automatically gets the sync behavior.

---

