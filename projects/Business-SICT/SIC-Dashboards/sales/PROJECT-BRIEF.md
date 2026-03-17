# Sales KPI Dashboard

**Owner:** Marc (CCO)
**Department:** Sales
**Started:** March 2026
**Status:** Active — v10

---

## Purpose

Single-file HTML dashboard providing C-suite visibility into sales performance: revenue, pipeline, forecast accuracy, gross profit, and team performance. Refreshed with each data drop from Finance/ERP.

## Outputs

| File | Type | Description |
|------|------|-------------|
| `Sales_KPI_Dashboard_FY2026_v10.html` | HTML | Current live dashboard |
| `data/` | Folder | Source Excel drops from Finance |
| `archive/` | Folder | Previous dashboard versions |
| `update_v8.py` | Script | Update helper for v8 data refresh |

## Sections

1. KPI Scorecards (6 cards) — YTD revenue, Q1 coverage, forecast accuracy
2. Rolling Horizon View (Q1/Q2/FY)
3. Forecast vs Actual vs Budget chart
4. Sales Team Performance (bar + table)
5. Gross Profit Analysis (4 charts)
6. Revenue Breakdown + Pipeline + 3X Calc

## Data Refresh

1. Drop new Excel export into `data/`
2. Update values in HTML directly or via script
3. Archive previous HTML version
