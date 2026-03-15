# SIC Sales KPI Dashboard — Build Log & Migration Reference
**Project:** FY2026 Sales KPI Dashboard  
**Owner:** Marc (CCO), Silicon Craft Technology (SIC)  
**Built:** March 4–8, 2026  
**Current Version:** v10
**File:** `Sales_KPI_Dashboard_FY2026_v10.html`

---

## 1. Overview

A single-page, scrollable HTML dashboard for C-suite and management review of SIC's FY2026 commercial performance. Designed for browser viewing (desktop/tablet), no server required — self-contained HTML file with embedded Plotly charts and JavaScript.

### Design Principles
- **Single file, no tabs** — one continuous scroll, 6 numbered sections
- **RAG stoplight logic** — 🟢 ≥80% · 🟡 50–79% · 🔴 <50%
- **Dynamic inputs** — Pipeline 3X calculator recalculates live in-browser
- **Rolling 3-quarter horizon** — Current Q · Next Q · Full Year
- **No backend required** — all logic is client-side JavaScript + Plotly CDN

---

## 2. Dashboard Sections

| # | Section | Key Content |
|---|---------|-------------|
| 01 | Key Performance Indicators | 6 KPI scorecards with RAG stoplights |
| 02 | Rolling Horizon View | Q1 (current) · Q2 (next) · Full Year cards with Q-by-Q mini breakdown |
| 03 | Forecast vs Actual vs Budget | Monthly revenue trend chart (4 lines) + Q1 PowerBI live band |
| 04 | Sales Team Performance | Grouped bar chart + salesperson scorecard table |
| 05 | Gross Profit Analysis | GP by SP · Segment · Region · Product — Finance ERP actuals |
| 06 | Revenue Breakdown + Pipeline | Region/Segment/Product/Customer charts + 3X pipeline calculator + Risk & Opp tables |

---

## 3. Data Sources

| Source File | Sheet / Tab | Data Used |
|-------------|-------------|-----------|
| `March-Sales-Monthly-Dashboard-20260225.xlsx` (file:1) | Sales Dashboard | FY budget by SP, 80% FCST, YTD+SO, Gap, 3X pipeline opportunities |
| `March-Sales-Monthly-Dashboard-20260225.xlsx` (file:11, Mar 4 update) | Sales Dashboard + individual SP sheets | Updated 80% FCST, YTD+SO as of Mar 4, Risk & Opportunity detail |
| `Quarter-Revenue-by-Region-WR-2.xlsx` (file:2) | Export | FY2025 revenue by region (EMEA/CHINA/ROA/US) |
| `Quarter-Revenue-Update-M-WR1.xlsx` (file:3, file:12) | Export | Q1 QTD actual, Open SO, QTD+SO, %ACH, vs last week (PowerBI live) |
| `Revenue-SO-Rolling-Forecast-and-Sale-Budget-Comparison.xlsx` (file:4/5) | Sales Budget + Rolling Forecast | Monthly budget by quarter (Q1–Q4), Rolling FCST by month, used for Q-split calculations |
| `Sale-report-Jan-26.xlsx` (file:18) | Raw Data | Full COGS GP analysis — revenue, cost, GP% by SP / Segment / Region / Product / Customer (Finance ERP) |
| `data (77).xlsx` (v9) | Export | Open Sales Orders — Col Z (SUM USD), Col P (Outstanding QTY), Col T (Shipment Month), Col U (Qtr), Col AC (Sales Nick Name). Source for Open SO figures. Totals row at bottom must be excluded. |
| `data (78).xlsx` (v9) | Export | YTD Actual Revenue — ERP shipped revenue (replaced by data(80) in v10). |
| `data (80).xlsx` (v10) | Export | YTD Actual Revenue — replaces data(78). Col B (Month), Col Q (USD Amount), Col U (Sales Nick Name), Col Y (Region). Jan $2.34M, Feb $1.41M, Mar $0.95M. Total YTD $4.69M. |
| `data (81).xlsx` (v10) | Export | Open Sales Orders — replaces data(77). Col Z (SUM USD), Col T (Shipment Month), Col U (Qtr), Col AC (Sales Nick Name). Q1 $1.05M, Q2 $4.23M, Q3 $2.96M, Q4 $3.40M. FY Total $11.64M. |
| `Month Revenue Update (M$) (WR1).xlsx` (v10) | PowerBI live | March MTD: Target $2.06M, MTD $0.95M, SO $1.04M, MTD+SO $1.98M, %ACH 96.5%. |
| `Revenue, SO, Rolling Forecast and Sale Budget Comparison.xlsx` (v10) | Rolling Forecast + Sales Budget | Rolling FCST monthly totals (FY $20.09M). Sales Budget monthly totals (FY $21.18M). |
| `SalesPlan2026_20251003_Sales_Target.xlsx` (v8) | SP2026 | FY2026 Budget by region: EMEA $14.34M, CHINA $4.54M, ROA $1.86M, US $0.44M. Total $21.18M. |

