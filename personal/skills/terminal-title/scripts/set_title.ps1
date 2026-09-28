#!/usr/bin/env pwsh
# Set terminal window title — PowerShell counterpart of set_title.sh
# Usage: powershell -File scripts/set_title.ps1 "Your Title Here"
#
# Mirrors set_title.sh exactly: directory-name prefix, optional
# CLAUDE_TITLE_PREFIX, the same ~/.claude/terminal_title handoff file, and the
# same 80-character safety cap.

param(
    [Parameter(Position = 0)]
    [string]$Title
)

# Exit silently if no title provided (fail-safe behavior)
if ([string]::IsNullOrWhiteSpace($Title)) { exit 0 }

# Validate and sanitize input
# Remove control characters (0x00-0x1F) and limit length to 80 characters
$clean = $Title -replace '[\x00-\x1F]', ''
if ($clean.Length -gt 80) { $clean = $clean.Substring(0, 80) }

# Ensure title is not empty after sanitization
if ([string]::IsNullOrWhiteSpace($clean)) { exit 0 }

# Get the current directory name (usually the repo/project name)
$dirName = Split-Path -Leaf $PWD.Path

# Build the final title with directory prefix and optional custom prefix
$prefix = $env:CLAUDE_TITLE_PREFIX
if (-not [string]::IsNullOrWhiteSpace($prefix)) {
    $prefix = $prefix -replace '[\x00-\x1F]', ''
    if ($prefix.Length -gt 20) { $prefix = $prefix.Substring(0, 20) }
}

if ([string]::IsNullOrWhiteSpace($prefix)) {
    $finalTitle = "$dirName | $clean"
} else {
    $finalTitle = "$prefix $dirName | $clean"
}

# Store the title in a file that shell hooks can read, so prompt hooks can
# preserve it. Same path and plain-UTF8 (no BOM) format as set_title.sh.
$homeDir = if ($env:HOME) { $env:HOME } else { $env:USERPROFILE }
if ($homeDir) {
    $claudeDir = Join-Path $homeDir '.claude'
    if (-not (Test-Path $claudeDir)) {
        New-Item -ItemType Directory -Path $claudeDir -Force | Out-Null
    }
    $titleFile = Join-Path $claudeDir 'terminal_title'
    $tempFile = "$titleFile.tmp.$PID"
    # Atomic write using temp file + rename
    try {
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($tempFile, "$finalTitle`n", $utf8NoBom)
        Move-Item -Path $tempFile -Destination $titleFile -Force -ErrorAction Stop
    } catch {
        if (Test-Path $tempFile) {
            Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
        }
    }
}

# Set the terminal title two ways: RawUI covers conhost and Windows Terminal,
# the OSC escape covers terminals that only honor ANSI (VS Code, WezTerm, tmux).
try { $Host.UI.RawUI.WindowTitle = $finalTitle } catch {}
[Console]::Write("$([char]27)]0;$finalTitle$([char]7)")
