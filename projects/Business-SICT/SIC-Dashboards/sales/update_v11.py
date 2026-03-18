"""Update Sales KPI Dashboard from v10 → v11 with Mar 17 data."""
import re, os

DASH = os.path.expanduser('~/Claude/Projects/Business-SICT/SIC-Dashboards/sales/Sales_KPI_Dashboard_FY2026_v10.html')

with open(DASH, 'r', encoding='utf-8') as f:
    html = f.read()

# === HEADER ===
html = html.replace('Data as of Mar 13, 2026', 'Data as of Mar 17, 2026')

# === SECTION 01: KPI SCORECARDS ===

# Card 1: Revenue QTD
html = html.replace('Revenue QTD (Q1 to Mar 13)', 'Revenue QTD (Q1 to Mar 17)')
html = html.replace(
    '>$4.69M</div>\n      <div class="kpi-sub">vs Q1 Target $5.72M (82.1%) | QTD+SO: $5.73M',
    '>$4.80M</div>\n      <div class="kpi-sub">vs Q1 Target $5.71M (84.1%) | QTD+SO: $5.68M'
)
html = html.replace('width:82%;background:#22c55e;"></div></div>\n      <div class="kpi-status" style="color:#22c55e;">\U0001f7e2 ON TRACK &nbsp; 82.1%',
                     'width:84%;background:#22c55e;"></div></div>\n      <div class="kpi-status" style="color:#22c55e;">\U0001f7e2 ON TRACK &nbsp; 84.1%')
html = html.replace(
    'Q1 QTD+SO = $5.73M \u2014 <strong style="color:#22c55e;">100.4% of Q1 target</strong><br>H1 progress: 41.5% | Jan $2.34M \u00b7 Feb $1.41M \u00b7 Mar $0.95M QTD',
    'Q1 QTD+SO = $5.68M \u2014 <strong style="color:#22c55e;">99.4% of Q1 target</strong><br>H1 progress: 42.5% | Jan $2.34M \u00b7 Feb $1.51M \u00b7 Mar $0.77M QTD'
)

# Card 2: FY FCST 80%
html = html.replace('>$18.27M</div>\n      <div class="kpi-sub">vs Annual Budget $22.0M</div>',
                     '>$19.10M</div>\n      <div class="kpi-sub">vs Annual Budget $22.0M</div>')
html = html.replace('width:83%;background:#22c55e;"></div></div>\n      <div class="kpi-status" style="color:#22c55e;">\U0001f7e2 ON TRACK &nbsp; 83.0%',
                     'width:87%;background:#22c55e;"></div></div>\n      <div class="kpi-status" style="color:#22c55e;">\U0001f7e2 ON TRACK &nbsp; 86.8%')
html = html.replace('-$3.73M (-17.0%)', '-$2.90M (-13.2%)')

# Card 3: Total Weighted FCST
html = html.replace('>$19.03M</div>\n      <div class="kpi-sub">vs Annual Budget $22.0M</div>',
                     '>$20.09M</div>\n      <div class="kpi-sub">vs Annual Budget $22.0M</div>')
html = html.replace('width:87%;background:#f59e0b;"></div></div>\n      <div class="kpi-status" style="color:#f59e0b;">\U0001f7e1 AT RISK &nbsp; 86.5%',
                     'width:91%;background:#22c55e;"></div></div>\n      <div class="kpi-status" style="color:#22c55e;">\U0001f7e2 ON TRACK &nbsp; 91.3%')

# Card 5: Forecast Accuracy
html = html.replace('Actual $3.74M vs FCST $3.82M', 'Actual $3.84M vs FCST $3.71M')

# Card 6: Book-to-Bill
html = html.replace('Orders $2.34M vs Revenue $3.74M', 'Orders $2.34M vs Revenue $3.84M')
html = html.replace('$1.04M open SO pending', '$0.88M open SO pending')

