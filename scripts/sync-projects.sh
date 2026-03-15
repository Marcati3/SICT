#!/bin/bash
# Sync project .md files (briefs, configs, copywriting rules) into ~/.claude/projects/
# Only copies .md files — never touches output files, data, or other project content.
# Safe to run on any device. Source folder is auto-detected.

SOURCE=""
if [ -d "$HOME/Claude/Projects" ]; then
  SOURCE="$HOME/Claude/Projects"
elif [ -d "/c/Users/intln/Claude/Projects" ]; then
  SOURCE="/c/Users/intln/Claude/Projects"
fi

DEST="$HOME/.claude/projects"

if [ -z "$SOURCE" ]; then
  echo "[!] No local Projects folder found — skipping project sync"
  exit 0
fi

for project_dir in "$SOURCE"/*/; do
  project_name=$(basename "$project_dir")
  mkdir -p "$DEST/$project_name"

  # Copy only .md files (briefs, configs, copywriting rules)
  for md_file in "$project_dir"*.md; do
    [ -f "$md_file" ] || continue
    cp "$md_file" "$DEST/$project_name/"
  done
done

echo "[OK] Project .md files synced to ~/.claude/projects/"
