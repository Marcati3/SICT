import json, html

with open(r'C:\Users\intln\Claude\Projects\Business-SICT\SIC-Dashboards\cae\data.json') as f:
    D = json.load(f)

S = D['summary']
K = D['kpis']

def esc(s):
    return html.escape(str(s)) if s else ''

def fmt_num(n):
    if n >= 1_000_000: return f'${n/1_000_000:.1f}M'
    if n >= 1_000: return f'${n/1_000:.0f}K'
    return f'${n:.0f}'

# Stalled rows — with action recommendation
stalled_rows = ''
for r in D['stalled']:
    age_color = '#ef4444' if r['days'] > 365 else '#f59e0b' if r['days'] > 270 else '#eab308'
    prio_color = '#ef4444' if r['priority'] == 'High' else '#f59e0b' if r['priority'] == 'Medium' else '#94a3b8'
    action = r.get('action', 'REVIEW')
    action_color = '#ef4444' if 'CLOSE' in action else '#f59e0b' if 'ESCALATE' in action else '#22c55e' if 'ADVANCE' in action or 'PUSH' in action else '#38bdf8'
    stalled_rows += f'''<tr>
<td style="color:#94a3b8;font-size:10px">{esc(r["id"])}</td>
<td>{esc(r["name"])}</td>
<td>{esc(r["customer"])}</td>
<td><span class="stage-pill">{esc(r["stage"])}</span></td>
<td style="color:{age_color};font-weight:700">{r["days"]}d</td>
<td style="color:{prio_color}">{esc(r["priority"])}</td>
<td>{esc(r["cae"])}</td>
<td style="color:{action_color};font-size:11px;font-weight:600;max-width:280px">{esc(action)}</td>
</tr>'''

crm_rows_json = json.dumps(D['crm'])

conv_rows = ''
for c in D['conversion']:
    rate = c['rate']
    color = '#22c55e' if rate >= 50 else '#f59e0b' if rate >= 30 else '#ef4444'
    conv_rows += f'''<tr>
<td>{esc(c["stage"])}</td>
<td style="text-align:center">{c["reached"]}</td>
<td style="text-align:center">{c["prevCount"]}</td>
<td style="text-align:center;color:{color};font-weight:700">{rate}%</td>
</tr>'''

# CAE first names only
def cae_first(name):
    if not name or name == 'nan': return 'Unassigned'
    return name.split()[0] if ' ' in name else name

cae_names_short = json.dumps([cae_first(c.get('CAE in-charge','?')) for c in D['caeWorkload']])

# Chart data
loss_labels = json.dumps(list(D['lossTypes'].keys()))
loss_values = json.dumps(list(D['lossTypes'].values()))
pg_labels = json.dumps(list(D['productGroups'].keys()))
pg_values = json.dumps(list(D['productGroups'].values()))
cty_labels = json.dumps(list(D['countries'].keys()))
cty_values = json.dumps(list(D['countries'].values()))
sp_labels = json.dumps(list(D['salespersons'].keys()))
sp_values = json.dumps(list(D['salespersons'].values()))
funnel_stages = json.dumps([f['stage'] for f in D['funnel']])
funnel_counts = json.dumps([f['count'] for f in D['funnel']])
vel_stages = json.dumps([v['stage'] for v in D['velocity']])
vel_avg = json.dumps([v['avg_days'] for v in D['velocity']])
vel_med = json.dumps([v['median_days'] for v in D['velocity']])
intake_months = json.dumps([i['month'] for i in D['intake']])
intake_counts = json.dumps([i['count'] for i in D['intake']])

# KPI RAG colors
def rag(val, target, lower_is_better=True):
    if val is None: return '#94a3b8'
    if lower_is_better:
        if val <= target: return '#22c55e'
        if val <= target * 1.5: return '#f59e0b'
        return '#ef4444'
    else:
        if val >= target: return '#22c55e'
        if val >= target * 0.7: return '#f59e0b'
        return '#ef4444'

def rag_pct(pct, target=70):
    if pct >= target: return '#22c55e'
    if pct >= 50: return '#f59e0b'
    return '#ef4444'

gonogo = K['gonogo']
app_sol = K['appSolution']
din_dwin = K['dinToDwin']
ttm_ots = K['ttm']['Off-the-shelf']
ttm_mod = K['ttm']['Modified']
ttm_npi = K['ttm']['NPI']

gonogo_color = rag_pct(gonogo['pct'], 80)
ttm_ots_color = rag(ttm_ots['avg_months'], 4.5) if ttm_ots['avg_months'] else '#94a3b8'
ttm_mod_color = rag(ttm_mod['avg_months'], 9) if ttm_mod['avg_months'] else '#94a3b8'
ttm_npi_color = rag(ttm_npi['avg_months'], 18) if ttm_npi['avg_months'] else '#94a3b8'
appsol_color = rag_pct(app_sol['pct'], 80)
dindwin_color = rag(din_dwin['rate'], 50, lower_is_better=False)

# GoNoGo distribution for chart
gonogo_dist = K['gonogo']['distribution']
gonogo_dist_keys = json.dumps(list(gonogo_dist.keys()))
gonogo_dist_vals = json.dumps(list(gonogo_dist.values()))

# App Solution distribution
appsol_dist = K['appSolution']['distribution']
appsol_dist_keys = json.dumps(list(appsol_dist.keys()))
appsol_dist_vals = json.dumps(list(appsol_dist.values()))

# TTM distribution — bar chart by month, stacked by sale process type
ttm_dist = K.get('ttmDist', {})
ttm_by_mt = K.get('ttmByMonthType', {})
ttm_dist_keys = sorted(ttm_dist.keys(), key=lambda x: int(x))
ttm_dist_keys_json = json.dumps([int(k) for k in ttm_dist_keys])
# Build stacked series per type
ttm_ots_bars = json.dumps([ttm_by_mt.get(k, {}).get('Off-the-shelf', 0) for k in ttm_dist_keys])
ttm_mod_bars = json.dumps([ttm_by_mt.get(k, {}).get('Modified', 0) for k in ttm_dist_keys])
ttm_npi_bars = json.dumps([ttm_by_mt.get(k, {}).get('NPI', 0) for k in ttm_dist_keys])

# Closed-Won table rows + pie chart data
closed_won_rows = ''
total_won_rev = 0
won_by_product = {}
won_rev_by_product = {}
for w in D.get('closedWon', []):
    rev = w.get('estRev', 0)
    total_won_rev += rev
    p = w.get('product', 'Unknown')
    won_by_product[p] = won_by_product.get(p, 0) + 1
    won_rev_by_product[p] = won_rev_by_product.get(p, 0) + rev
    rev_str = f"${rev:,.0f}" if rev > 0 else '—'
    vol_str = f"{w['volume']:,}" if w.get('volume') else '—'
    closed_won_rows += f'''<tr>
<td style="color:#94a3b8;font-size:10px">{esc(w["id"])}</td>
<td>{esc(w["name"])}</td>
<td>{esc(w["customer"])}</td>
<td>{esc(w["product"])}</td>
<td style="font-size:10px">{esc(w.get("productName",""))}</td>
<td>{esc(w["saleProcess"])}</td>
<td>{esc(w["cae"])}</td>
<td style="color:#22c55e;font-weight:600">{esc(w["winDate"])}</td>
<td style="text-align:right">{vol_str}</td>
<td style="text-align:right">{rev_str}</td>
<td style="font-size:10px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="{esc(w["comment"])}">{esc(w["comment"])}</td>
</tr>'''

