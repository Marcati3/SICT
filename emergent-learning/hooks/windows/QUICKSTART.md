# Windows Hooks - Quick Start

Get semantic memory working on Windows in 3 steps.

## 1. Install Hooks (30 seconds)

```powershell
cd ~/.claude/emergent-learning/hooks/windows
powershell -ExecutionPolicy Bypass -File install.ps1
```

This copies all hook files to `%USERPROFILE%\.claude\hooks\`.

## 2. Start Daemon (if not running)

```powershell
cd C:\path\to\semantic-memory-daemon
python server.py
```

Keep this terminal open, or set `$env:CLAUDE_DAEMON_DIR` for auto-start.

## 3. Use Claude Code

```powershell
claude
```

That's it. The hooks are now active:

- **Every prompt**: Relevant memories are recalled and injected
- **Before compaction**: Transcript is exported and learnings are extracted
- **Session start**: Daemon health is checked

## Optional: Auto-Start Daemon

Add to your PowerShell profile (`notepad $PROFILE`):

```powershell
$env:CLAUDE_DAEMON_DIR = "C:\path\to\semantic-memory-daemon"
```

Now the SessionStart hook will launch the daemon automatically.

## Verify It's Working

### Test Memory Recall

Ask Claude: "What have I worked on recently?"

If the daemon is running and has memories, you'll see them in Claude's response.

### Check Daemon Status

```powershell
curl http://127.0.0.1:8741/health
```

Should return `{"status":"ok"}`.

### View Exported Transcripts

After a context compaction, check:

```powershell
Get-ChildItem ~/.claude/transcripts/
```

You should see directories with session IDs containing `transcript.md` files.

## Troubleshooting

**Hook not firing?**
- Check files exist: `Get-ChildItem ~/.claude/hooks/*.ps1`
- Both `.ps1` AND `.cmd` files must be present

**Daemon not connecting?**
- Is it running? `curl http://127.0.0.1:8741/health`
- Check firewall settings
- Verify environment variables: `$env:CLAUDE_DAEMON_PORT`

**Python error in PreCompact?**
- Ensure Python is in PATH: `python --version`
- Set UTF-8 encoding: `$env:PYTHONIOENCODING = "utf-8"`

**Execution policy blocked?**
- Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Or always use the `.cmd` wrappers (they bypass policy)

## What's Happening Behind the Scenes?

### On Every Prompt (UserPromptSubmit)

1. Hook receives your question via stdin
2. Queries daemon: `POST /recall` with your question
3. Daemon returns relevant memories (0.5s timeout)
4. Hook injects memories as XML into Claude's context
5. Claude sees prior learnings and answers with context

### Before Compaction (PreCompact)

1. Hook receives transcript path via stdin
2. Copies raw JSONL to `~/.claude/transcripts/<session-id>/`
3. Converts JSONL to markdown using Python
4. Writes metadata JSON
5. Outputs instructions for Claude to dispatch extraction sub-agent
6. Sub-agent reads transcript and stores learnings via daemon API

### At Session Start (SessionStart)

1. Hook checks for orphaned transcripts (>60min old)
2. Pings daemon health endpoint (2s timeout)
3. If daemon not running and `CLAUDE_DAEMON_DIR` set, starts it
4. Waits up to 10 seconds for daemon to be ready
5. Warns user if daemon unavailable

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `CLAUDE_DAEMON_HOST` | `127.0.0.1` | Daemon hostname |
| `CLAUDE_DAEMON_PORT` | `8741` | Daemon port |
| `CLAUDE_DAEMON_DIR` | (none) | Auto-start daemon from this path |

## Next Steps

- Review full documentation: `README.md`
- Customize daemon connection settings
- Set up auto-start for convenience
- Monitor daemon logs for storage activity

Happy coding with persistent memory!
