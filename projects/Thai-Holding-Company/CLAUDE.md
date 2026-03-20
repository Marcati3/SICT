# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this project.

## Project

Thai Holding Company: A personal project to establish a Thailand-based holding company offering governance, corporate, regulatory, and representation services to Western SMEs entering the Thai market. Services include IOR/EOR, PDPA local representative, Thai director/shareholder participation, product registration, trademark/IP custody, and franchise support.

## Context

- `PROJECT-BRIEF.md` — **Read this first.** Full project state, decisions made, service model architecture, compliance framework, and open items.
- `conversations/` — Original ChatGPT threads and handoff documents for deep reference.
  - `conversations/Legal/` — Full legal document suite (MSA, addenda, KYC forms, compliance tracker, service models workbook).

## Key Facts

- **Nature:** Personal project (not part of SICT or any employer)
- **Target clients:** Western SMEs entering Thailand — non-hazardous, compliant businesses
- **Service model:** Compliance-first; explicitly prohibits nominee arrangements
- **Governance:** Genuine management control, active board, substance requirements
- **Legal framework:** Thai law (FBA, CCC, PDPA, AML/KYC, Customs Act)
- **Regulatory bodies:** NBTC, TISI, DIW, PDPC, Thai Customs

## Current Priorities

1. Finalize and format legal document suite (MSA + 5 addenda) into Word/PDF
2. Build Service Models Workbook in Excel (3 sheets: Service_Models, Risk_Matrix, SOW_Linkage)
3. Finalize client risk tiers and acceptance/rejection workflow
4. Develop pricing model for each service line
5. Prepare go-to-market materials for Western SME outreach

## Output Folder Rules (MANDATORY)

**NEVER save output files to the project root.** All outputs go into the appropriate subfolder:

| Folder | What goes there |
|---|---|
| `Legal/` | MSA, addenda, KYC forms, compliance docs (Word/PDF) |
| `Workbooks/` | Service models workbook, risk matrix, SOW linkage (Excel) |
| `Compliance/` | Onboarding tracker, acceptance/rejection workflows, audit templates |
| `Go-To-Market/` | Pitch decks, one-pagers, website copy, outreach materials |
| `Governance/` | Board templates, minutes, delegation matrix, governance calendar |
| `Pricing/` | Fee structures, pricing models, escrow schedules |

**Within each folder, create a descriptive subfolder** for the workstream if needed (e.g., `Legal/MSA-v2/`, `Go-To-Market/Website/`).

Every new output folder gets a `PROJECT-BRIEF.md`.

**Never save outputs to Downloads, Desktop, or any location outside this project tree.**

## Working Style

- Read `PROJECT-BRIEF.md` for full context before acting
- This project spans legal drafting, compliance frameworks, service design, and financial modeling
- Preserve all legal terms, regulatory references, and compliance language from the brief
- When drafting legal documents, maintain formal tone and structured clause numbering