won_product_labels = json.dumps(list(won_by_product.keys()))
won_product_counts = json.dumps(list(won_by_product.values()))
won_product_rev_labels = json.dumps(list(won_rev_by_product.keys()))
won_product_rev_values = json.dumps(list(won_rev_by_product.values()))

# Recent comments table rows
comment_rows = ''
for c in D.get('recentComments', []):
    sc = "STAGE_COLORS['" + c['stage'] + "']" if c['stage'] else "'#64748b'"
    stage_color = {'New Lead':'#94a3b8','Contact':'#60a5fa','Qualified Lead':'#38bdf8','NDA':'#2dd4bf','Samples':'#a78bfa','Evaluation':'#f59e0b','Design-In':'#fb923c','PreProduction':'#f472b6','Design-Win':'#22c55e'}.get(c['stage'], '#64748b')
    comment_rows += f'''<tr>
<td style="color:#94a3b8;font-size:10px">{esc(c["id"])}</td>
<td>{esc(c["name"])}</td>
<td>{esc(c["customer"])}</td>
<td><span class="stage-pill" style="background:{stage_color}30;color:{stage_color};border:1px solid {stage_color}50">{esc(c["stage"])}</span></td>
<td>{esc(c["cae"])}</td>
<td style="font-size:10px">{esc(c["modified"])}</td>
<td style="font-size:11px;max-width:350px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="{esc(c["comment"])}">{esc(c["comment"])}</td>
</tr>'''

