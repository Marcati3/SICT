# NPR Health Dashboard — Quarterly Board Slide Brief

## Frequency
Quarterly (next: June 2026)

## Input
- `New_Release_Product_Health_Dashboard.xlsx` — first tab ("Executive Summary") only
- Key columns: Project Name (A), Product Chip (B), Launch (C), Gate (D), Status (E), Investment THB (F), BC Rev 23-25 (G), Actual Rev 23-25 (H), Variance THB (I), Trajectory % (J), GP % (K), BC Payback Yrs (L), RAG Status (M), What's Off (N), Why (O), Action (P), GP RAG (Q), Payback Signal (R)

## Output
- 1 executive slide (.pptx), SIC corporate template style
- Filename: `NPR_Health-Dashboard_Board_vN.pptx`

## Template
- `TEMPLATES/NPR_Health-Dashboard_Board_Template.pptx`

---

## Slide Structure (Approved March 2026)

### Header Bar
- Navy (#1E2761) full-width bar
- Title: "New Product Release — Portfolio Health" — Georgia 16.5pt bold, white
- Subtitle right-aligned: "[Quarter] [Year] · LEAN Dashboard · THB (33/USD)" — Calibri 9.5pt, light blue (#CADCFC)

### KPI Cards Row (5 cards)
Left-to-right:
1. TOTAL PRODUCTS — count active + research
2. TOTAL INVESTMENT — THB, sum of column F
3. ACTUAL REVENUE — THB, sum of column H
4. VARIANCE vs BC — THB, sum of column I
5. AVG GROSS PROFIT — % average of column K (active products only, exclude zeros)

Card style: light gray (#F4F6F9) background, thin border (#D0D7E2), left accent stripe colored per KPI type. Georgia 24pt bold for value, Calibri 7pt for label/sub.

### Middle Row — 3 Columns

#### Column 1: RAG STATUS BY CHIP (pie chart)
- Pie chart grouped by RAG status (not per-chip slices)
- Labels: "GREEN (N chips) XX%", "AMBER (N chip) XX%", "RED (N chip) XX%", "N/A (N chips) XX%"
- Colors: GREEN=#2E7D32, AMBER=#E65100, RED=#C62828, N/A=#9E9E9E
- Below pie: chip legend rows — colored pill per status + chip names listed
- GP PRESSURE note sits under AMBER row (not a separate risk card)

#### Column 2: ROI — BC PROJECTION vs ACTUAL (grouped bar chart)
- Horizontal grouped bar: "BC Projection" (light blue #90CAF9) vs "Cumulative Actual" (green #2E7D32)
- Show products with BC targets OR meaningful actual revenue (typically 4-5 chips)
- Data labels on, legend at bottom
- Below chart: ROI callout line — top performer ROI multiple + notable outlier

#### Column 3: KEY RISKS & ACTIONS (3 cards only)
- Card 1: RED product — what's off, action required
- Card 2: AMBER product — what's off, action required
- Card 3: Concentration risk (SIC73F1 or whichever chip dominates) — % of revenue, payback, trajectory
- Style: colored left accent stripe, tinted background per severity

### Executive Summary Bar (bottom)
- Thin navy divider line, light gray (#EEF1F6) background
- Header: "EXECUTIVE SUMMARY" — Georgia 7.5pt bold, navy
- Content: 1-2 sentences ONLY. No duplication of risk cards.
- Focus: overall trajectory status + variance drivers + anything not covered above
- Do NOT include: action items (those are in risk cards), repeats of KPI values

### Bottom Edge
- Thin navy (#1E2761) bar at slide bottom

---

## Design Rules
- Fonts: Georgia (titles, values), Calibri (labels, body)
- Colors: Navy #1E2761, White #FFFFFF, Light BG #F4F6F9, Border #D0D7E2
- RAG: GREEN=#2E7D32, AMBER=#E65100, RED=#C62828
- No footer KPI bar (removed — duplicates top row)
- Executive summary must NOT repeat risk card content
- GP pressure note goes in chip legend area, not as separate risk card
- Maximum 3 risk cards
