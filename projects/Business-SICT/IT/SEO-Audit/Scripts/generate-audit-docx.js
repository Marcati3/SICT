const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat
} = require("docx");

// Colors
const DARK_BLUE = "1D4E89";
const LIGHT_BLUE = "3CBAF1";
const RED = "C0392B";
const ORANGE = "E67E22";
const YELLOW = "F1C40F";
const GREEN = "27AE60";
const GRAY = "7F8C8D";
const LIGHT_GRAY = "ECF0F1";
const WHITE = "FFFFFF";
const BLACK = "000000";

// Table helpers
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 }
};
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };
const TABLE_WIDTH = 9360;

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: DARK_BLUE, type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [new TextRun({ text, bold: true, color: WHITE, font: "Arial", size: 20 })] })]
  });
}

function cell(text, width, opts = {}) {
  const { bold, color, shading, align } = opts;
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: shading ? { fill: shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({
      alignment: align || AlignmentType.LEFT,
      children: [new TextRun({ text, bold: bold || false, color: color || BLACK, font: "Arial", size: 20 })]
    })]
  });
}

function scoreColor(score) {
  if (score >= 70) return GREEN;
  if (score >= 50) return ORANGE;
  return RED;
}

function severityColor(sev) {
  if (sev === "Critical") return RED;
  if (sev === "High") return ORANGE;
  if (sev === "Medium") return YELLOW;
  return GREEN;
}

function heading1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 }, children: [new TextRun({ text, bold: true, font: "Arial", size: 32, color: DARK_BLUE })] });
}

function heading2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 160 }, children: [new TextRun({ text, bold: true, font: "Arial", size: 26, color: DARK_BLUE })] });
}

function heading3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 120 }, children: [new TextRun({ text, bold: true, font: "Arial", size: 22, color: "2C3E50" })] });
}

function para(text, opts = {}) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, font: "Arial", size: 20, ...opts })] });
}

function boldPara(label, value) {
  return new Paragraph({ spacing: { after: 80 }, children: [
    new TextRun({ text: label, bold: true, font: "Arial", size: 20 }),
    new TextRun({ text: value, font: "Arial", size: 20 })
  ]});
}

function bulletItem(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 20 })]
  });
}