# === SECTION 02: ROLLING HORIZON Q1 ===
# Q1 QTD+SO value
html = html.replace('>QTD + SO</div>\n          <div style="font-size:18px;font-weight:800;color:#22c55e;">$5.73M',
                     '>QTD + SO</div>\n          <div style="font-size:18px;font-weight:800;color:#22c55e;">$5.68M')
# Q1 QTD Actual
html = html.replace('>QTD Actual</div>\n          <div style="font-size:18px;font-weight:800;color:#14b8a6;">$4.69M',
                     '>QTD Actual</div>\n          <div style="font-size:18px;font-weight:800;color:#14b8a6;">$4.80M')
# Q1 Open SO
html = html.replace('>Open SO</div>\n          <div style="font-size:18px;font-weight:800;color:#3b82f6;">$1.04M',
                     '>Open SO</div>\n          <div style="font-size:18px;font-weight:800;color:#3b82f6;">$0.88M')
# Q1 progress bar percentage
html = html.replace('>100.4%</span>', '>99.4%</span>')
html = html.replace('Q1 coverage 100.4%', 'Q1 coverage 99.4%')
html = html.replace('+$0.02M ahead</strong> of budget', '-$0.03M behind</strong> budget')
html = html.replace(
    'Q1 on-plan \u2014 Jan $2.34M \u00b7 Feb $1.41M \u00b7 Mar $0.95M QTD + $1.04M open SO',
    'Q1 on-plan \u2014 Jan $2.34M \u00b7 Feb $1.51M \u00b7 Mar $0.77M QTD + $0.88M open SO'
)

# Q2 widget
html = html.replace('>$5.55M</div>\n        </div>\n        <div>\n          <div style="font-size:9px;color:#cbd5e1;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">80% FCST</div>\n          <div style="font-size:18px;font-weight:800;color:#f59e0b;">$3.92M',
                     '>$5.53M</div>\n        </div>\n        <div>\n          <div style="font-size:9px;color:#cbd5e1;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">80% FCST</div>\n          <div style="font-size:18px;font-weight:800;color:#f59e0b;">$4.72M')
html = html.replace('>$4.23M</div>\n        </div>\n        <div>\n          <div style="font-size:9px;color:#cbd5e1;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">Q2 Gap</div>\n          <div style="font-size:18px;font-weight:800;color:#ef4444;">-$1.32M',
                     '>$3.99M</div>\n        </div>\n        <div>\n          <div style="font-size:9px;color:#cbd5e1;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">Q2 Gap</div>\n          <div style="font-size:18px;font-weight:800;color:#ef4444;">-$0.81M')
html = html.replace('>70.7%</span>', '>85.4%</span>')
html = html.replace('width:71%;height:100%;background:#f59e0b;', 'width:85%;height:100%;background:#22c55e;')
html = html.replace('76.3% SO coverage', '72.2% SO coverage')
html = html.replace('Q2 gap vs budget: <strong style="color:#ef4444;">-$1.32M</strong>',
                     'Q2 gap vs budget: <strong style="color:#ef4444;">-$0.81M</strong>')

# FY widget
html = html.replace('>$18.27M</div>\n        </div>\n        <div>\n          <div style="font-size:9px;color:#cbd5e1;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">Open SO (FY)</div>\n          <div style="font-size:18px;font-weight:800;color:#3b82f6;">$11.64M',
                     '>$19.10M</div>\n        </div>\n        <div>\n          <div style="font-size:9px;color:#cbd5e1;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px;">Open SO (FY)</div>\n          <div style="font-size:18px;font-weight:800;color:#3b82f6;">$12.01M')
html = html.replace('>FY Gap</div>\n          <div style="font-size:18px;font-weight:800;color:#ef4444;">-$3.73M',
                     '>FY Gap</div>\n          <div style="font-size:18px;font-weight:800;color:#ef4444;">-$2.90M')
