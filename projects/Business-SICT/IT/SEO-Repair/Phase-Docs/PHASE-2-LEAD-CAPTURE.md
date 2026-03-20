# Phase 2: Lead Capture System — Implementation Guide

**Site:** www.sic.co.th
**Date:** 2026-03-19
**Current state:** 1,332 datasheet downloads, 0 leads captured, 0.04% conversion rate

---

## Current Download Architecture

| Content Type | Current Access | Gating Needed? |
|-------------|---------------|----------------|
| Product datasheets | Customer portal (webapp.sic.co.th) | Already gated — verify it captures leads |
| Product brochures | Direct PDF links (ungated) | YES — gate these |
| Sensor Brochure PDF | Direct link (ungated) | YES |
| Product pages | Open access | NO — keep open |
| Blog posts | Open access | NO — keep open |
| Application pages | Open access | NO — keep open |

**Key finding:** Datasheets already route through `webapp.sic.co.th/customer-portal` — a JS app that likely requires registration. The 1,332 downloads with "zero leads" might mean the portal captures data but doesn't feed it to sales. **Action: Verify the customer portal's registration flow and where leads go.**

**Brochures are the real gap** — direct PDF links with zero capture:
- `https://documents.sic.co.th/popup/SICProductAll_2026.pdf` ← ungated
- `https://www.sic.co.th/wp-content/uploads/2025/09/Sensor_Brochure.pdf` ← ungated
- `https://www.sic.co.th/wp-content/uploads/2024/12/SICAllBrochure.pdf` ← 404 (broken!)

---

## 2A. Gate Brochure/Document Downloads

### Option A: Contact Form 7 + Thank You Page (Simplest — CF7 Already Installed)

**Step 1: Create a new CF7 form for downloads**

In WP Admin > Contact > Add New, create form called "Download Gate":

```
[text* your-name placeholder "Your Name"]
[email* your-email placeholder "Business Email"]
[text* your-company placeholder "Company Name"]
[select* your-country "-- Select Country --" "Thailand" "China" "United States" "Japan" "India" "South Korea" "Germany" "Taiwan" "Singapore" "United Kingdom" "Other"]
[hidden product-interest default:get]
[submit "Download Now"]
```

Mail tab settings:
```
To: info@sic.co.th (or dedicated lead inbox)
Subject: [Download Request] {product-interest} — {your-name} at {your-company}
Body:
New download lead captured:
Name: {your-name}
Email: {your-email}
Company: {your-company}
Country: {your-country}
Document: {product-interest}
```

**Step 2: Create Thank You / Download pages**

For each gated document, create a simple WordPress page:
- `/download/product-brochure/` → Contains the actual PDF download link
- `/download/sensor-brochure/` → Contains the sensor brochure link

These pages should be noindex (add via Yoast) so Google doesn't index them.

**Step 3: Replace direct PDF links**

On the Products page, change:
```
FROM: <a href="https://documents.sic.co.th/popup/SICProductAll_2026.pdf">Download Brochure</a>
TO:   <a href="/download-brochure/?doc=product-brochure">Download Brochure</a>
```

Create a page `/download-brochure/` that shows the CF7 form above. On successful submission, redirect to the thank-you page with the actual download link.

### Option B: WPForms Lite (Free — Better UX)

1. Install WPForms Lite (free version, no bloat)
2. Create a "Download Gate" form with same fields as above
3. Use the "Confirmation" feature to redirect to the PDF after submission
4. WPForms stores entries in the database — viewable in WP Admin

### Option C: CF7 + Redirection Plugin (No New Plugins)

CF7 can redirect after submission using additional settings:

In the CF7 form's "Additional Settings" tab, add:
```
on_sent_ok: "location.replace('/download/product-brochure/');"
```

Or use the CF7 Redirection plugin for more control.

### GA4 Event Tracking for Downloads

