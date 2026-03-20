# Phase 4: SEO & Mobile Fixes — Implementation Guide

**Site:** www.sic.co.th
**Date:** 2026-03-19

---

## 4A. On-Page SEO for Top Product Pages

### Priority Keywords & Current Rankings

| Keyword | Current Rank | Target | Primary Page |
|---------|-------------|--------|-------------|
| Immobilizer | 2 | 1 | /products/immobilizer-transponder/ |
| ASIC Design | 5.1 | Top 3 | /services/ |
| Sensor Interface | 5 | Top 3 | /products/sensor-interface-products/ |
| NFC Chip | 8.5 | Top 5 | /products/nfc-chip/ |
| RFID IC | 11.5 | Top 5 | /products/industrial-iot/ |
| RFID Chip | 11.7 | Top 5 | /products/industrial-iot/ |
| Animal Identification | 12.4 | Top 5 | /products/animal-id/ |

### SEO Checklist Per Page

For each of the top 20 product pages, apply this checklist:

#### Title Tag Optimization (Yoast SEO > Edit Page > SEO Title)

Format: `{Product Name} — {Primary Benefit} | Silicon Craft Technology`

Recommended titles for top pages:

| Page | Current Title (likely generic) | Optimized Title |
|------|-------------------------------|----------------|
| /products/immobilizer-transponder/ | Immobilizer Transponder | Automotive Immobilizer Transponder IC — Anti-Theft Security \| SIC |
| /products/sensor-interface-products/ | Sensor Interface Products | NFC Sensor Interface IC — Battery-Free Biosensor Chips \| SIC |
| /products/nfc-chip/ | NFC Chip | NFC Tag IC — Secure Authentication & Energy Harvesting \| SIC |
| /products/industrial-iot/ | Industrial IoT | RFID & HF Reader IC for Industrial IoT \| Silicon Craft |
| /products/animal-id/ | Animal ID | Animal ID Transponder IC — ISO 11784/11785 Compliant \| SIC |
| /services/ | Services | Custom ASIC Design Services — Fabless IC Design \| SIC |
| /product/sic6146-id46-... | SIC6146 | SIC6146 ID46 Automotive Immobilizer Transponder IC \| SIC |
| /product/sic4310-nfc-... | SIC4310 | SIC4310 NFC Type 2 Tag IC with UART & GPIO \| SIC |
| /product/sic4341-... | SIC4341 | SIC4341 Potentiostat Sensor Interface with NFC \| SIC |
| /product/sic4343-... | SIC4343 | SIC4343 Voltage Sensor AFE with NFC Interface \| SIC |

#### Meta Description Optimization

Format: Focus on buyer benefit, not specs. Include a CTA. Max 155 characters.

| Page | Recommended Meta Description |
|------|------------------------------|
| Immobilizer | "Automotive immobilizer transponder ICs supporting ID46, ID48, ID8A and more protocols. Proven anti-theft security in 40+ countries. Request samples." |
| Sensor Interface | "Battery-free NFC sensor interface chips for point-of-care diagnostics. Potentiostat, galvanostat, and voltage sensor AFE. Download datasheets." |
| NFC Chip | "NFC Forum Type 2 Tag ICs with AES-128 encryption and tamper detection. For brand protection, authentication, and smart packaging. Get samples." |
| Industrial IoT | "Multi-protocol HF reader ICs and ISO 15693 tag ICs for factory automation, asset tracking, and access control. Browse development kits." |
| Animal ID | "ISO 11784/11785 compliant LF transponder ICs for livestock identification and pet tracking. HDX and FDX-B protocols. Order online." |
| Services | "Custom ASIC design from a SET-listed fabless semiconductor company. 20+ years of IC design expertise. Contact our engineering team." |

#### Heading Structure Fix

Each page should have exactly **1 H1** tag (the page title) and logical H2/H3 hierarchy.

**Known issue from prior audit:** Homepage has 5 H1 tags — reduce to 1.

In Flatsome page builder:
1. Edit the page
2. Find all elements using H1
3. Change 4 of them to H2
4. Keep only the primary headline as H1

#### Internal Linking

Each product category page should link to:
- The relevant hub page (Phase 3) when built
- 2-3 related product categories (cross-sell)
- The contact page with "Request Sample" CTA
- Relevant application pages

