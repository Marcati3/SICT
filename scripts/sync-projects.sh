#!/bin/bash
# Bidirectional sync of project .md files (briefs, configs, copywriting rules)
# - Desktop: copies local Projects → repo, then repo → local Projects (newer wins)
# - Phone/Tablet: skips safely (no local Projects folder)
# Only syncs .md files — never touches output files, data, or generated content.

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
  project_name=$(basename "$project_dir")
  mkdir -p "$REPO/$project_name"
  for md_file in "$project_dir"*.md; do
    [ -f "$md_file" ] || continue
    fname=$(basename "$md_file")
    repo_file="$REPO/$project_name/$fname"
    # Copy if repo file doesn't exist or local is newer
    if [ ! -f "$repo_file" ] || [ "$md_file" -nt "$repo_file" ]; then
      cp "$md_file" "$repo_file"
    fi
  done
done

# Step 2: Repo → Local (phone/tablet edits come back to desktop)
for project_dir in "$REPO"/*/; do
  project_name=$(basename "$project_dir")
  # Skip non-project folders (like C--Users-intln-Claude)
  [[ "$project_name" == C--* ]] && continue
  [[ "$project_name" == US-Trip* ]] && continue
  mkdir -p "$LOCAL/$project_name"
  for md_file in "$project_dir"*.md; do
    [ -f "$md_file" ] || continue
    fname=$(basename "$md_file")
    local_file="$LOCAL/$project_name/$fname"
    # Copy if local file doesn't exist or repo is newer
    if [ ! -f "$local_file" ] || [ "$md_file" -nt "$local_file" ]; then
      cp "$md_file" "$local_file"
    fi
  done
done

echo "[OK] Project .md files synced (bidirectional)"
