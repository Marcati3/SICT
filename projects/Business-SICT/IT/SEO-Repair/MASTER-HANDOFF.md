# SIC Website SEO Repair — Master Handoff

**Client:** Silicon Craft Technology PLC (www.sic.co.th)
**Stakeholder:** Marc Spiegel, CCO
**Date:** 2026-03-19
**Prepared by:** Claude Code SEO Analysis

---

## Executive Summary

SIC's website has three critical failures costing ~5,000 visitors/month in lost traffic:
1. **"Page Not Found" is the #1 page** — 67+ broken URLs confirmed
2. **96.6% bot traffic** polluting analytics
3. **Zero lead capture** on downloadable content

This package contains ready-to-deploy fixes for all 5 phases. Implementation requires WordPress admin access and GA4 access.

---

## Deliverables

| # | File | What It Does | Who Implements |
|---|------|-------------|----------------|
| 01 | `01-redirect-rules.htaccess` | 67+ 301 redirects for all broken URLs | Web Dev / IT |
| 02 | `02-redirects-csv-import.csv` | Same redirects as CSV for Redirection plugin | Web Dev |
| 03 | `PHASE-1-IMPLEMENTATION.md` | 404 fixes + bot filtering + homepage canonical | Web Dev + Marketing |
| 04 | `PHASE-2-LEAD-CAPTURE.md` | Datasheet gating, sample request forms, CTAs | Marketing + Web Dev |
| 05 | `PHASE-3-HUB-PAGES.md` | 4 industry hub landing page specifications | Marketing + Web Dev |
| 06 | `PHASE-4-SEO-MOBILE.md` | Title/meta optimization + mobile CSS fixes | Marketing + Web Dev |
| 07 | `PHASE-5-ANALYTICS.md` | GA4 dashboard + UTM naming convention | Marketing |

**From prior SEO audit** (in `../SEO-Audit/seo-fixes/`):
| 08 | `01-htaccess-security-headers.txt` | Security headers for .htaccess | IT / Hosting |
| 09 | `02-corporation-schema.json` | Organization schema | Web Dev |
| 10 | `03-product-schema-template.json` | Product schema template | Web Dev |
| 11 | `04-llms.txt` | AI search visibility file | IT / Hosting |
| 12 | `05-robots-txt-additions.txt` | AI crawler directives | Web Dev |
| 13 | `06-image-alt-text-list.md` | Alt text for 39 images | Marketing |
| 14 | `07-article-schema-template.json` | Blog post schema template | Web Dev |

---

## Implementation Timeline

### Week 1: Emergency (Phase 1)
| Day | Task | Owner | Time |
|-----|------|-------|------|
| 1 | Install Redirection plugin, import CSV | Web Dev | 30 min |
| 1 | Test 10 critical redirects | Web Dev | 15 min |
| 1 | Enable 404 logging in Redirection | Web Dev | 5 min |
| 2 | Create GA4 "Real Traffic" segment | Marketing | 30 min |
| 2 | Fix homepage canonical/title in Yoast | Web Dev | 15 min |
| 3 | Verify all 67+ redirects working | Web Dev | 1 hour |

### Week 2: Lead Capture (Phase 2)
| Day | Task | Owner | Time |
|-----|------|-------|------|
| 4 | Verify customer portal captures leads | IT | 30 min |
| 4 | Create Download Gate CF7 form | Web Dev | 1 hour |
| 5 | Create Sample Request + Talk to Engineer forms | Web Dev | 1 hour |
| 5 | Create /request-sample/ and /talk-to-engineer/ pages | Web Dev | 1 hour |
| 6 | Replace brochure PDF links with gated flow | Web Dev | 1 hour |
| 6 | Add CTA buttons to product pages | Web Dev | 2 hours |
| 7 | Add CF7 → GA4 tracking JavaScript | Web Dev | 30 min |
| 7 | Test all forms on desktop + mobile | QA | 1 hour |

### Weeks 3-4: Hub Pages (Phase 3)
| Day | Task | Owner | Time |
|-----|------|-------|------|
| 8-9 | Create /solutions/ parent + 4 hub pages | Web Dev + Marketing | 8 hours |
| 10 | Add hub page links to navigation menu | Web Dev | 30 min |
| 10 | Add internal links from product/app pages | Web Dev | 2 hours |
| 11 | Review and refine hub page content | Marketing | 2 hours |
| 12 | Add gated download CTAs to hub pages | Web Dev | 1 hour |
| 14 | Mobile test all hub pages | QA | 1 hour |