html = html.replace('>83.0%</span>\n        </div>\n        <div style="background:#334155;border-radius:4px;height:6px;overflow:hidden;">\n          <div style="width:83%;height:100%;background:#22c55e;',
                     '>86.8%</span>\n        </div>\n        <div style="background:#334155;border-radius:4px;height:6px;overflow:hidden;">\n          <div style="width:87%;height:100%;background:#22c55e;')

# Q-by-Q mini breakdown
html = html.replace('>$1.05M</div>\n          <div style="font-size:8px;color:#cbd5e1;">Mar remaining',
                     '>$0.88M</div>\n          <div style="font-size:8px;color:#cbd5e1;">Mar remaining')
html = html.replace('>$4.23M</div>\n          <div style="font-size:8px;color:#22c55e;">76.3%',
                     '>$3.99M</div>\n          <div style="font-size:8px;color:#22c55e;">72.2%')
html = html.replace('>$3.40M</div>\n          <div style="font-size:8px;color:#f59e0b;">77.8%',
                     '>$3.70M</div>\n          <div style="font-size:8px;color:#f59e0b;">66.2%')

# Q2 priority actions gap amount
html = html.replace('Close $1.32M Gap', 'Close $0.81M Gap')

# === PLOTLY CHART: Monthly Revenue ===
# Update Feb actual
html = html.replace('"y":[2336020,1406761,945102,0,0,0,0,0,0,0,0,0]',
                     '"y":[2336020,1507322,771590,0,0,0,0,0,0,0,0,0]')
# Update Open SO by month
html = html.replace('"y":[0,0,1045725,1512811,1258806,1462353,875162,1228932,857705,1629177,849415,916609]',
                     '"y":[0,0,878978,1555171,1122691,1315353,870738,1228932,855493,1633713,844991,1223759]')
# Update 80% FCST avg line
html = html.replace('"y":[1522566,1522566,1522566,1522566,1522566,1522566,1522566,1522566,1522566,1522566,1522566,1522566]',
                     '"y":[1591313,1591313,1591313,1591313,1591313,1591313,1591313,1591313,1591313,1591313,1591313,1591313]')

# === PLOTLY CHART: Salesperson ===
# Budget bars - Terry and Nuttapon budgets changed slightly
html = html.replace('"y":[10578896,1924653,128557,438365,3536363,4630859],"type":"bar"},',
                     '"y":[10578896,1924653,101057,438365,3501463,4630858],"type":"bar"},')
# 80% FCST bars
html = html.replace('"y":[8869491,1264422,115745,160593,3245398,4615140],"type":"bar"},',
                     '"y":[9023399,1836310,125557,160593,2805287,5144612],"type":"bar"},')
# YTD Actual bars (note: trace order was changed to Budget→FCST→Actual→SO)
html = html.replace('"y":[2008044,346394,27839,19561,764252,1521793],"type":"bar"},',
                     '"y":[2065574,334654,27839,19561,637555,1529749],"type":"bar"},')
# Open SO bars
html = html.replace('"y":[6557562,1147147,62943,140472,1882537,1840080],"type":"bar"}',
                     '"y":[6888512,1158886,62455,140472,2039619,1839074],"type":"bar"}')

# === SECTION 04: Sales Team Table ===
# Intira
html = html.replace('<td>$10.58M</td>\n      <td style="color:#22c55e;font-weight:700;">$8.87M<br><small>84%</small></td>\n      <td style="color:#14b8a6;">$2.01M</td>\n      <td style="color:#3b82f6;">$6.56M</td>\n      <td style="color:#ef4444;">-$1.71M</td>',
                     '<td>$10.58M</td>\n      <td style="color:#22c55e;font-weight:700;">$9.02M<br><small>85%</small></td>\n      <td style="color:#14b8a6;">$2.07M</td>\n      <td style="color:#3b82f6;">$6.89M</td>\n      <td style="color:#ef4444;">-$1.56M</td>')
