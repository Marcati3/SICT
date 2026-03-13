#
# Windows Installation Script for Semantic Memory Hooks
#
# Usage: powershell -ExecutionPolicy Bypass -File install.ps1
#

$ErrorActionPreference = "Stop"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Semantic Memory Hooks - Windows Installation" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Determine installation paths
$CLAUDE_HOOKS_DIR = Join-Path $env:USERPROFILE ".claude\hooks"
$SCRIPT_DIR = $PSScriptRoot

Write-Host "[1/4] Checking installation directories..." -ForegroundColor Yellow

# Create hooks directory if it doesn't exist
if (-not (Test-Path $CLAUDE_HOOKS_DIR)) {
    Write-Host "  Creating $CLAUDE_HOOKS_DIR" -ForegroundColor Gray
    New-Item -ItemType Directory -Path $CLAUDE_HOOKS_DIR -Force | Out-Null
} else {
    Write-Host "  ✓ Hooks directory exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/4] Installing hook files..." -ForegroundColor Yellow

$hooks = @(
    @{Name = "UserPromptSubmit"; Description = "Memory recall on each prompt"},
    @{Name = "PreCompact"; Description = "Auto-export transcripts before compaction"},
    @{Name = "SessionStart"; Description = "Session initialization and daemon check"}
)

foreach ($hook in $hooks) {
    $psFile = "$($hook.Name).ps1"
    $cmdFile = "$($hook.Name).cmd"

    Write-Host "  Installing $($hook.Name)..." -ForegroundColor Gray
    Write-Host "    → $($hook.Description)" -ForegroundColor DarkGray

    # Copy PowerShell script
    $srcPs = Join-Path $SCRIPT_DIR $psFile
    $dstPs = Join-Path $CLAUDE_HOOKS_DIR $psFile
    Copy-Item -Path $srcPs -Destination $dstPs -Force

    # Copy CMD wrapper
    $srcCmd = Join-Path $SCRIPT_DIR $cmdFile
    $dstCmd = Join-Path $CLAUDE_HOOKS_DIR $cmdFile
    Copy-Item -Path $srcCmd -Destination $dstCmd -Force

    Write-Host "    ✓ Installed $psFile and $cmdFile" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/4] Verifying installation..." -ForegroundColor Yellow

$allInstalled = $true
foreach ($hook in $hooks) {
    $psFile = Join-Path $CLAUDE_HOOKS_DIR "$($hook.Name).ps1"
    $cmdFile = Join-Path $CLAUDE_HOOKS_DIR "$($hook.Name).cmd"

    if ((Test-Path $psFile) -and (Test-Path $cmdFile)) {
        Write-Host "  ✓ $($hook.Name) hooks installed" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $($hook.Name) hooks missing!" -ForegroundColor Red
        $allInstalled = $false
    }
}

Write-Host ""
Write-Host "[4/4] Configuration check..." -ForegroundColor Yellow

# Check for Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ Python not found in PATH" -ForegroundColor Yellow
    Write-Host "    The PreCompact hook requires Python to convert transcripts" -ForegroundColor DarkYellow
}

# Check for curl (used in sub-agent extraction)
try {
    $curlVersion = curl --version 2>&1 | Select-Object -First 1
    Write-Host "  ✓ curl found: $curlVersion" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ curl not found in PATH" -ForegroundColor Yellow
    Write-Host "    Learning extraction will need Invoke-WebRequest instead" -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
if ($allInstalled) {
    Write-Host "  Installation Complete!" -ForegroundColor Green
} else {
    Write-Host "  Installation Incomplete - check errors above" -ForegroundColor Red
}
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor White
Write-Host ""
Write-Host "  1. Start the memory daemon:" -ForegroundColor Gray
Write-Host "     cd <daemon-directory>" -ForegroundColor DarkGray
Write-Host "     python server.py" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  2. (Optional) Set environment variable to auto-start daemon:" -ForegroundColor Gray
Write-Host "     `$env:CLAUDE_DAEMON_DIR = 'C:\path\to\daemon'" -ForegroundColor DarkGray
Write-Host "     Add to PowerShell profile for persistence" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  3. Start Claude Code - hooks will activate automatically" -ForegroundColor Gray
Write-Host ""
Write-Host "Configuration:" -ForegroundColor White
Write-Host "  • Daemon URL: `$env:CLAUDE_DAEMON_HOST (default: 127.0.0.1)" -ForegroundColor Gray
Write-Host "  • Daemon Port: `$env:CLAUDE_DAEMON_PORT (default: 8741)" -ForegroundColor Gray
Write-Host "  • Auto-start: `$env:CLAUDE_DAEMON_DIR (optional)" -ForegroundColor Gray
Write-Host ""
