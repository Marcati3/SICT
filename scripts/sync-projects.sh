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

# ─── STEP 2: Projects files ↔ Repo (bidirectional, recursive) ────────────────
# Syncs ALL project-relevant file types across all projects (not just SICT):
#   Documents:  .md .html .txt .csv .json
#   Microsoft:  .docx .xlsx .pptx .doc .xls .ppt
#   PDF:        .pdf
#   Graphics:   .png .jpg .jpeg .gif .svg .webp .ico .bmp
#   Social:     .mp4 .mov .mp3 .wav
SYNC_EXTENSIONS="-name *.md -o -name *.html -o -name *.txt -o -name *.csv -o -name *.json \
  -o -name *.docx -o -name *.xlsx -o -name *.pptx -o -name *.doc -o -name *.xls -o -name *.ppt \
  -o -name *.pdf \
  -o -name *.png -o -name *.jpg -o -name *.jpeg -o -name *.gif -o -name *.svg -o -name *.webp -o -name *.ico -o -name *.bmp \
  -o -name *.mp4 -o -name *.mov -o -name *.mp3 -o -name *.wav"

# Local → Repo (desktop edits go to repo for pushing to phone/tablet)
while IFS= read -r -d '' src_file; do
  rel_path="${src_file#$LOCAL/}"
  repo_file="$REPO/$rel_path"
  mkdir -p "$(dirname "$repo_file")"
  if [ ! -f "$repo_file" ] || [ "$src_file" -nt "$repo_file" ]; then
    cp "$src_file" "$repo_file"
  fi
done < <(eval "find \"$LOCAL\" \( $SYNC_EXTENSIONS \) -not -path '*/node_modules/*' -not -path '*/data/*' -print0" 2>/dev/null)

# Repo → Local (phone/tablet edits come back to desktop)
while IFS= read -r -d '' src_file; do
  rel_path="${src_file#$REPO/}"
  # Skip Claude Code internal project dirs
  [[ "$rel_path" == C--* ]] && continue
  local_file="$LOCAL/$rel_path"
  mkdir -p "$(dirname "$local_file")"
  if [ ! -f "$local_file" ] || [ "$src_file" -nt "$local_file" ]; then
    cp "$src_file" "$local_file"
  fi
done < <(eval "find \"$REPO\" \( $SYNC_EXTENSIONS \) -not -path '*/node_modules/*' -not -path '*/data/*' -print0" 2>/dev/null)

# ─── STEP 2.5: Fix misplaced output folders in repo ──────────────────────────
# Cowork/Claude app sometimes creates folders at outputs/ root instead of the
# correct Business-SICT/... path. Use cowork-map.txt to detect and fix.
REPO_OUTPUTS="$HOME/.claude/outputs"
if [ -f "$SCRIPTS/cowork-map.txt" ] && [ -d "$REPO_OUTPUTS" ]; then
  while IFS='|' read -r pattern folder; do
    [[ "$pattern" =~ ^[[:space:]]*# ]] && continue
    [ -z "$pattern" ] && continue
    folder=$(echo "$folder" | xargs)
    # Extract the last segment as potential misplaced folder name
    leaf=$(basename "$folder")
    misplaced="$REPO_OUTPUTS/$leaf"
    correct="$REPO_OUTPUTS/$folder"
    if [ -d "$misplaced" ] && [ "$misplaced" != "$correct" ]; then
      mkdir -p "$correct"
      for f in "$misplaced"/*; do
        [ -f "$f" ] || continue
        fname=$(basename "$f")
        if [ ! -f "$correct/$fname" ]; then
          mv "$f" "$correct/"
          echo "  [fix] Moved $leaf/$fname → $folder/"
        fi
      done
      # Remove if empty
      rmdir "$misplaced" 2>/dev/null
    fi
  done < "$SCRIPTS/cowork-map.txt"
fi

# ─── STEP 3: Output files ↔ Repo (bidirectional, all deliverable types) ─────
REPO_OUTPUTS="$HOME/.claude/outputs"
mkdir -p "$REPO_OUTPUTS"

if [ -n "$OUTPUTS" ]; then
  # Local → Repo (desktop outputs go to repo)
  while IFS= read -r -d '' out_file; do
    rel_path="${out_file#$OUTPUTS/}"
    repo_file="$REPO_OUTPUTS/$rel_path"
    mkdir -p "$(dirname "$repo_file")"
    if [ ! -f "$repo_file" ] || [ "$out_file" -nt "$repo_file" ]; then
      cp "$out_file" "$repo_file"
    fi
  done < <(eval "find \"$OUTPUTS\" \( $SYNC_EXTENSIONS \) -not -path '*/node_modules/*' -print0" 2>/dev/null)

  # Repo → Local (phone/tablet outputs come back to desktop)
  while IFS= read -r -d '' out_file; do
    rel_path="${out_file#$REPO_OUTPUTS/}"
    local_file="$OUTPUTS/$rel_path"
    mkdir -p "$(dirname "$local_file")"
    if [ ! -f "$local_file" ] || [ "$out_file" -nt "$local_file" ]; then
      cp "$out_file" "$local_file"
    fi
  done < <(eval "find \"$REPO_OUTPUTS\" \( $SYNC_EXTENSIONS \) -not -path '*/node_modules/*' -print0" 2>/dev/null)

  echo "[3/3] Outputs ↔ Repo synced"
else
  echo "[3/3] Outputs: skipped (no local OUTPUTS folder)"
fi

echo "[2/2] Projects .md ↔ Repo synced"
echo "[OK] All synced"
