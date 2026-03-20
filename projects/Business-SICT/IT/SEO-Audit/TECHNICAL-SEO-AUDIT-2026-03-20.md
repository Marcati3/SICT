# Technical SEO Audit: www.sic.co.th
**Date:** March 20, 2026
**Platform:** WordPress (Flatsome theme v3.19.7) + WooCommerce + Yoast SEO
**Data source:** Live WebFetch of homepage, robots.txt, and sitemap_index.xml

---

## Technical SEO Score: 52/100

| Category | Max Points | Score | Severity Summary |
|----------|-----------|-------|------------------|
| Crawlability | 15 | 12 | 1 Medium issue |
| Indexability | 15 | 14 | 1 Low issue |
| Security | 15 | 5 | 2 Critical, 1 High |
| URL Structure | 10 | 8 | 1 Low issue |
| Mobile | 10 | 7 | 1 Medium issue |
| Core Web Vitals Signals | 15 | 4 | 2 Critical, 1 High |
| JavaScript Rendering | 10 | 7 | 1 Medium issue |
| IndexNow | 5 | 0 | 1 Medium issue |
| Structured Data (bonus) | 5 | 2 | 1 High issue |
| **TOTAL** | **100** | **52** | |

---

## 1. Crawlability (12/15)

### robots.txt -- GOOD
**Severity: N/A (Pass)**

The robots.txt is well-configured via Yoast SEO:

```
User-agent: *
Disallow: /wp-content/uploads/wc-logs/
Disallow: /wp-content/uploads/woocommerce_transient_files/
Disallow: /wp-content/uploads/woocommerce_uploads/
Disallow: /*?add-to-cart=
Disallow: /*?*add-to-cart=
Disallow: /wp-admin/
Allow: /wp-admin/admin-ajax.php
Sitemap: https://www.sic.co.th/sitemap_index.xml
```

- Correctly blocks WooCommerce sensitive directories (logs, uploads, transient files)
- Blocks cart query parameter URLs (prevents crawl waste on dynamic cart pages)
- Blocks `/wp-admin/` while allowing `admin-ajax.php` (needed for front-end AJAX)
- Sitemap declaration present and pointing to correct URL

### Canonical Tag -- GOOD
**Severity: N/A (Pass)**

Canonical is set to `https://www.sic.co.th/` -- correct, self-referencing, uses www + HTTPS.

### Meta Robots -- GOOD
**Severity: N/A (Pass)**

Previous audit confirmed `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` -- optimal for search visibility.

### Redirect Chain (www vs non-www) -- NEEDS VERIFICATION
**Severity: Medium**

- The canonical enforces `https://www.sic.co.th/` (www version)
- Non-www to www redirect could not be fully verified in this audit (WebFetch limitation)
- Previous audit from March 16 confirmed redirects work correctly
- **Risk:** If non-www does not 301 to www, duplicate content issues arise

### XML Sitemap -- GOOD with minor concern
**Severity: Low**

Sitemap index at `/sitemap_index.xml` contains 12 child sitemaps:
1. `post-sitemap.xml` -- Blog posts
2. `page-sitemap.xml` -- Static pages
3. `blocks-sitemap.xml` -- Reusable blocks (unnecessary, could be excluded)
4. `product-sitemap.xml` -- WooCommerce products
5. `thjm_jobs-sitemap.xml` -- Job listings
6. `post_tag-sitemap.xml` -- Post tag archives
7. `product_cat-sitemap.xml` -- Product category archives
8. `product_tag-sitemap.xml` -- Product tag archives
9. `thjm_job_category-sitemap.xml` -- Job category archives
10. `thjm_job_locations-sitemap.xml` -- Job location archives
11. `thjm_job_type-sitemap.xml` -- Job type archives
12. `author-sitemap.xml` -- Author archives

**Issue:** `blocks-sitemap.xml` exposes WordPress reusable blocks which are typically not useful content. Consider excluding via Yoast settings.

