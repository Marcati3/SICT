#!/bin/bash
#
# Stop Hook - Capture session on clean exit
#
# This hook fires when the Claude Code session ends normally.
# Similar to PreCompact but for clean session endings.
#
# Install: ln -sf ~/.claude/emergent-learning/hooks/semantic-hooks/Stop.sh ~/.claude/hooks/Stop.sh

set -euo pipefail

# Configuration - Uses existing ELF dashboard backend on port 8888
DAEMON_HOST="${CLAUDE_DAEMON_HOST:-127.0.0.1}"
DAEMON_PORT="${CLAUDE_DAEMON_PORT:-8888}"
DAEMON_URL="http://${DAEMON_HOST}:${DAEMON_PORT}/api/semantic"
TRANSCRIPTS_DIR="${HOME}/.claude/transcripts"

# Read input from stdin
INPUT=$(cat)

# Extract session info
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
    # No transcript to capture
    exit 0
fi

# Create output directory
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)
SESSION_DIR="${TRANSCRIPTS_DIR}/${TIMESTAMP}-${SESSION_ID}"
mkdir -p "$SESSION_DIR"

# Copy raw transcript
cp "$TRANSCRIPT_PATH" "${SESSION_DIR}/transcript.jsonl"

# Convert to markdown (same as PreCompact)
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

            if entry.get('sessionId'):
                session_id = entry['sessionId']

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
    f.write(f"# Session Transcript (Clean Exit)\n\n")
    f.write(f"**Session ID**: {session_id}\n")
    f.write(f"**Project**: {project_path}\n")
    f.write(f"**Ended**: {datetime.now().isoformat()}\n")
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

print(f"Session transcript saved: {len(messages)} messages", file=sys.stderr)
CONVERT_SCRIPT

# Write metadata
cat > "${SESSION_DIR}/metadata.json" << METADATA
{
    "session_id": "${SESSION_ID}",
    "project_path": "${PROJECT_PATH}",
    "ended_at": "$(date -Iseconds)",
    "exit_type": "clean",
    "transcript_jsonl": "${SESSION_DIR}/transcript.jsonl",
    "transcript_md": "${SESSION_DIR}/transcript.md",
    "daemon_url": "${DAEMON_URL}",
    "status": "pending_extraction"
}
METADATA

# Silent output - just capture for later extraction
echo "Session transcript saved to: ${SESSION_DIR}/transcript.md" >&2
echo "Run learning extraction manually or on next session start." >&2
