# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this project.

## Project

Ratchada Reapers — Thailand ice hockey team branding, graphics, and merchandise. This is a creative/design project, not a codebase.

## Context

- `PROJECT-BRIEF.md` — **Read this first.** Full project state: branding decisions, logo specs, file inventory, merchandise plans, fight song, open items.
- `conversations/` — Original ChatGPT threads for deep reference if the brief doesn't cover something.

## Key Facts

- **Team:** Ratchada Reapers (Bangkok, Thailand)
- **Colors:** Black, deep crimson red, white/off-white, ice blue accent
- **Logo:** Grim reaper in hooded robe wielding hockey stick as scythe
- **Sponsor:** Buddy's Bar & Grill
- **Captain:** Messier | **Assistant Captain:** August
- **Rivals:** Beavers, Devils, Wolves

## Current Priority

1. True vector logo (SVG/AI with clean paths — not the current raster-embedded SVG wrapper)
2. Embroidery-optimized variant
3. One-color and two-color logo variants
4. Sponsor lockup with Buddy's Bar & Grill

## Output Folder Rules (MANDATORY)

**NEVER save output files to the project root.** All outputs go into the appropriate subfolder:

| Folder | What goes there |
|---|---|
| `Logo/` | Logo files — all formats (PNG, SVG, AI, PDF), all variants (full color, one-color, two-color, embroidery) |
| `Merch/` | Merchandise layouts, t-shirt designs, print-ready files |
| `Branding/` | Color specs, Pantone references, typography, sponsor lockups |
| `Music/` | Fight song files, audio prompts, lyrics |

**Within each folder, create a descriptive subfolder** for the workstream if needed (e.g., `Logo/Variants/`, `Merch/T-Shirts/`).

Every new output folder gets a `PROJECT-BRIEF.md`.

**Never save outputs to Downloads, Desktop, or any location outside this project tree.**

## Working Style

This project is design-driven. When continuing work:
- Read `PROJECT-BRIEF.md` for full context before acting
- Preserve all existing design decisions (colors, typography, composition)
- Reference the DPI/format tables in the brief for any new file output
- Check the Open Items section for what's next
