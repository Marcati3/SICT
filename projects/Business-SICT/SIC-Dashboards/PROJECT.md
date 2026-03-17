# SIC Executive Dashboards

**Owner:** Marc (CCO), Silicon Craft Technology
**Started:** March 2026
**Goal:** Unified C-suite KPI visibility across Sales, CAE, and Marketing

---

## Project Structure

```
sic-dashboards/
├── PROJECT.md              ← This file
├── sales/                  ← Sales KPI Dashboard
│   ├── PROJECT-BRIEF.md
│   ├── Sales_KPI_Dashboard_FY2026_v10.html   (current)
│   ├── data/               ← Source Excel/CSV drops
│   └── archive/            ← Previous versions
├── cae/                    ← CAE Pipeline & CRM Dashboard
│   ├── PROJECT-BRIEF.md
│   ├── CAE_Pipeline_Dashboard_FY2026_v2.4.html   (current)
│   ├── build_dashboard.py  ← Generates HTML from data.json
│   ├── process_data.py     ← Processes Excel → data.json
│   └── data.json           ← Processed opportunity data
├── npd/                    ← New Product Development Health Dashboard
│   ├── PROJECT-BRIEF.md
│   ├── New_Release_Product_Health_Dashboard.xlsx   (source data)
│   ├── NPD_Board_Slide_Mar2026.pptx               (board slide)
│   └── build_slide.py      ← Generates PPTX from dashboard data
├── marketing/              ← Marketing Dashboard (planned)
└── docs/                   ← Build logs, reference docs
    └── SIC_Dashboard_Build_Log_v10.md
```

## Dashboards

| Dashboard | Status | Owner |
|-----------|--------|-------|
| Sales KPI | v10 — Active, data refresh Mar 13 | Marc |
| CAE Pipeline & CRM | v2.4 — Active, data from Mar 14 | Marc |
| NPD Health | Active — 9 products, LEAN scoring, board slide Mar 2026 | Marc |
| Marketing | Planned | TBD |

## Design Principles (All Dashboards)

1. **Lean** — no clutter, every pixel earns its place
2. **Visually obvious** — anyone can read it in 5 seconds
3. **Single-file HTML** — no server, no build step, open in any browser
4. **Consistent design system** — shared colors, typography, stoplight logic across all three

### RAG Logic — Trajectory vs Plan, Not Snapshot Panic

RAG status reflects whether we are **on track against the annual plan at this point in the cycle**, not a raw snapshot vs annual target. This prevents false alarms from expected seasonality, order timing, or product mix sequencing.

- **Green** — on or ahead of plan for this point in the year
- **Amber** — behind plan but recoverable with identified actions
- **Red** — structurally off-plan, requires intervention now

If a KPI looks low but matches the budgeted phasing, it stays green with a contextual note — not amber.

### Amber/Red Commentary Rule — No Orphan Reds

Every amber or red KPI must answer three questions:

1. **What's off** — the gap, plain language, no jargon
2. **Why** — is this cyclical timing, a structural miss, or a data lag?
3. **Action** — specific task, specific owner, specific timeframe

If there is no action because the gap is just timing, then the KPI should not be red. Reclassify as green with a note explaining the expected recovery.

The dashboard drives behavior. When someone opens it, they know exactly what they need to do and by when.

## Sales Dashboard — Widget Refinement Tracker

| # | Widget / Section | Status |
|---|-----------------|--------|
| 01 | KPI Scorecards (6 cards) | v10 — YTD $4.69M, Q1 coverage 100.4% |
| 02 | Rolling Horizon View (Q1·Q2·FY) | v10 — Open SO updated: Q1 $1.04M, Q2 $4.23M, FY $11.64M |
| 03 | Forecast vs Actual vs Budget chart | v10 — Mar actual $945K added, Open SO monthly refreshed |
| 04 | Sales Team Performance (bar + table) | v10 — Terry YTD $764K, Open SO $1.88M |
| 05 | Gross Profit Analysis (4 charts) | v8 — Feb GP integrated; awaiting Mar data |
| 06 | Revenue Breakdown + Pipeline + 3X Calc | v10 — Region YTD updated with Mar (EMEA $3.44M, CHINA $1.03M) |

## CAE Dashboard — Section Tracker

| # | Section | Content |
|---|---------|---------|
| 01 | KPI Scorecards (6 cards) | Active Pipeline, Win Rate, Avg Cycle Time, New Leads Q1, Stalled Opps, Pipeline Value |
| 02 | Pipeline Funnel & Conversion | Funnel visualization + stage-to-stage conversion rates table |
| 03 | Velocity & Aging | Days-in-stage bar chart + monthly new lead intake trend |
| 04 | CAE Workload & Win/Loss | Engineer workload table + loss reason pie chart with commentary |
| 05 | Product & Geographic | Pipeline by product group, country (top 15), salesperson |
| 06 | Stalled Opportunities | Top 30 aged opps (>180d) with priority/CAE/stage — action required |
| 07 | CRM Pipeline Table | Full 221-record interactive table with search, 7 filters, column sorting |

### CAE KPIs (FY2026 — Targets to be confirmed)

| KPI | Current | Proposed Target | Status |
|-----|---------|----------------|--------|
| Win Rate | 11.1% | 15% | AT RISK |
| Avg Cycle Time | 339 days | <270 days | NEEDS ACTION |
| New Leads / Quarter | 50 (Q1) | 60 | ON TRACK |
| Stalled Rate (>180d) | 57% | <30% | NEEDS ACTION |
| Pipeline Est. Value | $4.2M | TBD | Sparse data |

### CAE Data Refresh Procedure

1. Export `OpportunityList` from SharePoint
2. Save to `cae/data/` directory
3. Update the Excel path in `process_data.py`
4. Run: `python process_data.py` → generates `data.json`
5. Run: `python build_dashboard.py` → generates new HTML
6. Archive previous HTML version

## Workflow

- User provides detailed instructions per widget
- Each widget refined individually, tested, then locked
- New data drops go to `sales/data/`
- Previous HTML versions archived before overwrite

## Upcoming

- [x] Sales Dashboard widget-by-widget refinement (v9 — all rows reviewed & validated)
- [x] February GP data integration (v8 — Jan+Feb actuals from Finance ERP)
- [x] Forecast Accuracy + Book-to-Bill KPIs (v8 — added to Row 01 scorecards)
- [x] CAE Dashboard — v1 built with pipeline funnel, velocity, win/loss, CRM table (Mar 14)
- [ ] Marketing Dashboard — scope and KPI definition
- [ ] Cross-dashboard KPI linkage (unified executive view)
