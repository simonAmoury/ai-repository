---
name: find-skills
description: Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a skill that can...", or express interest in extending capabilities. This skill should be used when the user is looking for functionality that might exist as an installable skill.
allowed-tools: "Bash(npx skills:*), Read, Glob, Grep, AskUserQuestion"
---

# Find Skills

This skill helps you discover and install skills from the open agent skills ecosystem.

> **Vendored external skill.** Source: the `skills.sh` ecosystem docs
> (`npx skills`). Copied into this repo, not authored here. Last synced
> 2026-09-17. Upstream changes to the CLI's flags will not appear here
> automatically — re-check `npx skills --help` if a command behaves unexpectedly.

## Workflow checklist

- [ ] Step 1  Understand what the user needs (domain / task / likely to exist?)
- [ ] Step 2  Search with `npx skills find <query>`
- [ ] Step 3  Present the candidates with source and install command
- [ ] Step 4  Confirm before installing        ⚠️ REQUIRED
- [ ] Step 5  Install, then report what landed where

## When to Use This Skill

Use this skill when the user:

- Asks "how do I do X" where X might be a common task with an existing skill
- Says "find a skill for X" or "is there a skill for X"
- Asks "can you do X" where X is a specialized capability
- Expresses interest in extending agent capabilities
- Wants to search for tools, templates, or workflows
- Mentions they wish they had help with a specific domain (design, testing, deployment, etc.)

## What is the Skills CLI?

The Skills CLI (`npx skills`) is the package manager for the open agent skills ecosystem. Skills are modular packages that extend agent capabilities with specialized knowledge, workflows, and tools.

**Key commands:**

- `npx skills find [query]` - Search for skills interactively or by keyword
- `npx skills add <package>` - Install a skill from GitHub or other sources
- `npx skills check` - Check for skill updates
- `npx skills update` - Update all installed skills

**Browse skills at:** https://skills.sh/

## How to Help Users Find Skills

### Step 1: Understand What They Need

When a user asks for help with something, identify:

1. The domain (e.g., React, testing, design, deployment)
2. The specific task (e.g., writing tests, creating animations, reviewing PRs)
3. Whether this is a common enough task that a skill likely exists

### Step 2: Search for Skills

Run the find command with a relevant query:

```bash
npx skills find [query]
```

For example:

- User asks "how do I make my React app faster?" → `npx skills find react performance`
- User asks "can you help me with PR reviews?" → `npx skills find pr review`
- User asks "I need to create a changelog" → `npx skills find changelog`

The command will return results like:

```
Install with npx skills add <owner/repo@skill>

vercel-labs/agent-skills@vercel-react-best-practices
└ https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### Step 3: Present Options to the User

When you find relevant skills, present them to the user with:

1. The skill name and what it does
2. The install command they can run
3. A link to learn more at skills.sh

Example response:

```
I found a skill that might help! The "vercel-react-best-practices" skill provides
React and Next.js performance optimization guidelines from Vercel Engineering.

To install it:
npx skills add vercel-labs/agent-skills@vercel-react-best-practices

Learn more: https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices
```

### Step 4: Confirm Before Installing ⚠️ REQUIRED

Installing a skill runs third-party code from a public repo and, with `-g`, drops
it into the user's home directory where every future session loads it. Never
install without explicit consent for that specific package.

Before installing, state plainly:

1. **Package** — the full `owner/repo@skill` identifier.
2. **Source** — the repo it comes from, and whether you recognize it as a
   well-known publisher (`vercel-labs/agent-skills`, `anthropics/skills`) or an
   unfamiliar one.
3. **Scope** — user-level (`-g`, affects all projects) or this project only.

Then ask whether to proceed. If the publisher is unfamiliar, say so rather than
presenting all sources as equivalent, and offer to show the skill's `SKILL.md`
first so the user can read what it does before it is installed.

Watch for names that merely resemble a well-known skill — a near-miss on a
popular package is the standard typosquatting shape. Confirm the exact identifier
against the `skills.sh` listing rather than pattern-matching on a familiar-looking
name.

### Step 5: Install and Report

Once the user has approved that specific package:

```bash
npx skills add <owner/repo@skill> -g
```

The `-g` flag installs globally (user-level). Drop it to install into the current
project only, which is the safer default when the user only needs the skill here.

Add `-y` only when the user has already approved this exact package in Step 4 —
it suppresses the CLI's own confirmation prompt, so it must never be the thing
that makes an unreviewed install silent.

After installing, tell the user the install path and that the skill takes effect
in new sessions.

## Common Skill Categories

When searching, consider these common categories:

| Category        | Example Queries                          |
| --------------- | ---------------------------------------- |
| Web Development | react, nextjs, typescript, css, tailwind |
| Testing         | testing, jest, playwright, e2e           |
| DevOps          | deploy, docker, kubernetes, ci-cd        |
| Documentation   | docs, readme, changelog, api-docs        |
| Code Quality    | review, lint, refactor, best-practices   |
| Design          | ui, ux, design-system, accessibility     |
| Productivity    | workflow, automation, git                |

## Tips for Effective Searches

1. **Use specific keywords**: "react testing" is better than just "testing"
2. **Try alternative terms**: If "deploy" doesn't work, try "deployment" or "ci-cd"
3. **Check popular sources**: Many skills come from `vercel-labs/agent-skills` or `ComposioHQ/awesome-claude-skills`

## When No Skills Are Found

If no relevant skills exist:

1. Acknowledge that no existing skill was found
2. Offer to help with the task directly using your general capabilities
3. Suggest the user could create their own skill with `npx skills init`

Example:

```
I searched for skills related to "xyz" but didn't find any matches.
I can still help you with this task directly! Would you like me to proceed?

If this is something you do often, you could create your own skill:
npx skills init my-xyz-skill
```