### Data Hierarchy (priority order)
1. **PowerBI live** (Quarter-Revenue-Update) — most current QTD actual & SO
2. **March Sales Dashboard** — 80% FCST, Rolling FCST, SP-level detail, Risk & Opp
3. **Revenue-SO-Rolling Forecast** — quarterly budget splits, monthly rolling FCST
4. **Finance ERP** (Sale-report) — GP/COGS actuals, authoritative for margin data

---

## 4. Key Metrics & Formulas

### Revenue KPIs
| Metric | Formula | Source |
|--------|---------|--------|
| YTD / QTD Actual | PowerBI QTD field | Quarter-Revenue-Update |
| 80% FCST | Sum of SP 80% confidence forecasts | March Sales Dashboard |
| Rolling FCST | Sum of Open SO + forward sales plan by month | Revenue-SO-Rolling Forecast |
| FY Gap | Budget − 80% FCST | Derived |
| Q-split FCST | FY FCST × (RF_Q / RF_total) applied to remainder after Q1 actual | Derived from Rolling Forecast proportions |

### GP Metrics
| Metric | Formula | Source |
|--------|---------|--------|
| USD Revenue | THB Total Sales ÷ Rate | Sale-report Raw Data (AcctCode 41100001.0 only) |
| USD COGS | THB Total Cost ÷ Rate | Sale-report Raw Data |
| GP $ | USD Revenue − USD COGS | Derived |
| GP % | GP $ ÷ USD Revenue × 100 | Derived |

> **Note:** Finance ERP revenue ($3.69M Jan) ≠ Dashboard cash-basis revenue ($2.34M Jan) due to invoice timing vs shipment month recognition. Use ERP for GP% calculation; use PowerBI/dashboard for revenue trend tracking.

### 3X Pipeline Logic (Dynamic — updates monthly)
```
Gap = FY Budget − 80% FCST
3X Target = Gap × 3
Pipeline Coverage % = Weighted Pipeline ÷ 3X Target
```
The 3X target **shrinks each month** as the FCST closes the gap to budget. If gap = 0, no pipeline target is required.

### Quarterly Horizon Logic
- **Current Quarter (Q1):** Uses QTD Actual + Open SO (PowerBI)
- **Next Quarter (Q2):** Uses 80% FCST split by Rolling Forecast proportions
- **Full Year:** Uses total 80% FCST vs FY Budget; Q1–Q4 mini breakdown

---

## 5. Salesperson Reference

| Dashboard Name | ERP Name (Sales By) | Accounts |
|---------------|---------------------|---------|
| Intira | Intira Loychoosak | Allflex EU, Allflex China, Caisley, FASTHINK, JMA, Kaba ILCO, Smartrac, Sistema |
| Lisa | Lisha Lee | Fofia, Hawang, Lanhai, Soartech, Tonghua, Voraus, Waferwon, EEEDENG, HUALIN, Tatwah |
| Nuttapon | Chen Yi Jhen (ERP) | Hitachi TH, Techna, Head, KKP Bank |
| Shan | Mr.Shan Sharma | IKS/AKS, Tempocom, STRATTEC, TYMA, Autentica, IDOLOGY, Key Craze, Mepco |
| Terry | Chen Yi Jhen (ERP)* | Changjo, Chilitag, Duali, EPC, Freevision, Hitachi, Marshall, Queclink, SES, Willlink, Goldsun, E-Garde, Astag, Hanyang, CMSC, IDAID |
| Tunn | Tunn Prasoprat | HID Global, APKID, BTG, Elektronika, Escatec, LUX-IDent, Omnia, Oregon, Axess, Wigidex |

