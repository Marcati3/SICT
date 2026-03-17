# IT / SEO Audit — Project Brief

## Project Overview

SEO audit and remediation for **www.sic.co.th**, the corporate website of Silicon Craft Technology PLC (SET: SICT). Audit conducted 2026-03-16 using Claude Code SEO methodology (based on AgriciDaniel/claude-seo).

**Current SEO Health Score:** 46/100
**Target Score After Fixes:** 75-80/100

---

## Key Findings

1. **87% of images missing alt text** (39 of 45) — accessibility and SEO disaster
2. **Zero security headers** — no HSTS, CSP, X-Frame-Options, or Referrer-Policy
3. **5 H1 tags on homepage** — should be exactly 1
4. **No Product schema** despite WooCommerce store — missing rich results
5. **No AI search optimization** — no llms.txt, no GEO signals

## Deliverables

| File | Purpose |
|------|---------|
| `SEO-AUDIT-REPORT.md` | Full audit report with scores, findings, and prioritized action plan |
| `SEO-AUDIT-REPORT.docx` | Word version for team distribution |
| `seo-fixes/README-HANDOFF.md` | Implementation guide with order, validation URLs, notes |
| `seo-fixes/01-htaccess-security-headers.txt` | Security headers + cache-control for .htaccess |
| `seo-fixes/02-corporation-schema.json` | Corporation schema (ticker, awards, contactPoint) |
| `seo-fixes/03-product-schema-template.json` | Product schema template for WooCommerce |
| `seo-fixes/04-llms.txt` | AI crawler guidance file for site root |
| `seo-fixes/05-robots-txt-additions.txt` | AI crawler Allow/Disallow directives |
| `seo-fixes/06-image-alt-text-list.md` | Alt text recommendations for all 39 images |
| `seo-fixes/07-article-schema-template.json` | Article/BlogPosting schema template |

## Assignments by Function

| Team | Tasks | Total Effort |
|------|-------|-------------|
| **Marketing Team** | Alt text, H1 fix, WebP conversion, author bylines, address, OG image, team page | ~9 hours |
| **IT Dept (Web Developer)** | Product schema, Organization schema, Article schema, responsive images, hreflang, SearchAction | ~13 hours |
| **Web Hosting / IT Dept** | Security headers, cache-control, llms.txt upload | ~2 hours |
| **Engineering** | Provide author bios/credentials for blog posts | ~30 min |
| **HR** | Provide team profiles/credentials for team page | ~1 hour |

## Implementation Timeline

- **Week 1 (Critical + High):** Security headers, image alt text, H1 fix, Corporation schema, Product schema
- **Week 2 (Medium):** llms.txt, robots.txt AI directives, Article schema
- **Month 1 (Lower priority):** Responsive images, WebP conversion, author bylines, physical address, OG image

## Tech Stack

- **Platform:** WordPress (Flatsome theme v3.19.7) + WooCommerce
- **SEO Plugin:** Yoast SEO
- **Caching:** WP Rocket
- **Server:** Apache/2

## Status

- [x] Audit completed (2026-03-16)
- [x] Report generated (.md + .docx)
- [x] Fix files packaged with handoff instructions
- [ ] Fixes implemented by web team
- [ ] Post-implementation validation

## Validation URLs

After implementation, verify at:
- Security headers: https://securityheaders.com/?q=www.sic.co.th
- Schema markup: https://search.google.com/test/rich-results
- AI readiness: www.sic.co.th/llms.txt and www.sic.co.th/robots.txt
- Overall: Google Lighthouse in Chrome DevTools > SEO section
