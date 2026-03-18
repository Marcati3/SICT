const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageNumber, PageBreak, LevelFormat
} = require("docx");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

function headerCell(text, width) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: "1B3A5C", type: ShadingType.CLEAR },
    margins: cellMargins,
    verticalAlign: "center",
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", font: "Arial", size: 20 })] })],
  });
}

function cell(text, width, opts = {}) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [new Paragraph({
      alignment: opts.align || AlignmentType.LEFT,
      children: [new TextRun({ text, bold: !!opts.bold, font: "Arial", size: 20, color: opts.color || "333333" })],
    })],
  });
}

function scoreRow(category, weight, score, weighted, fill) {
  return new TableRow({
    children: [
      cell(category, 3500, { fill }),
      cell(weight, 1500, { align: AlignmentType.CENTER, fill }),
      cell(String(score), 1500, { align: AlignmentType.CENTER, fill, bold: true }),
      cell(String(weighted), 2860, { align: AlignmentType.CENTER, fill }),
    ],
  });
}

function actionRow(num, issue, assignedTo, impact, effort, fill) {
  return new TableRow({
    children: [
      cell(String(num), 400, { align: AlignmentType.CENTER, fill }),
      cell(issue, 2800, { fill }),
      cell(assignedTo, 2200, { fill }),
      cell(impact, 2200, { fill }),
      cell(effort, 1760, { fill }),
    ],
  });
}

function heading(text, level) {
  return new Paragraph({ heading: level, spacing: { before: 300, after: 150 }, children: [new TextRun({ text, font: "Arial" })] });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 22, bold: !!opts.bold, color: opts.color || "333333" })],
  });
}

