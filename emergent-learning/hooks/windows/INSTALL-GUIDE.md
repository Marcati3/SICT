# Cross-Platform Installation Guide

Complete installation instructions for semantic memory hooks on Windows, macOS, and Linux.

## Platform Detection

First, determine your platform:

```bash
# Unix-like (macOS/Linux)
uname -s

# Windows (PowerShell)
$PSVersionTable.Platform  # Or just check if you're in PowerShell
```

## Installation by Platform

### Windows

**Prerequisites:**
- PowerShell 5.1+ (built into Windows 10/11)
- Python 3.7+
- Claude Code with hooks support

**Quick Install:**

```powershell
# Navigate to hooks directory
cd ~/.claude/emergent-learning/hooks/windows

# Run installer
powershell -ExecutionPolicy Bypass -File install.ps1
```

**Manual Install:**

```powershell
# Copy hooks to Claude directory
$src = "~/.claude/emergent-learning/hooks/windows"
$dst = "~/.claude/hooks"

Copy-Item "$src/UserPromptSubmit.ps1" $dst
Copy-Item "$src/UserPromptSubmit.cmd" $dst
Copy-Item "$src/PreCompact.ps1" $dst
Copy-Item "$src/PreCompact.cmd" $dst
Copy-Item "$src/SessionStart.ps1" $dst
Copy-Item "$src/SessionStart.cmd" $dst
```

**Verify:**

```powershell
Get-ChildItem ~/.claude/hooks/*.ps1
Get-ChildItem ~/.claude/hooks/*.cmd
```

**Configuration:**

```powershell
# Optional: Add to PowerShell profile
notepad $PROFILE

# Add these lines:
$env:CLAUDE_DAEMON_HOST = "127.0.0.1"
$env:CLAUDE_DAEMON_PORT = "8741"
$env:CLAUDE_DAEMON_DIR = "C:\path\to\semantic-memory-daemon"
```

### macOS / Linux

**Prerequisites:**
- Bash 4.0+
- Python 3.7+
- `jq` command-line JSON processor
- `curl`
- Claude Code with hooks support

**Install jq (if needed):**

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Fedora/RHEL
sudo dnf install jq

# Alpine
apk add jq
```

**Quick Install:**

```bash
# Copy hooks
cp /tmp/claude-code-semantic-memory/hooks/user-prompt-submit.sh ~/.claude/hooks/UserPromptSubmit.sh
cp /tmp/claude-code-semantic-memory/hooks/pre-compact.sh ~/.claude/hooks/PreCompact.sh
cp /tmp/claude-code-semantic-memory/hooks/session-start.sh ~/.claude/hooks/SessionStart.sh

