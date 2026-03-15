#!/bin/bash
# =============================================================================
# Full project sync across all Claude interfaces:
#   1. Claude Cowork (desktop app) → Projects
#   2. CLAUDE OUTPUTS → Projects
#   3. Projects ↔ Repo (bidirectional)
#
# Run this at session start and before push. Safe to run repeatedly.
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

# ─── STEP 1: Cowork outputs → Projects ────────────────────────────────────────
if [ -f "$SCRIPTS/cowork-map.txt" ]; then
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
        dest="$LOCAL/$target"
        mkdir -p "$dest"
        cp -r -u "$session_dir/outputs/"* "$dest/" 2>/dev/null
        synced=$((synced + 1))
      fi
    done
  done
  echo "[1/3] Cowork: $synced sessions synced"
else
  echo "[1/3] Cowork: skipped (no cowork-map.txt)"
fi

# ─── STEP 2: CLAUDE OUTPUTS → Projects ────────────────────────────────────────
if [ -n "$OUTPUTS" ] && [ -d "$OUTPUTS" ]; then
  for out_dir in "$OUTPUTS"/*/; do
    [ -d "$out_dir" ] || continue
    out_name=$(basename "$out_dir")
    [ -d "$LOCAL/$out_name" ] && cp -r -u "$out_dir"* "$LOCAL/$out_name/" 2>/dev/null
  done
  echo "[2/3] CLAUDE OUTPUTS synced"
else
  echo "[2/3] CLAUDE OUTPUTS: skipped"
fi

# ─── STEP 3: Projects ↔ Repo (bidirectional) ──────────────────────────────────
for project_dir in "$LOCAL"/*/; do
  [ -d "$project_dir" ] || continue
  project_name=$(basename "$project_dir")
  mkdir -p "$REPO/$project_name"
  cp -r -u "$project_dir"* "$REPO/$project_name/" 2>/dev/null
done

for project_dir in "$REPO"/*/; do
  [ -d "$project_dir" ] || continue
  project_name=$(basename "$project_dir")
  [[ "$project_name" == C--* ]] && continue
  mkdir -p "$LOCAL/$project_name"
  cp -r -u "$project_dir"* "$LOCAL/$project_name/" 2>/dev/null
done

echo "[3/3] Projects ↔ Repo synced"
echo "[OK] All synced (Cowork + Outputs + Projects + Repo)"
