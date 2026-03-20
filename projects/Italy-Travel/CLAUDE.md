# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this project.

## Project

Italy Travel — Trip planning, itineraries, and destination research for Italy trips. Two trips covered: 2023 research itinerary (Rome to Sicily) and 2025 wine-focused Tuscany/Veneto trip.

## Context

- `PROJECT-BRIEF.md` — **Read this first.** Full itineraries, confirmed bookings, winery schedule, hotel status, and open items.
- `conversations/` — Original ChatGPT threads (7 files across Planning and Destinations).

## Key Facts (2025 Trip)

- **Dates:** Sep 28 – Oct 14, 2025 (17 days), 2 travelers from Bangkok
- **Route:** Rome (FCO) → Montepulciano → Siena → Montalcino → Chianti → Donoratico/Bolgheri → Florence → Verona → Venice (VCE)
- **Theme:** Premium wineries (1/day weekdays only, none on weekends)
- **Car:** Avis FCO pickup, Florence drop-off
- **Train:** Florence→Verona (~1h32), Verona→Venice (~1h)
- **Budget:** Under 150 EUR/night for hotels

## Current Priorities

1. Book Montalcino hotel (Oct 2-3)
2. Book Chianti hotel (Oct 4-6, Castellina area)
3. Book Donoratico hotel (Oct 7)
4. Resolve Valdicava replacement winery for Oct 2
5. Confirm remaining winery appointments
6. Finalize Verona→Venice transfer timing

## Output Folder Rules (MANDATORY)

**NEVER save output files to the project root.** All outputs go into the appropriate subfolder:

| Folder | What goes there |
|---|---|
| `Itineraries/` | Day-by-day itineraries, route plans, schedule docs |
| `Bookings/` | Hotel confirmations, winery appointments, restaurant reservations |
| `Research/` | Destination research, restaurant lists, transport options |

**Within each folder, create a descriptive subfolder** for the workstream if needed (e.g., `Bookings/Hotels/`, `Research/Wineries/`).

Every new output folder gets a `PROJECT-BRIEF.md`.

**Never save outputs to Downloads, Desktop, or any location outside this project tree.**

## Working Style

- Read `PROJECT-BRIEF.md` for full context before acting
- Preserve all confirmed bookings, winery appointments with times, hotel names, and restaurant reservations
- Forward-only route — no backtracking