Example for Sensor Interface Products page:
```
Related: [NFC Chip Products](/products/nfc-chip/) | [Healthcare Applications](/applications/healthcare/)
```

#### Product Schema (from prior SEO audit)

Use the template in `../SEO-Audit/seo-fixes/03-product-schema-template.json`

For each WooCommerce product page, Yoast WooCommerce SEO plugin should auto-generate Product schema. If not installed:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SIC4310 NFC Forum Type 2 Tag IC",
  "description": "NFC Forum Type 2 Tag IC with UART Interface and 8 GPIOs",
  "brand": {
    "@type": "Brand",
    "name": "Silicon Craft Technology"
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "Silicon Craft Technology PLC"
  },
  "sku": "SIC4310",
  "category": "NFC Tag IC",
  "offers": {
    "@type": "Offer",
    "price": "0.798",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

---

## 4B. Mobile Quick Fixes

### Current State
- 20% of traffic is mobile
- 39.3% engagement rate (vs 57.4% desktop)
- Full redesign planned Q4 2026 — these are quick fixes only

### Quick Fix Checklist (Top 10 Pages)

**Pages to fix (by traffic):**
1. Homepage (/)
2. Products (/products/)
3. Contact (/contact/)
4. Applications (/applications/)
5. SIC4310 product page
6. SIC4341 product page
7. Immobilizer category (/products/immobilizer-transponder/)
8. Sensor Interface (/products/sensor-interface-products/)
9. NFC Chip (/products/nfc-chip/)
10. Our Brand (/our-brand/)

### Fix 1: Viewport Meta Tag

Verify this tag exists in `<head>` (should be there with Flatsome theme):
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Fix 2: Tap Targets (Min 44x44px)

In WordPress Customizer or theme CSS, add:
```css
/* Mobile CTA button sizing */
@media (max-width: 768px) {
  .button, .btn, a.button, input[type="submit"],
  .add_to_cart_button, .single_add_to_cart_button {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 24px;
    font-size: 16px;
  }

  /* Navigation links */
  .menu-item a, .nav-link {
    min-height: 44px;
    display: flex;
    align-items: center;
  }
}
```

### Fix 3: Readable Text (Min 16px Body)

```css
@media (max-width: 768px) {
  body, p, li, td {
    font-size: 16px !important;
    line-height: 1.6;
  }

  h1 { font-size: 24px !important; }
  h2 { font-size: 20px !important; }
  h3 { font-size: 18px !important; }
}
```

### Fix 4: Responsive Images

```css
@media (max-width: 768px) {
  img {
    max-width: 100%;
    height: auto;
  }

  /* Fix any fixed-width images */
  .product-image img,
  .wp-post-image,
  .woocommerce-product-gallery img {
    width: 100% !important;
    height: auto !important;
  }
}
```

### Fix 5: Horizontal Overflow Prevention

```css
@media (max-width: 768px) {
  html, body {
    overflow-x: hidden;
  }

  /* Prevent tables from overflowing */
  table {
    display: block;
    overflow-x: auto;
    max-width: 100%;
  }

  /* Prevent wide elements from breaking layout */
  .row, .container, .section {
    max-width: 100vw;
    overflow-x: hidden;
  }
}
```

### Where to Add Mobile CSS

**Option A (Recommended):** WordPress Customizer > Additional CSS
- Go to Appearance > Customize > Additional CSS
- Paste all mobile CSS above
- Preview on mobile before publishing

**Option B:** Child theme style.css
- If a child theme exists, add to the child theme's style.css
- This survives theme updates

### Testing

After adding mobile CSS:
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Test at 375px (iPhone), 390px (iPhone 14), 412px (Pixel)
4. Check each of the top 10 pages for:
   - [ ] No horizontal scrolling
   - [ ] Text readable without zooming
   - [ ] Buttons large enough to tap
   - [ ] Images not overflowing
   - [ ] Navigation menu works

---

## Implementation Priority

| Fix | Effort | Impact | Priority |
|-----|--------|--------|----------|
| Title tags (Yoast) | 30 min | HIGH | 1 |
| Meta descriptions (Yoast) | 30 min | HIGH | 2 |
| H1 fix (homepage) | 15 min | MEDIUM | 3 |
| Mobile CSS | 30 min | MEDIUM | 4 |
| Internal linking | 1-2 hours | MEDIUM | 5 |
| Product schema | 2-4 hours | MEDIUM | 6 |
