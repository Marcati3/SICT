#!/bin/bash
#
# PreCompact Hook - Auto-export, convert, and prepare for learning extraction
#
# This hook fires when Claude Code is about to compact the context window.
# It preserves the full session by:
# 1. Exporting the raw JSONL transcript
# 2. Converting to readable markdown
# 3. Outputting instructions for Claude to extract and store learnings
#
# Install: ln -sf ~/.claude/emergent-learning/hooks/semantic-hooks/PreCompact.sh ~/.claude/hooks/PreCompact.sh

set -euo pipefail

# Configuration - Uses existing ELF dashboard backend on port 8888
DAEMON_HOST="${CLAUDE_DAEMON_HOST:-127.0.0.1}"
DAEMON_PORT="${CLAUDE_DAEMON_PORT:-8888}"
DAEMON_URL="http://${DAEMON_HOST}:${DAEMON_PORT}/api/semantic"
TRANSCRIPTS_DIR="${HOME}/.claude/transcripts"

# Read input from stdin
INPUT=$(cat)

# Extract session info using Python
EXTRACT_SCRIPT='
import sys, json

try:
    data = json.load(sys.stdin)
    hook_input = data.get("hookInput", {})

    session_id = hook_input.get("sessionId", "unknown")
    transcript_path = hook_input.get("transcriptPath", "")
    project_path = hook_input.get("cwd", "")

    print(f"{session_id}|{transcript_path}|{project_path}")

except Exception as e:
    print("unknown||", file=sys.stderr)
'

EXTRACTED=$(echo "$INPUT" | python3 -c "$EXTRACT_SCRIPT" 2>/dev/null || echo "unknown||")
IFS='|' read -r SESSION_ID TRANSCRIPT_PATH PROJECT_PATH <<< "$EXTRACTED"

if [ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ]; then
    echo "⚠ No transcript found, skipping semantic extraction" >&2
    exit 0
fi

# Create output directory
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
SESSION_DIR="${TRANSCRIPTS_DIR}/${TIMESTAMP}-${SESSION_ID}"
mkdir -p "$SESSION_DIR"

# 1. Copy raw transcript
cp "$TRANSCRIPT_PATH" "${SESSION_DIR}/transcript.jsonl"
echo "✓ Exported transcript to ${SESSION_DIR}" >&2

# 2. Convert to markdown
python3 - "$SESSION_DIR" "$PROJECT_PATH" << 'CONVERT_SCRIPT'
import json
import sys
from pathlib import Path
from datetime import datetime

session_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
project_path = sys.argv[2] if len(sys.argv) > 2 else ""
jsonl_path = session_dir / "transcript.jsonl"
md_path = session_dir / "transcript.md"

messages = []
session_id = session_dir.name

with open(jsonl_path) as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            entry = json.loads(line)

            # Extract session metadata
            if entry.get('sessionId'):
                session_id = entry['sessionId']

            # Determine role
            role = entry.get('type') or entry.get('role')

            if role == 'user':
                content = entry.get('message', {}).get('content') or entry.get('content') or entry.get('text') or ''
                if isinstance(content, str) and content.strip():
                    messages.append({'role': 'user', 'content': content})

            elif role == 'assistant':
                assistant_content = ''
                thinking_content = ''

                content = entry.get('message', {}).get('content') or entry.get('content')

                if isinstance(content, list):
                    for block in content:
                        if block.get('type') == 'thinking':
                            thinking_content += block.get('thinking', '')
                        elif block.get('type') == 'text':
                            assistant_content += block.get('text', '')
                elif isinstance(content, str):
                    assistant_content = content

                if entry.get('thinking'):
                    thinking_content = entry['thinking']

                if thinking_content.strip() or assistant_content.strip():
                    messages.append({
                        'role': 'assistant',
                        'thinking': thinking_content.strip() or None,
                        'content': assistant_content.strip()
                    })

        except json.JSONDecodeError:
            continue