function bullet(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22 })],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1B3A5C" },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "444444" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1200, bottom: 1440, left: 1200 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: "SEO Audit Report | www.sic.co.th | March 2026", font: "Arial", size: 16, color: "999999" })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", font: "Arial", size: 16, color: "999999" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" }),
              new TextRun({ text: " | Confidential", font: "Arial", size: 16, color: "999999" }),
            ],
          })],
        }),
      },
      children: [
        // === COVER / TITLE ===
        new Paragraph({ spacing: { before: 2400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "SEO AUDIT REPORT", font: "Arial", size: 52, bold: true, color: "1B3A5C" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "www.sic.co.th", font: "Arial", size: 32, color: "2E75B6" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: "Silicon Craft Technology PLC", font: "Arial", size: 24, color: "666666" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
          children: [new TextRun({ text: "March 16, 2026", font: "Arial", size: 22, color: "999999" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 12 } },
          spacing: { before: 200, after: 100 },
          children: [new TextRun({ text: "Business Type: Semiconductor / RFID Chip Design", font: "Arial", size: 20, color: "666666" })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Platform: WordPress (Flatsome v3.19.7) + WooCommerce", font: "Arial", size: 20, color: "666666" })],
        }),

        // === PAGE BREAK - HEALTH SCORE ===
        new Paragraph({ children: [new PageBreak()] }),

        heading("SEO Health Score: 46/100", HeadingLevel.HEADING_1),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3500, 1500, 1500, 2860],
          rows: [
            new TableRow({ children: [headerCell("Category", 3500), headerCell("Weight", 1500), headerCell("Score", 1500), headerCell("Weighted", 2860)] }),
            scoreRow("Technical SEO", "22%", 58, "12.8", "F2F7FB"),
            scoreRow("Content Quality (E-E-A-T)", "23%", 52, "12.0"),
            scoreRow("On-Page SEO", "20%", 45, "9.0", "F2F7FB"),
            scoreRow("Schema / Structured Data", "10%", 25, "2.5"),
            scoreRow("Performance (CWV)", "10%", 55, "5.5", "F2F7FB"),
            scoreRow("AI Search Readiness", "10%", 20, "2.0"),
            scoreRow("Images", "5%", 28, "1.4", "F2F7FB"),
            new TableRow({ children: [
              cell("TOTAL", 3500, { bold: true }),
              cell("", 1500),
              cell("", 1500),
              cell("45.2 \u2192 46", 2860, { bold: true, align: AlignmentType.CENTER }),
            ] }),
          ],
        }),

        // === EXECUTIVE SUMMARY ===
        new Paragraph({ spacing: { before: 400 } }),
        heading("Executive Summary", HeadingLevel.HEADING_1),
        para("Silicon Craft Technology (SIC) has a solid foundation \u2014 HTTPS, proper redirects, Yoast SEO, active blog with recent content, and real awards (Forbes Asia Best Under a Billion 2024). However, there are significant gaps in structured data, image optimization, security headers, and AI search readiness that are holding the site back."),

        heading("Top 5 Critical Issues", HeadingLevel.HEADING_2),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [
          new TextRun({ text: "87% of images missing alt text", bold: true, font: "Arial", size: 22 }),
          new TextRun({ text: " (39 of 45 images) \u2014 accessibility and SEO disaster", font: "Arial", size: 22 }),
        ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [
          new TextRun({ text: "Zero security headers", bold: true, font: "Arial", size: 22 }),
          new TextRun({ text: " \u2014 no HSTS, CSP, X-Frame-Options, or Referrer-Policy", font: "Arial", size: 22 }),
        ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [
          new TextRun({ text: "5 H1 tags on homepage", bold: true, font: "Arial", size: 22 }),
          new TextRun({ text: " \u2014 should be exactly 1", font: "Arial", size: 22 }),
        ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [
          new TextRun({ text: "No Product schema", bold: true, font: "Arial", size: 22 }),
          new TextRun({ text: " despite WooCommerce store \u2014 missing rich results", font: "Arial", size: 22 }),
        ]}),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [
          new TextRun({ text: "No AI search optimization", bold: true, font: "Arial", size: 22 }),
          new TextRun({ text: " \u2014 no llms.txt, no GEO signals", font: "Arial", size: 22 }),
        ]}),

        heading("Top 5 Quick Wins", HeadingLevel.HEADING_2),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: "Add alt text to all 39 images (~2 hours, biggest ROI)", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: "Add Organization schema with full address, founding date, stock ticker", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: "Fix H1 to single tag, convert extras to H2", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: "Add security headers via .htaccess (Apache server)", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: "Add hreflang tags if bilingual audience intended", font: "Arial", size: 22 })] }),

        // === TECHNICAL SEO ===
        new Paragraph({ children: [new PageBreak()] }),
        heading("1. Technical SEO (Score: 58/100)", HeadingLevel.HEADING_1),

        heading("Crawlability & Indexability \u2014 GOOD", HeadingLevel.HEADING_3),
        bullet("robots.txt: Properly configured via Yoast. Blocks WooCommerce logs and cart URLs.", "bullets"),
        bullet("Sitemap: Present at /sitemap_index.xml with 13 child sitemaps", "bullets"),
        bullet("Meta robots: index, follow, max-image-preview:large \u2014 correct", "bullets"),
        bullet("Canonical tag: Present and correct (https://www.sic.co.th/)", "bullets"),

        heading("Redirects \u2014 GOOD", HeadingLevel.HEADING_3),
        bullet("http://www.sic.co.th \u2192 301 \u2192 https://www.sic.co.th/ (correct)", "bullets"),
        bullet("https://sic.co.th \u2192 301 \u2192 https://www.sic.co.th/ (correct)", "bullets"),
        bullet("No redirect chains detected", "bullets"),

        heading("Security \u2014 CRITICAL", HeadingLevel.HEADING_3),
        para("HTTPS is enabled, but ALL security headers are missing:", { bold: true }),
        bullet("No Strict-Transport-Security (HSTS)", "bullets"),
        bullet("No X-Frame-Options", "bullets"),
        bullet("No X-Content-Type-Options", "bullets"),
        bullet("No Content-Security-Policy", "bullets"),
        bullet("No Referrer-Policy", "bullets"),
        bullet("No Permissions-Policy", "bullets"),
        para("Fix: See seo-fixes/htaccess-security-headers.txt in the handoff package.", { bold: true }),

        // === E-E-A-T ===
        new Paragraph({ children: [new PageBreak()] }),
        heading("2. Content Quality / E-E-A-T (Score: 52/100)", HeadingLevel.HEADING_1),

        heading("Experience (45/100)", HeadingLevel.HEADING_3),
        bullet("Claims 20+ years of experience \u2014 good", "bullets"),
        bullet("Product images appear original (not stock) \u2014 good", "bullets"),
        bullet("Missing: Case studies, customer testimonials, first-hand demonstrations", "bullets"),

        heading("Expertise (55/100)", HeadingLevel.HEADING_3),
        bullet("Technical product descriptions (LF/HF protocols, reader ICs) \u2014 good", "bullets"),
        bullet("Blog with technical articles \u2014 good", "bullets"),
        bullet("Missing: Author bylines, team credentials (PhDs), white paper summaries", "bullets"),

        heading("Authoritativeness (65/100)", HeadingLevel.HEADING_3),
        bullet("Forbes Asia Best Under a Billion 2024 \u2014 strong", "bullets"),
        bullet("Thailand Cybersecurity Award 2025 \u2014 strong", "bullets"),
        bullet("Public company (PLC) on SET \u2014 strong", "bullets"),
        bullet("Missing: SET ticker in schema, industry association memberships, partner logos", "bullets"),

        heading("Trustworthiness (50/100)", HeadingLevel.HEADING_3),
        bullet("Phone: +66 2 589 9991, Email: info@sic.co.th, Privacy policy present", "bullets"),
        bullet("Missing: Full physical address, Google Maps embed, ISO certification badges", "bullets"),

        // === ON-PAGE SEO ===
        new Paragraph({ children: [new PageBreak()] }),
        heading("3. On-Page SEO (Score: 45/100)", HeadingLevel.HEADING_1),

        heading("Title Tag \u2014 GOOD", HeadingLevel.HEADING_3),
        para("\"Silicon Craft Technology: Innovative RFID Chip & ASIC Designs\" \u2014 57 characters (ideal: 50-60)"),

        heading("Meta Description \u2014 GOOD", HeadingLevel.HEADING_3),
        para("135 characters, includes keywords and value proposition."),

        heading("Heading Structure \u2014 CRITICAL", HeadingLevel.HEADING_3),
        para("5 H1 tags detected (should be exactly 1):", { bold: true }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: "\"SILICON CRAFT TECHNOLOGY PLC\"", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: "\"RFID CHIP TECHNOLOGY\"", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: "\"ADVANCING YOUR WORLD\"", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: "\"UPCOMING NEWS & EVENTS\"", font: "Arial", size: 22 })] }),
        new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 60 }, children: [new TextRun({ text: "\"HIGHLIGHT ARTICLES\"", font: "Arial", size: 22 })] }),
        para("Fix: Keep only #1 or create a single descriptive H1. Convert the rest to H2.", { bold: true }),

        // === SCHEMA ===
        new Paragraph({ children: [new PageBreak()] }),
        heading("4. Schema / Structured Data (Score: 25/100)", HeadingLevel.HEADING_1),

        heading("Currently Implemented (via Yoast)", HeadingLevel.HEADING_3),
        bullet("WebPage \u2014 Present", "bullets"),
        bullet("Organization \u2014 Present (name, URL, logo, sameAs) but incomplete", "bullets"),
        bullet("BreadcrumbList \u2014 Present", "bullets"),
        bullet("WebSite \u2014 Present (empty description field)", "bullets"),

        heading("Missing (High Priority)", HeadingLevel.HEADING_3),
        bullet("Product schema \u2014 WooCommerce store active but NO product schema", "bullets"),
        bullet("Corporation schema \u2014 Missing ticker, address, founding date", "bullets"),
        bullet("Article/BlogPosting \u2014 Blog exists but no article schema", "bullets"),
        bullet("LocalBusiness \u2014 Has physical office, should supplement Organization", "bullets"),
        para("Fix: See seo-fixes/corporation-schema.json and seo-fixes/product-schema-template.json in the handoff package.", { bold: true }),

        // === PERFORMANCE ===
        heading("5. Performance (Score: 55/100)", HeadingLevel.HEADING_1),
        bullet("Cache-Control: max-age=0 \u2014 pages not cached, every visit hits server", "bullets"),
        bullet("WP Rocket installed but cache headers misconfigured", "bullets"),
        bullet("HTTP/2 available (Apache mod_http2)", "bullets"),
        para("Fix: Set max-age=86400 for static assets, max-age=3600 for HTML pages.", { bold: true }),

        // === AI SEARCH ===
        heading("6. AI Search Readiness (Score: 20/100)", HeadingLevel.HEADING_1),
        bullet("No llms.txt file \u2014 AI crawlers have no guidance", "bullets"),
        bullet("No AI crawler directives in robots.txt", "bullets"),
        bullet("No structured passages optimized for citation", "bullets"),
        bullet("Brand mentions limited \u2014 brand correlates 3x more than backlinks for AI visibility", "bullets"),
        para("Fix: See seo-fixes/llms.txt and seo-fixes/robots-txt-additions.txt in the handoff package.", { bold: true }),

        // === IMAGES ===
        heading("7. Images (Score: 28/100)", HeadingLevel.HEADING_1),
        para("39 of 45 images (87%) have no alt text. This is the single largest SEO and accessibility failure.", { bold: true }),
        bullet("Carousel images (carouselHome-1 through 8): all missing alt text", "bullets"),
        bullet("Product images (Product1-5): all missing alt text", "bullets"),
        bullet("Application banners: all missing alt text", "bullets"),
        bullet("Good: WebP format used, lazy loading present, width/height set (prevents CLS)", "bullets"),
        para("Fix: See seo-fixes/image-alt-text-list.md for recommended alt text for every image.", { bold: true }),

        // === ACTION PLAN ===
        new Paragraph({ children: [new PageBreak()] }),
        heading("Prioritized Action Plan", HeadingLevel.HEADING_1),

        heading("CRITICAL \u2014 Fix Immediately", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [400, 2800, 2200, 2200, 1760],
          rows: [
            new TableRow({ children: [headerCell("#", 400), headerCell("Issue", 2800), headerCell("Assigned To", 2200), headerCell("Impact", 2200), headerCell("Effort", 1760)] }),
            actionRow(1, "Add alt text to all 39 images", "Marketing Team", "High \u2014 accessibility + SEO", "2 hours"),
            actionRow(2, "Fix to single H1 tag", "Marketing Team", "High \u2014 heading hierarchy", "15 min", "F2F7FB"),
            actionRow(3, "Add security headers", "Web Hosting / IT Dept", "High \u2014 trust + security", "30 min"),
          ],
        }),

        new Paragraph({ spacing: { before: 200 } }),
        heading("HIGH \u2014 Fix Within 1 Week", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [400, 2800, 2200, 2200, 1760],
          rows: [
            new TableRow({ children: [headerCell("#", 400), headerCell("Issue", 2800), headerCell("Assigned To", 2200), headerCell("Impact", 2200), headerCell("Effort", 1760)] }),
            actionRow(4, "Add Product schema to WooCommerce", "IT Dept (Web Developer)", "High \u2014 rich results", "2-4 hours"),
            actionRow(5, "Complete Organization schema", "IT Dept (Web Developer)", "Medium \u2014 entity recognition", "1 hour", "F2F7FB"),
            actionRow(6, "Fix Cache-Control headers", "Web Hosting / IT Dept", "Medium \u2014 page speed", "30 min"),
            actionRow(7, "Add Article/BlogPosting schema", "IT Dept (Web Developer)", "Medium \u2014 rich results", "2 hours", "F2F7FB"),
          ],
        }),

        new Paragraph({ spacing: { before: 200 } }),
        heading("MEDIUM \u2014 Fix Within 1 Month", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [400, 2800, 2200, 2200, 1760],
          rows: [
            new TableRow({ children: [headerCell("#", 400), headerCell("Issue", 2800), headerCell("Assigned To", 2200), headerCell("Impact", 2200), headerCell("Effort", 1760)] }),
            actionRow(8, "Add responsive images (srcset)", "IT Dept (Web Developer)", "Medium \u2014 mobile perf", "4-8 hours"),
            actionRow(9, "Convert JPG/PNG to WebP", "Marketing Team", "Medium \u2014 page speed", "2 hours", "F2F7FB"),
            actionRow(10, "Create llms.txt", "Web Hosting / IT Dept", "Medium \u2014 AI visibility", "1 hour"),
            actionRow(11, "Add author bylines to blog", "Marketing + Engineering", "Medium \u2014 E-E-A-T", "2 hours", "F2F7FB"),
            actionRow(12, "Add physical address + map", "Marketing Team", "Medium \u2014 local SEO", "1 hour"),
            actionRow(13, "Custom OG image", "Marketing Team (Design)", "Low-Med \u2014 social", "1 hour", "F2F7FB"),
          ],
        }),

        // === ASSIGNMENT SUMMARY ===
        new Paragraph({ spacing: { before: 300 } }),
        heading("Assignment Summary by Function", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3200, 3200, 2960],
          rows: [
            new TableRow({ children: [headerCell("Team", 3200), headerCell("Tasks", 3200), headerCell("Total Effort", 2960)] }),
            new TableRow({ children: [cell("Marketing Team", 3200, { bold: true }), cell("#1, #2, #9, #11, #12, #13, #17", 3200), cell("~9 hours", 2960)] }),
            new TableRow({ children: [cell("IT Dept (Web Developer)", 3200, { bold: true, fill: "F2F7FB" }), cell("#4, #5, #7, #8, #14, #15, #16", 3200, { fill: "F2F7FB" }), cell("~13 hours", 2960, { fill: "F2F7FB" })] }),
            new TableRow({ children: [cell("Web Hosting / IT Dept", 3200, { bold: true }), cell("#3, #6, #10", 3200), cell("~2 hours", 2960)] }),
            new TableRow({ children: [cell("Engineering", 3200, { bold: true, fill: "F2F7FB" }), cell("#11 (provide author bios)", 3200, { fill: "F2F7FB" }), cell("~30 min", 2960, { fill: "F2F7FB" })] }),
            new TableRow({ children: [cell("HR", 3200, { bold: true }), cell("#17 (provide team profiles)", 3200), cell("~1 hour", 2960)] }),
          ],
        }),

        // === WHAT'S WORKING ===
        new Paragraph({ spacing: { before: 400 } }),
        heading("What\u2019s Working Well", HeadingLevel.HEADING_1),
        bullet("Clean URL structure with descriptive slugs", "bullets"),
        bullet("Proper 301 redirects (HTTP\u2192HTTPS, non-www\u2192www)", "bullets"),
        bullet("Active blog with recent content (March 2026)", "bullets"),
        bullet("Yoast SEO properly configured", "bullets"),
        bullet("Forbes Asia award \u2014 strong authority signal", "bullets"),
        bullet("WP Rocket caching plugin installed", "bullets"),
        bullet("Good use of WebP image format", "bullets"),
        bullet("Lazy loading implemented", "bullets"),
        bullet("CLS prevention via explicit image dimensions", "bullets"),

        new Paragraph({ spacing: { before: 600 } }),
        new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 8 } },
          spacing: { before: 200 },
          children: [new TextRun({ text: "Generated by Claude Code SEO Audit \u2014 based on AgriciDaniel/claude-seo methodology", font: "Arial", size: 18, color: "999999", italics: true })],
        }),
      ],
    },
  ],
});

const outputPath = "C:/Users/intln/Claude/Projects/Business-SICT/SEO-AUDIT-REPORT.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Created: " + outputPath);
});
