#!/bin/bash
# SessionStart hook for Android tablet
# Symlinks ~/.claude dirs to /home/user/SICT so all paths in CLAUDE.md resolve correctly
# Also pulls latest from master

REPO="/home/user/SICT"

# Symlink key directories first (instant, critical)
for dir in agents commands emergent-learning hooks outputs projects scripts skills; do
  if [ -d "$REPO/$dir" ] && [ ! -L "$HOME/.claude/$dir" ]; then
    rm -rf "$HOME/.claude/$dir" 2>/dev/null
    ln -sf "$REPO/$dir" "$HOME/.claude/$dir"
  fi
done

exit 0
