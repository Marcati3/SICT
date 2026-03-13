#
# PreCompact Hook - Auto-export, convert, and dispatch sub-agent for extraction
#
# This hook fires when Claude Code is about to compact the context window.
# It preserves the full session by:
# 1. Exporting the raw JSONL transcript
# 2. Converting to readable markdown
# 3. Outputting instructions for Claude to dispatch a sub-agent to extract learnings
#
# The sub-agent reads the transcript, extracts learnings, and stores them
# in the semantic memory database via the daemon API.
#
# Install: Copy to %USERPROFILE%\.claude\hooks\PreCompact.ps1
#          Also copy PreCompact.cmd wrapper
#

$ErrorActionPreference = "Continue"

# Configuration
$DAEMON_HOST = if ($env:CLAUDE_DAEMON_HOST) { $env:CLAUDE_DAEMON_HOST } else { "127.0.0.1" }
$DAEMON_PORT = if ($env:CLAUDE_DAEMON_PORT) { $env:CLAUDE_DAEMON_PORT } else { "8741" }
$DAEMON_URL = "http://${DAEMON_HOST}:${DAEMON_PORT}"
$TRANSCRIPTS_DIR = Join-Path $env:USERPROFILE ".claude\transcripts"

# Read input from stdin
$INPUT = [Console]::In.ReadToEnd()

if (-not $INPUT) {
    Write-Error "No input received"
    exit 0
}

# Extract session info
try {
    $InputObject = $INPUT | ConvertFrom-Json
    $SESSION_ID = if ($InputObject.sessionId) { $InputObject.sessionId } else { "unknown" }
    $TRANSCRIPT_PATH = if ($InputObject.transcriptPath) { $InputObject.transcriptPath } else { "" }
    $PROJECT_PATH = if ($InputObject.cwd) { $InputObject.cwd } else { "" }
} catch {
    Write-Error "Failed to parse input JSON"
    exit 0
}

if (-not $TRANSCRIPT_PATH -or -not (Test-Path $TRANSCRIPT_PATH)) {
    Write-Error "No transcript found, skipping"
    exit 0
}

# Create output directory
$SESSION_DIR = Join-Path $TRANSCRIPTS_DIR $SESSION_ID
if (-not (Test-Path $SESSION_DIR)) {
    New-Item -ItemType Directory -Path $SESSION_DIR -Force | Out-Null
}

# 1. Copy raw transcript
Copy-Item $TRANSCRIPT_PATH (Join-Path $SESSION_DIR "transcript.jsonl") -Force
Write-Error "✓ Exported transcript"

# 2. Convert to markdown using Python
$convertScript = @'
import json
import sys
from pathlib import Path
from datetime import datetime

session_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
jsonl_path = session_dir / "transcript.jsonl"
md_path = session_dir / "transcript.md"

messages = []
session_id = session_dir.name
project_path = ""

with open(jsonl_path, encoding='utf-8') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            entry = json.loads(line)

            if entry.get('sessionId'):
                session_id = entry['sessionId']
            if entry.get('cwd'):
                project_path = entry['cwd']

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
with open(md_path, 'w', encoding='utf-8') as f:
    f.write(f"# Session Transcript\n\n")
    f.write(f"**Session ID**: {session_id}\n")
    f.write(f"**Project**: {project_path}\n")
    f.write(f"**Exported**: {datetime.now().isoformat()}\n\n")
    f.write("---\n\n")

    for msg in messages:
        if msg['role'] == 'user':
            f.write(f"## User\n\n{msg['content']}\n\n")
        elif msg['role'] == 'assistant':
            f.write("## Assistant\n\n")
            if msg.get('thinking'):
                f.write(f"<thinking>\n{msg['thinking']}\n</thinking>\n\n")
            if msg.get('content'):
                f.write(f"{msg['content']}\n\n")
        f.write("---\n\n")

print(f"Converted {len(messages)} messages", file=sys.stderr)
'@

# Save and run conversion script
$tempScript = Join-Path $env:TEMP "convert_transcript.py"
$convertScript | Out-File -FilePath $tempScript -Encoding UTF8 -Force

try {
    python $tempScript $SESSION_DIR 2>&1 | Write-Error
    Write-Error "✓ Converted to markdown"
} catch {
    Write-Error "⚠ Failed to convert transcript: $_"
}

# 3. Write metadata
$timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")
$metadata = @{
    session_id = $SESSION_ID
    project_path = $PROJECT_PATH
    exported_at = $timestamp
    transcript_path = Join-Path $SESSION_DIR "transcript.md"
    daemon_url = $DAEMON_URL
    status = "pending_extraction"
} | ConvertTo-Json

$metadata | Out-File -FilePath (Join-Path $SESSION_DIR "metadata.json") -Encoding UTF8 -Force
Write-Error "✓ Wrote metadata"

Write-Error ""
Write-Error "═══════════════════════════════════════════════════════════════"
Write-Error "Session transcript exported to: $(Join-Path $SESSION_DIR 'transcript.md')"
Write-Error "═══════════════════════════════════════════════════════════════"
Write-Error ""

# 4. Output context for Claude to dispatch sub-agent
$transcriptPath = (Join-Path $SESSION_DIR "transcript.md") -replace '\\', '/'
$subagentInstruction = @"

<pre-compact-extraction-required>
Session transcript has been exported and needs learning extraction.

TRANSCRIPT PATH: $transcriptPath
SESSION ID: $SESSION_ID
DAEMON URL: $DAEMON_URL

Dispatch a sub-agent using the Task tool with this prompt:

---
Read the transcript at $transcriptPath and extract learnings to store in the semantic memory database.

For each learning you find, store it by running:
curl -X POST $DAEMON_URL/store -H "Content-Type: application/json" -d '{\"type\": \"<TYPE>\", \"content\": \"<LEARNING>\", \"context\": \"<CONTEXT>\", \"confidence\": <SCORE>, \"session_source\": \"$SESSION_ID\"}'

LEARNING TYPES:
- WORKING_SOLUTION: Commands, code, or approaches that worked
- GOTCHA: Traps, counterintuitive behaviors, "watch out for this"
- PATTERN: Recurring architectural decisions or workflows
- DECISION: Explicit design choices with reasoning
- FAILURE: What didn't work and why
- PREFERENCE: User's stated preferences

RULES:
- Be specific - include actual commands, paths, error messages
- Confidence 0.95+ for explicitly confirmed, 0.85+ for strong evidence
- Skip generic programming knowledge Claude already knows
- Skip incomplete thoughts and debugging noise
- Focus on user-specific infrastructure, preferences, workflows
---

</pre-compact-extraction-required>

"@

Write-Output $subagentInstruction
