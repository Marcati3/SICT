# SEO Audit Report: www.sic.co.th
**Date:** March 16, 2026
**Business Type:** Semiconductor / RFID Chip Design (SaaS-adjacent B2B manufacturer)
**Platform:** WordPress (Flatsome theme v3.19.7) + WooCommerce

---

## SEO Health Score: 46/100

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 22% | 58 | 12.8 |
| Content Quality (E-E-A-T) | 23% | 52 | 12.0 |
| On-Page SEO | 20% | 45 | 9.0 |
| Schema / Structured Data | 10% | 25 | 2.5 |
| Performance (CWV) | 10% | 55 | 5.5 |
| AI Search Readiness | 10% | 20 | 2.0 |
| Images | 5% | 28 | 1.4 |
| **TOTAL** | | | **45.2 → 46** |

---

## Executive Summary

Silicon Craft Technology (SIC) has a solid foundation — HTTPS, proper redirects, Yoast SEO, active blog with recent content, and real awards (Forbes Asia Best Under a Billion 2024). However, there are significant gaps in structured data, image optimization, security headers, and AI search readiness that are holding the site back.

### Top 5 Critical Issues
1. **87% of images missing alt text** (39 of 45 images) — accessibility and SEO disaster
2. **Zero security headers** — no HSTS, CSP, X-Frame-Options, or Referrer-Policy
3. **5 H1 tags on homepage** — should be exactly 1
4. **No Product schema** despite WooCommerce store — missing rich results
5. **No AI search optimization** — no llms.txt, no GEO signals

### Top 5 Quick Wins
1. Add alt text to all 39 images (~2 hours of work, biggest ROI)
2. Add Organization schema with full address, founding date, stock ticker
3. Fix H1 to single tag, convert extras to H2
4. Add security headers via .htaccess (Apache server)
5. Add hreflang tags (Thai/English) if bilingual audience intended

---

## 1. Technical SEO (Score: 58/100)

### Crawlability & Indexability — GOOD
- **robots.txt**: Properly configured via Yoast. Blocks WooCommerce logs and cart URLs. Allows admin-ajax.
- **Sitemap**: Present at `/sitemap_index.xml` with 13 child sitemaps (posts, pages, products, tags, authors)
- **Meta robots**: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` — correct
- **Canonical tag**: Present and correct (`https://www.sic.co.th/`)

### Redirects — GOOD
- `http://www.sic.co.th` → 301 → `https://www.sic.co.th/` (correct)
- `https://sic.co.th` → 301 → `https://www.sic.co.th/` (correct)
- No redirect chains detected

### Security — CRITICAL
- HTTPS: Yes
- **Missing ALL security headers:**
  - No `Strict-Transport-Security` (HSTS)
  - No `X-Frame-Options`
  - No `X-Content-Type-Options`
  - No `Content-Security-Policy`
  - No `Referrer-Policy`
  - No `Permissions-Policy`
- Server: Apache/2 (version not exposed — good)

**Fix:** Add to `.htaccess`:
```apache
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
```

### Mobile — GOOD
- Responsive theme (Flatsome)
- Mobile-first indexing compatible

### Server
- Server: Apache/2
- Cache-Control present but `max-age=0` — suboptimal
- No `Vary: Accept-Encoding` properly set for compression

---

## 2. Content Quality / E-E-A-T (Score: 52/100)

### Experience (Score: 45/100)
- Claims "20+ years of experience" — good
- Product images appear original (not stock) — good
- **Missing**: Case studies with specific outcomes, customer testimonials with real names, first-hand demonstrations

### Expertise (Score: 55/100)
- Technical product descriptions (LF/HF protocols, reader ICs) — good domain knowledge
- Blog with technical articles (pH measurement with NFC, immobilizer technology) — good
- **Missing**: Author bylines on blog posts, team credentials (PhDs, engineering backgrounds), technical white paper summaries on site

### Authoritativeness (Score: 65/100)
- Forbes Asia Best Under a Billion 2024 — strong
- Thailand Cybersecurity Award 2025 — strong
- Public company (PLC) on SET — strong
- Social profiles linked (LinkedIn, YouTube, Facebook, X) — good
- **Missing**: SET stock ticker in schema, industry association memberships, partner logos

