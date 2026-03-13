# Windows Porting Notes

Technical details on how the bash hooks were ported to PowerShell for Windows compatibility.

## Design Decisions

### 1. PowerShell + CMD Wrapper Architecture

**Why not pure CMD/batch?**
- CMD lacks native JSON parsing
- No easy HTTP requests without external tools
- String manipulation is painful
- Error handling is limited

**Why not pure PowerShell?**
- PowerShell execution policy can block scripts
- Some users have strict corporate policies
- CMD wrappers provide universal entry point

**Solution: Hybrid approach**
- Core logic in PowerShell (.ps1 files)
- Simple CMD wrappers (.cmd files) that bypass execution policy
- Claude Code hooks system calls the .cmd file
- CMD immediately invokes PowerShell with `-ExecutionPolicy Bypass`

### 2. JSON Parsing

**Bash version:**
```bash
QUERY=$(echo "$INPUT" | jq -r '.userPrompt // empty')
```

**PowerShell version:**
```powershell
$InputObject = $INPUT | ConvertFrom-Json
$QUERY = $InputObject.userPrompt
```

**Rationale:**
- PowerShell has built-in JSON support (no external dependencies)
- `ConvertFrom-Json` is available since PowerShell 3.0
- `ConvertTo-Json` for output formatting
- More reliable than parsing with regex

### 3. HTTP Requests

**Bash version:**
```bash
curl -s --max-time 2 "${DAEMON_URL}/health"
```

**PowerShell version:**
```powershell
Invoke-WebRequest -Uri "${DAEMON_URL}/health" -TimeoutSec 2 -UseBasicParsing
```

**Rationale:**
- `Invoke-WebRequest` is built into PowerShell
- Windows 10+ has `curl.exe`, but it's an alias that can be confusing
- `-UseBasicParsing` avoids IE dependency
- More consistent error handling with try/catch
- Better integration with PowerShell objects

### 4. Stdin Reading

**Bash version:**
```bash
INPUT=$(cat)
```

**PowerShell version:**
```powershell
$INPUT = [Console]::In.ReadToEnd()
```

**Rationale:**
- Direct .NET console access
- Reliable across all PowerShell versions
- Handles encoding properly
- Alternative: `$INPUT = @($input)`

### 5. Error Output (stderr)

**Bash version:**
```bash
echo "Error message" >&2
```

**PowerShell version:**
```powershell
Write-Error "Error message"
```

**Rationale:**
- `Write-Error` writes to stderr stream
- `Write-Host` would write to stdout (wrong!)
- Consistent with PowerShell conventions
- Preserves separation of output streams for Claude Code

### 6. Background Process Execution

**Bash version:**
```bash
nohup python3 server.py > daemon.log 2>&1 &
```

**PowerShell version:**
```powershell
$processStartInfo = New-Object System.Diagnostics.ProcessStartInfo
$processStartInfo.FileName = "python"
$processStartInfo.Arguments = "server.py"
$processStartInfo.UseShellExecute = $false
$processStartInfo.CreateNoWindow = $true
$processStartInfo.RedirectStandardOutput = $true
$processStartInfo.RedirectStandardError = $true
$process = [System.Diagnostics.Process]::Start($processStartInfo)
```

**Rationale:**
- No `nohup` equivalent in Windows
- `Start-Process -NoNewWindow` doesn't detach properly
- Direct .NET `Process` class gives full control
- Can redirect output without creating visible window
- Process survives after PowerShell exits

### 7. File System Operations

**Bash version:**
```bash
mkdir -p "$SESSION_DIR"
cp "$TRANSCRIPT_PATH" "${SESSION_DIR}/transcript.jsonl"
```

**PowerShell version:**
```powershell
New-Item -ItemType Directory -Path $SESSION_DIR -Force | Out-Null
Copy-Item $TRANSCRIPT_PATH (Join-Path $SESSION_DIR "transcript.jsonl") -Force
```

**Rationale:**
- `-Force` flag replaces `-p` (no error if exists)
- `Join-Path` handles path separators cross-platform
- PowerShell cmdlets are more verbose but clearer
- `| Out-Null` suppresses output (like `> /dev/null`)

### 8. Finding Old Files

**Bash version:**
```bash
find "$TRANSCRIPTS_DIR" -maxdepth 1 -type d -mmin +60 | wc -l
```

**PowerShell version:**
```powershell
$cutoffTime = (Get-Date).AddMinutes(-60)
$orphans = Get-ChildItem -Path $TRANSCRIPTS_DIR -Directory | Where-Object {
    $_.LastWriteTime -lt $cutoffTime
}
$orphans.Count
```

**Rationale:**
- Windows doesn't have GNU `find`
- PowerShell pipeline is more readable
- `Get-ChildItem` is the native way
- Filtering with `Where-Object` is idiomatic
- Direct property access (`.Count`, `.LastWriteTime`)