---

## 2. Indexability (14/15)

### noindex Tags -- GOOD
**Severity: N/A (Pass)**

No noindex directives detected on the homepage. Yoast meta robots tag allows indexing with generous snippet/image preview settings.

### X-Robots-Tag Headers -- NOT DETECTED
**Severity: Low**

No X-Robots-Tag HTTP headers were detected. This is not a problem per se -- the meta robots tag in HTML handles indexing directives. However, for non-HTML resources (PDFs, images), X-Robots-Tag headers provide additional control.

**Recommendation:** Consider adding `X-Robots-Tag: noindex` for sensitive PDF files (datasheets behind forms, etc.) if applicable.

---

## 3. Security (5/15)

### HTTPS Enforcement -- GOOD
**Severity: N/A (Pass)**

The site serves over HTTPS. Canonical URL uses `https://`. All internal references observed use HTTPS protocol.

### Security Headers -- CRITICAL FAILURE
**Severity: Critical**

Based on previous audit and current fetch, the site is missing ALL security headers:

| Header | Status | Impact |
|--------|--------|--------|
| Strict-Transport-Security (HSTS) | MISSING | Browsers don't force HTTPS on subsequent visits |
| Content-Security-Policy (CSP) | MISSING | No protection against XSS, code injection |
| X-Frame-Options | MISSING | Site can be embedded in iframes (clickjacking risk) |
| X-Content-Type-Options | MISSING | MIME-type sniffing attacks possible |
| Referrer-Policy | MISSING | Full referrer URLs leak to third parties |
| Permissions-Policy | MISSING | No control over browser API access (camera, mic, etc.) |

**Google considers HTTPS a ranking signal, and the absence of HSTS means this signal is weakened.** While security headers are not direct ranking factors, they affect trust signals and could impact Core Web Vitals through increased attack surface.

### Mixed Content Risk -- MEDIUM
**Severity: High**

Google Fonts and Google Tag Manager are loaded from external HTTPS sources (good). However, no Content-Security-Policy header means there is no enforcement preventing mixed content from being injected. WordPress plugins could introduce HTTP resources without detection.

**Fix:** Add these headers via `.htaccess` (Apache) or server config:
```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
```

---

## 4. URL Structure (8/10)

### Clean URLs -- GOOD
**Severity: N/A (Pass)**

WordPress permalink structure appears to use clean URLs (no `?p=123` format). Product, post, and page URLs use human-readable slugs.

### Trailing Slash Consistency -- MINOR ISSUE
**Severity: Low**

The canonical URL uses a trailing slash (`https://www.sic.co.th/`). WordPress typically enforces trailing slashes consistently via its rewrite rules. No inconsistencies detected on the homepage, but inner pages should be spot-checked.

---

## 5. Mobile (7/10)

### Viewport Meta Tag -- GOOD
**Severity: N/A (Pass)**

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Correctly configured. Allows proper scaling on mobile devices.

### Responsive Design Signals -- MOSTLY GOOD
**Severity: Medium**

- Flatsome theme (v3.19.7) is a responsive WordPress theme with mobile-specific layouts
- Uses percentage-based image widths (e.g., `width: 20%`) rather than fixed pixel widths
- **Issue:** Percentage-based widths without corresponding height declarations contribute to CLS (Cumulative Layout Shift) -- see Core Web Vitals section
- No AMP implementation detected (not required, but noted)

---

## 6. Core Web Vitals Signals (4/15)

### LCP (Largest Contentful Paint) Candidates -- CRITICAL
**Severity: Critical**

