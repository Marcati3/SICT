import pandas as pd
import json
import numpy as np

df = pd.read_excel(r'C:\Users\intln\Downloads\OpportunityList_20260314_0454.xlsx')

# Normalize product groups
pg_map = {'HF tag': 'HF Tag', 'LF tag': 'LF Tag'}
df['Product Group'] = df['Product Group'].map(lambda x: pg_map.get(x, x) if pd.notna(x) else 'Unknown')

# Salesperson mapping
sp_map = {
    'SL0332(tunn.prasoprat@sic.co.th)': 'Tunn',
    'SL0376(chen.yi.jhen@sic.co.th)': 'Terry',
    'SL0037(nuttapon@sic.co.th)': 'Nuttapon',
    'CN008(lisa@sic.co.th)': 'Lisa',
    'SL0198(shan.sharma@sic.co.th)': 'Shan',
    'SL0174(intira.loychoosak@sic.co.th)': 'Intira',
    'SL0XXX(koichiro.sasai@sic.co.th)': 'Koichiro',
    'SL0300(sadayu.utid@sic.co.th)': 'Sadayu',
}
def map_sp(x):
    if pd.isna(x): return 'Unknown'
    x = x.strip()
    for k, v in sp_map.items():
        if k in x: return v
    return x
df['Salesperson'] = df['Customer Name:Sale Person Code'].apply(map_sp)

STAGE_ORDER = ['New Lead', 'Contact', 'Qualified Lead', 'NDA', 'Samples', 'Evaluation', 'Design-In', 'PreProduction', 'Design-Win']
STAGE_IDX = {s: i for i, s in enumerate(STAGE_ORDER)}
today = pd.Timestamp('2026-03-14')

active = df[(df['Closed-Lost'] == False) & (df['Suspend'] == False)].copy()
closed_lost = df[df['Closed-Lost'] == True].copy()

active['age_days'] = (today - active['Register Date']).dt.days.fillna(0).astype(int)
active['est_revenue'] = active['Expected Volume'].fillna(0) * active['Target Price (USD)'].fillna(0)

# =====================================================================
# CAE FY26 KPIs — computed from stage date mappings
# =====================================================================

def working_days(start, end):
    """Count working days between two dates (exclude weekends)."""
    if pd.isna(start) or pd.isna(end): return None
    return int(np.busday_count(start.date(), end.date()))

# --- KPI 1: Go/NoGo Cycle Time (Registration Date → 3_5-GoNoGo) ---
# Target: <2 working days
kpi1_mask = df['Register Date'].notna() & df['3_5-GoNoGo'].notna()
kpi1_data = df[kpi1_mask].copy()
kpi1_data['gonogo_days'] = kpi1_data.apply(lambda r: working_days(r['Register Date'], r['3_5-GoNoGo']), axis=1)
kpi1_data = kpi1_data[kpi1_data['gonogo_days'].notna() & (kpi1_data['gonogo_days'] >= 0)]

kpi1_avg = round(kpi1_data['gonogo_days'].mean(), 1) if len(kpi1_data) > 0 else None
kpi1_median = round(kpi1_data['gonogo_days'].median(), 1) if len(kpi1_data) > 0 else None
kpi1_within_target = int((kpi1_data['gonogo_days'] <= 2).sum()) if len(kpi1_data) > 0 else 0
kpi1_total = len(kpi1_data)
kpi1_pct = round(kpi1_within_target / kpi1_total * 100, 1) if kpi1_total > 0 else 0

# Distribution for histogram
kpi1_dist = kpi1_data['gonogo_days'].value_counts().sort_index().to_dict()
kpi1_dist = {str(int(k)): int(v) for k, v in kpi1_dist.items()}

# --- KPI 2: Time-to-Market (S4-NDA → S8-PrePro) by Sale Process ---
# 2.1 Off-the-shelf: <4.5 months (≈137 calendar days)
# 2.2 Modified: <9 months (≈274 days)
# 2.3 NPI: <18 months (≈548 days)
ttm_mask = df['S4-NDA-Entry-Date'].notna() & df['S8-PrePro-Entry-Date'].notna()
ttm_data = df[ttm_mask].copy()
ttm_data['ttm_days'] = (ttm_data['S8-PrePro-Entry-Date'] - ttm_data['S4-NDA-Entry-Date']).dt.days
ttm_data = ttm_data[ttm_data['ttm_days'] >= 0]
ttm_data['ttm_months'] = ttm_data['ttm_days'] / 30.44  # avg days per month