# Write markdown
with open(md_path, 'w') as f:
    f.write(f"# Session Transcript\n\n")
    f.write(f"**Session ID**: {session_id}\n")
    f.write(f"**Project**: {project_path}\n")
    f.write(f"**Exported**: {datetime.now().isoformat()}\n")
    f.write(f"**Message Count**: {len(messages)}\n\n")
    f.write("---\n\n")

    for i, msg in enumerate(messages, 1):
        if msg['role'] == 'user':
            f.write(f"## [{i}] User\n\n{msg['content']}\n\n")
        elif msg['role'] == 'assistant':
            f.write(f"## [{i}] Assistant\n\n")
            if msg.get('thinking'):
                f.write(f"<details><summary>Thinking</summary>\n\n{msg['thinking']}\n\n</details>\n\n")
            if msg.get('content'):
                f.write(f"{msg['content']}\n\n")
        f.write("---\n\n")

print(f"✓ Converted {len(messages)} messages to markdown", file=sys.stderr)
CONVERT_SCRIPT

# 3. Write metadata
cat > "${SESSION_DIR}/metadata.json" << METADATA
{
    "session_id": "${SESSION_ID}",
    "project_path": "${PROJECT_PATH}",
    "exported_at": "$(date -Iseconds)",
    "transcript_jsonl": "${SESSION_DIR}/transcript.jsonl",
    "transcript_md": "${SESSION_DIR}/transcript.md",
    "daemon_url": "${DAEMON_URL}",
    "status": "pending_extraction"
}
METADATA

echo "" >&2
echo "════════════════════════════════════════════════════════════════" >&2
echo " Session transcript exported and converted" >&2
echo "════════════════════════════════════════════════════════════════" >&2
echo " Location: ${SESSION_DIR}/transcript.md" >&2
echo " Daemon:   ${DAEMON_URL}" >&2
echo "════════════════════════════════════════════════════════════════" >&2
echo "" >&2

# 4. Output instructions for Claude to extract learnings
# This appears in Claude's context after compaction
cat << EXTRACTION_INSTRUCTIONS

<semantic-extraction-required>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CONTEXT COMPACTION - LEARNING EXTRACTION REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The conversation context has been compacted. A transcript has been
exported for learning extraction to preserve institutional knowledge.

TRANSCRIPT: ${SESSION_DIR}/transcript.md
SESSION:    ${SESSION_ID}
DAEMON:     ${DAEMON_URL}

TASK: Extract and store learnings from this session.

APPROACH:
1. Read the transcript markdown file
2. Identify significant learnings (see LEARNING TYPES below)
3. For each learning, store via semantic memory daemon:

   curl -X POST ${DAEMON_URL}/store \\
     -H "Content-Type: application/json" \\
     -d '{
       "type": "<TYPE>",
       "content": "<SPECIFIC_LEARNING>",
       "context": "<WHEN_THIS_APPLIES>",
       "confidence": <0.0-1.0>,
       "session_source": "${SESSION_ID}"
     }'

LEARNING TYPES:
- WORKING_SOLUTION: Commands, code, or approaches that worked
- GOTCHA: Traps, counterintuitive behaviors, "watch out for this"
- PATTERN: Recurring architectural decisions or workflows
- DECISION: Explicit design choices with reasoning
- FAILURE: What didn't work and why (save future debugging time)
- PREFERENCE: User's stated preferences about tools, style, workflow
- HEURISTIC: General principle learned from this interaction

QUALITY GUIDELINES:
✓ Be specific - include actual commands, paths, error messages
✓ Confidence 0.95+ for explicitly confirmed, 0.80-0.90 for strong inference
✓ Skip generic programming knowledge Claude already knows
✓ Skip incomplete thoughts and debugging noise
✓ Focus on this user's specific infrastructure, preferences, workflows
✓ Extract WHY decisions were made, not just WHAT was done

EXAMPLE:
{
  "type": "WORKING_SOLUTION",
  "content": "Use 'bun install' instead of 'npm install' for this user's projects - it's faster and their preference",
  "context": "JavaScript/TypeScript project initialization",
  "confidence": 0.95,
  "session_source": "${SESSION_ID}"
}

After storing learnings, update metadata status:
echo '{"status": "extracted", "extracted_at": "'$(date -Iseconds)'"}' > ${SESSION_DIR}/extraction-status.json

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</semantic-extraction-required>

EXTRACTION_INSTRUCTIONS
