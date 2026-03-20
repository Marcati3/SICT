# Phase 5: Analytics Dashboard & UTM Setup

**Site:** www.sic.co.th
**GA4 Property:** Silicon Craft (New 2025)
**Date:** 2026-03-19

---

## 5A. Clean GA4 Measurement Setup

### Step 1: Create "Real Traffic" Segment

In GA4 > Explore > Segments:

**Segment Name:** Real Traffic (Exclude Bots)
**Type:** Session segment
**Conditions (Exclude sessions matching ALL):**
- Session source **exactly matches** (direct)
- AND Session medium **exactly matches** (none)
- AND Average engagement time per session **< 2 seconds**
- AND City **matches regex:** `Shanghai|Bayingolin|Shenzhen|Hangzhou|Guangzhou|Beijing|Chengdu|Nanjing|Wuhan|Tianjin`

**Alternative approach (simpler):**
Create an **Include** segment instead:
- Session engagement time per session **> 5 seconds**
- OR Session source **does not exactly match** (direct)

### Step 2: Configure Conversion Events

In GA4 Admin > Events > Modify/Create events:

| Event Name | Trigger | Priority |
|-----------|---------|----------|
| `generate_lead` | CF7 form submission (download gate) | HIGH |
| `contact_form_submit` | CF7 contact form submission | HIGH |
| `sample_request` | Sample request form submission | HIGH |
| `engineer_contact` | Talk to Engineer form submission | HIGH |
| `datasheet_click` | Click on "Download Datasheet" button | MEDIUM |

Mark all as **Conversions** in GA4 Admin > Events > toggle "Mark as conversion"

**Implementation via Google Tag Manager (if installed) or gtag.js:**

```javascript
// Add to theme footer or via Code Snippets plugin
// CF7 form submission tracking
document.addEventListener('wpcf7mailsent', function(event) {
  var formId = event.detail.contactFormId;
  var formMap = {
    // Replace these IDs with actual CF7 form IDs after creation
    'DOWNLOAD_FORM_ID': 'generate_lead',
    'CONTACT_FORM_ID': 'contact_form_submit',
    'SAMPLE_FORM_ID': 'sample_request',
    'ENGINEER_FORM_ID': 'engineer_contact'
  };

  var eventName = formMap[formId] || 'form_submission';

  gtag('event', eventName, {
    'event_category': 'lead',
    'event_label': document.title,
    'form_id': formId
  });
});

// Datasheet click tracking
document.querySelectorAll('a[href*="customer-portal"], a[href*="datasheet"], a[href*="factsheet"]').forEach(function(link) {
  link.addEventListener('click', function() {
    gtag('event', 'datasheet_click', {
      'event_category': 'engagement',
      'event_label': this.textContent.trim(),
      'link_url': this.href
    });
  });
});
```

### Step 3: Custom Reports

#### Report 1: Monthly Traffic Dashboard
**Create in GA4 > Reports > Library > Create new report**

| Metric | Dimension |
|--------|-----------|
| Active users | Source/medium |
| Sessions | Country |
| Engagement rate | Landing page |
| Conversions | Device category |
| Avg engagement time | |

Apply "Real Traffic" segment.

#### Report 2: Weekly 404 Monitor
**Create in GA4 > Explore**

- Type: Free form
- Rows: Page path
- Values: Views, Bounce rate, Exit rate
- Filter: Page title **contains** "Page not found" OR "404"
- Date range: Last 7 days

Save and schedule weekly email to Marc.

#### Report 3: Monthly Lead Report
**Create in GA4 > Explore**

- Type: Free form
- Rows: Event name (filter to conversion events only)
- Columns: Month
- Values: Event count, Total users

#### Report 4: LinkedIn Attribution
**Create in GA4 > Explore**

- Type: Free form
- Rows: Session campaign, Session content
- Filter: Session source = linkedin
- Values: Users, Sessions, Engagement rate, Conversions
- Date range: Last 30 days

### Step 4: Marc's CCO Dashboard