ttm_by_type = {}
targets_months = {'Off-the-shelf': 4.5, 'Modified': 9, 'NPI': 18}
for sp_type in ['Off-the-shelf', 'Modified', 'NPI']:
    subset = ttm_data[ttm_data['Sale Process'] == sp_type]
    target = targets_months[sp_type]
    if len(subset) > 0:
        avg_months = round(subset['ttm_months'].mean(), 1)
        med_months = round(subset['ttm_months'].median(), 1)
        within = int((subset['ttm_months'] <= target).sum())
        ttm_by_type[sp_type] = {
            'avg_months': avg_months,
            'median_months': med_months,
            'target_months': target,
            'within_target': within,
            'total': len(subset),
            'pct_on_target': round(within / len(subset) * 100, 1),
            'values': [round(v, 1) for v in subset['ttm_months'].tolist()],
        }
    else:
        ttm_by_type[sp_type] = {
            'avg_months': None, 'median_months': None, 'target_months': target,
            'within_target': 0, 'total': 0, 'pct_on_target': 0, 'values': [],
        }

# TTM distribution — bucket all completed journeys by month for bar chart
ttm_all_months = ttm_data['ttm_months'].dropna()
ttm_all_months_int = ttm_all_months.apply(lambda x: int(round(x)))
ttm_dist = ttm_all_months_int.value_counts().sort_index().to_dict()
ttm_dist = {str(int(k)): int(v) for k, v in ttm_dist.items()}
# Also track which sale process each month-bucket entry belongs to
ttm_by_month_type = {}
for _, row in ttm_data.iterrows():
    mo = int(round(row['ttm_months']))
    sp = row['Sale Process'] if pd.notna(row['Sale Process']) else 'Unknown'
    key = str(mo)
    if key not in ttm_by_month_type:
        ttm_by_month_type[key] = {'Off-the-shelf': 0, 'Modified': 0, 'NPI': 0}
    if sp in ttm_by_month_type[key]:
        ttm_by_month_type[key][sp] += 1

# --- KPI 3: Application Solution Cycle Time (3_5-GoNoGo → 4_5-SolutionProvided) ---
# Target: <10 working days
kpi3_mask = df['3_5-GoNoGo'].notna() & df['4_5-SolutionProvided'].notna()
kpi3_data = df[kpi3_mask].copy()
kpi3_data['solution_days'] = kpi3_data.apply(lambda r: working_days(r['3_5-GoNoGo'], r['4_5-SolutionProvided']), axis=1)
kpi3_data = kpi3_data[kpi3_data['solution_days'].notna() & (kpi3_data['solution_days'] >= 0)]

kpi3_avg = round(kpi3_data['solution_days'].mean(), 1) if len(kpi3_data) > 0 else None
kpi3_median = round(kpi3_data['solution_days'].median(), 1) if len(kpi3_data) > 0 else None
kpi3_within_target = int((kpi3_data['solution_days'] <= 10).sum()) if len(kpi3_data) > 0 else 0
kpi3_total = len(kpi3_data)
kpi3_pct = round(kpi3_within_target / kpi3_total * 100, 1) if kpi3_total > 0 else 0

kpi3_dist = kpi3_data['solution_days'].value_counts().sort_index().to_dict()
kpi3_dist = {str(int(k)): int(v) for k, v in kpi3_dist.items()}

# --- KPI 4: DIN to DWIN Conversion Rate (S7-DI → S9-DWIN) ---
# Target: >50%
din_count = int(df['S7-DI-Entry-Date'].notna().sum())
dwin_count = int(df['S9-DWIN-Entry-Date'].notna().sum())
kpi4_rate = round(dwin_count / din_count * 100, 1) if din_count > 0 else 0

# =====================================================================
# Pipeline & CRM metrics (same as before)
# =====================================================================

stage_counts = active['Pipeline Stage'].value_counts()
funnel_data = [{'stage': s, 'count': int(stage_counts.get(s, 0))} for s in STAGE_ORDER]

velocity_data = []
for s in STAGE_ORDER:
    so = active[active['Pipeline Stage'] == s]
    if len(so) > 0:
        velocity_data.append({'stage': s, 'avg_days': round(so['age_days'].mean()), 'median_days': round(so['age_days'].median()), 'count': len(so)})