### Trustworthiness (Score: 50/100)
- Phone number visible: +66 2 589 9991
- Email: info@sic.co.th
- Privacy policy in footer — good
- **Missing**: Full physical address on homepage, Google Maps embed, company registration number, ISO certification badges

### Content Depth
- Homepage word count: ~2,800-3,200 words — adequate for homepage (minimum 500)
- Blog actively updated through March 2026 — good freshness signal
- White Papers section exists — good

---

## 3. On-Page SEO (Score: 45/100)

### Title Tag — GOOD
`Silicon Craft Technology: Innovative RFID Chip & ASIC Designs`
- Length: 57 characters (ideal: 50-60)
- Includes primary keyword + brand
- Unique and descriptive

### Meta Description — GOOD
`Silicon Craft Technology PLC is Thailand's leading semiconductor and only IC design company, specializing in RFID chip and ASIC designs.`
- Length: ~135 characters (ideal: 120-160)
- Includes keywords and value proposition

### Heading Structure — CRITICAL ISSUE
**5 H1 tags detected (should be exactly 1):**
1. "SILICON CRAFT TECHNOLOGY PLC"
2. "RFID CHIP TECHNOLOGY"
3. "ADVANCING YOUR WORLD"
4. "UPCOMING NEWS & EVENTS"
5. "HIGHLIGHT ARTICLES"

**Fix:** Keep only #1 or create a single descriptive H1. Convert the rest to H2.

### Internal Linking — GOOD
- Rich navigation with product categories, applications, blog sections
- Multiple CTAs linking to key pages (store, products, services, careers)
- Breadcrumb implemented (single item on homepage — correct)

### Open Graph / Social
- OG image present (logo) — should use a custom branded OG image
- Twitter Card: Not explicitly configured

---

## 4. Schema / Structured Data (Score: 30/100)

### Currently Implemented (via Yoast)
| Type | Status |
|------|--------|
| WebPage | Present |
| Organization | Present (name, URL, logo, sameAs) |
| BreadcrumbList | Present |
| ImageObject | Present |
| WebSite | Present |

### Missing (High Priority)
| Type | Why |
|------|-----|
| **Product** | WooCommerce store active but NO product schema — missing rich results in Google |
| **LocalBusiness** | Has physical office in Thailand — should supplement Organization |
| **Article/BlogPosting** | Blog exists but no article schema on posts |
| **SoftwareApplication** | For design tools at webapp.sic.co.th |

### Issues Found
- Organization schema missing: `address`, `foundingDate`, `numberOfEmployees`, `tickerSymbol`
- No `contactPoint` in Organization schema
- WebSite schema has empty `description` field
- No SearchAction (sitelinks search box) in WebSite schema

---

## 5. Performance (Score: 55/100)

- Cache-Control: `max-age=0` — pages not cached, every visit hits server
- No explicit CDN detected
- Server response: Apache/2 with mod_http2 available (Upgrade: h2,h2c)
- WP Rocket caching plugin detected — good, but cache headers suggest misconfiguration
- Google Site Kit installed — has PageSpeed data available

**Recommendation:** Fix Cache-Control headers. Set `max-age=86400` for static assets, `max-age=3600` for HTML pages.

---

## 6. AI Search Readiness (Score: 20/100)

### Current State
- **No llms.txt file** — AI crawlers have no structured guidance
- **No AI crawler directives** in robots.txt (no GPTBot, ClaudeBot, PerplexityBot rules)
- Content is in HTML (accessible) — good baseline
- **No structured passages** optimized for citation (134-167 word sweet spot)
- **Brand mentions** limited — critical for AI citation (brand mentions correlate 3x more than backlinks for AI visibility)

### Recommendations
1. Create `/llms.txt` with company overview and key capabilities
2. Add explicit AI crawler rules in robots.txt (Allow or Disallow based on strategy)
3. Structure blog articles with quotable passages (stats, definitions, facts)
4. Increase brand visibility through PR and technical publications

---

## 7. Images (Score: 28/100)

### Critical: Alt Text Crisis
- **39 of 45 images (87%) have no alt text**
- Carousel images (carouselHome-1 through 8): all missing
- Product images (Product1-5): all missing
- Application banners: all missing
- Social/footer icons: all missing

### Good Practices Found
- WebP format used for ~25 images
- Lazy loading on below-fold images
- Explicit width/height on all images (prevents CLS)

