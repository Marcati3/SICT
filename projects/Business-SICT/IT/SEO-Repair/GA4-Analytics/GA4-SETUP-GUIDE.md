# GA4 Setup Guide — Exact Steps

**Property:** Silicon Craft (New 2025)
**Property ID:** 484953142
**Measurement ID:** G-EC9QNBGH5D
**GTM Container:** GT-PLVXX5CG
**URL:** https://analytics.google.com/analytics/web/#/p484953142/

---

## Step 1: Mark Events as Conversions (5 minutes)

1. Go to: **https://analytics.google.com/analytics/web/#/p484953142/admin/events**
2. You should see these existing events:
   - `submit_lead_form` ← already detected
   - `contact` ← already detected
   - `add_to_cart` ← already detected
3. Toggle **"Mark as key event"** (star icon) for:
   - `submit_lead_form`
   - `contact`
   - `add_to_cart`
4. If `generate_lead` doesn't exist yet, click **"Create event"**:
   - Event name: `generate_lead`
   - Matching conditions: Event name equals `generate_lead`
   - Save → Mark as key event

---

## Step 2: Create "Real Traffic" Segment (10 minutes)

1. Go to: **https://analytics.google.com/analytics/web/#/p484953142/analysis/new**
2. Click **"+"** next to Segments → **"Session segment"**
3. Name: **"Real Traffic (Exclude Bots)"**
4. Click **"Add condition"**:
   - Condition group 1 (Include sessions where):
     - Session engagement time per session **is greater than** `5`
   - **OR**
   - Condition group 2:
     - Session source **does not exactly match** `(direct)`
5. Save the segment
6. Apply it to your explorations

### Alternative: Exclude bot traffic specifically
If you prefer to exclude rather than include:
1. Create segment → **"Exclude"** sessions where ALL of:
   - Session source **exactly matches** `(direct)`
   - AND Session medium **exactly matches** `(none)`
   - AND City **matches regex**: `Shanghai|Bayingolin|Shenzhen|Hangzhou|Guangzhou|Beijing`
   - AND Session engagement time **is less than** `2`

---

## Step 3: Create Weekly 404 Monitor (5 minutes)

1. Go to: **Explore** → New exploration → **Free form**
2. Name: **"Weekly 404 Monitor"**
3. **Rows:** Page path and screen class
4. **Values:** Views, Bounce rate
5. **Filters:** Page title **contains** `not found` OR `404`
6. **Date range:** Last 7 days
7. Save

After the redirects we deployed, this should show **zero results**. If any new 404s appear, the Redirection plugin is also logging them.

---

## Step 4: Create Monthly Lead Report (5 minutes)

1. Go to: **Explore** → New exploration → **Free form**
2. Name: **"Monthly Leads"**
3. **Rows:** Event name
4. **Columns:** Month
5. **Values:** Event count, Total users
6. **Filters:** Event name **matches regex**: `submit_lead_form|contact|generate_lead|add_to_cart`
7. **Date range:** Last 90 days
8. Save

---

## Step 5: Create LinkedIn Attribution Report (5 minutes)

1. Go to: **Explore** → New exploration → **Free form**
2. Name: **"LinkedIn Attribution"**
3. **Rows:** Session campaign, Session content
4. **Values:** Users, Sessions, Engagement rate, Key events
5. **Filters:** Session source **exactly matches** `linkedin`
6. **Date range:** Last 30 days
7. Save

This will show data once the marketing team starts using UTM parameters on LinkedIn posts (see UTM guide in PHASE-5 doc).

---

## Step 6: CCO Dashboard (10 minutes)

### Option A: GA4 Home Customization
1. Go to: **Reports** → **Reports snapshot**
2. Click **"Customize report"** (pencil icon)
3. Add cards:
   - Users (with Real Traffic segment)
   - Key events (conversions)
   - Pages and screens (top 10)
   - Traffic acquisition (by source)
4. Save as default view

### Option B: Looker Studio (Recommended for sharing)
1. Go to: **https://lookerstudio.google.com/**
2. Create → Report → Add data → Google Analytics 4
3. Select property: **Silicon Craft (New 2025)**
4. Add scorecards:
   - Total users (filtered)
   - Key events count
   - Engagement rate
5. Add table: Top pages by views
6. Add chart: Users trend (last 13 months)
7. Share with Marc

---

## Step 7: Define Internal Traffic (5 minutes)

1. Go to: **Admin** → Data Streams → Select stream
2. Click **"Configure tag settings"** → **"Define internal traffic"**
3. Create rule:
   - Name: `SIC Office Bangkok`
   - Match type: IP address equals
   - Value: **[Get from IT — SIC office IP address]**
4. Save

Then:
1. Go to: **Admin** → Data Settings → **Data Filters**
2. Create filter:
   - Name: `Exclude Internal`
   - Filter type: Developer traffic
   - Operation: Exclude
   - State: **Testing** (switch to Active after 1 week)

---

## Step 8: GTM Tag for Form Tracking (Optional — enhances tracking)

If you want more detailed form tracking via GTM:

1. Go to: **https://tagmanager.google.com/**
2. Open container **GT-PLVXX5CG**
3. Create new **Tag**:
   - Type: Custom HTML
   - Paste this code:

```html
<script>
document.addEventListener('wpcf7mailsent', function(event) {
  dataLayer.push({
    'event': 'cf7_submission',
    'cf7_form_id': event.detail.contactFormId,
    'cf7_form_title': document.title
  });
});

document.querySelectorAll('a[href*="customer-portal"], a[href*=".pdf"]').forEach(function(link) {
  link.addEventListener('click', function() {
    dataLayer.push({
      'event': 'datasheet_click',
      'link_text': this.textContent.trim().substring(0, 50),
      'link_url': this.href
    });
  });
});
</script>
```

4. Trigger: **All Pages**
5. Save and **Publish**

Then create a GA4 Event tag:
- Tag type: Google Analytics: GA4 Event
- Event name: `{{Event}}` (use the dataLayer event name)
- Trigger: Custom Event = `cf7_submission` or `datasheet_click`

---

## Quick Reference

| What | Where |
|------|-------|
| GA4 Admin | analytics.google.com/analytics/web/#/p484953142/admin |
| GA4 Reports | analytics.google.com/analytics/web/#/p484953142/reports |
| GA4 Explore | analytics.google.com/analytics/web/#/p484953142/analysis |
| GTM | tagmanager.google.com (container GT-PLVXX5CG) |
| Measurement ID | G-EC9QNBGH5D |
| Property ID | 484953142 |

---

## Time Estimate

| Step | Time |
|------|------|
| Mark conversions | 5 min |
| Create Real Traffic segment | 10 min |
| Create 404 monitor | 5 min |
| Create lead report | 5 min |
| Create LinkedIn report | 5 min |
| CCO dashboard | 10 min |
| Define internal traffic | 5 min |
| GTM form tracking (optional) | 15 min |
| **Total** | **~60 min** |