dashboard_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>CAE Pipeline &amp; CRM Dashboard — FY2026</title>
<script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
<style>
*{{box-sizing:border-box;margin:0;padding:0;}}
body{{font-family:'Segoe UI',system-ui,sans-serif;background:#0f172a;color:#f1f5f9;}}

.header{{background:linear-gradient(135deg,#1e293b 0%,#0f172a 100%);border-bottom:2px solid #334155;
  padding:18px 28px;display:flex;justify-content:space-between;align-items:center;
  position:sticky;top:0;z-index:100;}}
.header-left h1{{font-size:22px;font-weight:800;color:#f1f5f9;}}
.header-left .sub{{font-size:11px;color:#cbd5e1;margin-top:3px;}}
.header-right{{text-align:right;}}
.header-right .meta{{font-size:11px;color:#cbd5e1;margin-top:2px;}}
.stoplight-badge{{display:inline-flex;gap:12px;margin-top:6px;background:#334155;
  padding:5px 12px;border-radius:20px;font-size:11px;}}

.main{{padding:20px 28px;max-width:1800px;margin:0 auto;}}

.section{{margin-bottom:28px;}}
.section-header{{display:flex;align-items:center;gap:10px;margin-bottom:14px;
  padding-bottom:8px;border-bottom:1px solid #334155;}}
.section-header h2{{font-size:13px;font-weight:700;text-transform:uppercase;
  letter-spacing:0.08em;color:#cbd5e1;}}
.section-number{{background:#334155;color:#cbd5e1;font-size:10px;font-weight:700;
  padding:2px 8px;border-radius:10px;}}

.kpi-row{{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;}}
.kpi-card{{background:#1e293b;border-radius:10px;padding:16px 14px;
  border-top:4px solid #334155;position:relative;}}
.kpi-label{{font-size:9px;font-weight:700;text-transform:uppercase;
  letter-spacing:0.09em;color:#94a3b8;margin-bottom:5px;}}
.kpi-value{{font-size:26px;font-weight:800;line-height:1.1;margin-bottom:3px;}}
.kpi-sub{{font-size:11px;color:#cbd5e1;margin-bottom:7px;}}
.kpi-detail{{font-size:10px;color:#94a3b8;margin-top:2px;}}
.progress-wrap{{background:#334155;border-radius:4px;height:5px;margin:5px 0;overflow:hidden;}}
.progress-bar{{height:100%;border-radius:4px;}}
.kpi-note{{font-size:10px;color:#cbd5e1;margin-top:6px;padding-top:5px;border-top:1px solid #334155;line-height:1.4;}}
.kpi-status{{font-size:11px;font-weight:700;margin-top:4px;}}

.chart-row-1{{display:grid;grid-template-columns:1fr;gap:16px;}}
.chart-row-2{{display:grid;grid-template-columns:1fr 1fr;gap:16px;}}
.chart-row-3{{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;}}
.chart-box{{background:#1e293b;border-radius:10px;border:1px solid #334155;padding:6px;overflow:hidden;}}

.table-wrap{{background:#1e293b;border-radius:10px;border:1px solid #334155;overflow:hidden;margin-top:12px;}}
table{{width:100%;border-collapse:collapse;font-size:12px;}}
th{{background:#0f172a;padding:9px 12px;text-align:left;font-size:9px;font-weight:700;
  text-transform:uppercase;letter-spacing:0.07em;color:#94a3b8;border-bottom:1px solid #334155;white-space:nowrap;}}
td{{padding:9px 12px;border-bottom:1px solid #263347;color:#cbd5e1;vertical-align:top;}}
tr:last-child td{{border-bottom:none;}}
tr:hover td{{background:#263347;}}
tfoot td{{background:#0f172a;font-weight:700;border-top:1px solid #475569;}}

.stage-pill{{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;
  background:#334155;color:#cbd5e1;white-space:nowrap;}}

.commentary{{background:#1a2d40;border-left:3px solid #14b8a6;border-radius:8px;
  padding:14px 18px;font-size:12px;line-height:1.75;color:#cbd5e1;margin-top:12px;}}
.commentary strong{{color:#f1f5f9;}}
.commentary ul{{margin:6px 0 0 18px;}}
.commentary li{{margin-bottom:3px;}}

.filter-bar{{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;align-items:center;}}
.filter-bar select,.filter-bar input{{background:#1e293b;border:1px solid #334155;color:#f1f5f9;
  padding:6px 10px;border-radius:6px;font-size:12px;min-width:130px;}}
.filter-bar input{{min-width:200px;}}
.filter-bar label{{font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;}}
.filter-group{{display:flex;flex-direction:column;gap:3px;}}
.crm-count{{font-size:12px;color:#94a3b8;margin-left:auto;}}

.age-badge{{display:inline-block;padding:2px 6px;border-radius:6px;font-size:10px;font-weight:700;}}
.age-green{{background:#14532d;color:#22c55e;}}
.age-amber{{background:#422006;color:#f59e0b;}}
.age-red{{background:#450a0a;color:#ef4444;}}

.prio-high{{color:#ef4444;font-weight:700;}}
.prio-medium{{color:#f59e0b;}}
.prio-low{{color:#94a3b8;}}

.two-table-grid{{display:grid;grid-template-columns:1fr 1fr;gap:16px;}}

.footer{{background:#1e293b;border-top:1px solid #334155;padding:14px 28px;
  font-size:10px;color:#cbd5e1;display:flex;justify-content:space-between;margin-top:20px;}}

.sort-btn{{cursor:pointer;user-select:none;}}
.sort-btn:hover{{color:#f1f5f9;}}
.sort-btn::after{{content:' \\25B4\\25BE';font-size:8px;opacity:0.5;}}

@media (max-width:1200px) {{
  .kpi-row{{grid-template-columns:repeat(3,1fr);}}
  .chart-row-2,.chart-row-3{{grid-template-columns:1fr;}}
  .two-table-grid{{grid-template-columns:1fr;}}
}}
</style>
</head>
<body>

<div class="header">
  <div class="header-left">
    <h1>CAE Pipeline &amp; CRM Dashboard — FY2026</h1>
    <div class="sub">Application Engineering KPIs &amp; Pipeline Management &nbsp;|&nbsp; Data as of Mar 14, 2026 &nbsp;|&nbsp; Source: SharePoint Opportunity List</div>
  </div>
  <div class="header-right">
    <div class="meta">Total Opportunities: {S['totalRecords']} &nbsp;|&nbsp; Active Pipeline: {S['totalActive']} &nbsp;|&nbsp; Design Wins: {S['totalDesignWins']} &nbsp;|&nbsp; Closed-Lost: {S['totalClosedLost']}</div>
    <div class="stoplight-badge">
      <span style="color:#22c55e">&#9679; ON TARGET</span>
      <span style="color:#f59e0b">&#9679; AT RISK</span>
      <span style="color:#ef4444">&#9679; OFF TARGET</span>
    </div>
  </div>
</div>

<div class="main">

<!-- ═══ SECTION 1: CAE FY26 KPIs ═══ -->
<div class="section">
  <div class="section-header">
    <span class="section-number">01</span>
    <h2>CAE FY2026 KPIs — Performance vs Target</h2>
  </div>
  <div class="kpi-row">

    <!-- KPI 1: Go/NoGo Cycle Time -->
    <div class="kpi-card" style="border-top-color:{gonogo_color};">
      <div class="kpi-label">1. Go/NoGo Cycle Time</div>
      <div class="kpi-value" style="color:{gonogo_color};">{gonogo['median']}d</div>
      <div class="kpi-sub">Median &nbsp;|&nbsp; Avg: {gonogo['avg']}d</div>
      <div class="kpi-detail">Registration Date &rarr; Go/NoGo Decision</div>
      <div class="progress-wrap"><div class="progress-bar" style="width:{min(gonogo['pct'], 100)}%;background:{gonogo_color};"></div></div>
      <div class="kpi-status" style="color:{gonogo_color};">{gonogo['within_target']}/{gonogo['total']} within target ({gonogo['pct']}%)</div>
      <div class="kpi-note">Target: <strong>&lt;2 working days</strong><br>Avg skewed by outliers — median shows true performance</div>
    </div>

    <!-- KPI 2.1: TTM Off-the-shelf -->
    <div class="kpi-card" style="border-top-color:{ttm_ots_color};">
      <div class="kpi-label">2.1 TTM — Off-the-Shelf</div>
      <div class="kpi-value" style="color:{ttm_ots_color};">{ttm_ots['avg_months'] or 'N/A'}mo</div>
      <div class="kpi-sub">Avg &nbsp;|&nbsp; Median: {ttm_ots['median_months'] or 'N/A'}mo</div>
      <div class="kpi-detail">NDA &rarr; PreProduction</div>
      <div class="progress-wrap"><div class="progress-bar" style="width:{min(ttm_ots['pct_on_target'], 100)}%;background:{ttm_ots_color};"></div></div>
      <div class="kpi-status" style="color:{ttm_ots_color};">{ttm_ots['within_target']}/{ttm_ots['total']} within target ({ttm_ots['pct_on_target']}%)</div>
      <div class="kpi-note">Target: <strong>&lt;4.5 months</strong><br>n={ttm_ots['total']} completed journeys</div>
    </div>

    <!-- KPI 2.2: TTM Modified -->
    <div class="kpi-card" style="border-top-color:{ttm_mod_color};">
      <div class="kpi-label">2.2 TTM — Modified</div>
      <div class="kpi-value" style="color:{ttm_mod_color};">{ttm_mod['avg_months'] or 'N/A'}mo</div>
      <div class="kpi-sub">Avg &nbsp;|&nbsp; Median: {ttm_mod['median_months'] or 'N/A'}mo</div>
      <div class="kpi-detail">NDA &rarr; PreProduction</div>
      <div class="progress-wrap"><div class="progress-bar" style="width:{min(ttm_mod['pct_on_target'], 100)}%;background:{ttm_mod_color};"></div></div>
      <div class="kpi-status" style="color:{ttm_mod_color};">{ttm_mod['within_target']}/{ttm_mod['total']} within target ({ttm_mod['pct_on_target']}%)</div>
      <div class="kpi-note">Target: <strong>&lt;9 months</strong><br>n={ttm_mod['total']} completed journeys</div>
    </div>

    <!-- KPI 2.3: TTM NPI -->
    <div class="kpi-card" style="border-top-color:{ttm_npi_color};">
      <div class="kpi-label">2.3 TTM — NPI</div>
      <div class="kpi-value" style="color:{ttm_npi_color};">{ttm_npi['avg_months'] or 'N/A'}mo</div>
      <div class="kpi-sub">Avg &nbsp;|&nbsp; Median: {ttm_npi['median_months'] or 'N/A'}mo</div>
      <div class="kpi-detail">NDA &rarr; PreProduction</div>
      <div class="progress-wrap"><div class="progress-bar" style="width:{min(ttm_npi['pct_on_target'], 100)}%;background:{ttm_npi_color};"></div></div>
      <div class="kpi-status" style="color:{ttm_npi_color};">{ttm_npi['within_target']}/{ttm_npi['total']} within target ({ttm_npi['pct_on_target']}%)</div>
      <div class="kpi-note">Target: <strong>&lt;18 months</strong><br>n={ttm_npi['total']} completed journeys</div>
    </div>

    <!-- KPI 3: App Solution Cycle -->
    <div class="kpi-card" style="border-top-color:{appsol_color};">
      <div class="kpi-label">3. App Solution Cycle</div>
      <div class="kpi-value" style="color:{appsol_color};">{app_sol['median']}d</div>
      <div class="kpi-sub">Median &nbsp;|&nbsp; Avg: {app_sol['avg']}d</div>
      <div class="kpi-detail">Go/NoGo &rarr; Solution Provided</div>
      <div class="progress-wrap"><div class="progress-bar" style="width:{min(app_sol['pct'], 100)}%;background:{appsol_color};"></div></div>
      <div class="kpi-status" style="color:{appsol_color};">{app_sol['within_target']}/{app_sol['total']} within target ({app_sol['pct']}%)</div>
      <div class="kpi-note">Target: <strong>&lt;10 working days</strong><br>Many same-day solutions pulling median to 0</div>
    </div>

    <!-- KPI 4: DIN to DWIN Conversion -->
    <div class="kpi-card" style="border-top-color:{dindwin_color};">
      <div class="kpi-label">4. DIN &rarr; DWIN Conversion</div>
      <div class="kpi-value" style="color:{dindwin_color};">{din_dwin['rate']}%</div>
      <div class="kpi-sub">{din_dwin['dwin_count']} wins / {din_dwin['din_count']} design-ins</div>
      <div class="kpi-detail">Design-In &rarr; Design-Win</div>
      <div class="progress-wrap"><div class="progress-bar" style="width:{min(din_dwin['rate'], 100)}%;background:{dindwin_color};"></div></div>
      <div class="kpi-status" style="color:{dindwin_color};">{"ON TARGET" if din_dwin['rate'] >= 50 else "OFF TARGET"}</div>
      <div class="kpi-note">Target: <strong>&gt;50%</strong><br>Strong conversion — focus on getting more opps to DIN stage</div>
    </div>

  </div>

  <div class="commentary" style="margin-top:14px;">
    <strong>KPI Health Summary — FY2026:</strong>
    <ul>
      <li><strong>Go/NoGo (KPI 1):</strong> Median 3 days is close to the 2-day target, but avg of 77.6 days reveals a long tail of stalled decisions. 49.5% on target — needs process discipline to close the gap. Action: implement SLA alerts for Go/NoGo decisions exceeding 2 days.</li>
      <li><strong>TTM Off-the-shelf (KPI 2.1):</strong> Avg 7.5 months vs 4.5-month target — off track. Only 33% within target. The NDA-to-PrePro journey is taking too long for standard products. Action: identify bottleneck stages (Samples? Evaluation?) and set stage-level SLAs.</li>
      <li><strong>TTM Modified (KPI 2.2):</strong> Avg 8.6 months vs 9-month target — borderline. Median of 10.7mo suggests half are exceeding target. Small sample (n={ttm_mod['total']}).</li>
      <li><strong>TTM NPI (KPI 2.3):</strong> Avg 10.5 months vs 18-month target — well within range. All {ttm_npi['total']} completed NPI journeys are on target.</li>
      <li><strong>App Solution (KPI 3):</strong> 77% within 10-day target. Many same-day turnarounds pulling median to 0. Avg of 14.3d driven by complex cases. Solid performance.</li>
      <li><strong>DIN-to-DWIN (KPI 4):</strong> 79.2% conversion — well above 50% target. The bottleneck is not converting DIN to DWIN, it's getting opportunities <em>into</em> DIN stage.</li>
    </ul>
  </div>
</div>

<!-- ═══ SECTION 2: KPI DETAIL CHARTS ═══ -->
<div class="section">
  <div class="section-header">
    <span class="section-number">02</span>
    <h2>KPI Detail — Cycle Time Distributions &amp; TTM Breakdown</h2>
  </div>
  <div class="chart-row-3">
    <div class="chart-box"><div id="gonogoChart" style="height:340px;"></div></div>
    <div class="chart-box"><div id="ttmChart" style="height:340px;"></div></div>
    <div class="chart-box"><div id="appsolChart" style="height:340px;"></div></div>
  </div>
</div>

<!-- ═══ SECTION 3: PIPELINE FUNNEL & CONVERSION ═══ -->
<div class="section">
  <div class="section-header">
    <span class="section-number">03</span>
    <h2>Pipeline Funnel &amp; Stage Conversion</h2>
  </div>
  <div class="chart-row-2">
    <div class="chart-box"><div id="funnelChart" style="height:420px;"></div></div>
    <div>
      <div class="chart-box"><div id="conversionChart" style="height:200px;"></div></div>
      <div class="table-wrap" style="margin-top:12px;">
        <table>
          <thead><tr><th>Stage</th><th style="text-align:center">Reached</th><th style="text-align:center">From Previous</th><th style="text-align:center">Conversion</th></tr></thead>
          <tbody>{conv_rows}</tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- ═══ SECTION 4: VELOCITY & AGING ═══ -->
<div class="section">
  <div class="section-header">
    <span class="section-number">04</span>
    <h2>Pipeline Velocity &amp; New Lead Intake</h2>
  </div>
  <div class="chart-row-2">
    <div class="chart-box"><div id="velocityChart" style="height:360px;"></div></div>
    <div class="chart-box"><div id="intakeChart" style="height:360px;"></div></div>
  </div>
</div>

<!-- ═══ SECTION 5: CAE WORKLOAD & WIN/LOSS ═══ -->
<div class="section">
  <div class="section-header">
    <span class="section-number">05</span>
    <h2>CAE Workload &amp; Win/Loss Analysis</h2>
  </div>
  <div class="two-table-grid">
    <div>
      <div class="chart-box"><div id="caeChart" style="height:380px;"></div></div>
    </div>
    <div>
      <div class="chart-box"><div id="lossChart" style="height:320px;"></div></div>
      <div class="commentary" style="margin-top:12px;">
        <strong>Loss Analysis:</strong>
        <ul>
          <li><strong>"No feedback" ({D['lossTypes'].get('No feedback', 0)})</strong> — largest category. Not competitive losses — leads went cold. Improve follow-up cadence.</li>
          <li><strong>"SIC has no capability" ({D['lossTypes'].get('SIC has no capability', 0)})</strong> — product gaps. Feed to NPD roadmap.</li>
          <li><strong>"Use competitor product" ({D['lossTypes'].get('Use competitor product', 0) + D['lossTypes'].get('Use Competitor Product', 0)})</strong> — true competitive losses = {round((D['lossTypes'].get('Use competitor product', 0) + D['lossTypes'].get('Use Competitor Product', 0))/S['totalClosedLost']*100, 1)}% of all losses.</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- ═══ SECTION 6: PRODUCT & GEOGRAPHIC ═══ -->
<div class="section">
  <div class="section-header">
    <span class="section-number">06</span>
    <h2>Product Mix &amp; Geographic Distribution</h2>
  </div>
  <div class="chart-row-3">
    <div class="chart-box"><div id="productChart" style="height:340px;"></div></div>
    <div class="chart-box"><div id="countryChart" style="height:340px;"></div></div>
    <div class="chart-box"><div id="spChart" style="height:340px;"></div></div>
  </div>
</div>

<!-- ═══ SECTION 7: DESIGN WINS (CLOSED WON) ═══ -->
<div class="section">
  <div class="section-header">
    <span class="section-number">07</span>
    <h2>Design Wins — Closed Won ({S['totalDesignWins']} opportunities)</h2>
  </div>
  <div class="commentary" style="margin-bottom:12px;">
    <strong>{S['totalDesignWins']} Design Wins</strong> with estimated total revenue <strong>${total_won_rev:,.0f}</strong>.
    DIN&rarr;DWIN conversion rate: <strong style="color:{dindwin_color}">{din_dwin['rate']}%</strong> (target &gt;50%).
  </div>
  <div class="chart-row-2">
    <div class="chart-box"><div id="wonByProductChart" style="height:340px;"></div></div>
    <div class="chart-box"><div id="wonByRevenueChart" style="height:340px;"></div></div>
  </div>
  <div class="table-wrap" style="max-height:400px;overflow-y:auto;margin-top:12px;">
    <table>
      <thead style="position:sticky;top:0;z-index:10;"><tr>
        <th>ID</th><th>Opportunity</th><th>Customer</th><th>Product Group</th><th>Product</th><th>Sale Process</th><th>CAE</th><th>Win Date</th><th style="text-align:right">Volume</th><th style="text-align:right">Est. Revenue</th><th>Comment</th>
      </tr></thead>
      <tbody>{closed_won_rows}</tbody>
    </table>
  </div>
</div>

<!-- ═══ SECTION 8: RECENT COMMENTS / ACTIVITY ═══ -->
<div class="section">
  <div class="section-header">
    <span class="section-number">08</span>
    <h2>Recent Activity — Latest Comments</h2>
  </div>
  <div class="commentary" style="margin-bottom:12px;">
    <strong>Most recently modified opportunities</strong> with comments. Shows the latest 20 updates across the active pipeline.
  </div>
  <div class="table-wrap" style="max-height:400px;overflow-y:auto;">
    <table>
      <thead style="position:sticky;top:0;z-index:10;"><tr>
        <th>ID</th><th>Opportunity</th><th>Customer</th><th>Stage</th><th>CAE</th><th>Modified</th><th>Latest Comment</th>
      </tr></thead>
      <tbody>{comment_rows}</tbody>
    </table>
  </div>
</div>

<!-- ═══ SECTION 9: STALLED OPPORTUNITIES ═══ -->
<div class="section">
  <div class="section-header">
    <span class="section-number">09</span>
    <h2>Stalled Opportunities — Action Required</h2>
  </div>
  <div class="commentary" style="margin-bottom:12px;">
    <strong>Stalled = &gt;180 days in pipeline without advancing.</strong> Review each: advance, close-lost, or document hold reason. Showing top 30 of {S['stalledCount']}.
  </div>
  <div class="table-wrap" style="max-height:500px;overflow-y:auto;">
    <table>
      <thead style="position:sticky;top:0;z-index:10;"><tr><th>ID</th><th>Opportunity</th><th>Customer</th><th>Stage</th><th>Age</th><th>Priority</th><th>CAE</th><th>Recommended Action</th></tr></thead>
      <tbody>{stalled_rows}</tbody>
    </table>
  </div>
</div>

<!-- ═══ SECTION 10: CRM PIPELINE TABLE ═══ -->
<div class="section">
  <div class="section-header">
    <span class="section-number">10</span>
    <h2>CRM — Full Pipeline View</h2>
  </div>
  <div class="filter-bar">
    <div class="filter-group">
      <label>Search</label>
      <input type="text" id="searchInput" placeholder="Customer, opportunity, ID..." oninput="filterCRM()">
    </div>
    <div class="filter-group">
      <label>Stage</label>
      <select id="stageFilter" onchange="filterCRM()"><option value="">All Stages</option></select>
    </div>
    <div class="filter-group">
      <label>Priority</label>
      <select id="priorityFilter" onchange="filterCRM()"><option value="">All</option><option>High</option><option>Medium</option><option>Low</option></select>
    </div>
    <div class="filter-group">
      <label>Product</label>
      <select id="productFilter" onchange="filterCRM()"><option value="">All Products</option></select>
    </div>
    <div class="filter-group">
      <label>CAE</label>
      <select id="caeFilter" onchange="filterCRM()"><option value="">All CAE</option></select>
    </div>
    <div class="filter-group">
      <label>Salesperson</label>
      <select id="spFilter" onchange="filterCRM()"><option value="">All</option></select>
    </div>
    <div class="filter-group">
      <label>Country</label>
      <select id="countryFilter" onchange="filterCRM()"><option value="">All Countries</option></select>
    </div>
    <div class="filter-group">
      <label>Age</label>
      <select id="ageFilter" onchange="filterCRM()">
        <option value="">Any Age</option>
        <option value="30">&lt;30 days</option>
        <option value="90">&lt;90 days</option>
        <option value="180">&lt;180 days</option>
        <option value="181">&gt;180 days (stalled)</option>
        <option value="365">&gt;365 days</option>
      </select>
    </div>
    <span class="crm-count" id="crmCount">{S['totalActive']} opportunities</span>
  </div>
  <div class="table-wrap" style="max-height:600px;overflow-y:auto;">
    <table id="crmTable">
      <thead style="position:sticky;top:0;z-index:10;">
        <tr>
          <th class="sort-btn" onclick="sortCRM('id')">ID</th>
          <th class="sort-btn" onclick="sortCRM('name')">Opportunity</th>
          <th class="sort-btn" onclick="sortCRM('customer')">Customer</th>
          <th class="sort-btn" onclick="sortCRM('stage')">Stage</th>
          <th class="sort-btn" onclick="sortCRM('priority')">Priority</th>
          <th class="sort-btn" onclick="sortCRM('product')">Product</th>
          <th class="sort-btn" onclick="sortCRM('cae')">CAE</th>
          <th class="sort-btn" onclick="sortCRM('salesperson')">Sales</th>
          <th class="sort-btn" onclick="sortCRM('country')">Country</th>
          <th class="sort-btn" onclick="sortCRM('days')">Age</th>
          <th class="sort-btn" onclick="sortCRM('registered')">Registered</th>
          <th class="sort-btn" onclick="sortCRM('modified')">Modified</th>
          <th>Latest Comment</th>
        </tr>
      </thead>
      <tbody id="crmBody"></tbody>
    </table>
  </div>
</div>

</div>

<div class="footer">
  <span>CAE Pipeline &amp; CRM Dashboard v2.0 &nbsp;|&nbsp; Silicon Craft Technology (SIC)</span>
  <span>Data: OpportunityList_20260314_0454.xlsx &nbsp;|&nbsp; Generated Mar 14, 2026</span>
</div>

<script>
const CRM_DATA = {crm_rows_json};
const STAGE_ORDER = ['New Lead','Contact','Qualified Lead','NDA','Samples','Evaluation','Design-In','PreProduction','Design-Win'];
const STAGE_COLORS = {{'New Lead':'#94a3b8','Contact':'#60a5fa','Qualified Lead':'#38bdf8','NDA':'#2dd4bf','Samples':'#a78bfa','Evaluation':'#f59e0b','Design-In':'#fb923c','PreProduction':'#f472b6','Design-Win':'#22c55e'}};
const PRIO_MAP = {{'High':0,'Medium':1,'Low':2}};

const plotBg = '#1e293b';
const plotPaper = '#1e293b';
const plotFont = {{family:'Segoe UI',color:'#cbd5e1'}};
const plotGrid = {{color:'#334155'}};
const PL = {{paper_bgcolor:plotPaper,plot_bgcolor:plotBg,font:plotFont,margin:{{l:50,r:20,t:40,b:50}},
  xaxis:{{gridcolor:plotGrid.color,zerolinecolor:'#475569'}},yaxis:{{gridcolor:plotGrid.color,zerolinecolor:'#475569'}}}};
const cfg = {{responsive:true,displayModeBar:false}};

// Each chart wrapped in try-catch to prevent cascade failures
try{{(function(){{
  const allK={gonogo_dist_keys}, allV={gonogo_dist_vals};
  const keys=[],vals=[];let overflow=0;
  for(let i=0;i<allK.length;i++){{
    const d=parseInt(allK[i]);
    if(d<=14){{keys.push(allK[i]);vals.push(allV[i]);}}
    else{{overflow+=allV[i];}}
  }}
  if(overflow>0){{keys.push('15+');vals.push(overflow);}}
  Plotly.newPlot('gonogoChart',[{{
    type:'bar',x:keys,y:vals,
    marker:{{color:keys.map(d=>parseInt(d)<=2?'#22c55e':d==='15+'?'#ef4444':'#f59e0b')}},
    text:vals,textposition:'auto',textfont:{{color:'#f1f5f9',size:11}}
  }}],{{...PL,title:{{text:'KPI 1: Go/NoGo Cycle Time (working days)',font:{{size:13,color:'#f1f5f9'}}}},
    xaxis:{{...PL.xaxis,title:'Working Days'}},yaxis:{{...PL.yaxis,title:'Count',rangemode:'tozero',autorange:true}},showlegend:false,
    shapes:[{{type:'line',x0:2.5,x1:2.5,y0:0,y1:1,yref:'paper',line:{{color:'#ef4444',dash:'dash',width:2}}}}],
    annotations:[{{x:2.5,y:1,yref:'paper',text:'2d target',showarrow:false,font:{{color:'#ef4444',size:10}},yanchor:'bottom'}}]
  }},cfg);
}})();}}catch(e){{console.error('gonogoChart:',e);}}

try{{
Plotly.newPlot('ttmChart',[
  {{type:'bar',name:'Off-the-shelf',x:{ttm_dist_keys_json},y:{ttm_ots_bars},marker:{{color:'#3b82f6'}}}},
  {{type:'bar',name:'Modified',x:{ttm_dist_keys_json},y:{ttm_mod_bars},marker:{{color:'#f59e0b'}}}},
  {{type:'bar',name:'NPI',x:{ttm_dist_keys_json},y:{ttm_npi_bars},marker:{{color:'#8b5cf6'}}}}
],{{...PL,title:{{text:'KPI 2: Time-to-Market NDA to PrePro (months)',font:{{size:13,color:'#f1f5f9'}}}},
  barmode:'stack',xaxis:{{...PL.xaxis,title:'Months',dtick:1}},
  yaxis:{{...PL.yaxis,title:'Count',rangemode:'tozero',autorange:true}},
  legend:{{x:0.55,y:1,font:{{size:10}}}},
  shapes:[
    {{type:'line',x0:4.5,x1:4.5,y0:0,y1:1,yref:'paper',line:{{color:'#ef4444',dash:'dash',width:1.5}}}},
    {{type:'line',x0:9,x1:9,y0:0,y1:1,yref:'paper',line:{{color:'#f59e0b',dash:'dash',width:1.5}}}},
    {{type:'line',x0:18,x1:18,y0:0,y1:1,yref:'paper',line:{{color:'#8b5cf6',dash:'dash',width:1.5}}}}
  ],
  annotations:[
    {{x:4.5,y:1,yref:'paper',text:'OTS 4.5mo',showarrow:false,font:{{color:'#ef4444',size:9}},yanchor:'bottom'}},
    {{x:9,y:1,yref:'paper',text:'Mod 9mo',showarrow:false,font:{{color:'#f59e0b',size:9}},yanchor:'bottom'}},
    {{x:18,y:1,yref:'paper',text:'NPI 18mo',showarrow:false,font:{{color:'#8b5cf6',size:9}},yanchor:'bottom'}}
  ]
}},cfg);
}}catch(e){{console.error('ttmChart:',e);}}

try{{(function(){{
  const allK={appsol_dist_keys}, allV={appsol_dist_vals};
  const keys=[],vals=[];let overflow=0;
  for(let i=0;i<allK.length;i++){{
    const d=parseInt(allK[i]);
    if(d<=29){{keys.push(allK[i]);vals.push(allV[i]);}}
    else{{overflow+=allV[i];}}
  }}
  if(overflow>0){{keys.push('30+');vals.push(overflow);}}
  Plotly.newPlot('appsolChart',[{{
    type:'bar',x:keys,y:vals,
    marker:{{color:keys.map(d=>parseInt(d)<=10?'#22c55e':d==='30+'?'#ef4444':'#f59e0b')}},
    text:vals,textposition:'auto',textfont:{{color:'#f1f5f9',size:11}}
  }}],{{...PL,title:{{text:'KPI 3: App Solution Cycle Time (working days)',font:{{size:13,color:'#f1f5f9'}}}},
    xaxis:{{...PL.xaxis,title:'Working Days'}},yaxis:{{...PL.yaxis,title:'Count',rangemode:'tozero',autorange:true}},showlegend:false,
    shapes:[{{type:'line',x0:10.5,x1:10.5,y0:0,y1:1,yref:'paper',line:{{color:'#ef4444',dash:'dash',width:2}}}}],
    annotations:[{{x:10.5,y:1,yref:'paper',text:'10d target',showarrow:false,font:{{color:'#ef4444',size:10}},yanchor:'bottom'}}]
  }},cfg);
}})();}}catch(e){{console.error('appsolChart:',e);}}

try{{(function(){{
  const stg={funnel_stages},cnt={funnel_counts};
  const fStg=[],fCnt=[];
  for(let i=0;i<stg.length;i++){{if(cnt[i]>0){{fStg.push(stg[i]);fCnt.push(cnt[i]);}}}}
  Plotly.newPlot('funnelChart',[{{
    type:'funnel',y:fStg,x:fCnt,
    textinfo:'value+percent initial',
    marker:{{color:fStg.map(s=>STAGE_COLORS[s]||'#64748b')}},
    connector:{{line:{{color:'#475569'}}}},textfont:{{color:'#f1f5f9',size:13}}
  }}],{{...PL,title:{{text:'Active Pipeline Funnel',font:{{size:14,color:'#f1f5f9'}}}},margin:{{l:120,r:20,t:50,b:20}}}},cfg);
}})();}}catch(e){{console.error('funnelChart:',e);}}

try{{
Plotly.newPlot('conversionChart',[{{
  type:'bar',x:{json.dumps([c['stage'] for c in D['conversion']])},
  y:{json.dumps([c['rate'] for c in D['conversion']])},
  marker:{{color:{json.dumps([c['rate'] for c in D['conversion']])}.map(r=>r>=50?'#22c55e':r>=30?'#f59e0b':'#ef4444')}},
  text:{json.dumps([str(c['rate'])+'%' for c in D['conversion']])},textposition:'auto',textfont:{{color:'#f1f5f9',size:11}}
}}],{{...PL,title:{{text:'Stage Conversion Rates',font:{{size:13,color:'#f1f5f9'}}}},margin:{{l:40,r:10,t:40,b:60}},
  xaxis:{{...PL.xaxis,type:'category',tickangle:-35,tickfont:{{size:9}}}},yaxis:{{gridcolor:'#334155',zerolinecolor:'#475569',type:'linear',title:'%',rangemode:'tozero'}},showlegend:false}},cfg);
}}catch(e){{console.error('conversionChart:',e);}}

try{{
Plotly.newPlot('velocityChart',[{{
  type:'bar',x:{vel_stages},y:{vel_avg},
  marker:{{color:{vel_avg}.map(d=>d>400?'#ef4444':d>250?'#f59e0b':'#22c55e')}},
  text:{vel_avg}.map(d=>d+'d'),textposition:'auto',textfont:{{color:'#f1f5f9',size:11}}
}}],{{...PL,title:{{text:'Pipeline Velocity — Avg Days Since Registration by Stage',font:{{size:14,color:'#f1f5f9'}}}},
  xaxis:{{...PL.xaxis,type:'category',tickangle:-25}},yaxis:{{gridcolor:'#334155',zerolinecolor:'#475569',type:'linear',title:'Days',rangemode:'tozero'}},showlegend:false}},cfg);
}}catch(e){{console.error('velocityChart:',e);}}

try{{
Plotly.newPlot('intakeChart',[{{
  type:'bar',x:{intake_months},y:{intake_counts},marker:{{color:'#3b82f6'}},
  text:{intake_counts},textposition:'auto',textfont:{{color:'#f1f5f9',size:11}}
}}],{{...PL,title:{{text:'Monthly New Lead Intake (Last 12mo)',font:{{size:14,color:'#f1f5f9'}}}},
  xaxis:{{...PL.xaxis,type:'category',tickangle:-35}},yaxis:{{gridcolor:'#334155',zerolinecolor:'#475569',type:'linear',title:'New Leads',rangemode:'tozero'}},showlegend:false}},cfg);
}}catch(e){{console.error('intakeChart:',e);}}

try{{
Plotly.newPlot('caeChart',[
  {{type:'bar',name:'High',x:{cae_names_short},y:{json.dumps([c['high'] for c in D['caeWorkload']])},marker:{{color:'#ef4444'}}}},
  {{type:'bar',name:'Medium',x:{cae_names_short},y:{json.dumps([c['medium'] for c in D['caeWorkload']])},marker:{{color:'#f59e0b'}}}},
  {{type:'bar',name:'Low',x:{cae_names_short},y:{json.dumps([c['low'] for c in D['caeWorkload']])},marker:{{color:'#64748b'}}}}
],{{...PL,title:{{text:'CAE Workload by Priority',font:{{size:13,color:'#f1f5f9'}}}},barmode:'stack',
  xaxis:{{...PL.xaxis,type:'category',tickfont:{{size:11}}}},yaxis:{{gridcolor:'#334155',zerolinecolor:'#475569',type:'linear',title:'Opportunities',rangemode:'tozero'}},
  legend:{{x:0.7,y:1,font:{{size:11}}}}}},cfg);
}}catch(e){{console.error('caeChart:',e);}}

try{{
Plotly.newPlot('lossChart',[{{
  type:'pie',labels:{loss_labels},values:{loss_values},
  hole:0.4,textinfo:'percent',textposition:'inside',
  marker:{{colors:['#ef4444','#f59e0b','#8b5cf6','#64748b','#3b82f6','#94a3b8','#22c55e','#f472b6','#475569']}},
  textfont:{{size:11,color:'#f1f5f9'}},
  insidetextorientation:'horizontal',
  pull:[0.03,0,0,0,0,0,0,0,0]
}}],{{...PL,title:{{text:'Closed-Lost Reasons',font:{{size:14,color:'#f1f5f9'}}}},
  margin:{{l:10,r:10,t:50,b:10}},showlegend:true,
  legend:{{font:{{size:10,color:'#cbd5e1'}},x:0,y:-0.15,orientation:'h'}}}},cfg);
}}catch(e){{console.error('lossChart:',e);}}

try{{
Plotly.newPlot('productChart',[{{
  type:'bar',x:{pg_values},y:{pg_labels},orientation:'h',
  marker:{{color:['#3b82f6','#8b5cf6','#22c55e','#f59e0b','#ef4444','#14b8a6','#f472b6','#64748b','#a78bfa']}},
  text:{pg_values},textposition:'auto',textfont:{{color:'#f1f5f9',size:11}}
}}],{{...PL,title:{{text:'Active Pipeline by Product',font:{{size:13,color:'#f1f5f9'}}}},
  margin:{{l:90,r:20,t:40,b:30}},yaxis:{{...PL.yaxis,autorange:'reversed'}},
  xaxis:{{...PL.xaxis,title:'Opportunities',rangemode:'tozero',autorange:true}},showlegend:false}},cfg);
}}catch(e){{console.error('productChart:',e);}}

try{{
Plotly.newPlot('countryChart',[{{
  type:'bar',x:{cty_values},y:{cty_labels},orientation:'h',marker:{{color:'#14b8a6'}},
  text:{cty_values},textposition:'inside',textangle:0,textfont:{{color:'#f1f5f9',size:11}},
  insidetextanchor:'middle'
}}],{{...PL,title:{{text:'Pipeline by Country (Top 15)',font:{{size:13,color:'#f1f5f9'}}}},
  margin:{{l:100,r:20,t:40,b:30}},yaxis:{{...PL.yaxis,autorange:'reversed'}},
  xaxis:{{...PL.xaxis,title:'Opportunities',rangemode:'tozero',autorange:true}},showlegend:false}},cfg);
}}catch(e){{console.error('countryChart:',e);}}

try{{
Plotly.newPlot('spChart',[{{
  type:'bar',x:{sp_labels},y:{sp_values},marker:{{color:'#a78bfa'}},
  text:{sp_values},textposition:'auto',textfont:{{color:'#f1f5f9',size:11}}
}}],{{...PL,title:{{text:'Pipeline by Salesperson',font:{{size:13,color:'#f1f5f9'}}}},
  margin:{{l:40,r:20,t:40,b:50}},xaxis:{{...PL.xaxis,type:'category'}},yaxis:{{gridcolor:'#334155',zerolinecolor:'#475569',type:'linear',title:'Opportunities',rangemode:'tozero'}},showlegend:false}},cfg);
}}catch(e){{console.error('spChart:',e);}}

try{{
Plotly.newPlot('wonByProductChart',[{{
  type:'pie',labels:{won_product_labels},values:{won_product_counts},
  hole:0.4,textinfo:'label+value+percent',textposition:'auto',
  marker:{{colors:['#3b82f6','#8b5cf6','#22c55e','#f59e0b','#ef4444','#14b8a6','#f472b6','#64748b']}},
  textfont:{{size:11,color:'#f1f5f9'}},
  insidetextorientation:'horizontal'
}}],{{...PL,title:{{text:'Design Wins by Product Segment',font:{{size:14,color:'#f1f5f9'}}}},
  margin:{{l:10,r:10,t:50,b:10}},showlegend:true,
  legend:{{font:{{size:11,color:'#cbd5e1'}},x:0,y:-0.15,orientation:'h'}}}},cfg);
}}catch(e){{console.error('wonByProductChart:',e);}}

try{{
Plotly.newPlot('wonByRevenueChart',[{{
  type:'pie',labels:{won_product_rev_labels},values:{won_product_rev_values},
  hole:0.4,textinfo:'label+percent',textposition:'auto',
  marker:{{colors:['#3b82f6','#8b5cf6','#22c55e','#f59e0b','#ef4444','#14b8a6','#f472b6','#64748b']}},
  textfont:{{size:11,color:'#f1f5f9'}},
  insidetextorientation:'horizontal'
}}],{{...PL,title:{{text:'Design Win Revenue by Product Segment',font:{{size:14,color:'#f1f5f9'}}}},
  margin:{{l:10,r:10,t:50,b:10}},showlegend:true,
  legend:{{font:{{size:11,color:'#cbd5e1'}},x:0,y:-0.15,orientation:'h'}}}},cfg);
}}catch(e){{console.error('wonByRevenueChart:',e);}}

// CRM TABLE
let sortCol='days', sortAsc=false, filtered=CRM_DATA.slice();

function initFilters() {{
  const stages=new Set(), products=new Set(), caes=new Set(), sps=new Set(), countries=new Set();
  CRM_DATA.forEach(r=>{{stages.add(r.stage);products.add(r.product);if(r.cae)caes.add(r.cae);sps.add(r.salesperson);if(r.country)countries.add(r.country);}});
  const addOpts=(id,vals)=>{{const el=document.getElementById(id);[...vals].sort().forEach(v=>{{const o=document.createElement('option');o.value=v;o.textContent=v;el.appendChild(o);}});}};
  STAGE_ORDER.forEach(s=>{{if(stages.has(s)){{const o=document.createElement('option');o.value=s;o.textContent=s;document.getElementById('stageFilter').appendChild(o);}}}});
  addOpts('productFilter',products);addOpts('caeFilter',caes);addOpts('spFilter',sps);addOpts('countryFilter',countries);
}}

function filterCRM() {{
  const search=document.getElementById('searchInput').value.toLowerCase();
  const stage=document.getElementById('stageFilter').value;
  const prio=document.getElementById('priorityFilter').value;
  const prod=document.getElementById('productFilter').value;
  const cae=document.getElementById('caeFilter').value;
  const sp=document.getElementById('spFilter').value;
  const country=document.getElementById('countryFilter').value;
  const age=document.getElementById('ageFilter').value;
  filtered=CRM_DATA.filter(r=>{{
    if(search && !r.id.toLowerCase().includes(search) && !r.name.toLowerCase().includes(search) && !r.customer.toLowerCase().includes(search)) return false;
    if(stage && r.stage!==stage) return false;
    if(prio && r.priority!==prio) return false;
    if(prod && r.product!==prod) return false;
    if(cae && r.cae!==cae) return false;
    if(sp && r.salesperson!==sp) return false;
    if(country && r.country!==country) return false;
    if(age==='30' && r.days>=30) return false;
    if(age==='90' && r.days>=90) return false;
    if(age==='180' && r.days>=180) return false;
    if(age==='181' && r.days<180) return false;
    if(age==='365' && r.days<365) return false;
    return true;
  }});
  renderCRM();
}}

function sortCRM(col) {{
  if(sortCol===col) sortAsc=!sortAsc; else {{sortCol=col;sortAsc=true;}}
  renderCRM();
}}

function renderCRM() {{
  const sorted=[...filtered].sort((a,b)=>{{
    let av=a[sortCol],bv=b[sortCol];
    if(sortCol==='stage'){{av=STAGE_ORDER.indexOf(av);bv=STAGE_ORDER.indexOf(bv);}}
    if(sortCol==='priority'){{av=PRIO_MAP[av]||9;bv=PRIO_MAP[bv]||9;}}
    if(typeof av==='string') return sortAsc?av.localeCompare(bv):bv.localeCompare(av);
    return sortAsc?av-bv:bv-av;
  }});
  const tbody=document.getElementById('crmBody');
  tbody.innerHTML=sorted.map(r=>{{
    const ageCls=r.days>365?'age-red':r.days>180?'age-amber':'age-green';
    const prioCls=r.priority==='High'?'prio-high':r.priority==='Medium'?'prio-medium':'prio-low';
    const sc=STAGE_COLORS[r.stage]||'#64748b';
    return `<tr>
      <td style="color:#94a3b8;font-size:10px;white-space:nowrap">${{r.id}}</td>
      <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${{r.name}}">${{r.name}}</td>
      <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${{r.customer}}">${{r.customer}}</td>
      <td><span class="stage-pill" style="background:${{sc}}30;color:${{sc}};border:1px solid ${{sc}}50">${{r.stage}}</span></td>
      <td class="${{prioCls}}">${{r.priority}}</td>
      <td>${{r.product}}</td>
      <td style="font-size:11px">${{r.cae}}</td>
      <td style="font-size:11px">${{r.salesperson}}</td>
      <td style="font-size:11px">${{r.country}}</td>
      <td><span class="age-badge ${{ageCls}}">${{r.days}}d</span></td>
      <td style="font-size:10px;white-space:nowrap">${{r.registered}}</td>
      <td style="font-size:10px;white-space:nowrap">${{r.modified}}</td>
      <td style="font-size:10px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${{r.comment}}">${{r.comment}}</td>
    </tr>`;
  }}).join('');
  document.getElementById('crmCount').textContent=filtered.length+' opportunities';
}}

initFilters();
renderCRM();
</script>
</body>
</html>'''

import glob, re as re_mod

out_dir = r'C:\Users\intln\Claude\Projects\Business-SICT\SIC-Dashboards\cae'
existing = glob.glob(f'{out_dir}/CAE_Pipeline_Dashboard_FY2026_v*.html')
max_ver = 0
for f in existing:
    m = re_mod.search(r'_v(\d+(?:\.\d+)?)', f)
    if m:
        v = float(m.group(1))
        if v > max_ver: max_ver = v
next_ver = f'{max_ver + 0.1:.1f}' if max_ver >= 2 else '2.0'
out_file = f'{out_dir}/CAE_Pipeline_Dashboard_FY2026_v{next_ver}.html'

with open(out_file, 'w', encoding='utf-8') as f:
    f.write(dashboard_html)

print(f"Dashboard v{next_ver} written: {len(dashboard_html):,} bytes")
print(f"File: {out_file}")