### 9. Python Script Embedding

**Bash version:**
```bash
python3 - "$SESSION_DIR" << 'CONVERT_SCRIPT'
import json
# ... script ...
CONVERT_SCRIPT
```

**PowerShell version:**
```powershell
$convertScript = @'
import json
# ... script ...
'@
$tempScript = Join-Path $env:TEMP "convert_transcript.py"
$convertScript | Out-File -FilePath $tempScript -Encoding UTF8 -Force
python $tempScript $SESSION_DIR
```

**Rationale:**
- PowerShell doesn't support heredoc to stdin cleanly
- Creating temp file is more reliable
- `@'...'@` is PowerShell's here-string (no interpolation)
- Explicit UTF-8 encoding avoids Windows encoding issues
- Temp file auto-cleans on system restart

### 10. Date Formatting

**Bash version:**
```bash
date -Iseconds  # 2026-01-29T12:34:56-08:00
```

**PowerShell version:**
```powershell
(Get-Date).ToString("yyyy-MM-ddTHH:mm:ssK")  # 2026-01-29T12:34:56-08:00
```

**Rationale:**
- PowerShell's `Get-Date` has rich formatting options
- ISO 8601 format: `"o"` or custom format string
- Timezone included with `K` specifier
- More control than Unix `date` command

## Compatibility Matrix

| Feature | Bash | PowerShell | Notes |
|---------|------|------------|-------|
| JSON parsing | `jq` (external) | `ConvertFrom-Json` (built-in) | PS more reliable |
| HTTP requests | `curl` (external) | `Invoke-WebRequest` (built-in) | Both work well |
| stdin reading | `cat` | `[Console]::In.ReadToEnd()` | PS more explicit |
| Error output | `>&2` | `Write-Error` | Functionally same |
| Background jobs | `nohup &` | `System.Diagnostics.Process` | PS more complex |
| Find files | `find` (external) | `Get-ChildItem` (built-in) | PS more verbose |
| Path joining | String concat | `Join-Path` | PS handles `\` vs `/` |
| Python script | heredoc to stdin | Temp file | PS workaround |
| Date format | `date -Iseconds` | `Get-Date -Format` | Both support ISO |
| Execution | `chmod +x` | ExecutionPolicy bypass | Different security models |

## Known Limitations

### 1. Execution Policy

Windows PowerShell has execution policies that can block scripts. Workarounds:

- **CMD wrapper** (recommended): Bypasses policy per execution
- **Set policy**: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
- **Manual bypass**: `powershell -ExecutionPolicy Bypass -File script.ps1`

### 2. Python Encoding

Windows defaults to CP1252 or system code page, not UTF-8:

```powershell
# Set before running hooks
$env:PYTHONIOENCODING = "utf-8"
```

Or in Python scripts:
```python
open(file, encoding='utf-8')  # Always specify explicitly
```

### 3. Path Separators

Windows uses backslash (`\`), but forward slash (`/`) often works:

```powershell
# For URLs, always normalize
$path -replace '\\', '/'

# For file paths, use Join-Path
Join-Path $dir $file  # Handles platform differences
```

### 4. Line Endings

Windows uses CRLF (`\r\n`), Unix uses LF (`\n`):

- PowerShell handles both transparently for text
- JSON output should use LF only (PowerShell does this automatically)
- Embedded Python scripts must handle both

### 5. Case Sensitivity

Windows file system is case-insensitive (usually):

- Hooks use exact case: `UserPromptSubmit.ps1` (not `userpromptsubmit.ps1`)
- Claude Code may require exact case for hook names
- Environment variables are case-insensitive in PowerShell

### 6. Signal Handling

Windows doesn't have Unix signals (SIGTERM, SIGHUP):

- No clean equivalent to `trap` command
- Background processes don't receive Ctrl+C
- Daemon shutdown must be explicit (HTTP endpoint or process kill)

### 7. File Locking

Windows locks open files more aggressively:

- Can't delete/move files while in use
- Transcripts may be locked during export
- Use `-Force` flag or retry logic

## Testing Strategy

### Unit Testing (per hook)

```powershell
# Test UserPromptSubmit
echo '{"userPrompt":"test query"}' | powershell UserPromptSubmit.ps1

# Test SessionStart
echo '{"sessionId":"test-123"}' | powershell SessionStart.ps1

