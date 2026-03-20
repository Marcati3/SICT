# Phase 1: Emergency Fixes — Implementation Guide

**Site:** www.sic.co.th
**Date:** 2026-03-19
**Status:** Ready for implementation

---

## 1A. 404 Redirect Fixes

### What Was Found

**67+ broken URLs confirmed** via direct site probing. Three categories:

| Category | Count | Example | Impact |
|----------|-------|---------|--------|
| Immobilizer product short URLs | 14 | /product/sic61au/ | HIGH — immobilizer is #1 keyword |
| Common page paths | 41 | /about/, /downloads/, /support/ | HIGH — standard visitor expectations |
| Product category generics | 12 | /product-category/rfid/ | MEDIUM — category browsing |

### Implementation Option A: .htaccess (Preferred — Fastest)

1. SSH/SFTP into the server
2. Open `.htaccess` in the WordPress root directory
3. Copy the contents of `01-redirect-rules.htaccess` and paste it **BEFORE** the `# BEGIN WordPress` section
4. Save and test

### Implementation Option B: WordPress Redirection Plugin (No Server Access)

1. In WordPress Admin, go to **Plugins > Add New**
2. Search for **"Redirection"** by John Godley (4M+ installs)
3. Install and activate
4. Go to **Tools > Redirection**
5. Import redirects — use the CSV below or add manually

#### CSV Import File

Use `02-redirects-csv-import.csv` (generated alongside this guide) for bulk import into the Redirection plugin:
- Go to Tools > Redirection > Import/Export
- Upload the CSV file
- All 67+ redirects will be created at once

### Implementation Option C: Yoast SEO Premium

If Yoast SEO Premium is installed (it may be — check Plugins page):
1. Go to **Yoast SEO > Redirects**
2. Add redirects manually or import via CSV

### Validation

After implementation, test these critical URLs:
```
curl -I https://www.sic.co.th/about/
# Expected: HTTP 301 → /our-brand/

curl -I https://www.sic.co.th/product/sic61au/
# Expected: HTTP 301 → /products/immobilizer-transponder/

curl -I https://www.sic.co.th/downloads/
# Expected: HTTP 301 → /products/

curl -I https://www.sic.co.th/product-category/rfid/
# Expected: HTTP 301 → /product-category/industrial-iot/
```

### 404 Monitoring Setup

After fixing existing 404s, enable monitoring:
1. In the **Redirection plugin**, go to Settings
2. Enable **"Monitor permalink changes"** and **"Log 404 errors"**
3. Set log retention to 30 days
4. Check weekly for new 404s appearing

---

## 1B. Bot Traffic Filtering in GA4

### Step-by-Step Instructions (Execute in Browser)

#### Step 1: Define Internal Traffic
1. Go to **GA4 Admin** (gear icon, bottom left)
2. Click **Data Streams** > Select the web stream
3. Click **Configure tag settings** > **Define internal traffic**
4. Add a rule:
   - Name: "SIC Office Bangkok"
   - IP type: IP address equals
   - Value: [Get from IT team — SIC's office IP]
5. Save

#### Step 2: Create Data Filter
1. In GA4 Admin > **Data Settings** > **Data Filters**
2. Click **Create Filter**
3. Name: "Exclude Internal Traffic"
4. Filter type: Developer traffic
5. Filter operation: Exclude
6. State: Testing (switch to Active after verification)
7. Save

#### Step 3: Create "Clean Traffic" Exploration
1. Go to **Explore** tab in GA4
2. Create new **Free Form** exploration
3. Add segments:
   - **Segment 1: "Suspected Bot Traffic"**
     - Conditions (AND):
       - Session source = (direct)
       - Session medium = (none)
       - Average engagement time per session < 2 seconds
       - City matches regex: `Shanghai|Bayingolin|Shenzhen|Hangzhou|Guangzhou|Beijing|Chengdu|Nanjing`
   - **Segment 2: "Real Traffic"**
     - Exclude Segment 1

4. Compare metrics side-by-side:
   - Users, sessions, engagement rate, avg engagement time
   - This shows the clean vs bot split

#### Step 4: Save "Real Traffic" Segment for Reporting
1. In GA4 Reports, click **Comparisons** (top of page)
2. Add comparison using the "Real Traffic" segment criteria
3. Apply to all standard reports

#### Step 5: Document Bot Volume
Create a note documenting:
- Total users: ~44,853 (Jan-Feb 2026)
- Suspected bot users: ~43,321 (96.6%)
- Real organic users: ~1,150
- Bot characteristics: (direct)/(none), Chinese cities, <2s engagement

### Server-Level Blocking (When Hosting Access Available)

Add to `.htaccess` when server access is provided:
```apache
# Block known bot IP ranges (Chinese data centers)
# WARNING: Verify these don't block legitimate Chinese customers
# Only add after reviewing server logs for specific IPs
# Deny from xxx.xxx.xxx.0/24
```

**NOTE:** Do NOT blanket-block Chinese IPs — SIC has real Chinese customers (LF products, HF readers). Instead, block specific data center IP ranges identified from server logs.

---

## 1C. Fix Duplicate Homepage

### The Problem
GA4 shows two homepage entries splitting traffic:
- "Silicon Craft Technology: Innovative RFID Chip & ASIC Designs" (2,866 views)
- "Silicon Craft Technology PLC : Innovative RFID Chip" (duplicate, lower traffic)

### Root Cause Investigation

Most likely causes:
1. **Trailing slash inconsistency:** `sic.co.th` vs `sic.co.th/`
2. **www vs non-www:** `sic.co.th` vs `www.sic.co.th`
3. **HTTP vs HTTPS:** Should be fully HTTPS
4. **Title tag inconsistency:** Two different `<title>` tags being served

### Fixes

#### A. Force canonical URL (add to .htaccess, before WordPress block):
```apache
# Force www + HTTPS + trailing slash on homepage
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

RewriteCond %{HTTP_HOST} !^www\. [NC]
RewriteRule ^(.*)$ https://www.sic.co.th/$1 [L,R=301]
```

#### B. Verify canonical tag in WordPress:
1. Go to **Yoast SEO > General** settings
2. Ensure the site URL is set to `https://www.sic.co.th`
3. In **Settings > General**, verify:
   - WordPress Address (URL): `https://www.sic.co.th`
   - Site Address (URL): `https://www.sic.co.th`

#### C. Check the title tag:
1. View page source of the homepage
2. Look for `<title>` tag — should be exactly ONE consistent title
3. If Yoast is managing it, go to **Yoast SEO > Search Appearance > Homepage**
4. Set the SEO title to: `Silicon Craft Technology | RFID, NFC & Sensor IC Design`

---

## Validation Checklist

After implementing all Phase 1 fixes:

- [ ] Visit /about/ — should redirect to /our-brand/ (not 404)
- [ ] Visit /product/sic61au/ — should redirect to /products/immobilizer-transponder/
- [ ] Visit /downloads/ — should redirect to /products/
- [ ] Visit /product-category/rfid/ — should redirect to /product-category/industrial-iot/
- [ ] Redirection plugin logging enabled for ongoing 404 monitoring
- [ ] GA4 "Real Traffic" segment created and applied
- [ ] Homepage loads with single canonical URL (www.sic.co.th)
- [ ] Homepage title tag is consistent

---

## Files in This Package

| File | Purpose |
|------|---------|
| `01-redirect-rules.htaccess` | All 67+ redirect rules for .htaccess |
| `02-redirects-csv-import.csv` | Same redirects as CSV for Redirection plugin import |
| `PHASE-1-IMPLEMENTATION.md` | This guide |