cae_data = active.groupby('CAE in-charge').agg(
    total=('Opportunity ID', 'count'),
    high=('Priority', lambda x: (x == 'High').sum()),
    medium=('Priority', lambda x: (x == 'Medium').sum()),
    low=('Priority', lambda x: (x == 'Low').sum()),
).reset_index()
cae_workload = cae_data.to_dict('records')

win_count = len(active[active['Pipeline Stage'] == 'Design-Win'])
loss_type_counts = closed_lost['Closed-Lost Type'].value_counts().to_dict()
pg_counts = active['Product Group'].value_counts().to_dict()
country_counts = active['Country'].value_counts().head(15).to_dict()
sp_counts = active['Salesperson'].value_counts().to_dict()
source_counts = active['Source of Lead'].value_counts().to_dict()

stalled = active[(active['age_days'] > 180) & (active['Pipeline Stage'] != 'Design-Win')].sort_values('age_days', ascending=False)

def recommend_action(row):
    stage = row['Pipeline Stage']
    days = int(row['age_days'])
    owner = str(row['Activity Owner']) if pd.notna(row['Activity Owner']) else ''
    comment = str(row['Daily Latest Comment']) if pd.notna(row['Daily Latest Comment']) else ''
    no_response = 'no response' in comment.lower() or 'no feedback' in comment.lower()

    if days > 600:
        return 'CLOSE — stale >600d, no viable path'
    if no_response and days > 365:
        return 'CLOSE — no customer response >1yr'
    if stage in ('New Lead', 'Contact'):
        if days > 270:
            return 'CLOSE — never qualified after 9mo'
        return 'QUALIFY or CLOSE — set Go/NoGo deadline within 2 weeks'
    if stage == 'Qualified Lead':
        if days > 365:
            return 'CLOSE — qualified but no NDA after 1yr'
        return 'ADVANCE to NDA — schedule customer meeting'
    if stage == 'NDA':
        return 'ADVANCE — send samples or close if blocked'
    if stage == 'Samples':
        if days > 365:
            return 'CLOSE — samples sent >1yr ago, no eval progress'
        return 'FOLLOW UP — check sample status, push to evaluation'
    if stage == 'Evaluation':
        if days > 365:
            return 'ESCALATE — evaluation stalled >1yr, exec-to-exec call'
        return 'FOLLOW UP — get evaluation feedback, identify blockers'
    if stage == 'Design-In':
        return 'PUSH to PrePro — identify remaining qualification steps'
    if stage == 'PreProduction':
        return 'PUSH to DWIN — confirm production readiness'
    return 'REVIEW — assess viability and set next milestone'

stalled_list = []
for _, r in stalled.head(30).iterrows():
    stalled_list.append({
        'id': r['Opportunity ID'],
        'name': str(r['Opportunity Name'])[:60],
        'customer': str(r['Customer Name'])[:40],
        'stage': r['Pipeline Stage'],
        'days': int(r['age_days']),
        'cae': str(r['CAE in-charge']) if pd.notna(r['CAE in-charge']) else 'Unassigned',
        'priority': r['Priority'],
        'product': r['Product Group'],
        'action': recommend_action(r),
    })

df['reg_month'] = df['Register Date'].dt.to_period('M')
monthly_intake = df[df['Register Date'] >= '2025-04-01'].groupby('reg_month').size()
intake_data = [{'month': str(m), 'count': int(c)} for m, c in monthly_intake.items()]

