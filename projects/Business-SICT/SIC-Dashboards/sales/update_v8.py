import re

with open(r'C:\Users\intln\Projects\sic-dashboards\sales\Sales_KPI_Dashboard_FY2026_v8.html', 'r', encoding='utf-8') as f:
    html = f.read()

# === HEADER ===
html = html.replace('Data as of Mar 8, 2026', 'Data as of Mar 10, 2026')

# === SECTION 01: KPI SCORECARDS ===
html = html.replace(
    'Revenue QTD (Q1 to Mar 4)',
    'Revenue QTD (Q1 to Mar 10)'
)
# Revenue QTD value - first occurrence only
html = html.replace(
    '>$4.59M</div>\n      <div class="kpi-sub">vs Q1 Target $5.71M (80.4%) | QTD+SO: $5.75M',
    '>$4.61M</div>\n      <div class="kpi-sub">vs Q1 Target $5.71M (80.9%) | QTD+SO: $6.11M'
)
html = html.replace('width:80%;background:#22c55e;"></div></div>\n      <div class="kpi-status" style="color:#22c55e;">\U0001f7e2 ON TRACK &nbsp; 80.4%',
                     'width:81%;background:#22c55e;"></div></div>\n      <div class="kpi-status" style="color:#22c55e;">\U0001f7e2 ON TRACK &nbsp; 80.9%')
html = html.replace(
    'Q1 QTD+SO = $5.75M \u2014 <strong style="color:#22c55e;">ABOVE Q1 target!</strong><br>H1 progress: 40.6% | Jan $2.34M \u00b7 Feb $1.12M \u00b7 Mar ~$1.14M',
    'Q1 QTD+SO = $6.11M \u2014 <strong style="color:#22c55e;">107% of Q1 target!</strong><br>H1 progress: 40.8% | Jan $2.34M \u00b7 Feb $1.41M \u00b7 Mar $0.87M QTD'
)

# Card 2: FY FCST 80%
html = html.replace('>$18.09M</div>\n      <div class="kpi-sub">vs Annual Budget $22.0M</div>\n      <div class="progress-wrap"><div class="progress-bar" style="width:82%;background:#22c55e;',
                     '>$18.27M</div>\n      <div class="kpi-sub">vs Annual Budget $22.0M</div>\n      <div class="progress-wrap"><div class="progress-bar" style="width:83%;background:#22c55e;')
html = html.replace('\U0001f7e2 ON TRACK &nbsp; 82.2%', '\U0001f7e2 ON TRACK &nbsp; 83.0%')
html = html.replace('-$3.91M (-17.8%)', '-$3.73M (-17.0%)')

# Card 3: Rolling FCST upside note
html = html.replace('+$0.76M upside vs 80% FCST<br>Unconstrained demand view',
                     '+$0.76M upside vs 80% FCST<br>Includes weighted opportunities ($1.65M)')

# === SECTION 02: ROLLING HORIZON ===
# Q1 QTD
html = html.replace('>QTD Actual</div>\n          <div style="font-size:18px;font-weight:800;color:#14b8a6;">$4.59M',
                     '>QTD Actual</div>\n          <div style="font-size:18px;font-weight:800;color:#14b8a6;">$4.61M')
# Q1 Open SO
html = html.replace('>Open SO</div>\n          <div style="font-size:18px;font-weight:800;color:#3b82f6;">$1.16M',
                     '>Open SO</div>\n          <div style="font-size:18px;font-weight:800;color:#3b82f6;">$1.50M')
# Q1 QTD+SO
html = html.replace('>QTD + SO</div>\n          <div style="font-size:18px;font-weight:800;color:#22c55e;">$5.75M',
                     '>QTD + SO</div>\n          <div style="font-size:18px;font-weight:800;color:#22c55e;">$6.11M')
