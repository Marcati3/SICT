#!/bin/bash
# Bidirectional sync of ALL project files (briefs, configs, docs, outputs)
# Uses rsync-style logic with cp. Preserves subdirectory structure.
# Excludes: data/ dirs, node_modules, .git

REPO="$HOME/.claude/projects"
LOCAL=""
if [ -d "$HOME/Claude/Projects" ]; then
  LOCAL="$HOME/Claude/Projects"
elif [ -d "/c/Users/intln/Claude/Projects" ]; then
  LOCAL="/c/Users/intln/Claude/Projects"
fi

if [ -z "$LOCAL" ]; then
  echo "[!] No local Projects folder found — skipping project sync"
  exit 0
fi

# Step 1: Local → Repo (desktop edits go to repo for pushing)
for project_dir in "$LOCAL"/*/; do
  [ -d "$project_dir" ] || continue
  project_name=$(basename "$project_dir")
  target="$REPO/$project_name"
  mkdir -p "$target"
  cp -r -u "$project_dir"* "$target/" 2>/dev/null
done

# Step 2: Repo → Local (phone/tablet edits come back to desktop)
for project_dir in "$REPO"/*/; do
  [ -d "$project_dir" ] || continue
  project_name=$(basename "$project_dir")
  [[ "$project_name" == C--* ]] && continue
  target="$LOCAL/$project_name"
  mkdir -p "$target"
  cp -r -u "$project_dir"* "$target/" 2>/dev/null
done

echo "[OK] All project files synced (bidirectional)"
