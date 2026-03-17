# NPD — New Product Development Health Dashboard

**Owner:** Marc (CCO)
**Department:** NPD / Product Management
**Started:** March 2026
**Status:** Active

---

## Purpose

Board-level visibility into the health of SICT's new product portfolio — investment, revenue trajectory, gross profit, and ROI across all active releases. Designed for monthly board review and executive steering.

## Outputs

| File | Type | Description |
|------|------|-------------|
| `New_Release_Product_Health_Dashboard.xlsx` | Excel | Source data workbook — 9 products, LEAN scoring, RAG logic |
| `NPD_Board_Slide_Mar2026.pptx` | PowerPoint | Single-slide board summary (scorecard + actions + forward outlook) |
| `build_slide.py` | Script | Generates the PPTX from dashboard data |

## Key Metrics

- **Portfolio:** 9 products, 8 active, 1 research
- **Total Investment:** 114.5M THB ($3.5M USD)
- **Actual Revenue (2023-2025):** 69.6M THB
- **Forward Revenue (2026-2030 BC):** 991.4M THB
- **Weighted Avg Gross Profit:** 74.1%

## RAG Logic

Uses **Trajectory vs Plan** (not snapshot). Same framework as all SIC Dashboards — see root PROJECT.md.

## LEAN Scoring

Weighted composite: Revenue 40% + Gross Profit 30% + ROI 30%

## Data Refresh

1. Update product data in the Excel workbook
2. Run `build_slide.py` to regenerate the board slide
3. Archive previous PPTX version before overwriting