Add this to the CF7 form submission success callback (via theme's JS or a snippet plugin):

```javascript
document.addEventListener('wpcf7mailsent', function(event) {
    if (event.detail.contactFormId === FORM_ID) {
        gtag('event', 'generate_lead', {
            'event_category': 'download',
            'event_label': event.detail.inputs.find(i => i.name === 'product-interest')?.value || 'unknown',
            'value': 1
        });
    }
});
```

Replace `FORM_ID` with the actual CF7 form ID after creation.

---

## 2B. Product Page CTAs — Add "Request Sample" and "Talk to Engineer"

### Current Product Page CTAs:
- "Add to Cart" (WooCommerce) ✓
- "Download Datasheet/Factsheet" (links to customer portal) ✓
- "Add to Wishlist" ✓
- No "Request Sample" button ✗
- No "Talk to Engineer" CTA ✗

### Implementation

**Step 1: Create "Request Sample" Form (CF7)**

New CF7 form called "Sample Request":
```
[text* your-name placeholder "Your Name"]
[email* your-email placeholder "Business Email"]
[text* your-company placeholder "Company Name"]
[select* your-country "-- Select Country --" "Thailand" "China" "United States" "Japan" "India" "South Korea" "Germany" "Taiwan" "Singapore" "United Kingdom" "Other"]
[text your-quantity placeholder "Estimated Quantity (optional)"]
[hidden product-name default:get]
[textarea your-message placeholder "Application details or requirements (optional)"]
[submit "Request Sample"]
```

Mail settings:
```
To: info@sic.co.th
Subject: [Sample Request] {product-name} — {your-name} at {your-company}
```

**Step 2: Create "Talk to Engineer" Form (CF7)**

New CF7 form called "Engineering Contact":
```
[text* your-name placeholder "Your Name"]
[email* your-email placeholder "Business Email"]
[text* your-company placeholder "Company Name"]
[select* your-country "-- Select Country --" "Thailand" "China" "United States" "Japan" "India" "South Korea" "Germany" "Taiwan" "Singapore" "United Kingdom" "Other"]
[hidden product-name default:get]
[textarea* your-question placeholder "Describe your technical question or application requirement"]
[submit "Contact an Engineer"]
```

**Step 3: Add CTAs to Product Pages**

In the Flatsome theme product template (or via WooCommerce hooks), add two buttons below the existing "Add to Cart" section:

```html
<!-- Add via Flatsome UX Builder or WooCommerce product tab -->
<div class="sic-product-ctas" style="margin-top: 20px; display: flex; gap: 10px;">
  <a href="/request-sample/?product={product_name}"
     class="button alt"
     style="background: #2a5c3f; color: white;">
    Request a Sample
  </a>
  <a href="/talk-to-engineer/?product={product_name}"
     class="button"
     style="background: #1a3a5c; color: white;">
    Talk to an Engineer
  </a>
</div>
```

**Step 4: Create Landing Pages**

- `/request-sample/` — Page with the Sample Request CF7 form
- `/talk-to-engineer/` — Page with the Engineering Contact CF7 form

Both pages should:
- Accept a `?product=` URL parameter to pre-fill the product name
- Include trust signals (certifications, 20+ years experience, 40+ countries)
- Mobile-friendly layout

### Improve Existing Contact Form

The current contact form at /contact/ is decent but could be improved:

1. **Add Product Interest dropdown** with these options:
   - Immobilizer Transponder
   - NFC Tag IC
   - Sensor Interface
   - Animal ID Transponder
   - Industrial IoT / RFID Reader
   - ASIC Design Service
   - General Inquiry

2. **Add "Purpose" field:**
   - Request a Quote
   - Request a Sample
   - Technical Support
   - Partnership/Distribution
   - General Inquiry

3. **Keep existing "How did you hear about us?" field** — this is good for attribution.

---

## Where Leads Should Go

Confirm with Marc/IT:

| Form | Email Destination | Notes |
|------|-------------------|-------|
| Download Gate | leads@sic.co.th or info@sic.co.th | New inbox for download leads |
| Sample Request | sales@sic.co.th or info@sic.co.th | Route to sales team |
| Talk to Engineer | engineering@sic.co.th or info@sic.co.th | Route to FAE team |
| Contact Form | info@sic.co.th | Existing — keep as-is |

---

## Success Metrics

| Metric | Before | Target |
|--------|--------|--------|
| Leads from downloads | 0 | 30+/quarter |
| Sample requests | ~0 visible | 10+/quarter |
| Contact form submissions | 39/year | 20/quarter |
| Total identified leads/quarter | ~10 | 60+ |

---

## Implementation Checklist

- [ ] Verify customer portal (webapp.sic.co.th) lead capture — is data going anywhere?
- [ ] Create Download Gate CF7 form
- [ ] Create download thank-you pages (noindex)
- [ ] Replace direct brochure PDF links with gated flow
- [ ] Fix broken brochure link (SICAllBrochure.pdf → 404)
- [ ] Create Sample Request CF7 form + landing page
- [ ] Create Talk to Engineer CF7 form + landing page
- [ ] Add CTA buttons to all product pages
- [ ] Add Product Interest dropdown to contact form
- [ ] Set up GA4 event tracking for all form submissions
- [ ] Configure email routing for new form types
- [ ] Test all forms on mobile
