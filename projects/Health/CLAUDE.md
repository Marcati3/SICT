# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this project.

## Project

Health — Personal medical and health management tracking. Pharmaceutical weight loss, HGH optimization, CPAP/sleep apnea management, blood work monitoring.

## Context

- `PROJECT-BRIEF.md` — **Read this first.** Complete medical history, medications, dosages, lab results, and protocols.
- `conversations/` — Original ChatGPT thread (Jul 2025 – Feb 2026).

## Key Facts

- **Profile:** 59-year-old male (DOB: Feb 7, 1967), 177 cm, 74 kg, BMI ~23.6, active (ice hockey 1-2x/week)
- **Current meds:** Mounjaro 2.5 mg weekly, HGH 2.0 IU daily, supplement stack
- **CPAP:** ResMed AirFit N30i, APAP 6-15 cmH2O, EPR 3, humidity 3
- **Diet:** Intermittent fasting 16:8, protein target ~130-135 g/day
- **Goals:** Body fat optimization, anti-aging

## Current Priorities (High)

1. **Hematuria follow-up** — persistent blood in urine (trace Sep → 3+ Dec), needs repeat urinalysis + possible ultrasound
2. **IGF-1 recheck** — reduced HGH from 2.31 to 2.0 IU, need retest (target 250-300 ng/mL)
3. **Mounjaro dose** — stable at 2.5 mg, decision pending on retry of 5 mg
4. **CPAP leak resolution** — new nasal pillow cushion ordered Dec 2025

## Output Folder Rules (MANDATORY)

**NEVER save output files to the project root.** All outputs go into the appropriate subfolder:

| Folder | What goes there |
|---|---|
| `Lab-Results/` | Blood work summaries, lab tracking spreadsheets |
| `CPAP/` | Sleep data exports, CPAP setting logs, mask notes |
| `Medications/` | Dosing histories, titration logs, side effect tracking |
| `Protocols/` | Diet plans, supplement stacks, exercise protocols |

**Within each folder, create a descriptive subfolder** for the workstream if needed (e.g., `Lab-Results/2026-Q1/`).

Every new output folder gets a `PROJECT-BRIEF.md`.

**Never save outputs to Downloads, Desktop, or any location outside this project tree.**

## Working Style

- Read `PROJECT-BRIEF.md` for full context before acting
- Preserve ALL medical specifics — medications, dosages, lab values, dates
- This is health-critical continuity data; never summarize away dosing details or lab numbers