# Q1 percentage
html = html.replace('>100.5%</span>', '>107.1%</span>')
# Q1 progress bar
html = html.replace('width:100%;height:100%;background:#22c55e;border-radius:4px;"></div>\n',
                     'width:100%;height:100%;background:#22c55e;border-radius:4px;"></div>\n')
# Q1 status
html = html.replace('Q1 coverage 100.7%', 'Q1 coverage 107.1%')
html = html.replace('+$0.03M ahead</strong> of budget', '+$0.40M ahead</strong> of budget')
html = html.replace('Strong March recovery after CNY-impacted Feb',
                     'Strong Q1 close \u2014 Feb revised up to $1.41M, +$1.58M vs last week')

# Q1 mini breakdown
html = html.replace('>$5.75M</div>\n          <div style="font-size:8px;color:#22c55e;">\u2705 100.7%',
                     '>$6.11M</div>\n          <div style="font-size:8px;color:#22c55e;">\u2705 107.1%')

# Section 02 second half: Forecast vs Actual cards
html = html.replace('>$4.59M</div>\n      <div style="font-size:11px;color:#94a3b8;">80.4% of Q1 target',
                     '>$4.61M</div>\n      <div style="font-size:11px;color:#94a3b8;">80.9% of Q1 target')
html = html.replace('>$1.16M</div>\n      <div style="font-size:11px;color:#94a3b8;">Pending delivery Q1',
                     '>$1.50M</div>\n      <div style="font-size:11px;color:#94a3b8;">Pending delivery Q1')
html = html.replace('>$5.75M \u2705</div>\n      <div style="font-size:11px;color:#94a3b8;"><strong style="color:#22c55e;">100.7% of Q1 target',
                     '>$6.11M \u2705</div>\n      <div style="font-size:11px;color:#94a3b8;"><strong style="color:#22c55e;">107.1% of Q1 target')

# === PLOTLY CHART: Monthly Revenue Actual 2026 ===
# Update Feb actual from 1119183 to 1406222
html = html.replace('"y":[2336020,1119183,0,0,0,0,0,0,0,0,0,0]',
                     '"y":[2336020,1406222,0,0,0,0,0,0,0,0,0,0]')
html = html.replace('Jan\u2013Feb 2026 actuals', 'Jan\u2013Feb 2026 actuals (updated Mar 10)')

# Update Rolling FCST line
html = html.replace('"y":[2249890,1548288,1903394,1549078,1321527,1721484,1488137,1759393,1871760,2137914,1537470,1279922]',
                     '"y":[2241993,1540481,1814254,1544407,1316549,1678930,1313057,1590732,1677666,1941420,1367435,1088376]')

# Update 80% FCST average line
html = html.replace('"y":[1507871.75,1507871.75,1507871.75,1507871.75,1507871.75,1507871.75,1507871.75,1507871.75,1507871.75,1507871.75,1507871.75,1507871.75]',
                     '"y":[1522566,1522566,1522566,1522566,1522566,1522566,1522566,1522566,1522566,1522566,1522566,1522566]')

# Update 2025 actuals line
html = html.replace('"y":[1432115,1428965,1498726,1508388,1604190,1478220,1318910,1289450,1332890,1508980,1409850,1240560]',
                     '"y":[1869844,2191489,1689869,2720506,1362817,1845407,1764544,1557650,1617069,1437768,847531,2038713]')

# === PLOTLY CHART: Salesperson bar chart ===
# Update YTD Actual bars
html = html.replace('"y":[1720460,210661,12344,19561,371047,1120784],"type":"bar"}',
                     '"y":[1863747,268723,12345,19561,381607,1195914],"type":"bar"}')
# Update 80% FCST bars
html = html.replace('"y":[8720375,1264422,88534,160593,3245398,4615140],"type":"bar"}',
                     '"y":[8869491,1264422,115745,160593,3245398,4615140],"type":"bar"}')
