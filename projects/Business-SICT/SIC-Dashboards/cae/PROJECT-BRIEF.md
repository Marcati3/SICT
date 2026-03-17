# CAE Pipeline & CRM Dashboard

**Owner:** Marc (CCO)
**Department:** CAE (Customer Application Engineering)
**Started:** March 2026
**Status:** Active — v2.4

---

## Purpose

Single-file HTML dashboard for CAE pipeline health: funnel conversion, velocity, win/loss analysis, engineer workload, and full CRM opportunity table. Built from SharePoint opportunity export.

## Outputs

| File | Type | Description |
|------|------|-------------|
| `CAE_Pipeline_Dashboard_FY2026_v2.4.html` | HTML | Current live dashboard |
| `build_dashboard.py` | Script | Generates HTML from data.json |
| `process_data.py` | Script | Processes Excel export into data.json |
| `data.json` | Data | Processed opportunity data |

## Sections

1. KPI Scorecards (6 cards) — pipeline value, win rate, cycle time, stalled rate
2. Pipeline Funnel & Conversion
3. Velocity & Aging
4. CAE Workload & Win/Loss
5. Product & Geographic breakdown
6. Stalled Opportunities (>180d)
7. CRM Pipeline Table (221 records, interactive)

## Data Refresh

1. Export `OpportunityList` from SharePoint
2. Save to `cae/data/`
3. Run `python process_data.py` to generate `data.json`
4. Run `python build_dashboard.py` to generate new HTML
5. Archive previous HTML version
