#
# UserPromptSubmit Hook - Injects relevant memories on every prompt
#
# This hook fires mechanically on every user message. It:
# 1. Extracts the user's prompt
# 2. Queries the memory daemon for relevant learnings
# 3. Injects matches as XML into Claude's context
#
# Install: Copy to %USERPROFILE%\.claude\hooks\UserPromptSubmit.ps1
#          Also copy UserPromptSubmit.cmd wrapper
#

$ErrorActionPreference = "SilentlyContinue"

# Configuration
$DAEMON_HOST = if ($env:CLAUDE_DAEMON_HOST) { $env:CLAUDE_DAEMON_HOST } else { "127.0.0.1" }
$DAEMON_PORT = if ($env:CLAUDE_DAEMON_PORT) { $env:CLAUDE_DAEMON_PORT } else { "8741" }
$DAEMON_URL = "http://${DAEMON_HOST}:${DAEMON_PORT}"
$HEALTH_TIMEOUT = 0.5
$RECALL_TIMEOUT = 2

# Read input from stdin
$INPUT = [Console]::In.ReadToEnd()

if (-not $INPUT) {
    exit 0
}

# Extract user prompt
try {
    $InputObject = $INPUT | ConvertFrom-Json
    $QUERY = $InputObject.userPrompt

    if (-not $QUERY -or $QUERY -eq "") {
        exit 0
    }
} catch {
    exit 0
}

# Check daemon health (quick timeout)
try {
    $healthResponse = Invoke-WebRequest -Uri "${DAEMON_URL}/health" -TimeoutSec $HEALTH_TIMEOUT -UseBasicParsing -ErrorAction Stop
} catch {
    # Daemon not available, continue without memory
    exit 0
}

# Query for relevant memories
try {
    $body = @{
        query = $QUERY
    } | ConvertTo-Json -Compress

    $response = Invoke-WebRequest -Uri "${DAEMON_URL}/recall" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -TimeoutSec $RECALL_TIMEOUT `
        -UseBasicParsing `
        -ErrorAction Stop

    $RESPONSE = $response.Content | ConvertFrom-Json
} catch {
    # Failed to query, continue without memory
    exit 0
}

# Extract memories
$MEMORIES = $RESPONSE.memories
if (-not $MEMORIES -or $MEMORIES.Count -eq 0) {
    exit 0
}

# Format as XML for injection
$xml = "<recalled-learnings>`n"
foreach ($memory in $MEMORIES) {
    $type = $memory.type
    $similarity = $memory.similarity
    $content = $memory.content -replace '&', '&amp;' -replace '<', '&lt;' -replace '>', '&gt;' -replace '"', '&quot;'
    $xml += "<memory type=`"$type`" similarity=`"$similarity`">$content</memory>`n"
}
$xml += "</recalled-learnings>"

# Output for Claude Code hook system
$output = @{
    hookSpecificOutput = @{
        additionalContext = $xml
    }
} | ConvertTo-Json -Compress

Write-Output $output