crm_records = []
for _, r in active.sort_values('age_days', ascending=False).iterrows():
    crm_records.append({
        'id': r['Opportunity ID'],
        'name': str(r['Opportunity Name'])[:70] if pd.notna(r['Opportunity Name']) else '',
        'customer': str(r['Customer Name'])[:50] if pd.notna(r['Customer Name']) else '',
        'stage': r['Pipeline Stage'],
        'stageIdx': STAGE_IDX.get(r['Pipeline Stage'], -1),
        'priority': r['Priority'],
        'product': r['Product Group'],
        'cae': str(r['CAE in-charge']) if pd.notna(r['CAE in-charge']) else 'Unassigned',
        'salesperson': r['Salesperson'],
        'country': str(r['Country']) if pd.notna(r['Country']) else '',
        'days': int(r['age_days']),
        'registered': r['Register Date'].strftime('%Y-%m-%d') if pd.notna(r['Register Date']) else '',
        'modified': r['Modified'].strftime('%Y-%m-%d') if pd.notna(r['Modified']) else '',
        'source': str(r['Source of Lead']) if pd.notna(r['Source of Lead']) else '',
        'saleProcess': str(r['Sale Process']) if pd.notna(r['Sale Process']) else '',
        'volume': int(r['Expected Volume']) if pd.notna(r['Expected Volume']) else 0,
        'price': round(float(r['Target Price (USD)']), 4) if pd.notna(r['Target Price (USD)']) else 0,
        'estRev': round(float(r['est_revenue']), 2),
        'comment': str(r['Daily Latest Comment'])[:120] if pd.notna(r['Daily Latest Comment']) else '',
        'activityOwner': str(r['Activity Owner']) if pd.notna(r['Activity Owner']) else '',
        'targetMP': r['Target Mass Production Date'].strftime('%Y-%m-%d') if pd.notna(r['Target Mass Production Date']) else '',
        'distributor': str(r['Distributor']) if pd.notna(r['Distributor']) else '',
    })

stage_date_cols = {
    'Contact': 'S2-Contact-Entry-Date',
    'Qualified Lead': 'S3-Qualified-Entry-Date',
    'NDA': 'S4-NDA-Entry-Date',
    'Samples': 'S5-Sample-Entry-Date',
    'Evaluation': 'S6-Eval-Entry-Date',
    'Design-In': 'S7-DI-Entry-Date',
    'PreProduction': 'S8-PrePro-Entry-Date',
    'Design-Win': 'S9-DWIN-Entry-Date',
}
conversion_data = []
prev_count = len(df)
for stage_name, col in stage_date_cols.items():
    reached = int(df[col].notna().sum())
    rate = round(reached / prev_count * 100, 1) if prev_count > 0 else 0
    conversion_data.append({'stage': stage_name, 'reached': reached, 'prevCount': prev_count, 'rate': rate})
    prev_count = reached

cae_stages = {}
for cae in active['CAE in-charge'].dropna().unique():
    cae_opps = active[active['CAE in-charge'] == cae]
    cae_stages[cae] = cae_opps['Pipeline Stage'].value_counts().to_dict()

summary = {
    'totalActive': len(active),
    'totalClosedLost': len(closed_lost),
    'totalDesignWins': win_count,
    'winRate': round(win_count / (win_count + len(closed_lost)) * 100, 1) if (win_count + len(closed_lost)) > 0 else 0,
    'totalRecords': len(df),
    'avgAge': round(active['age_days'].mean()),
    'medianAge': round(active['age_days'].median()),
    'highPriority': int((active['Priority'] == 'High').sum()),
    'newLeadsThisMonth': int(len(df[(df['Register Date'] >= '2026-03-01') & (df['Register Date'] < '2026-04-01')])),
    'newLeadsThisQ': int(len(df[(df['Register Date'] >= '2026-01-01') & (df['Register Date'] < '2026-04-01')])),
    'totalEstRevenue': round(active['est_revenue'].sum(), 2),
    'stalledCount': len(stalled),
    'pipelineExclWins': len(active[active['Pipeline Stage'] != 'Design-Win']),
}

# CAE KPIs
kpis = {
    'gonogo': {
        'avg': kpi1_avg, 'median': kpi1_median,
        'within_target': kpi1_within_target, 'total': kpi1_total,
        'pct': kpi1_pct, 'target': 2, 'unit': 'working days',
        'distribution': kpi1_dist,
    },
    'ttm': ttm_by_type,
    'ttmDist': ttm_dist,
    'ttmByMonthType': ttm_by_month_type,
    'appSolution': {
        'avg': kpi3_avg, 'median': kpi3_median,
        'within_target': kpi3_within_target, 'total': kpi3_total,
        'pct': kpi3_pct, 'target': 10, 'unit': 'working days',
        'distribution': kpi3_dist,
    },
    'dinToDwin': {
        'din_count': din_count, 'dwin_count': dwin_count,
        'rate': kpi4_rate, 'target': 50,
    },
}