# Lisa
html = html.replace('<td>$1.92M</td>\n      <td style="color:#f59e0b;font-weight:700;">$1.26M<br><small>66%</small></td>\n      <td style="color:#14b8a6;">$0.35M</td>\n      <td style="color:#3b82f6;">$1.15M</td>\n      <td style="color:#ef4444;">-$660K</td>',
                     '<td>$1.92M</td>\n      <td style="color:#22c55e;font-weight:700;">$1.84M<br><small>95%</small></td>\n      <td style="color:#14b8a6;">$0.33M</td>\n      <td style="color:#3b82f6;">$1.16M</td>\n      <td style="color:#ef4444;">-$88K</td>')
# Lisa status update
html = html.replace('<td><span style="color:#f59e0b;font-size:10px;font-weight:700;">\U0001f7e1 AT RISK</span></td>\n      <td style="font-size:10px;color:#cbd5e1;">Closed Waferwon SIC73F1 50K pcs (done) + 150K pcs pending HID qualification.</td>',
                     '<td><span style="color:#22c55e;font-size:10px;font-weight:700;">\U0001f7e2 ON TRACK</span></td>\n      <td style="font-size:10px;color:#cbd5e1;">Closed Waferwon SIC73F1 50K pcs (done) + 150K pcs pending HID qualification.</td>')
# Nuttapon
html = html.replace('<td>$0.13M</td>\n      <td style="color:#22c55e;font-weight:700;">$0.12M<br><small>90%</small></td>\n      <td style="color:#14b8a6;">$0.03M</td>\n      <td style="color:#3b82f6;">$0.06M</td>\n      <td style="color:#ef4444;">-$13K</td>',
                     '<td>$0.10M</td>\n      <td style="color:#22c55e;font-weight:700;">$0.13M<br><small>124%</small></td>\n      <td style="color:#14b8a6;">$0.03M</td>\n      <td style="color:#3b82f6;">$0.06M</td>\n      <td style="color:#22c55e;">+$25K</td>')
# Nuttapon status - now green because FC > budget
html = html.replace('<td><span style="color:#22c55e;font-size:10px;font-weight:700;">\U0001f7e2 ON TRACK</span></td>\n      <td style="font-size:10px;color:#cbd5e1;">Hitachi JP SIC73F1 frame order',
                     '<td><span style="color:#22c55e;font-size:10px;font-weight:700;">\U0001f7e2 ON TRACK</span></td>\n      <td style="font-size:10px;color:#cbd5e1;">Hitachi JP SIC73F1 frame order')
# Shan
html = html.replace('<td>$0.44M</td>\n      <td style="color:#ef4444;font-weight:700;">$0.16M<br><small>37%</small></td>\n      <td style="color:#14b8a6;">$0.02M</td>\n      <td style="color:#3b82f6;">$0.14M</td>\n      <td style="color:#ef4444;">-$278K</td>',
                     '<td>$0.44M</td>\n      <td style="color:#ef4444;font-weight:700;">$0.16M<br><small>37%</small></td>\n      <td style="color:#14b8a6;">$0.02M</td>\n      <td style="color:#3b82f6;">$0.14M</td>\n      <td style="color:#ef4444;">-$278K</td>')
# Terry
html = html.replace('<td>$3.54M</td>\n      <td style="color:#22c55e;font-weight:700;">$3.25M<br><small>92%</small></td>\n      <td style="color:#14b8a6;">$0.76M</td>\n      <td style="color:#3b82f6;">$1.88M</td>\n      <td style="color:#ef4444;">-$291K</td>',
                     '<td>$3.50M</td>\n      <td style="color:#22c55e;font-weight:700;">$2.81M<br><small>80%</small></td>\n      <td style="color:#14b8a6;">$0.64M</td>\n      <td style="color:#3b82f6;">$2.04M</td>\n      <td style="color:#ef4444;">-$696K</td>')