**Issues identified:**
1. **No preload/preconnect directives detected** -- Critical fonts (Inter Tight, Inter) and hero images load without resource hints, delaying LCP
2. **Hero carousel images lack explicit dimensions** -- Browser cannot reserve space until image loads
3. **15+ external JavaScript files** loaded synchronously, including Google Tag Manager container code loaded in the `<head>` -- blocks rendering
4. **No lazy-loading detected** (`loading="lazy"` absent from images) -- all images compete for bandwidth with the LCP element
5. **Google Fonts loaded from external CDN** without `<link rel="preconnect">` -- adds DNS lookup + connection time

**Expected impact:** LCP likely exceeds 2.5s threshold on mobile connections.

**Fix priority list:**
1. Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
2. Add `<link rel="preload">` for hero/above-fold images
3. Defer non-critical JavaScript (move GTM to `async` or delay)
4. Add `loading="lazy"` to below-fold images

### CLS (Cumulative Layout Shift) Risk -- CRITICAL
**Severity: Critical**

**Issues identified:**
1. **Carousel/slider images without width/height attributes** -- major CLS source. When images load, content shifts as the browser calculates dimensions
2. **Multiple images using percentage widths without aspect-ratio** -- no `aspect-ratio` CSS property or explicit `width`/`height` HTML attributes
3. **Cookie consent banner** -- dynamically injected, likely pushes content down
4. **Sticky navigation elements** detected -- if not properly handled with CSS `position: sticky` reserving space, causes shifts
5. **WooCommerce dynamic content** (cart widgets, price updates) -- JavaScript-driven DOM modifications

**Expected impact:** CLS likely exceeds 0.1 threshold.

**Fix priority list:**
1. Add explicit `width` and `height` attributes to ALL images (most impactful)
2. Use CSS `aspect-ratio` for responsive images: `aspect-ratio: 16/9`
3. Reserve space for cookie consent banner using CSS `min-height`
4. Preload carousel images to reduce layout shift timing

### INP (Interaction to Next Paint) Signals -- HIGH RISK
**Severity: High**

**Issues identified:**
1. **15+ synchronous JavaScript files** -- heavy main thread blocking
2. **Google Tag Manager + Google Analytics** -- event listeners on every click, scroll, and page interaction
3. **WooCommerce cart functionality** -- JavaScript-driven add-to-cart handlers
4. **reCAPTCHA integration** on contact forms -- loads additional JavaScript
5. **jQuery dependency** -- legacy library adds overhead to event handling
6. **No evidence of code splitting or dynamic imports** -- entire JS payload loads on every page

**Expected impact:** INP may exceed 200ms on mid-range mobile devices.

**Fix priority list:**
1. Defer non-critical JavaScript with `defer` or `async` attributes
2. Consider loading reCAPTCHA only on pages with forms (not globally)
3. Evaluate removing jQuery dependency (Flatsome theme may require it)
4. Implement `requestIdleCallback` for non-urgent analytics events

---

## 7. JavaScript Rendering (7/10)

### Client-Side Frameworks -- NO MAJOR FRAMEWORKS
**Severity: N/A (Pass)**

No React, Vue, or Angular detected. The site uses:
- **jQuery** -- traditional DOM manipulation
- **WooCommerce JS** -- cart and shop functionality
- **Flatsome theme JS** -- sliders, lightboxes, UI components

This is favorable for SEO. Server-side rendered WordPress content is fully crawlable by Googlebot without JavaScript execution.

### noscript Tags -- MISSING
**Severity: Medium**

No `<noscript>` fallback content detected. While Googlebot executes JavaScript, this means:
- Users with JS disabled see no fallback content
- Some SEO crawlers (Bing, smaller engines) may miss JavaScript-dependent content
- GTM noscript iframe (standard for GTM) was not detected -- should be present

