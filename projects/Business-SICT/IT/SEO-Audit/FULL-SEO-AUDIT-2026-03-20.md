# Full SEO Audit Report: www.sic.co.th

**Subject:** Silicon Craft Technology PLC (SIC)
**Industry:** Semiconductor / IC Design (B2B)
**Date:** 2026-03-20
**Audited by:** 7 parallel SEO subagents (Claude Opus 4.6)

---

## SEO Health Score: 49/100

| Category | Weight | Score | Weighted |
|----------|--------|-------|----------|
| Technical SEO | 22% | 52/100 | 11.4 |
| Content Quality | 23% | 56/100 | 12.9 |
| On-Page SEO | 20% | 62/100 | 12.4 |
| Schema / Structured Data | 10% | 55/100 | 5.5 |
| Performance (CWV) | 10% | 38/100 | 3.8 |
| AI Search Readiness (GEO) | 10% | 41/100 | 4.1 |
| Images | 5% | 40/100 | 2.0 |
| **TOTAL** | **100%** | | **49/100** |

**Verdict:** The site has a functional foundation (valid sitemaps, server-side rendering, JSON-LD schema, HTTPS) but suffers from significant performance, content depth, and AI readiness gaps. A publicly listed semiconductor company should target 75+.

---

## Platform & Stack

- **CMS:** WordPress + Flatsome Theme
- **E-commerce:** WooCommerce
- **SEO Plugin:** Yoast SEO
- **Caching:** WP Rocket
- **Analytics:** Google Tag Manager + GA4
- **Other:** reCAPTCHA, Google Site Kit, Cookie Consent

---

## Category Breakdowns

### 1. Technical SEO — 52/100

**What's Working:**
- robots.txt properly configured via Yoast (blocks sensitive WooCommerce paths)
- Self-referencing canonical tag on HTTPS www version
- 13 well-organized XML sitemaps via Yoast
- Fully server-rendered (no client-side JS framework dependency)
- Proper viewport meta tag
- Clean URL structure (/about-us/, /services/, /products/, /blog/)

**Critical Issues:**
- No security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- CLS risk from carousel/product images lacking explicit width/height attributes
- LCP risk — no `<link rel="preconnect">` or `<link rel="preload">` for Google Fonts or hero images
- 15+ synchronous JavaScript files blocking rendering
- No lazy-loading (`loading="lazy"`) on any images

**High Issues:**
- No Open Graph or Twitter Card meta tags (critical for B2B LinkedIn sharing)
- INP risk — jQuery + WooCommerce + reCAPTCHA + GTM all loading synchronously
- Mixed content risk — no CSP enforcement

**Medium Issues:**
- No IndexNow protocol support
- No GTM noscript fallback
- blocks-sitemap.xml exposes WordPress reusable blocks

---

### 2. Content Quality — 56/100

**E-E-A-T Composite: 69% (27.5/40)**

| Signal | Score | Key Gap |
|--------|-------|---------|
| Experience | 6/10 | No case studies, no customer testimonials, no project portfolio |
| Expertise | 7/10 | Good product taxonomy, but no datasheets inline, no named experts |
| Authoritativeness | 7/10 | SET-listed since 2019, but /investor-relations/ returns 404 |
| Trust | 7.5/10 | Contact info present, but no privacy policy link found |

**Critical Issues:**
- /history-rewards/ returns 404 — broken authority page
- /investor-relations/ returns 404 — critical for a public company
- Zero author attribution on any blog content (2/10)

**Content Depth:**
- Homepage: ~400-500 words (borderline thin)
- About: ~350-400 words (borderline thin)
- Products overview: ~300 words (thin)
- Blog: ~32 posts, 500-800 words each (adequate)

**Missing:**
- No Thai language version (gap for a Thai-listed company)
- No case studies or customer testimonials
- No leadership team bios accessible
- Weak cross-linking between blog and product pages

---

### 3. On-Page SEO — 62/100

**What's Working:**
- Title tag: "Silicon Craft Technology: Innovative RFID Chip & ASIC Designs" (~57 chars, ideal)
- Single H1 present with target keywords
- Clean URL hierarchy
- Footer well-organized with comprehensive links

**Issues:**
- Meta description slightly short at ~134 chars (ideal: 150-160)
- Multiple H1 tags detected on homepage
- H1 in ALL CAPS (stylistic concern)
- Generic "Learn More" CTA — low conversion potential
- Navigation has two tiers that may feel cluttered on mobile

---

### 4. Schema / Structured Data — 55/100

