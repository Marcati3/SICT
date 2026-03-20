# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this project.

## Project

Personal Finance — Investment portfolio management and financial strategy. Thai citizen managing a globally diversified portfolio through Interactive Brokers (IBKR).

## Context

- `PROJECT-BRIEF.md` — **Read this first.** Complete portfolio holdings, strategy framework, banking setup, and deployment rules.
- `conversations/` — Original ChatGPT threads.

## Key Facts

- **Goal:** Grow portfolio from ~$800K to $2M USD within 5 years (target ~2030)
- **Brokerage:** Interactive Brokers (IBKR), self-directed, manual order entry
- **Banking:** KBank (THB/USD), UOB Zenith (credit card)
- **Currencies:** USD and HKD only
- **Strategy:** 70% scalable growth / 30% premium monopoly leaders
- **Execution:** Staged entries (50% market, 50% GTC limit orders 5-15% below)
- **Current phase:** "Harvest and let compound" — portfolio fully deployed

## Current Priorities

1. Rebuild cash buffer to $20-30K before any new deployments
2. Monitor 3 active GTC limit orders (SMSD $1,100, TSM $255, ASML $875)
3. Dividend reinvestment into premium names nearest support
4. Evaluate Singapore offshore banking (ranked #1 for Thai citizen)

## Key Holdings

Semis (27%): NVDA, TSM, AMD, ASML | Energy (17%): CVX, RIO | Financials (19%) | Consumer/Tech (11%): SE, MELI, NVO | VTI (4%) | Cash (2%)

## Output Folder Rules (MANDATORY)

**NEVER save output files to the project root.** All outputs go into the appropriate subfolder:

| Folder | What goes there |
|---|---|
| `Portfolio-Analysis/` | Portfolio snapshots, allocation analysis, sector breakdowns |
| `Strategy/` | Deployment plans, rotation strategies, scenario analyses |
| `Banking/` | Offshore banking research, funding path docs |
| `Tax-Compliance/` | Tax planning, reporting obligations, withholding analysis |

**Within each folder, create a descriptive subfolder** for the workstream if needed (e.g., `Portfolio-Analysis/2026-Q1/`).

Every new output folder gets a `PROJECT-BRIEF.md`.

**Never save outputs to Downloads, Desktop, or any location outside this project tree.**

## Working Style

- Read `PROJECT-BRIEF.md` for full context before acting
- Preserve all position sizes, entry prices, limit order levels, and deployment rules
- Never suggest API-based tools or paid services — subscription only