Create a **Dashboard Overview** in GA4 Explore (or Looker Studio if preferred):

| Widget | Metric | Notes |
|--------|--------|-------|
| Scorecard 1 | Real organic visitors (filtered) | Monthly |
| Scorecard 2 | Leads captured (total conversions) | Monthly |
| Scorecard 3 | 404 count | Should be zero |
| Scorecard 4 | LinkedIn referral users | Monthly |
| Table | Top 10 product pages by engagement | Filtered for real traffic |
| Line chart | Real traffic trend (13 months) | Show YoY comparison |
| Bar chart | Conversions by type | generate_lead, sample_request, contact |
| Pie chart | Traffic by country (top 10) | Filtered for real traffic |

---

## 5B. UTM Parameter Convention

### Standard Format

```
utm_source=  [platform]
utm_medium=  [channel type]
utm_campaign=[campaign-name]
utm_content= [post-type]
```

### Reference Table for Marketing Team

| Parameter | Value | When to Use |
|-----------|-------|-------------|
| **utm_source** | `linkedin` | LinkedIn posts |
| | `facebook` | Facebook posts |
| | `twitter` | X/Twitter posts |
| | `email` | Email campaigns |
| | `partner` | Partner referrals |
| **utm_medium** | `organic` | Unpaid social posts |
| | `paid` | Paid ads/sponsored posts |
| | `email` | Email newsletters |
| | `referral` | Partner website links |
| **utm_campaign** | `sensor-q2-2026` | Example: Sensor push Q2 |
| | `follower-growth-q1` | Example: LinkedIn growth |
| | `tradeshow-semicon-2026` | Example: Event promotion |
| | `nfc-launch` | Example: Product launch |
| **utm_content** | `poll` | LinkedIn poll |
| | `carousel` | Image carousel post |
| | `video` | Video post |
| | `article` | Long-form article |
| | `infographic` | Visual/infographic |
| | `case-study` | Customer story |

### Example URLs

**LinkedIn organic post about sensor products:**
```
https://www.sic.co.th/products/sensor-interface-products/?utm_source=linkedin&utm_medium=organic&utm_campaign=sensor-q2-2026&utm_content=carousel
```

**LinkedIn paid ad for NFC authentication:**
```
https://www.sic.co.th/applications/brand-protection/?utm_source=linkedin&utm_medium=paid&utm_campaign=nfc-authentication-q2&utm_content=video
```

**Email newsletter linking to blog post:**
```
https://www.sic.co.th/blog/nfc-digital-product-passports/?utm_source=email&utm_medium=email&utm_campaign=monthly-newsletter-mar-2026&utm_content=article
```

### Quick UTM Builder

Marketing team can use Google's Campaign URL Builder:
`https://ga-dev-tools.google/campaign-url-builder/`

Or create a simple Google Sheet template:

| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| Base URL | Source | Medium | Campaign | Content | Final URL |
| (paste URL) | linkedin | organic | (campaign) | (type) | =CONCATENATE formula |

### Rules
1. **Always lowercase** — UTM parameters are case-sensitive
2. **Use hyphens**, not spaces or underscores
3. **Be consistent** — same campaign name across all posts in a campaign
4. **Every LinkedIn post** must use UTM parameters
5. **Never use UTMs on internal links** — only for external-to-site links
6. **Test the URL** before publishing — make sure it loads the right page

---

## Implementation Checklist

- [ ] Create "Real Traffic" segment in GA4
- [ ] Set up conversion events (5 events)
- [ ] Add CF7 → GA4 event tracking JavaScript
- [ ] Create 404 monitoring exploration (weekly)
- [ ] Create monthly lead report exploration
- [ ] Create LinkedIn attribution exploration
- [ ] Build CCO dashboard (GA4 or Looker Studio)
- [ ] Create UTM reference sheet for marketing team
- [ ] Share UTM builder link with marketing team
- [ ] Schedule weekly 404 report email to Marc
- [ ] Schedule monthly traffic report email to Marc