**Present (JSON-LD, Google-recommended format):**
- WebPage (with name, description, dates, language)
- Organization (name, URL, logo, sameAs social links)
- WebSite (with SearchAction for sitelinks search box)
- BreadcrumbList (single "Home" item — trivial on homepage)
- ImageObject (with dimensions and caption)

**Issues Found:**
- ImageObject URL typo: `sic.co.co.th` (doubled `.co`) — will fail Google validation
- BreadcrumbList trivial (single item)
- Missing contactPoint on Organization
- Missing address on Organization (PLC should have this)

**Missing Schema (High Impact):**
- Corporation schema (with tickerSymbol, foundingDate, numberOfEmployees)
- Product schema (critical for an IC design company)
- Article/NewsArticle schema (for blog posts)

---

### 5. Performance (CWV) — 38/100

**LCP (Largest Contentful Paint):**
- Hero carousel image not preloaded — adds 300-800ms to LCP
- Google Fonts block first paint
- WP Rocket inlines CSS (good) but inflates HTML size

**CLS (Cumulative Layout Shift):**
- font-display: swap causes text reflow (fonts not preloaded)
- Cookie consent banner dynamically injects
- Carousel images may lack container dimensions

**INP (Interaction to Next Paint):**
- 20+ script tags — heavy JS footprint
- jQuery + Flatsome + WooCommerce + reCAPTCHA + GTM all competing for main thread
- No evidence of task-yielding patterns

**Third-Party Impact (8+ external domains):**
- YouTube iframe embeds load ~1MB+ of JS (Critical)
- reCAPTCHA loads heavy JS bundle
- GTM spawns additional requests

**Top Fixes:**
1. Preload hero carousel image (`<link rel="preload">`)
2. Add `loading="lazy"` to all below-fold images
3. Replace YouTube iframes with lite-youtube-embed facade
4. Preload critical font files
5. Defer non-critical JS (GA4, WooCommerce cart fragments, cookie consent)

---

### 6. AI Search Readiness (GEO) — 41/100

| Platform | Score |
|----------|-------|
| Google AI Overviews | 35/100 |
| ChatGPT Search | 30/100 |
| Perplexity | 35/100 |
| Bing Copilot | 40/100 |

**AI Crawler Access:** All crawlers allowed by default (no explicit directives)

**Critical Gaps:**
- No /llms.txt file
- No FAQ section or question-based headings
- No Wikipedia entity
- No explicit AI crawler policy in robots.txt
- Weak passage-level citability (short paragraphs, no self-contained answer blocks)
- No statistics with source attribution

**Best Quotable Passage Found:**
> "Silicon Craft Technology PLC is Thailand's leading semiconductor and only IC design company, specializing in RFID chips and ASIC designs."

---

### 7. Sitemap — 73/100

**Structure:** Yoast-generated sitemap index with 12 child sitemaps, 555 total URLs

**What's Working:**
- Valid XML with correct namespace
- robots.txt declares sitemap correctly
- All key pages present
- lastmod dates in ISO 8601 format
- No changefreq/priority (correct — deprecated)

**Issues:**
- 363 tag pages (65% of sitemap) — massive taxonomy bloat
- 6 WordPress reusable blocks exposed in blocks-sitemap.xml
- WooCommerce utility pages included (/cart/, /checkout/, /my-account/)
- Batch-identical lastmod timestamps reduce Google's trust in lastmod accuracy

---

### 8. Visual / UX — 55/100

**Issues:**
- Tap targets below 48px minimum on mobile (buttons ~34-36px)
- Body font at 13px base — below 16px mobile minimum
- ~35-40% of images lack alt text; existing alt text is generic/duplicated
- Generic "Learn More" CTA above fold
- No sticky mobile CTA or floating action button
- Multiple H1 tags on homepage

