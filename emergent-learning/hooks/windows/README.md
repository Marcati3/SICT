# Semantic Memory Hooks - Windows Installation

Cross-platform PowerShell versions of the semantic memory hooks for Claude Code on Windows.

## Overview

These hooks integrate Claude Code with the semantic memory daemon to provide:

1. **UserPromptSubmit** - Automatic memory recall on every user prompt
2. **PreCompact** - Auto-export and extract learnings before context compaction
3. **SessionStart** - Session initialization and daemon health checks

## Requirements

- **Windows 10/11** with PowerShell 5.1 or later
- **Python 3.7+** (for transcript conversion in PreCompact hook)
- **curl** (built into Windows 10+) or PowerShell's Invoke-WebRequest
- **Claude Code** with hooks support
- **Semantic Memory Daemon** running locally or remotely

## Installation

### Automatic Installation

```powershell
cd ~/.claude/emergent-learning/hooks/windows
powershell -ExecutionPolicy Bypass -File install.ps1
```

### Manual Installation

1. Copy all `.ps1` and `.cmd` files to `%USERPROFILE%\.claude\hooks\`:

```powershell
$SOURCE = "~/.claude/emergent-learning/hooks/windows"
$DEST = "~/.claude/hooks"

Copy-Item "$SOURCE/UserPromptSubmit.ps1" $DEST
Copy-Item "$SOURCE/UserPromptSubmit.cmd" $DEST
Copy-Item "$SOURCE/PreCompact.ps1" $DEST
Copy-Item "$SOURCE/PreCompact.cmd" $DEST
Copy-Item "$SOURCE/SessionStart.ps1" $DEST
Copy-Item "$SOURCE/SessionStart.cmd" $DEST
```

2. Verify installation:

```powershell
Get-ChildItem ~/.claude/hooks/*.ps1
Get-ChildItem ~/.claude/hooks/*.cmd
```

## Configuration

### Environment Variables

Configure the daemon connection:

```powershell
# Daemon host (default: 127.0.0.1)
$env:CLAUDE_DAEMON_HOST = "127.0.0.1"

# Daemon port (default: 8741)
$env:CLAUDE_DAEMON_PORT = "8741"

# Auto-start daemon directory (optional)
$env:CLAUDE_DAEMON_DIR = "C:\path\to\semantic-memory-daemon"
```

To make these persistent, add them to your PowerShell profile:

```powershell
notepad $PROFILE
```

Add:
```powershell
$env:CLAUDE_DAEMON_HOST = "127.0.0.1"
$env:CLAUDE_DAEMON_PORT = "8741"
$env:CLAUDE_DAEMON_DIR = "C:\Users\YourName\semantic-memory"
```

## Usage

### Starting the Daemon

Before using the hooks, start the semantic memory daemon:

```powershell
cd C:\path\to\semantic-memory-daemon
python server.py
```

Or use auto-start by setting `CLAUDE_DAEMON_DIR` (SessionStart hook will launch it).

### Using Claude Code

Simply use Claude Code normally. The hooks will:

- **On session start**: Check daemon health, optionally start it, warn about orphaned transcripts
- **On each prompt**: Query daemon for relevant memories and inject them into context
- **Before compaction**: Export transcript, convert to markdown, instruct Claude to extract learnings

## Hook Details

### UserPromptSubmit.ps1

Fires on every user message:
- Extracts user prompt from stdin JSON
- Queries daemon `/recall` endpoint with user's question
- Injects relevant memories as XML in `additionalContext`
- Gracefully fails if daemon is unavailable (0.5s timeout)

**JSON Output Format:**
```json
{
  "hookSpecificOutput": {
    "additionalContext": "<recalled-learnings>...</recalled-learnings>"
  }
}
```

### PreCompact.ps1

Fires before context window compaction:
- Exports raw JSONL transcript to `~/.claude/transcripts/<session-id>/`
- Converts JSONL to readable markdown using embedded Python script
- Writes metadata JSON with session info
- Outputs instructions for Claude to dispatch extraction sub-agent

**Output Directory Structure:**
```
%USERPROFILE%\.claude\transcripts\
  └── <session-id>\
      ├── transcript.jsonl    (raw export)
      ├── transcript.md       (human-readable)
      └── metadata.json       (session metadata)
```

### SessionStart.ps1

Fires once at session initialization:
- Checks for orphaned transcripts from crashed sessions (>60 min old)
- Pings daemon `/health` endpoint (2s timeout)
- Optionally auto-starts daemon if `CLAUDE_DAEMON_DIR` is set
- Warns user if daemon is unavailable

## Windows-Specific Limitations

### 1. Path Separators

PowerShell uses backslashes (`\`) by default. The scripts normalize paths when needed:

```powershell
$path -replace '\\', '/'  # For URLs/cross-platform output
```

### 2. Python Encoding

Windows may default to non-UTF8 encoding. The conversion script explicitly uses UTF-8:

```powershell
python -X utf8 convert.py
# Or in Python: open(..., encoding='utf-8')
```

### 3. Background Processes

Starting the daemon in background differs from Unix `nohup`:

```powershell
# Uses System.Diagnostics.Process with redirected streams
# No direct equivalent to Unix job control
```

### 4. Find Command

Windows doesn't have GNU `find`. Uses PowerShell's `Get-ChildItem` instead:

```powershell
# Unix: find $dir -type d -mmin +60
# Windows: Get-ChildItem -Directory | Where-Object { $_.LastWriteTime -lt ... }
```

### 5. curl vs Invoke-WebRequest

Windows 10+ includes `curl.exe`, but PowerShell also has `Invoke-WebRequest`. The hooks use `Invoke-WebRequest` for better PowerShell integration:

```powershell
Invoke-WebRequest -Uri $url -TimeoutSec 2 -UseBasicParsing
```

### 6. Error Output

PowerShell separates stdout and stderr differently. User-facing messages use `Write-Error` to appear in stderr (equivalent to `>&2` in bash), while hook output goes to stdout.

### 7. Execution Policy

Windows may block unsigned scripts. The CMD wrappers use `-ExecutionPolicy Bypass`:

```cmd
powershell -NoProfile -ExecutionPolicy Bypass -File script.ps1
```

## Troubleshooting

### Hook Not Firing

Check that both `.ps1` and `.cmd` files are in `~/.claude/hooks/`:

```powershell
Get-ChildItem ~/.claude/hooks/
```

### Daemon Connection Failed

Test manually:

```powershell
Invoke-WebRequest http://127.0.0.1:8741/health
```

Check firewall settings if connecting to remote daemon.

### Python Not Found

Ensure Python is in PATH:

```powershell
python --version
```

If not, add Python to system PATH or use full path in `CLAUDE_DAEMON_DIR`.

### PowerShell Execution Policy Error

Run as administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Or use the CMD wrappers which bypass policy.

### Transcript Conversion Fails

Check Python availability and encoding:

```powershell
python -c "import sys; print(sys.getdefaultencoding())"
```

Should output `utf-8`. If not, set:

```powershell
$env:PYTHONIOENCODING = "utf-8"
```

## Differences from Bash Version

| Feature | Bash | PowerShell |
|---------|------|------------|
| JSON parsing | `jq` | `ConvertFrom-Json` |
| HTTP requests | `curl` | `Invoke-WebRequest` |
| stdin reading | `cat` | `[Console]::In.ReadToEnd()` |
| Error output | `>&2` | `Write-Error` |
| Background jobs | `nohup &` | `System.Diagnostics.Process` |
| Find files | `find` | `Get-ChildItem` + `Where-Object` |
| Date formatting | `date -Iseconds` | `Get-Date -Format "o"` |

## File List

```
windows/
├── UserPromptSubmit.ps1    # Memory recall hook (PowerShell)
├── UserPromptSubmit.cmd    # CMD wrapper
├── PreCompact.ps1          # Pre-compaction export (PowerShell)
├── PreCompact.cmd          # CMD wrapper
├── SessionStart.ps1        # Session initialization (PowerShell)
├── SessionStart.cmd        # CMD wrapper
├── install.ps1             # Automated installer
└── README.md               # This file
```

## Testing

Test each hook manually:

```powershell
# UserPromptSubmit
echo '{"userPrompt":"test query"}' | powershell ~/.claude/hooks/UserPromptSubmit.ps1

# SessionStart
echo '{"sessionId":"test-123"}' | powershell ~/.claude/hooks/SessionStart.ps1

# PreCompact (requires actual transcript)
echo '{"sessionId":"test","transcriptPath":"C:\\path\\to\\transcript.jsonl","cwd":"C:\\project"}' | powershell ~/.claude/hooks/PreCompact.ps1
```

## Support

For issues specific to Windows hooks:
- Check PowerShell version: `$PSVersionTable.PSVersion`
- Review execution policy: `Get-ExecutionPolicy`
- Test daemon connectivity manually
- Check Python availability and encoding

For general semantic memory issues, refer to the main daemon documentation.

## License

Same as parent semantic memory project.