# Make executable
chmod +x ~/.claude/hooks/UserPromptSubmit.sh
chmod +x ~/.claude/hooks/PreCompact.sh
chmod +x ~/.claude/hooks/SessionStart.sh
```

**Verify:**

```bash
ls -l ~/.claude/hooks/*.sh
```

**Configuration:**

```bash
# Optional: Add to shell profile (~/.bashrc, ~/.zshrc, etc.)
export CLAUDE_DAEMON_HOST="127.0.0.1"
export CLAUDE_DAEMON_PORT="8741"
export CLAUDE_DAEMON_DIR="/path/to/semantic-memory-daemon"
```

## Starting the Daemon

### All Platforms

The semantic memory daemon is platform-agnostic (Python):

```bash
# Navigate to daemon directory
cd /path/to/semantic-memory-daemon

# Start daemon
python server.py

# Or with specific port
DAEMON_PORT=8741 python server.py
```

**Background (Unix):**

```bash
nohup python server.py > daemon.log 2>&1 &
```

**Background (Windows PowerShell):**

```powershell
Start-Process python -ArgumentList "server.py" -NoNewWindow -RedirectStandardOutput "daemon.log" -RedirectStandardError "daemon.log"
```

## Verification

### Test Daemon Connection

**Unix:**
```bash
curl http://127.0.0.1:8741/health
```

**Windows:**
```powershell
curl http://127.0.0.1:8741/health
# Or
Invoke-WebRequest http://127.0.0.1:8741/health
```

Expected output: `{"status":"ok"}`

### Test Hook Installation

**Unix:**
```bash
echo '{"userPrompt":"test"}' | ~/.claude/hooks/UserPromptSubmit.sh
```

**Windows:**
```powershell
echo '{"userPrompt":"test"}' | powershell ~/.claude/hooks/UserPromptSubmit.ps1
```

If daemon is running, should return JSON with memories (or empty if no matches).

### Test Claude Code Integration

1. Start Claude Code: `claude`
2. Type a message about something you've done before
3. If memories exist, Claude will reference them
4. Check daemon logs to confirm recall queries

## Platform-Specific Notes

### Windows-Specific

**File Locations:**
- Hooks: `%USERPROFILE%\.claude\hooks\`
- Transcripts: `%USERPROFILE%\.claude\transcripts\`
- Temp files: `%TEMP%\` or `C:\Users\<username>\AppData\Local\Temp\`

**Path Separators:**
- PowerShell accepts both `\` and `/`
- Use `Join-Path` for reliability
- Daemon URLs always use `/`

**Execution Policy:**
- May need to bypass or set: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
- CMD wrappers automatically bypass per-execution

**Python:**
- Ensure Python is in PATH: `python --version`
- Set UTF-8 encoding: `$env:PYTHONIOENCODING = "utf-8"`

### macOS-Specific

**File Locations:**
- Hooks: `~/.claude/hooks/`
- Transcripts: `~/.claude/transcripts/`

**Shell:**
- Default shell is zsh (macOS 10.15+)
- Hooks use bash (shebang: `#!/bin/bash`)
- Add config to `~/.zshrc` or `~/.bashrc`

**Dependencies:**
- Install Homebrew first: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- Then: `brew install jq python`

### Linux-Specific

**File Locations:**
- Hooks: `~/.claude/hooks/`
- Transcripts: `~/.claude/transcripts/`

**Shell:**
- Usually bash or zsh
- Hooks require bash 4.0+: `bash --version`
- Add config to `~/.bashrc` or `~/.zshrc`

**Dependencies:**
- Use system package manager (apt, dnf, pacman, etc.)
- `jq`, `curl`, `python3` are standard

## Troubleshooting

### Hook Not Firing

**All Platforms:**
1. Verify hook files exist in `~/.claude/hooks/`
2. Check file names match exactly (case-sensitive on Unix)
3. Ensure executable bit set (Unix): `chmod +x ~/.claude/hooks/*.sh`
4. Check Claude Code version supports hooks

**Windows-Specific:**
- Both `.ps1` AND `.cmd` files must be present
- Try running manually to see errors
- Check execution policy: `Get-ExecutionPolicy`

### Daemon Not Connecting

**All Platforms:**
1. Is daemon running? `curl http://127.0.0.1:8741/health`
2. Check firewall settings
3. Verify port not in use: `netstat -an | grep 8741` (Unix) or `netstat -an | findstr 8741` (Windows)
4. Check environment variables
5. Review daemon logs

### Python Errors

**All Platforms:**
1. Verify Python installed: `python --version` or `python3 --version`
2. Check Python in PATH
3. Ensure UTF-8 encoding (Windows especially)

**Windows:**
```powershell
$env:PYTHONIOENCODING = "utf-8"
```

**Unix:**
```bash
export LC_ALL=en_US.UTF-8
```

### JSON Parsing Errors

**Unix:**
- Install `jq`: Required dependency
- Test: `echo '{"test":1}' | jq .`

**Windows:**
- PowerShell has built-in JSON support
- Test: `'{"test":1}' | ConvertFrom-Json`

## Configuration Reference

### Environment Variables (All Platforms)

| Variable | Default | Description |
|----------|---------|-------------|
| `CLAUDE_DAEMON_HOST` | `127.0.0.1` | Daemon hostname or IP |
| `CLAUDE_DAEMON_PORT` | `8741` | Daemon listening port |
| `CLAUDE_DAEMON_DIR` | (none) | Path to daemon (enables auto-start) |

**Unix (bash/zsh):**
```bash
export CLAUDE_DAEMON_HOST="127.0.0.1"
export CLAUDE_DAEMON_PORT="8741"
export CLAUDE_DAEMON_DIR="/home/user/semantic-memory"
```

**Windows (PowerShell):**
```powershell
$env:CLAUDE_DAEMON_HOST = "127.0.0.1"
$env:CLAUDE_DAEMON_PORT = "8741"
$env:CLAUDE_DAEMON_DIR = "C:\Users\user\semantic-memory"
```

### Hook Files (Platform Differences)

| Hook | Unix | Windows (PowerShell) | Windows (CMD) |
|------|------|----------------------|---------------|
| UserPromptSubmit | `UserPromptSubmit.sh` | `UserPromptSubmit.ps1` | `UserPromptSubmit.cmd` |
| PreCompact | `PreCompact.sh` | `PreCompact.ps1` | `PreCompact.cmd` |
| SessionStart | `SessionStart.sh` | `SessionStart.ps1` | `SessionStart.cmd` |

**Note:** Windows requires BOTH `.ps1` and `.cmd` files. Claude Code calls the `.cmd` wrapper, which invokes PowerShell.

## Complete Installation Checklist

- [ ] Platform identified (Windows / macOS / Linux)
- [ ] Prerequisites installed (Python, jq on Unix, PowerShell on Windows)
- [ ] Hook files copied to `~/.claude/hooks/`
- [ ] Hook files made executable (Unix: `chmod +x`)
- [ ] Environment variables configured (optional)
- [ ] Daemon installed and tested
- [ ] Daemon started successfully
- [ ] Health check passes: `curl http://127.0.0.1:8741/health`
- [ ] Hook test passes (manual stdin test)
- [ ] Claude Code integration verified
- [ ] Auto-start configured (optional)

## Next Steps

After successful installation:

1. **Use Claude Code normally** - Hooks work automatically
2. **Monitor daemon logs** - See memory storage/recall in action
3. **Review exported transcripts** - Check `~/.claude/transcripts/`
4. **Customize configuration** - Adjust timeouts, ports, etc.
5. **Set up auto-start** - Configure `CLAUDE_DAEMON_DIR` for convenience

## Support

For platform-specific issues:

- **Windows**: See `README.md` and `PORTING-NOTES.md` in `hooks/windows/`
- **Unix**: Check original bash scripts and daemon documentation
- **General**: Review daemon logs and Claude Code output

For bug reports or feature requests, include:
- Platform and version
- Hook file versions
- Daemon version
- Claude Code version
- Full error messages
- Steps to reproduce

Happy coding with persistent memory across sessions!