> ⚠️ **ERP mapping note:** In `Sale-report-Jan-26.xlsx`, "Chen Yi Jhen" maps to **Terry** (Freevision, Queclink, Willlink = Terry's accounts). Nuttapon's accounts (Hitachi TH, Techna) also appear under Chen Yi Jhen in some months. Verify by customer name when computing GP by salesperson.

---

## 6. Version History

| Version | Date | Changes |
|---------|------|---------|
| v1 | Mar 4, 2026 | Initial tabbed dashboard (4 tabs) |
| v2 | Mar 4, 2026 | Converted to single-page scrollable (no tabs), 5 sections |
| v3 | Mar 6, 2026 | Removed duplicate Forecast Comparison tile band (Section 02 4-tile block) |
| v4 | Mar 6, 2026 | Added dynamic 3X pipeline calculator with live JS recalculation |
| v5 | Mar 6, 2026 | Updated all metrics from March 4 data: FCST $18.27M, pipeline $5.59M unwtd, Q1 PowerBI live band added |
| v6 | Mar 6, 2026 | Added Rolling Horizon View (Section 02): Q1 · Q2 · Full Year cards + Q-by-Q mini breakdown + Q2 Priority Actions |
| v7 | Mar 8, 2026 | Added GP Section (Section 05) from Finance ERP Jan actuals: GP 40.3%, by SP/Segment/Region/Product. GP KPI card activated. |
| v8 | Mar 10, 2026 | Feb GP integrated (Jan+Feb YTD 40.8% — GREEN on plan). Forecast Accuracy KPI added (98.1%). Book-to-Bill KPI added (0.63x). Revenue by Region chart gained FY2025 Actual, FY2026 Budget, Rolling FCST, YTD Actual traces. Data refresh across all widgets. |
| v9 | Mar 12, 2026 | Full data validation & rebuild. Card 3 renamed to "Total Weighted FCST (incl. R&O)". Rolling FCST replaced with Open SO across Q2, FY, monthly chart, salesperson chart & table. YTD Actual corrected from ERP export (data(78).xlsx). Open Pipeline column removed (untraceable). Duplicate 4-card row removed. Revenue by Region / Top 10 / Pipeline chart spacing fixed. Open SO Pipeline by Salesperson chart removed. Action column added to Key Opportunities from R&O tab Col W. Gray fonts brightened for readability. |
| v10 | Mar 13, 2026 | Data refresh from 4 new source files. YTD Revenue updated to $4.69M (data(80) — Mar MTD $945K added). Open SO updated to $11.64M (data(81) — Q1 $1.05M, Q2 $4.23M). WR1 PowerBI live March: MTD+SO $1.98M, 96.5% ACH. Q1 coverage 100.4% ($5.73M vs $5.72M budget). Terry YTD $764K (+$80K), Open SO $1.88M (-$80K). Revenue by Region updated with Mar QTD (EMEA $3.44M, CHINA $1.03M, ROA $207K). Monthly chart Mar actual bar added. Comparison file added for Rolling FCST/Budget reference. |

---

## 7. Current KPI State (as of Mar 13, 2026 — v10)

### Revenue
| KPI | Value | Target | Status |
|-----|-------|--------|--------|
| YTD Actual (Jan–Mar 13) | $4.69M | — | From data(80).xlsx ERP |
| Q1 QTD + Open SO | $5.73M | $5.72M | 🟢 100.4% |
| 80% FCST (FY) | $18.27M | $22.0M | 🟡 83.0% |
| Total Weighted FCST (incl. R&O) | $19.03M | $22.0M | 🟡 86.5% |
| Open SO (FY2026) | $11.64M | — | From data(81).xlsx |
| FY Gap (Budget − 80% FCST) | -$3.73M | $0 | 🔴 |
| Q2 Open SO | $4.23M | $5.55M | 🔴 76.3% |

### GP (Jan+Feb 2026 YTD — ERP Actuals)
| KPI | Value | Target | Status |
|-----|-------|--------|--------|
| YTD GP% (Jan+Feb) | 40.8% | 48.0% | 🟢 ON PLAN — product mix timing per budget |
| YTD Revenue (ERP) | $3.73M | $3.67M budget | 🟢 |
| YTD GP Dollars | $1,525K | — | Jan $1,001K + Feb $522K |

### Pipeline (as of Mar 13)
| KPI | Value | Target | Status |
|-----|-------|--------|--------|
| 3X Pipeline Target | $11.19M | — | Dynamic |
| Pipeline Unweighted | $4.67M | $11.19M | 🔴 41.7% |
| Pipeline Weighted | $1.65M | $11.19M | 🔴 14.8% |
| Risk Weighted Exposure | -$887K | — | 🟡 Monitor |
| Forecast Accuracy | 98.1% | 50% | 🟢 |
| Book-to-Bill | 0.63x | ≥1.0/mo | 🔴 |

### Pending KPIs
| KPI | What's Needed |
|-----|--------------|
| March GP | `Sale-report-Mar-26.xlsx` from Finance |
| Q1 Full GP | Jan + Feb + Mar ERP files |

---

## 8. Monthly Update Procedure

### Every Month (within first week)
1. **PowerBI export** → update `Quarter-Revenue-Update` file → update Q1/QTD actual in dashboard Section 01 & 02
2. **Sales Dashboard file** → salesperson updates 80% FCST, YTD+SO, Risk & Opp → update Section 04 SP table + Pipeline Section 06 calculator inputs (5 fields)
3. **Finance ERP** → `Sale-report-[Mon]-26.xlsx` → run GP calculation → update Section 05

### Quarterly (Q-end)
4. **Rotate horizon** — Q1 becomes history, Q2 becomes "Current", Q3 becomes "Next"
5. Update quarterly budget splits from `Revenue-SO-Rolling Forecast` file

### Pipeline Calculator — 5 inputs to update monthly
| Input | Where to get it |
|-------|----------------|
| FY Budget ($M) | Fixed $22M (update if Board revises) |
| 80% FCST ($M) | Sum of SP FCST column in Sales Dashboard |
| Pipeline Unwtd ($M) | `Total (3X GAP) Unweighted` row in Sales Dashboard |
| Pipeline Wtd ($M) | `Total weighted opportunities` row |
| Risk Wtd ($M) | `Total weighted FCST risk` row |

---

## 9. Key Insights & Decisions Captured

### Strategic
- Q1 is on track — QTD+SO of $5.73M exceeds Q1 budget of $5.72M (100.4%). March MTD $945K is tracking well.
- **Q2 is the critical quarter** — only 76.3% SO coverage with a $1.32M gap. Critical to convert pipeline.
- GP margin at 40.3% (Jan) is 7.7pp below target, driven almost entirely by Allflex high-volume low-margin chips (AFX, SIC278).

### Tactical
- SIC7150 is being sold at near-cost (8.4% GP). Pricing review needed before Techna and HID Q2 quotes.
- Intira holds 48% of FY budget — her FCST recovery from Allflex and Caisley is the single highest-impact lever for FY.
- STRATTEC (Shan, $680K realistic) and E-Garde/FV (Terry, $634K combined) are the two highest-value Q2 pipeline opportunities.
- Pipeline weighted coverage at 14.8% of 3X target is critically low. Team needs to accelerate NBO qualification.

### Process
- ERP "Sales By" name for Lisa is "Lisha Lee" — not "Lisa Lertlak". Confirm with Finance for Feb file.
- Chen Yi Jhen in ERP covers both Terry's and Nuttapon's accounts — differentiate by Customer Name.
- Finance ERP invoice-date revenue differs from dashboard shipment-date revenue. Always use PowerBI for revenue tracking; use ERP only for GP/cost analysis.

---

## 10. Technology Stack

| Component | Technology |
|-----------|-----------|
| Charts | Plotly.js 2.27.0 (CDN) |
| Interactivity | Vanilla JavaScript (no framework) |
| Styling | Inline CSS, dark theme (#0f172a background) |
| Build tool | Python (pandas, openpyxl, plotly) via Perplexity AI |
| Hosting | Static HTML — open in any browser, no server needed |
| File size | ~124KB (v7) |

---

## 11. Files Produced

| File | Description |
|------|-------------|
| `Sales_KPI_Dashboard_FY2026_v10.html` | **Current dashboard — use this** |
| `Sales_KPI_Dashboard_FY2026_v9.html` | Full data validation rebuild (archived) |
| `Sales_KPI_Dashboard_FY2026_v8.html` | Feb GP integrated, Forecast Accuracy + Book-to-Bill added (archived) |
| `Sales_KPI_Dashboard_FY2026_v7.html` | GP Section added, Jan actuals (archived) |
| `Sales_KPI_Dashboard_FY2026_v6.html` | Previous version (no GP section, archived) |
| `Sales_KPI_Dashboard_FY2026_v5.html` | Without quarterly horizon view (archived) |
| `Sales_KPI_Dashboard_FY2026_v4.html` | Without Mar 4 data update (archived) |
| `gp_by_sp_jan26.csv` | GP by salesperson — January 2026 |
| `gp_by_seg_jan26.csv` | GP by market segment — January 2026 |
| `gp_by_reg_jan26.csv` | GP by region — January 2026 |
| `gp_by_cust_jan26.csv` | GP by customer (top 10) — January 2026 |
| `gp_by_chip_jan26.csv` | GP by product chip — January 2026 |

---

*Generated by Perplexity AI — SIC Strategy Space | March 8, 2026*