// Build the document
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: DARK_BLUE },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: DARK_BLUE },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Arial", color: "2C3E50" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets2", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets3", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets4", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets5", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets6", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets7", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets8", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers2", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: DARK_BLUE, space: 1 } },
          spacing: { after: 120 },
          children: [
            new TextRun({ text: "SEO Audit Report", font: "Arial", size: 18, color: DARK_BLUE, bold: true }),
            new TextRun({ text: "  |  www.sic.co.th  |  2026-03-20", font: "Arial", size: 18, color: GRAY }),
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GRAY, space: 1 } },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Silicon Craft Technology PLC  |  Confidential  |  Page ", font: "Arial", size: 16, color: GRAY }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: GRAY }),
          ]
        })]
      })
    },
    children: [
      // ===== COVER / TITLE =====
      new Paragraph({ spacing: { before: 2400 } }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
        new TextRun({ text: "SEO AUDIT REPORT", font: "Arial", size: 48, bold: true, color: DARK_BLUE })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [
        new TextRun({ text: "www.sic.co.th", font: "Arial", size: 32, color: LIGHT_BLUE })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: DARK_BLUE, space: 8 } },
        children: [new TextRun({ text: "Silicon Craft Technology PLC (SET: SICT)", font: "Arial", size: 24, color: GRAY })]
      }),

      // Meta info
      new Paragraph({ spacing: { before: 400 } }),
      new Table({
        width: { size: 5000, type: WidthType.DXA },
        columnWidths: [2000, 3000],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Date:", bold: true, font: "Arial", size: 20, color: GRAY })] })] }),
            new TableCell({ borders: noBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "March 20, 2026", font: "Arial", size: 20 })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Industry:", bold: true, font: "Arial", size: 20, color: GRAY })] })] }),
            new TableCell({ borders: noBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Semiconductor / IC Design (B2B)", font: "Arial", size: 20 })] })] }),
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: noBorders, width: { size: 2000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Audited by:", bold: true, font: "Arial", size: 20, color: GRAY })] })] }),
            new TableCell({ borders: noBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "7 parallel SEO subagents (Claude Opus 4.6)", font: "Arial", size: 20 })] })] }),
          ]}),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== HEALTH SCORE =====
      heading1("SEO Health Score: 49/100"),

      new Table({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        columnWidths: [3200, 1200, 1200, 1200, 2560],
        rows: [
          new TableRow({ children: [
            headerCell("Category", 3200),
            headerCell("Weight", 1200),
            headerCell("Score", 1200),
            headerCell("Weighted", 1200),
            headerCell("Status", 2560),
          ]}),
          ...([
            ["Technical SEO", "22%", "52/100", "11.4", 52],
            ["Content Quality", "23%", "56/100", "12.9", 56],
            ["On-Page SEO", "20%", "62/100", "12.4", 62],
            ["Schema / Structured Data", "10%", "55/100", "5.5", 55],
            ["Performance (CWV)", "10%", "38/100", "3.8", 38],
            ["AI Search Readiness (GEO)", "10%", "41/100", "4.1", 41],
            ["Images", "5%", "40/100", "2.0", 40],
          ]).map(([cat, wt, sc, wtd, num]) => new TableRow({ children: [
            cell(cat, 3200, { bold: true }),
            cell(wt, 1200, { align: AlignmentType.CENTER }),
            cell(sc, 1200, { align: AlignmentType.CENTER, color: scoreColor(num) }),
            cell(wtd, 1200, { align: AlignmentType.CENTER }),
            cell(num >= 70 ? "Good" : num >= 50 ? "Needs Improvement" : "Poor", 2560, { color: scoreColor(num), bold: true }),
          ]})),
          new TableRow({ children: [
            cell("TOTAL", 3200, { bold: true, shading: LIGHT_GRAY }),
            cell("100%", 1200, { bold: true, align: AlignmentType.CENTER, shading: LIGHT_GRAY }),
            cell("", 1200, { shading: LIGHT_GRAY }),
            cell("49/100", 1200, { bold: true, align: AlignmentType.CENTER, shading: LIGHT_GRAY, color: RED }),
            cell("Needs Significant Work", 2560, { bold: true, shading: LIGHT_GRAY, color: RED }),
          ]}),
        ]
      }),

      para(""),
      para("The site has a functional foundation (valid sitemaps, server-side rendering, JSON-LD schema, HTTPS) but suffers from significant performance, content depth, and AI readiness gaps. A publicly listed semiconductor company should target 75+."),

      // ===== PLATFORM =====
      heading2("Platform & Stack"),
      bulletItem("CMS: WordPress + Flatsome Theme", "bullets"),
      bulletItem("E-commerce: WooCommerce", "bullets"),
      bulletItem("SEO Plugin: Yoast SEO", "bullets"),
      bulletItem("Caching: WP Rocket", "bullets"),
      bulletItem("Analytics: Google Tag Manager + GA4", "bullets"),
      bulletItem("Other: reCAPTCHA, Google Site Kit, Cookie Consent", "bullets"),

      new Paragraph({ children: [new PageBreak()] }),

      // ===== 1. TECHNICAL SEO =====
      heading1("Category Breakdowns"),
      heading2("1. Technical SEO \u2014 52/100"),
      heading3("What\u2019s Working"),
      bulletItem("robots.txt properly configured via Yoast (blocks sensitive WooCommerce paths)", "bullets2"),
      bulletItem("Self-referencing canonical tag on HTTPS www version", "bullets2"),
      bulletItem("13 well-organized XML sitemaps via Yoast", "bullets2"),
      bulletItem("Fully server-rendered (no client-side JS framework dependency)", "bullets2"),
      bulletItem("Proper viewport meta tag", "bullets2"),
      bulletItem("Clean URL structure (/about-us/, /services/, /products/, /blog/)", "bullets2"),

      heading3("Critical Issues"),
      bulletItem("No security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)", "bullets3"),
      bulletItem("CLS risk from carousel/product images lacking explicit width/height attributes", "bullets3"),
      bulletItem("LCP risk \u2014 no preconnect or preload for Google Fonts or hero images", "bullets3"),
      bulletItem("15+ synchronous JavaScript files blocking rendering", "bullets3"),
      bulletItem("No lazy-loading on any images", "bullets3"),

      heading3("High Issues"),
      bulletItem("No Open Graph or Twitter Card meta tags (critical for B2B LinkedIn sharing)", "bullets4"),
      bulletItem("INP risk \u2014 jQuery + WooCommerce + reCAPTCHA + GTM all loading synchronously", "bullets4"),
      bulletItem("Mixed content risk \u2014 no CSP enforcement", "bullets4"),

      heading3("Medium Issues"),
      bulletItem("No IndexNow protocol support", "bullets5"),
      bulletItem("No GTM noscript fallback", "bullets5"),
      bulletItem("blocks-sitemap.xml exposes WordPress reusable blocks", "bullets5"),

      // ===== 2. CONTENT QUALITY =====
      new Paragraph({ children: [new PageBreak()] }),
      heading2("2. Content Quality \u2014 56/100"),
      heading3("E-E-A-T Composite: 69% (27.5/40)"),

      new Table({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        columnWidths: [2000, 1200, 6160],
        rows: [
          new TableRow({ children: [headerCell("Signal", 2000), headerCell("Score", 1200), headerCell("Key Gap", 6160)] }),
          new TableRow({ children: [cell("Experience", 2000, { bold: true }), cell("6/10", 1200, { align: AlignmentType.CENTER, color: ORANGE }), cell("No case studies, no customer testimonials, no project portfolio", 6160)] }),
          new TableRow({ children: [cell("Expertise", 2000, { bold: true }), cell("7/10", 1200, { align: AlignmentType.CENTER, color: ORANGE }), cell("Good product taxonomy, but no datasheets inline, no named experts", 6160)] }),
          new TableRow({ children: [cell("Authoritativeness", 2000, { bold: true }), cell("7/10", 1200, { align: AlignmentType.CENTER, color: ORANGE }), cell("SET-listed since 2019, but /investor-relations/ returns 404", 6160)] }),
          new TableRow({ children: [cell("Trust", 2000, { bold: true }), cell("7.5/10", 1200, { align: AlignmentType.CENTER, color: ORANGE }), cell("Contact info present, but no privacy policy link found", 6160)] }),
        ]
      }),

      heading3("Critical Issues"),
      bulletItem("/history-rewards/ returns 404 \u2014 broken authority page", "bullets6"),
      bulletItem("/investor-relations/ returns 404 \u2014 critical for a public company", "bullets6"),
      bulletItem("Zero author attribution on any blog content (scored 2/10)", "bullets6"),

      heading3("Content Depth"),
      bulletItem("Homepage: ~400-500 words (borderline thin)", "bullets7"),
      bulletItem("About: ~350-400 words (borderline thin)", "bullets7"),
      bulletItem("Products overview: ~300 words (thin)", "bullets7"),
      bulletItem("Blog: ~32 posts, 500-800 words each (adequate)", "bullets7"),

      heading3("Missing"),
      bulletItem("No Thai language version (gap for a Thai-listed company)", "bullets8"),
      bulletItem("No case studies or customer testimonials", "bullets8"),
      bulletItem("No leadership team bios accessible", "bullets8"),
      bulletItem("Weak cross-linking between blog and product pages", "bullets8"),

      // ===== 3. ON-PAGE SEO =====
      new Paragraph({ children: [new PageBreak()] }),
      heading2("3. On-Page SEO \u2014 62/100"),
      heading3("What\u2019s Working"),
      bulletItem("Title tag: \u201CSilicon Craft Technology: Innovative RFID Chip & ASIC Designs\u201D (~57 chars, ideal)", "bullets"),
      bulletItem("Single H1 present with target keywords", "bullets"),
      bulletItem("Clean URL hierarchy", "bullets"),
      bulletItem("Footer well-organized with comprehensive links", "bullets"),

      heading3("Issues"),
      bulletItem("Meta description slightly short at ~134 chars (ideal: 150-160)", "bullets2"),
      bulletItem("Multiple H1 tags detected on homepage", "bullets2"),
      bulletItem("H1 in ALL CAPS (stylistic concern)", "bullets2"),
      bulletItem("Generic \u201CLearn More\u201D CTA \u2014 low conversion potential", "bullets2"),
      bulletItem("Navigation has two tiers that may feel cluttered on mobile", "bullets2"),

      // ===== 4. SCHEMA =====
      heading2("4. Schema / Structured Data \u2014 55/100"),
      heading3("Present (JSON-LD)"),
      bulletItem("WebPage (with name, description, dates, language)", "bullets3"),
      bulletItem("Organization (name, URL, logo, sameAs social links)", "bullets3"),
      bulletItem("WebSite (with SearchAction for sitelinks search box)", "bullets3"),
      bulletItem("BreadcrumbList (single \u201CHome\u201D item \u2014 trivial on homepage)", "bullets3"),
      bulletItem("ImageObject (with dimensions and caption)", "bullets3"),

      heading3("Issues Found"),
      bulletItem("ImageObject URL typo: sic.co.co.th (doubled .co) \u2014 will fail Google validation", "bullets4"),
      bulletItem("BreadcrumbList trivial (single item)", "bullets4"),
      bulletItem("Missing contactPoint on Organization", "bullets4"),
      bulletItem("Missing address on Organization (PLC should have this)", "bullets4"),

      heading3("Missing Schema (High Impact)"),
      bulletItem("Corporation schema (with tickerSymbol, foundingDate, numberOfEmployees)", "bullets5"),
      bulletItem("Product schema (critical for an IC design company)", "bullets5"),
      bulletItem("Article/NewsArticle schema (for blog posts)", "bullets5"),

      // ===== 5. PERFORMANCE =====
      new Paragraph({ children: [new PageBreak()] }),
      heading2("5. Performance (CWV) \u2014 38/100"),

      heading3("LCP (Largest Contentful Paint)"),
      bulletItem("Hero carousel image not preloaded \u2014 adds 300-800ms to LCP", "bullets6"),
      bulletItem("Google Fonts block first paint", "bullets6"),
      bulletItem("WP Rocket inlines CSS (good) but inflates HTML size", "bullets6"),

      heading3("CLS (Cumulative Layout Shift)"),
      bulletItem("font-display: swap causes text reflow (fonts not preloaded)", "bullets7"),
      bulletItem("Cookie consent banner dynamically injects", "bullets7"),
      bulletItem("Carousel images may lack container dimensions", "bullets7"),

      heading3("INP (Interaction to Next Paint)"),
      bulletItem("20+ script tags \u2014 heavy JS footprint", "bullets8"),
      bulletItem("jQuery + Flatsome + WooCommerce + reCAPTCHA + GTM all competing for main thread", "bullets8"),
      bulletItem("No evidence of task-yielding patterns", "bullets8"),

      heading3("Third-Party Impact (8+ external domains)"),
      bulletItem("YouTube iframe embeds load ~1MB+ of JS (Critical)", "bullets"),
      bulletItem("reCAPTCHA loads heavy JS bundle", "bullets"),
      bulletItem("GTM spawns additional requests", "bullets"),

      // ===== 6. GEO =====
      heading2("6. AI Search Readiness (GEO) \u2014 41/100"),

      new Table({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        columnWidths: [5000, 4360],
        rows: [
          new TableRow({ children: [headerCell("Platform", 5000), headerCell("Score", 4360)] }),
          new TableRow({ children: [cell("Google AI Overviews", 5000), cell("35/100", 4360, { color: RED, align: AlignmentType.CENTER })] }),
          new TableRow({ children: [cell("ChatGPT Search", 5000), cell("30/100", 4360, { color: RED, align: AlignmentType.CENTER })] }),
          new TableRow({ children: [cell("Perplexity", 5000), cell("35/100", 4360, { color: RED, align: AlignmentType.CENTER })] }),
          new TableRow({ children: [cell("Bing Copilot", 5000), cell("40/100", 4360, { color: RED, align: AlignmentType.CENTER })] }),
        ]
      }),

      para(""),
      heading3("Critical Gaps"),
      bulletItem("No /llms.txt file", "bullets2"),
      bulletItem("No FAQ section or question-based headings", "bullets2"),
      bulletItem("No Wikipedia entity", "bullets2"),
      bulletItem("No explicit AI crawler policy in robots.txt", "bullets2"),
      bulletItem("Weak passage-level citability (short paragraphs, no self-contained answer blocks)", "bullets2"),
      bulletItem("No statistics with source attribution", "bullets2"),

      // ===== 7. SITEMAP =====
      new Paragraph({ children: [new PageBreak()] }),
      heading2("7. Sitemap \u2014 73/100"),
      para("Yoast-generated sitemap index with 12 child sitemaps, 555 total URLs."),

      heading3("What\u2019s Working"),
      bulletItem("Valid XML with correct namespace", "bullets3"),
      bulletItem("robots.txt declares sitemap correctly", "bullets3"),
      bulletItem("All key pages present", "bullets3"),
      bulletItem("lastmod dates in ISO 8601 format", "bullets3"),
      bulletItem("No changefreq/priority (correct \u2014 deprecated)", "bullets3"),

      heading3("Issues"),
      bulletItem("363 tag pages (65% of sitemap) \u2014 massive taxonomy bloat", "bullets4"),
      bulletItem("6 WordPress reusable blocks exposed in blocks-sitemap.xml", "bullets4"),
      bulletItem("WooCommerce utility pages included (/cart/, /checkout/, /my-account/)", "bullets4"),
      bulletItem("Batch-identical lastmod timestamps reduce Google\u2019s trust in lastmod accuracy", "bullets4"),

      // ===== 8. VISUAL =====
      heading2("8. Visual / UX \u2014 55/100"),
      heading3("Issues"),
      bulletItem("Tap targets below 48px minimum on mobile (buttons ~34-36px)", "bullets5"),
      bulletItem("Body font at 13px base \u2014 below 16px mobile minimum", "bullets5"),
      bulletItem("~35-40% of images lack alt text; existing alt text is generic/duplicated", "bullets5"),
      bulletItem("Generic \u201CLearn More\u201D CTA above fold", "bullets5"),
      bulletItem("No sticky mobile CTA or floating action button", "bullets5"),
      bulletItem("Multiple H1 tags on homepage", "bullets5"),

      heading3("Strengths"),
      bulletItem("Clean Inter font family", "bullets6"),
      bulletItem("Consistent brand color system (#1d4e89 dark blue, #3cbaf1 light blue)", "bullets6"),
      bulletItem("Mobile hamburger menu implemented", "bullets6"),
      bulletItem("Logical navigation grouping", "bullets6"),
      bulletItem("Well-structured footer", "bullets6"),

      // ===== ACTION PLAN =====
      new Paragraph({ children: [new PageBreak()] }),
      heading1("Prioritized Action Plan"),

      // Critical
      heading2("Critical \u2014 Fix This Week"),
      new Table({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        columnWidths: [400, 4160, 1600, 1600, 1600],
        rows: [
          new TableRow({ children: [headerCell("#", 400), headerCell("Issue", 4160), headerCell("Category", 1600), headerCell("Impact", 1600), headerCell("Effort", 1600)] }),
          ...([
            ["1", "Fix 404 on /history-rewards/ and /investor-relations/", "Content", "Lost authority pages", "Low"],
            ["2", "Add security headers (HSTS, CSP, X-Frame-Options, etc.)", "Technical", "Security & trust", "Low"],
            ["3", "Preload hero carousel image", "Performance", "300-800ms LCP gain", "Low"],
            ["4", "Add loading=\"lazy\" to all below-fold images", "Performance", "Bandwidth reduction", "Low"],
            ["5", "Fix ImageObject URL typo (sic.co.co.th)", "Schema", "Fails Google validation", "Low"],
            ["6", "Remove blocks-sitemap.xml from indexing", "Sitemap", "Thin content indexed", "Low"],
          ]).map(([n, issue, cat, impact, effort]) => new TableRow({ children: [
            cell(n, 400, { align: AlignmentType.CENTER, bold: true }),
            cell(issue, 4160),
            cell(cat, 1600),
            cell(impact, 1600),
            cell(effort, 1600, { color: GREEN }),
          ]})),
        ]
      }),

      // High
      heading2("High \u2014 Fix Within 2 Weeks"),
      new Table({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        columnWidths: [400, 4160, 1600, 1600, 1600],
        rows: [
          new TableRow({ children: [headerCell("#", 400), headerCell("Issue", 4160), headerCell("Category", 1600), headerCell("Impact", 1600), headerCell("Effort", 1600)] }),
          ...([
            ["7", "Add Open Graph and Twitter Card meta tags", "Technical", "LinkedIn sharing", "Low"],
            ["8", "Replace YouTube iframes with lite-youtube-embed", "Performance", "Save ~1MB+ JS", "Medium"],
            ["9", "Add author attribution to all blog posts", "Content", "Biggest E-E-A-T gap", "Medium"],
            ["10", "Create /llms.txt file", "GEO", "AI search visibility", "Low"],
            ["11", "Add explicit AI crawler directives to robots.txt", "GEO", "AI access control", "Low"],
            ["12", "Noindex 363 thin tag archive pages", "Sitemap", "65% crawl budget", "Medium"],
            ["13", "Fix tap targets \u2014 min 48x48px", "Visual", "Mobile usability", "Medium"],
            ["14", "Preload critical font files (Inter Tight 600)", "Performance", "Reduces LCP & CLS", "Low"],
          ]).map(([n, issue, cat, impact, effort]) => new TableRow({ children: [
            cell(n, 400, { align: AlignmentType.CENTER, bold: true }),
            cell(issue, 4160),
            cell(cat, 1600),
            cell(impact, 1600),
            cell(effort, 1600, { color: effort === "Low" ? GREEN : ORANGE }),
          ]})),
        ]
      }),

      // Medium
      new Paragraph({ children: [new PageBreak()] }),
      heading2("Medium \u2014 Fix Within 1 Month"),
      new Table({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        columnWidths: [400, 4160, 1600, 1600, 1600],
        rows: [
          new TableRow({ children: [headerCell("#", 400), headerCell("Issue", 4160), headerCell("Category", 1600), headerCell("Impact", 1600), headerCell("Effort", 1600)] }),
          ...([
            ["15", "Add Corporation schema with tickerSymbol, address", "Schema", "Entity recognition", "Medium"],
            ["16", "Add Product schema to all product pages", "Schema", "Product rich results", "Medium"],
            ["17", "Create FAQ section with question-based headings", "GEO/Content", "AI citation", "Medium"],
            ["18", "Add leadership team page with bios", "Content", "E-E-A-T boost", "Medium"],
            ["19", "Expand homepage content to 800+ words", "Content", "Thin content risk", "Medium"],
            ["20", "Add inline product specifications", "Content", "Content depth", "High"],
            ["21", "Defer non-critical JS", "Performance", "INP improvement", "Medium"],
            ["22", "Exclude WooCommerce utility pages from sitemap", "Sitemap", "Crawl efficiency", "Low"],
            ["23", "Increase body font to min 16px on mobile", "Visual", "Accessibility", "Low"],
            ["24", "Improve image alt text (unique, descriptive)", "Visual", "WCAG 2.1 Level A", "Medium"],
          ]).map(([n, issue, cat, impact, effort]) => new TableRow({ children: [
            cell(n, 400, { align: AlignmentType.CENTER, bold: true }),
            cell(issue, 4160),
            cell(cat, 1600),
            cell(impact, 1600),
            cell(effort, 1600, { color: effort === "Low" ? GREEN : effort === "Medium" ? ORANGE : RED }),
          ]})),
        ]
      }),

      // Low
      heading2("Low \u2014 Backlog"),
      new Table({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        columnWidths: [400, 4160, 1600, 1600, 1600],
        rows: [
          new TableRow({ children: [headerCell("#", 400), headerCell("Issue", 4160), headerCell("Category", 1600), headerCell("Impact", 1600), headerCell("Effort", 1600)] }),
          ...([
            ["25", "Add Thai language version", "Content", "Local investors", "High"],
            ["26", "Publish case studies with measurable outcomes", "Content", "E-E-A-T Experience", "High"],
            ["27", "Pursue Wikipedia article", "GEO", "AI citation signal", "High"],
            ["28", "Add IndexNow protocol", "Technical", "Faster Bing indexing", "Low"],
            ["29", "Add Article schema to blog posts", "Schema", "Article rich results", "Medium"],
            ["30", "Replace \u201CLearn More\u201D with action-oriented CTA", "Visual", "Conversion", "Low"],
            ["31", "Add sticky mobile CTA", "Visual", "Mobile conversion", "Medium"],
            ["32", "Consolidate robots.txt User-agent blocks", "Technical", "Cleanliness", "Low"],
          ]).map(([n, issue, cat, impact, effort]) => new TableRow({ children: [
            cell(n, 400, { align: AlignmentType.CENTER, bold: true }),
            cell(issue, 4160),
            cell(cat, 1600),
            cell(impact, 1600),
            cell(effort, 1600, { color: effort === "Low" ? GREEN : effort === "Medium" ? ORANGE : RED }),
          ]})),
        ]
      }),

      // ===== SCORE PROJECTION =====
      new Paragraph({ children: [new PageBreak()] }),
      heading1("Score Projection"),

      new Table({
        width: { size: TABLE_WIDTH, type: WidthType.DXA },
        columnWidths: [2800, 2000, 4560],
        rows: [
          new TableRow({ children: [headerCell("Timeframe", 2800), headerCell("Est. Score", 2000), headerCell("Key Changes", 4560)] }),
          new TableRow({ children: [cell("Current", 2800, { bold: true }), cell("49/100", 2000, { align: AlignmentType.CENTER, color: RED, bold: true }), cell("Baseline", 4560)] }),
          new TableRow({ children: [cell("After Quick Wins (1 day)", 2800, { bold: true }), cell("60-65/100", 2000, { align: AlignmentType.CENTER, color: ORANGE, bold: true }), cell("Critical fixes + low-hanging fruit", 4560)] }),
          new TableRow({ children: [cell("After High Priority (2 weeks)", 2800, { bold: true }), cell("68-72/100", 2000, { align: AlignmentType.CENTER, color: ORANGE, bold: true }), cell("Author attribution, tag cleanup, font preloading", 4560)] }),
          new TableRow({ children: [cell("After Medium Priority (1 month)", 2800, { bold: true }), cell("75-80/100", 2000, { align: AlignmentType.CENTER, color: GREEN, bold: true }), cell("Schema expansion, FAQ content, product specs", 4560)] }),
          new TableRow({ children: [cell("After Full Backlog (3 months)", 2800, { bold: true }), cell("82-88/100", 2000, { align: AlignmentType.CENTER, color: GREEN, bold: true }), cell("Case studies, Wikipedia, Thai localization", 4560)] }),
        ]
      }),

      para(""),
      para(""),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GRAY, space: 8 } },
        spacing: { before: 400 },
        children: [new TextRun({ text: "End of Report", font: "Arial", size: 20, color: GRAY, italics: true })]
      }),
    ]
  }]
});

const OUTPUT_PATH = "C:\\Users\\intln\\Claude\\Projects\\Business-SICT\\IT\\SEO-Audit\\SEO-Audit-SIC-2026-03-20.docx";

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT_PATH, buffer);
  console.log("Created: " + OUTPUT_PATH);
});