# Terry status
html = html.replace('<td><span style="color:#22c55e;font-size:10px;font-weight:700;">\U0001f7e2 ON TRACK</span></td>\n      <td style="font-size:10px;color:#cbd5e1;">FV SIC5777 ~50 wafers May\u2013Jun ($294K). Astag RE41 pre-prod lot imminent. Changjo RA10 PO received $159K.</td>',
                     '<td><span style="color:#22c55e;font-size:10px;font-weight:700;">\U0001f7e2 ON TRACK</span></td>\n      <td style="font-size:10px;color:#cbd5e1;">FV SIC5777 ~50 wafers May\u2013Jun ($294K). Astag RE41 pre-prod lot imminent. Changjo RA10 PO received $159K.</td>')
# Tunn
html = html.replace('<td>$4.63M</td>\n      <td style="color:#22c55e;font-weight:700;">$4.62M<br><small>100%</small></td>\n      <td style="color:#14b8a6;">$1.52M</td>\n      <td style="color:#3b82f6;">$1.84M</td>\n      <td style="color:#ef4444;">-$16K</td>',
                     '<td>$4.63M</td>\n      <td style="color:#22c55e;font-weight:700;">$5.14M<br><small>111%</small></td>\n      <td style="color:#14b8a6;">$1.53M</td>\n      <td style="color:#3b82f6;">$1.84M</td>\n      <td style="color:#22c55e;">+$514K</td>')
# Total row
html = html.replace('  <td>$22.00M</td>\n  <td style="color:#22c55e;font-weight:700;">$18.27M<br><small>83.0%</small></td>\n  <td style="color:#14b8a6;">$4.69M</td>\n  <td style="color:#3b82f6;">$11.64M</td>\n  <td style="color:#ef4444;">-$3.73M</td>',
                     '  <td>$21.18M</td>\n  <td style="color:#22c55e;font-weight:700;">$19.10M<br><small>90.2%</small></td>\n  <td style="color:#14b8a6;">$4.80M</td>\n  <td style="color:#3b82f6;">$12.01M</td>\n  <td style="color:#ef4444;">-$2.08M</td>')

# === SECTION 05: Revenue Breakdown ===
# Region chart - YTD 2026 actual
html = html.replace('"y":[3435282,1025782,206912,19561],"type":"bar"}',
                     '"y":[3500769,888396,205862,19561],"type":"bar"}')

# Segment donut
html = html.replace('"values":[2623945,471868,314323,299354,32752]',
                     '"values":[3061267,605231,385430,523960,39046]')
html = html.replace('"labels":["Animal ID","Industrial","Immobilizer","Access Control","Innovative NFC"]',
                     '"labels":["Animal ID","Industrial","Immobilizer","Access Control","Innovative NFC"]')
html = html.replace('Animal ID = 69% of YTD revenue', 'Animal ID = 66% of YTD revenue')

# Top 10 Products
html = html.replace(
    '"x":[2065737,491567,315945,246013,126574,109885,80195,64194,61046,31553],"y":["SIC279","AFX","SIC278","SIC5777X2","ULTX","SIC73F1","ATL3X","SIC7150","ATLF2SG2","SIC4340X2"]',
    '"x":[2527358,491567,441515,334266,189281,109885,80195,64194,61046,37846],"y":["SIC279","AFX","SIC5777X2","SIC278","ULTX","SIC73F1","ATL3X","SIC7150","ATLF2SG2","SIC4340X2"]'
)
html = html.replace(
    '"text":["$2066K","$492K","$316K","$246K","$127K","$110K","$80K","$64K","$61K","$32K"]',
    '"text":["$2527K","$492K","$442K","$334K","$189K","$110K","$80K","$64K","$61K","$38K"]'
)
html = html.replace(
    '"color":[2065737,491567,315945,246013,126574,109885,80195,64194,61046,31553]',
    '"color":[2527358,491567,441515,334266,189281,109885,80195,64194,61046,37846]'
)
html = html.replace('SIC279 leads at $2.07M', 'SIC279 leads at $2.53M')

