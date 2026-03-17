# Heuristics: mobile

Generated from failures, successes, and observations in the **mobile** domain.

---

## H-3: Claude app Code module has full CLI/git capabilities - Termux is unnecessary if the app is installed

**Confidence**: 0.85
**Source**: observation
**Created**: 2026-03-14

The Claude Android app's Code module can clone repos, run git, and execute commands. No need for a separate terminal emulator.

---

## H-4: scipy fails to compile on ARM/Termux - skip it for ELF, only needed for optional analytics

**Confidence**: 0.95
**Source**: observation
**Created**: 2026-03-14

scipy requires native compilation on ARM which takes 20+ minutes or fails. peewee-aio, aiofiles, aiosqlite, pyyaml are sufficient for core ELF.

---

## H-7: Claude app Code module has full terminal and git - Termux not needed on phone or tablet

**Confidence**: 0.95
**Source**: observation
**Created**: 2026-03-17

The Claude Android/iOS app Code module can run git clone, git push, and access the filesystem. No need for Termux.

---