# =====================================================================
# Closed-Won (Design-Win) records
# =====================================================================
design_wins = active[active['Pipeline Stage'] == 'Design-Win'].copy()
design_wins_sorted = design_wins.sort_values('S9-DWIN-Entry-Date', ascending=False, na_position='last')
closed_won_list = []
for _, r in design_wins_sorted.iterrows():
    closed_won_list.append({
        'id': r['Opportunity ID'],
        'name': str(r['Opportunity Name'])[:70] if pd.notna(r['Opportunity Name']) else '',
        'customer': str(r['Customer Name'])[:50] if pd.notna(r['Customer Name']) else '',
        'product': r['Product Group'],
        'saleProcess': str(r['Sale Process']) if pd.notna(r['Sale Process']) else '',
        'cae': str(r['CAE in-charge']) if pd.notna(r['CAE in-charge']) else 'Unassigned',
        'salesperson': map_sp(r['Customer Name:Sale Person Code']),
        'winDate': r['S9-DWIN-Entry-Date'].strftime('%Y-%m-%d') if pd.notna(r['S9-DWIN-Entry-Date']) else '',
        'registered': r['Register Date'].strftime('%Y-%m-%d') if pd.notna(r['Register Date']) else '',
        'volume': int(r['Expected Volume']) if pd.notna(r['Expected Volume']) else 0,
        'price': round(float(r['Target Price (USD)']), 4) if pd.notna(r['Target Price (USD)']) else 0,
        'estRev': round(float(r['Expected Volume'] * r['Target Price (USD)']), 2) if pd.notna(r['Expected Volume']) and pd.notna(r['Target Price (USD)']) else 0,
        'comment': str(r['Daily Latest Comment'])[:120] if pd.notna(r['Daily Latest Comment']) else '',
        'country': str(r['Country']) if pd.notna(r['Country']) else '',
        'productName': str(r['Product Name']) if pd.notna(r['Product Name']) else '',
        'productCode': str(r['Product Code']) if pd.notna(r['Product Code']) else '',
    })

# =====================================================================
# Recent comments / activity — latest modified records with comments
# =====================================================================
has_comments = active[active['Daily Latest Comment'].notna()].copy()
has_comments_sorted = has_comments.sort_values('Modified', ascending=False).head(20)
recent_comments = []
for _, r in has_comments_sorted.iterrows():
    recent_comments.append({
        'id': r['Opportunity ID'],
        'name': str(r['Opportunity Name'])[:60] if pd.notna(r['Opportunity Name']) else '',
        'customer': str(r['Customer Name'])[:40] if pd.notna(r['Customer Name']) else '',
        'stage': r['Pipeline Stage'],
        'cae': str(r['CAE in-charge']) if pd.notna(r['CAE in-charge']) else 'Unassigned',
        'modified': r['Modified'].strftime('%Y-%m-%d') if pd.notna(r['Modified']) else '',
        'comment': str(r['Daily Latest Comment'])[:200] if pd.notna(r['Daily Latest Comment']) else '',
    })

all_data = {
    'summary': summary,
    'kpis': kpis,
    'funnel': funnel_data,
    'velocity': velocity_data,
    'caeWorkload': cae_workload,
    'caeStages': cae_stages,
    'lossTypes': loss_type_counts,
    'productGroups': pg_counts,
    'countries': country_counts,
    'salespersons': sp_counts,
    'stalled': stalled_list,
    'intake': intake_data,
    'conversion': conversion_data,
    'sourceOfLead': source_counts,
    'crm': crm_records,
    'closedWon': closed_won_list,
    'recentComments': recent_comments,
}

with open(r'C:\Users\intln\Claude\Projects\Business-SICT\SIC-Dashboards\cae\data.json', 'w') as f:
    json.dump(all_data, f)

print(f"Exported: {len(crm_records)} active, {len(stalled_list)} stalled")
print(f"\n=== CAE FY26 KPIs ===")
print(f"KPI 1 — Go/NoGo Cycle Time: avg {kpi1_avg}d, median {kpi1_median}d | {kpi1_within_target}/{kpi1_total} within 2d target ({kpi1_pct}%)")
for sp_type, vals in ttm_by_type.items():
    print(f"KPI 2 — TTM {sp_type}: avg {vals['avg_months']}mo, median {vals['median_months']}mo | {vals['within_target']}/{vals['total']} within {vals['target_months']}mo target ({vals['pct_on_target']}%)")
print(f"KPI 3 — App Solution Cycle: avg {kpi3_avg}d, median {kpi3_median}d | {kpi3_within_target}/{kpi3_total} within 10d target ({kpi3_pct}%)")
print(f"KPI 4 -- DIN to DWIN Conversion: {dwin_count}/{din_count} = {kpi4_rate}% (target >50%)")