# Update Rolling FCST bars
html = html.replace('"y":[9019366,1836310,178057,160593,2764837,5222670],"type":"bar"}',
                     '"y":[9019366,1836310,178057,160593,2764837,5222670],"type":"bar"}')

# === SECTION 03: Sales Team Table ===
# Intira FCST
html = html.replace('>$8.87M <small style="color:#22c55e;">\u25b2$149K</small><br><small>84%</small>',
                     '>$8.87M <small style="color:#22c55e;">\u25b2$149K</small><br><small>84%</small>')
# Intira YTD
html = html.replace('<td style="color:#14b8a6;">$8.50M</td>\n      <td style="color:#ef4444;">$+1709K</td>',
                     '<td style="color:#14b8a6;">$8.50M</td>\n      <td style="color:#ef4444;">-$1.71M</td>')
# Lisa YTD
html = html.replace('<td style="color:#14b8a6;">$1.34M</td>\n      <td style="color:#ef4444;">$+660K</td>',
                     '<td style="color:#14b8a6;">$1.34M</td>\n      <td style="color:#ef4444;">-$660K</td>')
# Nuttapon YTD
html = html.replace('<td style="color:#14b8a6;">$0.09M</td>\n      <td style="color:#ef4444;">$+13K</td>',
                     '<td style="color:#14b8a6;">$0.09M</td>\n      <td style="color:#ef4444;">-$13K</td>')
# Shan YTD
html = html.replace('<td style="color:#14b8a6;">$0.16M</td>\n      <td style="color:#ef4444;">$+278K</td>',
                     '<td style="color:#14b8a6;">$0.16M</td>\n      <td style="color:#ef4444;">-$278K</td>')
# Terry YTD
html = html.replace('<td style="color:#14b8a6;">$2.28M</td>\n      <td style="color:#ef4444;">$+291K</td>',
                     '<td style="color:#14b8a6;">$2.28M</td>\n      <td style="color:#ef4444;">-$291K</td>')
# Tunn YTD
html = html.replace('<td style="color:#14b8a6;">$3.08M</td>\n      <td style="color:#ef4444;">$+16K</td>',
                     '<td style="color:#14b8a6;">$3.08M</td>\n      <td style="color:#ef4444;">-$16K</td>')

# Total row
html = html.replace('>$18.27M <small style="color:#22c55e;">\u25b2$176K</small><br><small>83.0%</small>',
                     '>$18.27M<br><small>83.0%</small>')
html = html.replace('<td style="color:#14b8a6;">$15.44M</td>\n  <td style="color:#ef4444;">-$3.73M</td>',
                     '<td style="color:#14b8a6;">$15.44M</td>\n  <td style="color:#ef4444;">-$3.73M</td>')

# === SECTION 04: Revenue Breakdown Charts ===
# Update Region chart - FY2025
html = html.replace('"y":[9180212,4152390,2891440,1023730],"type":"bar"}',
                     '"y":[15024764,4644773,1130989,137524],"type":"bar"}')
# Update Region chart - YTD 2026
html = html.replace('"y":[2308700,659424,383270,103809],"type":"bar"}',
                     '"y":[2965107,626963,130265,19561],"type":"bar"}')

# Update Segment donut
html = html.replace('"values":[2398335,441470,293852,288794,32752]',
                     '"values":[2623945,471868,314323,299354,32752]')

# Update Top 10 Products
html = html.replace(
    '"x":[1991246,491567,246013,196350,102883,82707,80195,61046,33309,31553],"y":["SIC279","AFX","SIC5777X2","SIC278","ULTX","SIC73F1","ATL3X","ATLF2SG2","SIC7150","SIC4340X2"]',
    '"x":[2065737,491567,315945,246013,126574,109885,80195,64194,61046,31553],"y":["SIC279","AFX","SIC278","SIC5777X2","ULTX","SIC73F1","ATL3X","SIC7150","ATLF2SG2","SIC4340X2"]'
)
html = html.replace(
    '"text":["$1991K","$492K","$246K","$196K","$103K","$83K","$80K","$61K","$33K","$32K"]',
    '"text":["$2066K","$492K","$316K","$246K","$127K","$110K","$80K","$64K","$61K","$32K"]'
)
html = html.replace(
    '"color":[1991246,491567,246013,196350,102883,82707,80195,61046,33309,31553]',
    '"color":[2065737,491567,315945,246013,126574,109885,80195,64194,61046,31553]'
)
html = html.replace('SIC279 leads at $1.99M', 'SIC279 leads at $2.07M')