**Strengths:**
- Clean Inter font family
- Consistent brand color system (#1d4e89 dark blue, #3cbaf1 light blue)
- Mobile hamburger menu implemented
- Logical navigation grouping
- Well-structured footer

---

## Prioritized Action Plan

### Critical — Fix This Week

| # | Issue | Category | Impact | Effort |
|---|-------|----------|--------|--------|
| 1 | Fix 404 on /history-rewards/ and /investor-relations/ | Content | Lost authority pages, broken internal links | Low |
| 2 | Add security headers (HSTS, CSP, X-Frame-Options, etc.) | Technical | Security vulnerability, trust signal | Low |
| 3 | Preload hero carousel image | Performance | 300-800ms LCP improvement | Low |
| 4 | Add `loading="lazy"` to all below-fold images | Performance | Significant bandwidth reduction | Low |
| 5 | Fix ImageObject URL typo (`sic.co.co.th` → `sic.co.th`) | Schema | Fails Google validation | Low |
| 6 | Remove blocks-sitemap.xml from indexing | Sitemap | Thin content indexed, wasted crawl budget | Low |

### High — Fix Within 2 Weeks

| # | Issue | Category | Impact | Effort |
|---|-------|----------|--------|--------|
| 7 | Add Open Graph and Twitter Card meta tags | Technical | B2B LinkedIn sharing previews | Low |
| 8 | Replace YouTube iframes with lite-youtube-embed | Performance | Save ~1MB+ JS per page | Medium |
| 9 | Add author attribution to all blog posts | Content | Biggest E-E-A-T gap | Medium |
| 10 | Create /llms.txt file | GEO | AI search visibility | Low |
| 11 | Add explicit AI crawler directives to robots.txt | GEO | Control AI training vs search access | Low |
| 12 | Noindex or remove 363 thin tag archive pages from sitemap | Sitemap | 65% crawl budget waste | Medium |
| 13 | Fix tap targets — min 48x48px on all interactive elements | Visual | Mobile usability, WCAG compliance | Medium |
| 14 | Preload critical font files (Inter Tight 600) | Performance | Reduces LCP and CLS | Low |

### Medium — Fix Within 1 Month

| # | Issue | Category | Impact | Effort |
|---|-------|----------|--------|--------|
| 15 | Add Corporation schema with tickerSymbol, address, contactPoint | Schema | Rich results, entity recognition | Medium |
| 16 | Add Product schema to all product pages | Schema | Product rich results | Medium |
| 17 | Create FAQ section with question-based headings | GEO/Content | AI citation, featured snippets | Medium |
| 18 | Add leadership team page with bios and credentials | Content | E-E-A-T Experience/Expertise | Medium |
| 19 | Expand homepage content to 800+ words | Content | Thin content risk | Medium |
| 20 | Add inline product specifications (not just brochure downloads) | Content | Content depth, search visibility | High |
| 21 | Defer non-critical JS (GA4, WooCommerce cart, cookie consent) | Performance | INP improvement | Medium |
| 22 | Exclude WooCommerce utility pages from sitemap | Sitemap | Crawl efficiency | Low |
| 23 | Increase body font to min 16px on mobile | Visual | Readability, accessibility | Low |
| 24 | Improve image alt text (unique, descriptive per image) | Visual | WCAG 2.1 Level A, image SEO | Medium |

### Low — Backlog

| # | Issue | Category | Impact | Effort |
|---|-------|----------|--------|--------|
| 25 | Add Thai language version | Content | Local investor audience | High |
| 26 | Publish case studies with measurable outcomes | Content | E-E-A-T Experience | High |
| 27 | Pursue Wikipedia article | GEO | Strongest AI citation signal | High |
| 28 | Add IndexNow protocol | Technical | Faster Bing/Yandex indexing | Low |
| 29 | Add Article schema to blog posts | Schema | Article rich results | Medium |
| 30 | Replace "Learn More" with action-oriented CTA | Visual | Conversion optimization | Low |
| 31 | Add sticky mobile CTA | Visual | Mobile conversion | Medium |
| 32 | Consolidate duplicate User-agent blocks in robots.txt | Technical | Cleanliness | Low |

---

## Quick Wins (High Impact, Low Effort)

These 8 fixes can be done in a single day and would raise the score to approximately **60-65/100**:

1. Fix 404 pages (/history-rewards/, /investor-relations/)
2. Add security headers via .htaccess
3. Preload hero image
4. Add loading="lazy" to below-fold images
5. Fix schema image URL typo
6. Remove blocks-sitemap.xml
7. Add Open Graph meta tags
8. Create /llms.txt

---

## Score Projection

| Timeframe | Estimated Score | Key Changes |
|-----------|----------------|-------------|
| Current | 49/100 | Baseline |
| After Quick Wins (1 day) | 60-65/100 | Critical fixes + low-hanging fruit |
| After High Priority (2 weeks) | 68-72/100 | Author attribution, tag cleanup, font preloading |
| After Medium Priority (1 month) | 75-80/100 | Schema expansion, FAQ content, product specs |
| After Full Backlog (3 months) | 82-88/100 | Case studies, Wikipedia, Thai localization |

---

*Report generated by 7 parallel SEO subagents. For questions or implementation support, run `/seo page <url>` for deep-dive analysis of specific pages.*
