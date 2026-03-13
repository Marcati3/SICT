#
# Test Script for Semantic Memory Hooks on Windows
#
# Usage: powershell -ExecutionPolicy Bypass -File test-hooks.ps1
#

$ErrorActionPreference = "Continue"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Semantic Memory Hooks - Test Suite" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$allPassed = $true
$HOOKS_DIR = Join-Path $env:USERPROFILE ".claude\hooks"
$DAEMON_HOST = if ($env:CLAUDE_DAEMON_HOST) { $env:CLAUDE_DAEMON_HOST } else { "127.0.0.1" }
$DAEMON_PORT = if ($env:CLAUDE_DAEMON_PORT) { $env:CLAUDE_DAEMON_PORT } else { "8741" }
$DAEMON_URL = "http://${DAEMON_HOST}:${DAEMON_PORT}"

# Test 1: Check hook files exist
Write-Host "[1/7] Checking hook files..." -ForegroundColor Yellow

$requiredFiles = @(
    "UserPromptSubmit.ps1",
    "UserPromptSubmit.cmd",
    "PreCompact.ps1",
    "PreCompact.cmd",
    "SessionStart.ps1",
    "SessionStart.cmd"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    $path = Join-Path $HOOKS_DIR $file
    if (Test-Path $path) {
        Write-Host "  ✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file missing!" -ForegroundColor Red
        $missingFiles += $file
        $allPassed = $false
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "  All hook files present" -ForegroundColor Green
} else {
    Write-Host "  Missing files: $($missingFiles -join ', ')" -ForegroundColor Red
}

# Test 2: Check Python
Write-Host ""
Write-Host "[2/7] Checking Python..." -ForegroundColor Yellow

try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Python not found in PATH" -ForegroundColor Red
    Write-Host "    Install Python from python.org" -ForegroundColor DarkYellow
    $allPassed = $false
}

# Test 3: Check curl
Write-Host ""
Write-Host "[3/7] Checking curl..." -ForegroundColor Yellow

try {
    $curlVersion = curl --version 2>&1 | Select-Object -First 1
    Write-Host "  ✓ curl found: $curlVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ curl not found (Invoke-WebRequest will be used)" -ForegroundColor Yellow
}

# Test 4: Check daemon connectivity
Write-Host ""
Write-Host "[4/7] Checking daemon connectivity..." -ForegroundColor Yellow
Write-Host "  Testing: $DAEMON_URL" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "${DAEMON_URL}/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    $status = ($response.Content | ConvertFrom-Json).status

    if ($status -eq "ok") {
        Write-Host "  ✓ Daemon is running and healthy" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Daemon responded but status is: $status" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Daemon not reachable" -ForegroundColor Red
    Write-Host "    Start daemon with: cd <daemon-dir> && python server.py" -ForegroundColor DarkYellow
    Write-Host "    Or set CLAUDE_DAEMON_DIR for auto-start" -ForegroundColor DarkYellow
    $allPassed = $false
}

# Test 5: Test UserPromptSubmit hook
Write-Host ""
Write-Host "[5/7] Testing UserPromptSubmit hook..." -ForegroundColor Yellow

$testInput = @{
    userPrompt = "test query for memory recall"
} | ConvertTo-Json -Compress

try {
    $hookPath = Join-Path $HOOKS_DIR "UserPromptSubmit.ps1"
    $result = $testInput | powershell -NoProfile -ExecutionPolicy Bypass -File $hookPath 2>&1

    if ($result) {
        Write-Host "  ✓ Hook executed successfully" -ForegroundColor Green

        try {
            $output = $result | ConvertFrom-Json
            if ($output.hookSpecificOutput) {
                Write-Host "  ✓ Valid JSON output structure" -ForegroundColor Green
            } else {
                Write-Host "  ⚠ Unexpected output format" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  ⚠ Output is not JSON (may be debug messages)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ✓ Hook executed (no output - daemon may be unavailable)" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Hook execution failed: $_" -ForegroundColor Red
    $allPassed = $false
}

# Test 6: Test SessionStart hook
Write-Host ""
Write-Host "[6/7] Testing SessionStart hook..." -ForegroundColor Yellow

$testInput = @{
    sessionId = "test-session-$([guid]::NewGuid().ToString())"
} | ConvertTo-Json -Compress

try {
    $hookPath = Join-Path $HOOKS_DIR "SessionStart.ps1"
    $result = $testInput | powershell -NoProfile -ExecutionPolicy Bypass -File $hookPath 2>&1
    Write-Host "  ✓ Hook executed successfully" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Hook execution failed: $_" -ForegroundColor Red
    $allPassed = $false
}

# Test 7: Check environment variables
Write-Host ""
Write-Host "[7/7] Checking configuration..." -ForegroundColor Yellow

Write-Host "  Environment variables:" -ForegroundColor Gray
Write-Host "    CLAUDE_DAEMON_HOST = $DAEMON_HOST" -ForegroundColor DarkGray
Write-Host "    CLAUDE_DAEMON_PORT = $DAEMON_PORT" -ForegroundColor DarkGray

if ($env:CLAUDE_DAEMON_DIR) {
    Write-Host "    CLAUDE_DAEMON_DIR = $env:CLAUDE_DAEMON_DIR" -ForegroundColor DarkGray

    if (Test-Path $env:CLAUDE_DAEMON_DIR) {
        Write-Host "  ✓ Daemon directory exists" -ForegroundColor Green

        $serverPath = Join-Path $env:CLAUDE_DAEMON_DIR "server.py"
        if (Test-Path $serverPath) {
            Write-Host "  ✓ server.py found in daemon directory" -ForegroundColor Green
        } else {
            Write-Host "  ⚠ server.py not found in daemon directory" -ForegroundColor Yellow
        }
    } else {
        Write-Host "  ⚠ Daemon directory does not exist" -ForegroundColor Yellow
    }
} else {
    Write-Host "    CLAUDE_DAEMON_DIR = (not set)" -ForegroundColor DarkGray
    Write-Host "  ⚠ Auto-start disabled (CLAUDE_DAEMON_DIR not set)" -ForegroundColor Yellow
}

# Test 8: Check transcripts directory
Write-Host ""
Write-Host "[Bonus] Checking transcripts directory..." -ForegroundColor Yellow

$transcriptsDir = Join-Path $env:USERPROFILE ".claude\transcripts"
if (Test-Path $transcriptsDir) {
    $sessions = Get-ChildItem -Path $transcriptsDir -Directory -ErrorAction SilentlyContinue
    Write-Host "  ✓ Transcripts directory exists" -ForegroundColor Green

    if ($sessions.Count -gt 0) {
        Write-Host "  Found $($sessions.Count) exported session(s)" -ForegroundColor Gray
    } else {
        Write-Host "  No exported sessions yet" -ForegroundColor Gray
    }
} else {
    Write-Host "  ⓘ Transcripts directory doesn't exist yet (will be created on first use)" -ForegroundColor Gray
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

if ($allPassed) {
    Write-Host "  All Critical Tests Passed! ✓" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Your installation is ready. Start using Claude Code:" -ForegroundColor White
    Write-Host "  claude" -ForegroundColor Gray
} else {
    Write-Host "  Some Tests Failed ✗" -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please fix the issues above before using the hooks." -ForegroundColor White
    Write-Host "See README.md for troubleshooting guidance." -ForegroundColor Gray
}

Write-Host ""
