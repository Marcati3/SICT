#!/bin/bash
# =============================================================================
# Full project sync across all Claude interfaces.
# Keeps two separate trees:
#   PROJECTS  = briefs, configs, conversations (.md files, reference docs)
#   OUTPUTS   = deliverables (docx, xlsx, pptx — versioned output files)
#
# Steps:
#   1. Cowork session outputs → CLAUDE OUTPUTS (not Projects)
#   2. Projects .md files ↔ Repo (bidirectional, for cross-device sync)
#
# Safe to run on any device. Skips gracefully if folders don't exist.
# To add a new cowork session: edit cowork-map.txt with title → folder mapping.
# =============================================================================

REPO="$HOME/.claude/projects"
SCRIPTS="$HOME/.claude/scripts"
LOCAL=""
OUTPUTS=""

# Detect local paths
for try_path in "$HOME/Claude/Projects" "/c/Users/intln/Claude/Projects"; do
  [ -d "$try_path" ] && LOCAL="$try_path" && break
done

for try_path in "$HOME/Claude/CLAUDE OUTPUTS" "/c/Users/intln/Claude/CLAUDE OUTPUTS"; do
  [ -d "$try_path" ] && OUTPUTS="$try_path" && break
done

if [ -z "$LOCAL" ]; then
  echo "[!] No local Projects folder found — skipping"
  exit 0
fi

# Known cowork session directories (avoids slow find)
COWORK_DIRS=(
  "$HOME/AppData/Roaming/Claude/local-agent-mode-sessions/ef44ca93-df54-4099-be9d-0e475b40dd2c/b9e172f2-c669-4615-bc92-89ff9d76f3cc"
  "$HOME/AppData/Roaming/Claude/local-agent-mode-sessions/509e106c-81a5-4c36-a40a-f39b4b5183b8"
)

# ─── STEP 1: Cowork outputs → CLAUDE OUTPUTS ────────────────────────────────
if [ -f "$SCRIPTS/cowork-map.txt" ] && [ -n "$OUTPUTS" ]; then
  synced=0
  for cowork_dir in "${COWORK_DIRS[@]}"; do
    [ -d "$cowork_dir" ] || continue
    for json_file in "$cowork_dir"/local_*.json; do
      [ -f "$json_file" ] || continue
      session_dir="${json_file%.json}"
      [ -d "$session_dir/outputs" ] || continue

      # Get session title
      title=$(python -c "import sys,json; print(json.load(sys.stdin).get('title',''))" < "$json_file" 2>/dev/null)
      [ -z "$title" ] && continue

      # Match against cowork-map.txt
      target=""
      while IFS='|' read -r pattern folder; do
        [[ "$pattern" =~ ^[[:space:]]*# ]] && continue
        [ -z "$pattern" ] && continue
        pattern=$(echo "$pattern" | xargs)
        folder=$(echo "$folder" | xargs)
        if echo "$title" | grep -qi "$pattern"; then
          target="$folder"
          break
        fi
      done < "$SCRIPTS/cowork-map.txt"

      if [ -n "$target" ]; then
        dest="$OUTPUTS/$target"
        mkdir -p "$dest"
        # Copy only deliverable files (docx, xlsx, pptx, pdf), not audit logs
        for ext in docx xlsx pptx pdf; do
          cp -u "$session_dir/outputs/"*.$ext "$dest/" 2>/dev/null
        done
        synced=$((synced + 1))
      fi
    done
  done
  echo "[1/2] Cowork → CLAUDE OUTPUTS: $synced sessions synced"
else
  echo "[1/2] Cowork: skipped (no cowork-map.txt or no OUTPUTS folder)"
fi

# ─── STEP 2: Projects .md files ↔ Repo (bidirectional) ──────────────────────
# Local → Repo (desktop edits go to repo for pushing to phone/tablet)
for project_dir in "$LOCAL"/*/; do
  [ -d "$project_dir" ] || continue
  project_name=$(basename "$project_dir")
  mkdir -p "$REPO/$project_name"
  for md_file in "$project_dir"*.md; do
    [ -f "$md_file" ] || continue
    fname=$(basename "$md_file")
    repo_file="$REPO/$project_name/$fname"
    if [ ! -f "$repo_file" ] || [ "$md_file" -nt "$repo_file" ]; then
      cp "$md_file" "$repo_file"
    fi
  done
done

# Repo → Local (phone/tablet edits come back to desktop)
for project_dir in "$REPO"/*/; do
  [ -d "$project_dir" ] || continue
  project_name=$(basename "$project_dir")
  [[ "$project_name" == C--* ]] && continue
  mkdir -p "$LOCAL/$project_name"
  for md_file in "$project_dir"*.md; do
    [ -f "$md_file" ] || continue
    fname=$(basename "$md_file")
    local_file="$LOCAL/$project_name/$fname"
    if [ ! -f "$local_file" ] || [ "$md_file" -nt "$local_file" ]; then
      cp "$md_file" "$local_file"
    fi
  done
done

echo "[2/2] Projects .md ↔ Repo synced"
echo "[OK] All synced"
