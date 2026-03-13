#!/bin/bash
#
# UserPromptSubmit Hook - Injects relevant semantic memories on every prompt
#
# This hook fires mechanically on every user message. It:
# 1. Extracts the user's prompt
# 2. Queries the semantic memory daemon for relevant learnings
# 3. Injects matches as XML into Claude's context
#
# Install: ln -sf ~/.claude/emergent-learning/hooks/semantic-hooks/UserPromptSubmit.sh ~/.claude/hooks/UserPromptSubmit.sh

set -euo pipefail

# Configuration - Uses existing ELF dashboard backend on port 8888
DAEMON_HOST="${CLAUDE_DAEMON_HOST:-127.0.0.1}"
DAEMON_PORT="${CLAUDE_DAEMON_PORT:-8888}"
DAEMON_URL="http://${DAEMON_HOST}:${DAEMON_PORT}/api/semantic"
HEALTH_TIMEOUT=0.5
RECALL_TIMEOUT=2

# Read input from stdin
INPUT=$(cat)

# Extract user prompt from hookInput
QUERY=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    prompt = data.get('hookInput', {}).get('userPrompt', '')
    if prompt:
        print(prompt)
except:
    pass
" 2>/dev/null)

if [ -z "$QUERY" ]; then
    exit 0
fi

# Check daemon health (quick timeout)
if ! curl -s --max-time "$HEALTH_TIMEOUT" "${DAEMON_URL}/health" > /dev/null 2>&1; then
    # Daemon not available, continue without memory
    exit 0
fi

# Query for relevant memories
RESPONSE=$(curl -s --max-time "$RECALL_TIMEOUT" \
    -X POST "${DAEMON_URL}/recall" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "import sys, json; print(json.dumps({'query': $(echo "$QUERY" | python3 -c "import sys, json; print(json.dumps(sys.stdin.read()))")}))")" 2>/dev/null || echo '{"memories":[]}')

# Extract memories
MEMORIES=$(echo "$RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    memories = data.get('memories', [])
    if memories:
        print(json.dumps(memories))
    else:
        print('[]')
except:
    print('[]')
" 2>/dev/null)

if [ "$MEMORIES" = "[]" ]; then
    exit 0
fi

# Count memories
COUNT=$(echo "$MEMORIES" | python3 -c "import sys, json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "0")

if [ "$COUNT" -eq 0 ]; then
    exit 0
fi

# Format as XML for injection
FORMAT_SCRIPT='
import sys, json, html

try:
    memories = json.load(sys.stdin)

    print("<recalled-learnings>")
    print(f"<summary>Found {len(memories)} relevant memories from ELF semantic database</summary>")

    for m in memories:
        type_val = html.escape(m.get("type", "unknown"))
        sim = m.get("similarity", 0)
        content = html.escape(m.get("content", ""))
        context = m.get("context", "")
        confidence = m.get("confidence", 0)

        print(f"<memory type=\"{type_val}\" similarity=\"{sim:.3f}\" confidence=\"{confidence:.2f}\">")
        print(f"  <content>{content}</content>")
        if context:
            print(f"  <context>{html.escape(context)}</context>")
        print("</memory>")

    print("</recalled-learnings>")

except Exception as e:
    print(f"<!-- Error formatting memories: {e} -->", file=sys.stderr)
'

FORMATTED=$(echo "$MEMORIES" | python3 -c "$FORMAT_SCRIPT" 2>/dev/null)

if [ -z "$FORMATTED" ]; then
    exit 0
fi

# Output for Claude Code hook system
python3 -c "
import sys, json

formatted = '''$FORMATTED'''

output = {
    'hookSpecificOutput': {
        'additionalContext': formatted
    }
}

print(json.dumps(output, indent=2))
"