# Top 10 Customers
html = html.replace(
    '"x":[1485829,969064,249598,160042,108642,102168,95256,73216,60375,56592],"y":["Allflex","HID Global","Freevision","FASTHINK","Queclink","Waferwon","LUX-IDent","Lanhai","Caisley","SMARTRAC"]',
    '"x":[1616550,1296605,445100,218849,108642,102168,95256,92575,91537,60375],"y":["Allflex","HID Global","Freevision","FASTHINK","Queclink","Waferwon","LUX-IDent","Fofia","Lanhai","Caisley"]'
)
html = html.replace(
    '"text":["$1486K","$969K","$250K","$160K","$109K","$102K","$95K","$73K","$60K","$57K"]',
    '"text":["$1617K","$1297K","$445K","$219K","$109K","$102K","$95K","$93K","$92K","$60K"]'
)
html = html.replace(
    '"color":[1485829,969064,249598,160042,108642,102168,95256,73216,60375,56592]',
    '"color":[1616550,1296605,445100,218849,108642,102168,95256,92575,91537,60375]'
)
html = html.replace('Allflex tops at $1.49M | Top 3 = 72%', 'Allflex tops at $1.62M | Top 3 = 73%')

# Revenue commentary
html = html.replace(
    'EMEA dominates</strong> YTD 2026 at $3.44M (73%), consistent with FY2025 trend. China rebounded to $1.03M (22%). ROA ($207K) and US ($20K) small but expected',
    'EMEA dominates</strong> YTD 2026 at $3.50M (76%), consistent with FY2025 trend. China at $0.89M (19%). ROA ($206K) and US ($20K) small but expected'
)
html = html.replace(
    'Animal ID concentration:</strong> 70% of YTD revenue ($2.62M). Industrial ($472K) and Immobilizer ($314K) growing but diversification needed in H2.',
    'Animal ID concentration:</strong> 66% of YTD revenue ($3.06M). Industrial ($605K) and Access Control ($524K) growing. Diversification improving vs prior weeks.'
)
html = html.replace(
    'SIC279 product dependency:</strong> Top chip family by revenue. SIC278 rose to #3. Product and customer breakdowns reflect Jan\u2013Feb YTD; March detail pending product-level analysis.',
    'SIC279 product dependency:</strong> $2.53M YTD (55%). SIC5777X2 rose to #3 at $442K. SIC278 at $334K. Product diversification improving with March shipments.'
)
html = html.replace(
    'Top 2 customers = Allflex + HID Global:</strong> Significant concentration \u2014 any delay from these 2 materially impacts monthly results.',
    'Top 2 customers = Allflex ($1.62M) + HID Global ($1.30M):</strong> 63% of YTD revenue. Freevision growing at $445K. Concentration narrowing.'
)

# === FOOTER ===
html = html.replace('Dashboard v10', 'Dashboard v11')
html = html.replace('v10 \u2014', 'v11 \u2014')

# === SAVE ===
out = DASH.replace('v10.html', 'v11.html')
with open(out, 'w', encoding='utf-8') as f:
    f.write(html)

print(f'v11 saved to: {out}')
print(f'File size: {len(html):,} chars')

# Quick validation
checks = [
    ('Mar 17', 'header date'),
    ('$4.80M', 'QTD revenue'),
    ('$19.10M', 'FY FCST'),
    ('$5.68M', 'QTD+SO'),
    ('$4.72M', 'Q2 FCST'),
    ('$12.01M', 'FY Open SO'),
    ('Dashboard v11', 'version'),
    ('2527358', 'SIC279 product'),
    ('1616550', 'Allflex customer'),
    ('1507322', 'Feb actual'),
    ('771590', 'Mar actual'),
]
passed = 0
for needle, label in checks:
    if needle in html:
        passed += 1
        print(f'  PASS: {label} ({needle})')
    else:
        print(f'  FAIL: {label} ({needle}) NOT FOUND')
print(f'\n{passed}/{len(checks)} checks passed')