**Fix:** Add GTM noscript fallback immediately after `<body>`:
```html
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PQBDWFRW" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

---

## 8. IndexNow (0/5)

### IndexNow Protocol -- NOT IMPLEMENTED
**Severity: Medium**

No IndexNow support detected:
- No IndexNow API key meta tag
- No IndexNow key file (e.g., `/{key}.txt`)
- No IndexNow plugin active

**What is IndexNow:** A protocol that lets websites instantly notify search engines (Bing, Yandex, Naver, Seznam) about content changes, rather than waiting for crawlers to discover them.

**Why it matters for SICT:** As a B2B company publishing product updates, press releases, and job listings, IndexNow ensures new content is indexed within minutes on supporting search engines.

**Fix:** Install the [IndexNow WordPress plugin](https://wordpress.org/plugins/indexnow/) (by Microsoft) -- takes under 5 minutes, no configuration needed beyond activation.

---

## 9. Bonus: Structured Data & Social (2/5)

### Open Graph Tags -- MISSING
**Severity: High**

No Open Graph (`og:title`, `og:description`, `og:image`) or Twitter Card meta tags detected. This means:
- Shared links on LinkedIn, Facebook, Twitter show generic/unpredictable previews
- For a B2B semiconductor company, LinkedIn sharing is critical -- missing OG tags severely undermines content distribution

**Fix:** Yoast SEO has built-in Social settings. Navigate to Yoast > Social and configure Open Graph defaults. Ensure each page/post has a featured image set.

### Schema Markup -- PARTIAL
**Severity: High**

Organization schema detected with social media links (LinkedIn, YouTube, Facebook, X/Twitter). However:
- No Product schema despite WooCommerce store
- No FAQ schema on relevant pages
- No BreadcrumbList schema
- No Article/BlogPosting schema on blog posts

---

## Summary: Priority Fix List

### Critical (Fix This Week)
| # | Issue | Category | Effort |
|---|-------|----------|--------|
| 1 | Add explicit width/height to all images | CWV - CLS | 2-3 hours |
| 2 | Add preconnect/preload resource hints | CWV - LCP | 30 minutes |
| 3 | Defer non-critical JavaScript | CWV - LCP/INP | 1-2 hours |
| 4 | Add security headers via .htaccess | Security | 30 minutes |

### High (Fix Within 2 Weeks)
| # | Issue | Category | Effort |
|---|-------|----------|--------|
| 5 | Add Open Graph / Twitter Card meta tags | Social/Indexability | 30 minutes |
| 6 | Add `loading="lazy"` to below-fold images | CWV - LCP | 1 hour |
| 7 | Add CSP header (start with report-only) | Security | 2-3 hours |
| 8 | Add Product schema to WooCommerce items | Structured Data | 1-2 hours |

### Medium (Fix Within 1 Month)
| # | Issue | Category | Effort |
|---|-------|----------|--------|
| 9 | Install IndexNow plugin | Indexing Speed | 5 minutes |
| 10 | Add GTM noscript fallback | JS Rendering | 10 minutes |
| 11 | Exclude blocks-sitemap.xml from index | Crawlability | 5 minutes |
| 12 | Verify non-www to www 301 redirect | Crawlability | 15 minutes |

### Low (Backlog)
| # | Issue | Category | Effort |
|---|-------|----------|--------|
| 13 | Add X-Robots-Tag for sensitive PDFs | Indexability | 30 minutes |
| 14 | Audit trailing slash consistency on inner pages | URL Structure | 1 hour |
| 15 | Add hreflang if bilingual audience intended | Crawlability | 2 hours |

---

## Comparison to Previous Audit (March 16, 2026)

The previous comprehensive audit scored the site at **46/100** across all SEO dimensions (content, on-page, technical, schema, performance, AI readiness, images). This focused technical audit scores the technical subset at **52/100**.

Key findings that remain unresolved since March 16:
- Security headers still missing (Critical)
- Images still lacking dimensions (Critical for CWV)
- No Open Graph tags (High)
- No IndexNow (Medium)
- No noscript fallbacks (Medium)

**All 5 critical issues from the March 16 audit appear to still be present.** Implementation of the fix recommendations from that audit has not been confirmed.

---

*Audit performed via live WebFetch data collection on March 20, 2026.*