### Weeks 4-5: SEO + Mobile (Phase 4)
| Day | Task | Owner | Time |
|-----|------|-------|------|
| 15 | Optimize title tags in Yoast (top 20 pages) | Marketing | 1 hour |
| 15 | Write meta descriptions (top 20 pages) | Marketing | 1 hour |
| 16 | Fix homepage H1 tags (5 → 1) | Web Dev | 15 min |
| 16 | Add mobile CSS to Customizer | Web Dev | 30 min |
| 17 | Add internal cross-links between categories | Web Dev | 1 hour |
| 18-19 | Add Product schema (Yoast WooCommerce or manual) | Web Dev | 3 hours |
| 20-21 | Image alt text (from prior audit list) | Marketing | 2 hours |

### Week 5-6: Analytics (Phase 5)
| Day | Task | Owner | Time |
|-----|------|-------|------|
| 22 | Set up GA4 conversion events | Marketing | 1 hour |
| 23 | Create monthly + weekly reports | Marketing | 2 hours |
| 24 | Build CCO dashboard | Marketing | 2 hours |
| 25 | Create UTM reference sheet for team | Marketing | 30 min |
| 26 | Train marketing team on UTM usage | Marketing | 30 min |
| 28 | First weekly report to Marc | Marketing | 15 min |

### Also Deploy (from prior SEO audit):
| When | Task | Owner | Time |
|------|------|-------|------|
| Week 1 | Security headers (.htaccess) | IT | 30 min |
| Week 2 | Corporation schema | Web Dev | 1 hour |
| Week 3 | llms.txt + robots.txt update | IT | 15 min |
| Week 4 | Article schema for blog | Web Dev | 2 hours |

---

## Key Findings Summary

### 404 Audit Results
- **67+ broken URLs found** by direct site probing
- **14 immobilizer product URLs** dead (SIC61xx short URLs)
- **41 common page paths** returning 404 (/about/, /downloads/, /support/, etc.)
- **12 product category paths** returning 404 (/product-category/rfid/, etc.)
- **Root cause:** Site restructure changed URL patterns but no redirects were set up
- **Fix:** All mapped in redirect CSV — install Redirection plugin + import

### Domain Clarification
- **Active domain:** www.sic.co.th (Thai country code TLD)
- **siliconcraftth.com:** Does NOT resolve — not an active domain
- **Sitemap:** Yoast-generated, 500+ indexed URLs, all healthy

### Lead Capture Current State
- Datasheets → webapp.sic.co.th customer portal (JS app, likely gated but needs verification)
- Brochures → Direct ungated PDF links (gap)
- No "Request Sample" CTA on any product page
- Contact form exists (CF7 + Cloudflare Turnstile) but lacks Product Interest field
- **Broken brochure link:** SICAllBrochure.pdf → 404

### Site Technology
- WordPress + Flatsome theme v3.19.7
- WooCommerce (active store with pricing)
- Yoast SEO
- WP Rocket (caching)
- Contact Form 7 with Cloudflare Turnstile
- Apache/2 server

---

## Success Metrics

| Metric | Before | After Phase 1 | After All Phases |
|--------|--------|--------------|-----------------|
| 404 page views | 9,782/2mo | Zero | Zero |
| Leads from downloads | 0 | 10+/quarter | 30+/quarter |
| Vertical landing pages | 0 | 0 | 4 live |
| Mobile engagement | 39.3% | 39.3% | 50%+ |
| LinkedIn referral | 37/2mo | 37/2mo | 100+/month |
| Contact/sample forms | 39/year | 20/quarter | 20/quarter |

---

## Risks & Dependencies

| Risk | Mitigation |
|------|-----------|
| No server access for .htaccess | Use Redirection plugin (WordPress-only, no server needed) |
| Customer portal may already capture leads | Verify with IT before building duplicate system |
| Bot traffic requires server-level blocking | GA4 filtering now; server blocking when access available |
| Chrome browser access not available | All specs created as implementation guides for web team |
| Hub pages need marketing content review | Specs contain buyer-focused copy — review before publishing |

---

## Files Location

All files in: `~/Claude/Projects/Business-SICT/IT/SEO-Repair/`
Prior audit files: `~/Claude/Projects/Business-SICT/IT/SEO-Audit/seo-fixes/`
