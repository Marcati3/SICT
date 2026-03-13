#
# SessionStart Hook - Initialize session and check daemon health
#
# This hook fires once when a Claude Code session begins. It:
# 1. Checks if the memory daemon is running
# 2. Optionally starts it if running locally
# 3. Warns about any orphaned transcripts from crashed sessions
#
# Install: Copy to %USERPROFILE%\.claude\hooks\SessionStart.ps1
#          Also copy SessionStart.cmd wrapper
#

$ErrorActionPreference = "Continue"

# Configuration
$DAEMON_HOST = if ($env:CLAUDE_DAEMON_HOST) { $env:CLAUDE_DAEMON_HOST } else { "127.0.0.1" }
$DAEMON_PORT = if ($env:CLAUDE_DAEMON_PORT) { $env:CLAUDE_DAEMON_PORT } else { "8741" }
$DAEMON_URL = "http://${DAEMON_HOST}:${DAEMON_PORT}"
$TRANSCRIPTS_DIR = Join-Path $env:USERPROFILE ".claude\transcripts"
$DAEMON_DIR = $env:CLAUDE_DAEMON_DIR  # Set this to auto-start daemon

# Read input from stdin
$INPUT = [Console]::In.ReadToEnd()

$SESSION_ID = "unknown"
if ($INPUT) {
    try {
        $InputObject = $INPUT | ConvertFrom-Json
        $SESSION_ID = if ($InputObject.sessionId) { $InputObject.sessionId } else { "unknown" }
    } catch {
        # Failed to parse, continue with unknown session ID
    }
}

# Check for orphaned transcripts (sessions that crashed before completing)
if (Test-Path $TRANSCRIPTS_DIR) {
    $cutoffTime = (Get-Date).AddMinutes(-60)
    $orphans = Get-ChildItem -Path $TRANSCRIPTS_DIR -Directory | Where-Object {
        $_.LastWriteTime -lt $cutoffTime
    }

    if ($orphans.Count -gt 0) {
        Write-Error "⚠️  Found $($orphans.Count) potentially orphaned transcript(s) in $TRANSCRIPTS_DIR"
        Write-Error "   These may be from crashed sessions. Review and process manually."
    }
}

# Check daemon health
$DAEMON_STATUS = "unknown"
try {
    $healthResponse = Invoke-WebRequest -Uri "${DAEMON_URL}/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    $DAEMON_STATUS = "running"
} catch {
    $DAEMON_STATUS = "not_running"

    # Try to start daemon if we're on the local machine and know where it is
    if ($DAEMON_HOST -eq "127.0.0.1" -and $DAEMON_DIR -and (Test-Path (Join-Path $DAEMON_DIR "server.py"))) {
        Write-Error "Starting memory daemon..."

        $serverPath = Join-Path $DAEMON_DIR "server.py"
        $logPath = Join-Path $DAEMON_DIR "daemon.log"

        # Start daemon in background
        $processStartInfo = New-Object System.Diagnostics.ProcessStartInfo
        $processStartInfo.FileName = "python"
        $processStartInfo.Arguments = "`"$serverPath`""
        $processStartInfo.WorkingDirectory = $DAEMON_DIR
        $processStartInfo.UseShellExecute = $false
        $processStartInfo.CreateNoWindow = $true
        $processStartInfo.RedirectStandardOutput = $true
        $processStartInfo.RedirectStandardError = $true

        try {
            $process = [System.Diagnostics.Process]::Start($processStartInfo)

            # Wait for startup
            for ($i = 1; $i -le 10; $i++) {
                Start-Sleep -Seconds 1
                try {
                    $healthResponse = Invoke-WebRequest -Uri "${DAEMON_URL}/health" -TimeoutSec 1 -UseBasicParsing -ErrorAction Stop
                    $DAEMON_STATUS = "started"
                    Write-Error "✓ Memory daemon started"
                    break
                } catch {
                    # Not ready yet
                }
            }

            if ($DAEMON_STATUS -ne "started") {
                Write-Error "⚠️  Failed to start memory daemon"
            }
        } catch {
            Write-Error "⚠️  Failed to start memory daemon: $_"
        }
    } else {
        Write-Error "⚠️  Memory daemon not running at ${DAEMON_URL}"
        Write-Error "   Start it with: cd <daemon-dir> && python server.py"
    }
}

# Output session info (optional - for logging/debugging)
# Uncomment to see session details:
# Write-Error "Session: $SESSION_ID | Daemon: $DAEMON_STATUS"