### Missing
- No `srcset` or `<picture>` elements (responsive images)
- No `fetchpriority="high"` on LCP image
- Remaining ~20 images in JPG/PNG (should convert to WebP)

---

## Prioritized Action Plan

### CRITICAL — Fix Immediately
| # | Issue | Assigned To | Impact | Effort |
|---|-------|------------|--------|--------|
| 1 | Add alt text to all 39 images | Marketing Team | High — accessibility + image SEO | 2 hours |
| 2 | Fix to single H1 tag | Marketing Team | High — heading hierarchy signals | 15 min |
| 3 | Add security headers | Web Hosting / IT Dept | High — trust signal + security | 30 min |

### HIGH — Fix Within 1 Week
| # | Issue | Assigned To | Impact | Effort |
|---|-------|------------|--------|--------|
| 4 | Add Product schema to WooCommerce products | IT Dept (Web Developer) | High — enables rich results | 2-4 hours |
| 5 | Complete Organization schema (address, founding date, ticker) | IT Dept (Web Developer) | Medium — entity recognition | 1 hour |
| 6 | Fix Cache-Control headers | Web Hosting / IT Dept | Medium — page speed | 30 min |
| 7 | Add Article/BlogPosting schema to blog posts | IT Dept (Web Developer) | Medium — rich results | 2 hours |

### MEDIUM — Fix Within 1 Month
| # | Issue | Assigned To | Impact | Effort |
|---|-------|------------|--------|--------|
| 8 | Add responsive images (srcset) | IT Dept (Web Developer) | Medium — mobile performance | 4-8 hours |
| 9 | Convert remaining JPG/PNG to WebP | Marketing Team | Medium — page speed | 2 hours |
| 10 | Create llms.txt for AI crawlers | Web Hosting / IT Dept | Medium — AI search visibility | 1 hour |
| 11 | Add author bylines to blog posts | Marketing Team + Engineering | Medium — E-E-A-T expertise | 2 hours |
| 12 | Add physical address + map to homepage | Marketing Team | Medium — local SEO + trust | 1 hour |
| 13 | Custom OG image (not just logo) | Marketing Team (Design) | Low-Medium — social sharing | 1 hour |

### LOW — Backlog
| # | Issue | Assigned To | Impact | Effort |
|---|-------|------------|--------|--------|
| 14 | Add hreflang if Thai content planned | IT Dept (Web Developer) | Low — international SEO | 2 hours |
| 15 | Add SoftwareApplication schema for design tools | IT Dept (Web Developer) | Low — niche visibility | 1 hour |
| 16 | Add SearchAction to WebSite schema | IT Dept (Web Developer) | Low — sitelinks search box | 30 min |
| 17 | Add team page with credentials | Marketing Team + HR | Low — E-E-A-T long-term | 4 hours |

### Assignment Summary by Function

| Team | Tasks | Total Effort |
|------|-------|-------------|
| **Marketing Team** | #1, #2, #9, #11, #12, #13, #17 | ~9 hours |
| **IT Dept (Web Developer)** | #4, #5, #7, #8, #14, #15, #16 | ~13 hours |
| **Web Hosting / IT Dept** | #3, #6, #10 | ~2 hours |
| **Engineering** | #11 (provide author bios/credentials) | ~30 min |
| **HR** | #17 (provide team profiles/credentials) | ~1 hour |

**Notes:**
- **Marketing Team** handles all content changes (alt text, headings, bylines, copy) via WordPress admin — no coding required
- **IT Dept / Web Developer** handles all schema markup and technical configuration — requires code-level access
- **Web Hosting / IT Dept** handles server-level changes (.htaccess, robots.txt, file uploads) — requires FTP or cPanel access
- **Engineering + HR** are supporting roles providing content (bios, credentials) for Marketing to publish

---

## What's Working Well

- Clean URL structure with descriptive slugs
- Proper 301 redirects (HTTP→HTTPS, non-www→www)
- Active blog with recent content (March 2026)
- Yoast SEO properly configured
- Forbes Asia award — strong authority signal
- WP Rocket caching plugin installed
- Good use of WebP image format
- Lazy loading implemented
- CLS prevention via explicit image dimensions

---

*Generated by Claude Code SEO Audit — based on AgriciDaniel/claude-seo methodology*