# Update Top 10 Customers
html = html.replace(
    '"x":[968424,607950,527788,230496,189203,160042,108642,74990,67320,60375],"y":["HID Global","SIAN Brazil","Allflex EU","Allflex China","Freevision","FASTHINK","Queclink","Waferwon","LUX-IDent","Caisley"]',
    '"x":[1485829,969064,249598,160042,108642,102168,95256,73216,60375,56592],"y":["Allflex","HID Global","Freevision","FASTHINK","Queclink","Waferwon","LUX-IDent","Lanhai","Caisley","SMARTRAC"]'
)
html = html.replace(
    '"text":["$968K","$608K","$528K","$230K","$189K","$160K","$109K","$75K","$67K","$60K"]',
    '"text":["$1486K","$969K","$250K","$160K","$109K","$102K","$95K","$73K","$60K","$57K"]'
)
html = html.replace(
    '"color":[968424,607950,527788,230496,189203,160042,108642,74990,67320,60375]',
    '"color":[1485829,969064,249598,160042,108642,102168,95256,73216,60375,56592]'
)
html = html.replace('HID Global tops at $968K | Top 3 = 60%',
                     'Allflex tops at $1.49M | Top 3 = 72%')

# Update Revenue Breakdown commentary
html = html.replace(
    '<strong>EMEA dominates</strong> YTD 2026 at $2.31M (67%), consistent with FY2025 trend. ROA and US are significantly behind FY2025 pace \u2014 monitor acceleration needed in H1.',
    '<strong>EMEA dominates</strong> YTD 2026 at $2.97M (79%), consistent with FY2025 trend. ROA ($130K) and US ($20K) small but expected \u2014 STRATTEC qualification is the US catalyst.'
)
html = html.replace(
    '<strong>Animal ID concentration risk:</strong> 69% of YTD revenue in a single segment. Industrial ($441K) and Immobilizer ($294K) are positive but small contributors.',
    '<strong>Animal ID concentration:</strong> 70% of YTD revenue ($2.62M). Industrial ($472K) and Immobilizer ($314K) growing but diversification needed in H2.'
)
html = html.replace(
    '<strong>SIC279 product dependency:</strong> $1.99M of $3.46M YTD revenue (58%) from one chip family. AFX is a distant #2 at $492K.',
    '<strong>SIC279 product dependency:</strong> $2.07M of $3.74M YTD revenue (55%) from one chip family. SIC278 rose to #3 at $316K.'
)
html = html.replace(
    '<strong>Top 3 customers = 60% of revenue:</strong> HID Global ($968K), SIAN Brazil ($608K), Allflex EU ($528K). Significant concentration \u2014 any delay from these 3 materially impacts monthly results (as seen with Feb dip).',
    '<strong>Top 2 customers = 66% of revenue:</strong> Allflex ($1.49M) and HID Global ($969K). Significant concentration \u2014 any delay from these 2 materially impacts monthly results.'
)

# === FOOTER ===
html = html.replace('Dashboard v7', 'Dashboard v8')
html = html.replace('v7 \u2014', 'v8 \u2014')

print('All edits complete.')
print(f'File size: {len(html):,} chars')

with open(r'C:\Users\intln\Projects\sic-dashboards\sales\Sales_KPI_Dashboard_FY2026_v8.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('v8 saved successfully.')