# Test PreCompact (requires real transcript)
$testInput = @{
    sessionId = "test-session"
    transcriptPath = "C:\path\to\real\transcript.jsonl"
    cwd = "C:\project"
} | ConvertTo-Json
echo $testInput | powershell PreCompact.ps1
```

### Integration Testing (with Claude Code)

1. Install hooks: `install.ps1`
2. Start daemon: `python server.py`
3. Run Claude Code session
4. Verify:
   - Memories are recalled (check Claude's responses)
   - Transcripts exported to `~/.claude/transcripts/`
   - Daemon logs show storage activity

### Cross-Platform Testing

Test on:
- Windows 10 (PowerShell 5.1)
- Windows 11 (PowerShell 5.1 + 7+)
- Linux with PowerShell Core (verify paths work)

## Performance Considerations

### 1. PowerShell Startup Time

PowerShell has ~100-500ms startup overhead:

- Unavoidable (interpreter initialization)
- CMD wrapper adds negligible time (<10ms)
- Cached after first run in same terminal

**Impact:**
- UserPromptSubmit: Adds <500ms to each prompt (acceptable)
- SessionStart: Only runs once (not noticeable)
- PreCompact: Runs rarely (not critical)

### 2. JSON Parsing

`ConvertFrom-Json` is slower than `jq`:

- ~10-50ms for typical hook inputs (<1KB JSON)
- Negligible compared to network I/O
- No installation required (worth tradeoff)

### 3. HTTP Timeout Settings

```powershell
# Quick health check
-TimeoutSec 0.5  # 500ms

# Memory recall
-TimeoutSec 2    # 2000ms
```

Aggressive timeouts ensure hooks don't block Claude Code if daemon is slow/dead.

## Security Considerations

### 1. Execution Policy Bypass

CMD wrappers use `-ExecutionPolicy Bypass`:

- Only affects the single script execution
- Doesn't change system-wide policy
- User must still explicitly run the installer
- Alternative: User can sign scripts or set policy manually

### 2. Environment Variables

Hooks trust environment variables:

```powershell
$DAEMON_HOST = $env:CLAUDE_DAEMON_HOST  # User-controlled
```

- Malicious users could point to rogue daemon
- Acceptable: User controls their own environment
- Daemon should validate inputs (not hook's responsibility)

### 3. Temporary Files

PreCompact creates temp Python script:

```powershell
$tempScript = Join-Path $env:TEMP "convert_transcript.py"
```

- Visible to other processes
- Cleaned on reboot, not immediately
- Contains no secrets (only conversion logic)

**Improvement:** Use more unique name or clean up explicitly.

### 4. Process Execution

SessionStart can launch daemon:

```powershell
python server.py  # Executes from $DAEMON_DIR
```

- Only if `CLAUDE_DAEMON_DIR` explicitly set
- User opted in
- Could be exploited if attacker controls `DAEMON_DIR` env var

**Mitigation:** Validate path exists and contains expected files.

## Future Improvements

### 1. PowerShell Core Support

- Test on PowerShell 7+ (cross-platform)
- Use `$IsWindows` variable for platform detection
- Support Linux/macOS with same scripts

### 2. Better Error Messages

```powershell
Write-Error "⚠️ Daemon not available. Start with: cd daemon-dir && python server.py"
```

Add more context:
- Why connection failed (timeout vs refused vs DNS)
- Exactly which URL was tried
- Suggest debugging steps

### 3. Logging

Add optional debug logging:

```powershell
if ($env:CLAUDE_HOOKS_DEBUG) {
    Write-Error "[DEBUG] Querying daemon at $DAEMON_URL"
}
```

### 4. Retry Logic

For transient failures:

```powershell
for ($i = 0; $i -lt 3; $i++) {
    try {
        $response = Invoke-WebRequest ...
        break
    } catch {
        Start-Sleep -Milliseconds 100
    }
}
```

### 5. Batch Memory Storage

Instead of one curl per learning:

```bash
curl -X POST /store -d '{"type": "...", "content": "..."}'  # Slow
```

Send batch:

```json
POST /store/batch
{
  "memories": [
    {"type": "...", "content": "..."},
    {"type": "...", "content": "..."}
  ]
}
```

Requires daemon API change.

## Contributing

When porting future hooks:

1. **Follow patterns**: Use same structure as existing hooks
2. **Test thoroughly**: Windows + PowerShell versions
3. **Document quirks**: Add to "Known Limitations"
4. **Keep sync**: Update both bash and PowerShell versions
5. **Update installer**: Add new hooks to `install.ps1`

## References

- [PowerShell Documentation](https://docs.microsoft.com/powershell/)
- [Invoke-WebRequest](https://docs.microsoft.com/powershell/module/microsoft.powershell.utility/invoke-webrequest)
- [ConvertFrom-Json](https://docs.microsoft.com/powershell/module/microsoft.powershell.utility/convertfrom-json)
- [System.Diagnostics.Process](https://docs.microsoft.com/dotnet/api/system.diagnostics.process)
- [PowerShell Execution Policies](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies)
