---
name: terminal-title
description: Automatically updates the terminal window title to reflect the current high-level task. Use when starting a new terminal-based coding-agent session, and use when the user switches to a distinctly new high-level task (e.g. from "API Integration" to "Database Migration"). Useful when several agent terminals are open at once and their titles would otherwise be indistinguishable.
allowed-tools: "Bash(bash scripts/set_title.sh:*), Bash(powershell -File scripts/set_title.ps1:*)"
version: "1.2.0"
---

# Terminal Title

## Overview

Automatically sets descriptive terminal window titles based on the current coding task. Useful when running multiple coding-agent terminals at the same time.

## When to Use

**Always trigger this skill:**
- At the start of every new terminal-based coding-agent session (after receiving the first user prompt)
- When switching to a substantially different task (e.g., from "API Integration" to "Database Migration")

**Trigger on task switches like these:**
- Switching from frontend work to backend work
- Moving from debugging to new feature development
- Changing from one module/component to a completely different one
- Starting work on a different part of the system (e.g., from auth to payments)

**Do NOT trigger for:**
- Follow-up questions about the same task ("Can you add a comment to that function?")
- Small refinements to current work ("Make it blue instead of red")
- Debugging the same feature you just built
- Clarifications ("What did you mean by X?")
- Iterating on the same component or module
- Mid-task status updates or progress checks

## How It Works

- [ ] **Extract task summary** — analyze the user's prompt to identify the high-level task
- [ ] **Generate title** — concise and descriptive, aim for 40 characters or fewer
- [ ] **Set title** — run the script for the current platform (see *Implementation*)

No confirmation needed: setting a window title is trivially reversible, so this
happens automatically in the background.

## Title Format Guidelines

**Good titles:**
- "API Integration: Auth Flow"
- "Fix: Login Bug"
- "DB Migration: Users Table"
- "Build: Dashboard UI"
- "Refactor: Payment Module"

**Displayed as (with automatic folder prefix):**
- `my-project | API Integration: Auth Flow`
- `my-project | Fix: Login Bug`

**Bad titles:**
- Too long: "Implementing the new authentication system with OAuth2.0 support" (exceeds 40 chars)
- Too generic: "Working" or "Coding"
- Too verbose: "The user wants me to help them with..."

**Format pattern:**
```
[Action/Category]: [Specific Focus]
```

The script automatically prefixes titles with the current directory name (usually the repo name) for easy identification across multiple terminals.

Keep titles concise, actionable, and immediately recognizable.

## Common Mistakes to Avoid

**❌ Too Verbose:**
- Bad: "Working on implementing the user authentication system with JWT tokens"
- Good: "Build: JWT Auth"

**❌ Too Vague:**
- Bad: "Code stuff"
- Bad: "Working"
- Good: "Refactor: API Layer"

**❌ Including System Information:**
- Bad: "john-macbook-pro: Debug app"
- Bad: "/Users/john/project: Build feature"
- Good: "Debug: App Issues"

**❌ Using Complete Sentences:**
- Bad: "I am working on the dashboard component"
- Good: "Build: Dashboard UI"

## Implementation

Pick the script that matches the platform. Both take the title as their single
argument and behave identically.

**macOS / Linux (and any POSIX shell):**
```bash
bash scripts/set_title.sh "Your Title Here"
```

**Windows:**
```powershell
powershell -NoProfile -File scripts/set_title.ps1 "Your Title Here"
```

Use the PowerShell script on Windows. Do not route `set_title.sh` through Git
Bash or WSL there — the title it sets applies to that subshell, not to the host
terminal window, so the call appears to succeed while nothing changes.

**Example workflow:**
```bash
# User asks: "Help me debug the authentication flow in the API"
bash scripts/set_title.sh "Debug: Auth API Flow"

# User asks: "Create a React component for the user profile page"
bash scripts/set_title.sh "Build: User Profile UI"

# Same thing on Windows
powershell -NoProfile -File scripts/set_title.ps1 "Test: Payment Module"
```

## Script Details

Both scripts accept a single argument (the title string) and exit silently if no
title is provided (fail-safe behavior).

`scripts/set_title.sh` uses ANSI escape sequences. Compatible with:
- macOS Terminal
- iTerm2
- Alacritty
- Most modern terminal emulators (xterm, rxvt, screen, tmux)

`scripts/set_title.ps1` sets `$Host.UI.RawUI.WindowTitle` *and* emits the same
ANSI sequence, so it covers both conhost / Windows Terminal and ANSI-only hosts
such as the VS Code integrated terminal and WezTerm.

**Two different length numbers, on purpose:** the 40-character guidance under
*Title Format Guidelines* is the authoring target — it keeps titles readable in a
narrow tab. The scripts independently truncate at 80 characters, which is a
safety cap against pathological input, not a license to write 80-character
titles. Aim for 40; the cap should never engage.

## Automatic Directory Prefix

Both scripts automatically prefix all titles with the current directory name (usually the repo/project name). This makes it easy to identify which project each terminal is working on:

```
my-project | Build: Dashboard UI
another-repo | Debug: Auth API
```

## Optional Custom Prefix

Users can optionally add an additional custom prefix by setting the `CLAUDE_TITLE_PREFIX` environment variable:

```bash
export CLAUDE_TITLE_PREFIX="🤖"
```

This produces titles like: `🤖 my-project | Build: Dashboard UI`

**Note:** You don't need to check for these variables or modify your behavior. The script handles this automatically.
