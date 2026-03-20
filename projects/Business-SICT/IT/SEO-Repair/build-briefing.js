const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, LevelFormat } = require("docx");

const ACCENT = "1B4F72";
const ACCENT_LIGHT = "D6EAF8";
const GRAY = "F2F3F4";
const WHITE = "FFFFFF";
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0 };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: ACCENT, type: ShadingType.CLEAR },
    margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: WHITE, font: "Arial", size: 20 })] })]
  });
}

function cell(text, width, opts = {}) {
  const runs = [];
  // Handle bold markers **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  parts.forEach(p => {
    if (p.startsWith("**") && p.endsWith("**")) {
      runs.push(new TextRun({ text: p.slice(2, -2), bold: true, font: "Arial", size: 20, ...(opts.color ? { color: opts.color } : {}) }));
    } else {
      runs.push(new TextRun({ text: p, font: "Arial", size: 20, ...(opts.color ? { color: opts.color } : {}) }));
    }
  });
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: opts.shading ? { fill: opts.shading, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins,
    children: [new Paragraph({ children: runs })]
  });
}

function makeTable(headers, rows, colWidths) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({ children: headers.map((h, i) => headerCell(h, colWidths[i])) }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((c, ci) => cell(c, colWidths[ci], { shading: ri % 2 === 1 ? GRAY : undefined }))
      }))
    ]
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 32, color: ACCENT })] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 26, color: ACCENT })] });
}
function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 120 },
    children: [new TextRun({ text, font: "Arial", size: 22, ...opts })] });
}
function bullet(text, opts = {}) {
  const runs = [];
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  parts.forEach(part => {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true, font: "Arial", size: 22 }));
    } else {
      runs.push(new TextRun({ text: part, font: "Arial", size: 22 }));
    }
  });
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: runs });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: ACCENT },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: ACCENT },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
    }]
  },
  sections: [
    // COVER PAGE
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        new Paragraph({ spacing: { before: 4000 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 },
          children: [new TextRun({ text: "SIC Website SEO Repair", font: "Arial", size: 52, bold: true, color: ACCENT })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Team Briefing", font: "Arial", size: 40, color: "555555" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 1 } },
          children: [new TextRun({ text: "www.sic.co.th", font: "Arial", size: 28, color: ACCENT })] }),
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "March 19, 2026", font: "Arial", size: 24, color: "666666" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Prepared for Marc Spiegel, CCO", font: "Arial", size: 24, color: "666666" })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 },
          children: [new TextRun({ text: "Silicon Craft Technology PLC", font: "Arial", size: 22, color: "999999" })] }),
      ]
    },
    // CONTENT
    {
      properties: {
        page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "SIC SEO Repair Briefing", font: "Arial", size: 16, color: "999999", italics: true })] })] })
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Page ", font: "Arial", size: 16, color: "999999" }),
                     new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "999999" })] })] })
      },
      children: [
        // EXECUTIVE SUMMARY
        h1("Executive Summary"),
        p("SIC\u2019s website has three critical failures costing approximately 5,000 visitors per month in lost traffic:"),
        bullet("**Red Flag 1:** \u201CPage Not Found\u201D is the #1 page on the entire website \u2014 9,782 views in Jan\u2013Feb 2026 (vs 2,866 for the homepage). 82 broken URLs confirmed and now fixed."),
        bullet("**Red Flag 2:** 96.6% of traffic is unattributed bot traffic \u2014 43,321 of 44,853 users came via (direct)/(none), primarily from Chinese data centers. Real organic traffic is approximately 575 users/month."),
        bullet("**Red Flag 3:** Zero lead capture on 1,332 datasheet downloads \u2014 only 39 lead form submissions in all of 2025 (0.04% conversion rate vs. industry average of 2\u20135%)."),

        new Paragraph({ spacing: { before: 200, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT_LIGHT, space: 1 } } }),

        // WHAT'S ALREADY DEPLOYED
        h1("Already Deployed (March 19, 2026)"),
        p("The following changes are live on sic.co.th right now:"),

        makeTable(
          ["Change", "Status", "Details"],
          [
            ["82 Redirect Rules", "**LIVE**", "All broken URLs now 301 redirect to correct pages"],
            ["Redirection Plugin", "**LIVE**", "v5.7.5 installed, 404 logging active"],
            ["5 Hub Landing Pages", "**LIVE**", "/solutions/ + 4 industry vertical pages"],
            ["Yoast SEO Titles", "**LIVE**", "Updated on key product category pages"],
            ["404 Monitoring", "**LIVE**", "New 404s automatically logged with 30-day retention"],
          ],
          [3000, 1200, 5160]
        ),

        p(""),
        h2("New Hub Pages Live"),
        bullet("sic.co.th/solutions/ \u2014 Solutions index page"),
        bullet("sic.co.th/solutions/automotive-security/ \u2014 Immobilizer transponder hub"),
        bullet("sic.co.th/solutions/healthcare-biosensor/ \u2014 NFC sensor interface hub"),
        bullet("sic.co.th/solutions/smart-manufacturing/ \u2014 Industrial IoT and RFID hub"),
        bullet("sic.co.th/solutions/brand-protection-authentication/ \u2014 NFC anti-counterfeit hub"),

        new Paragraph({ children: [new PageBreak()] }),

        // REMAINING TASKS
        h1("Remaining Tasks for Team"),

        h2("Week 1: Quick Wins (Web Dev)"),
        makeTable(
          ["Task", "Owner", "Time", "Guide"],
          [
            ["Paste mobile CSS into WPCode footer or GTM", "Web Dev", "5 min", "PHASE-4 doc"],
            ["Paste GA4 form tracking JS into WPCode or GTM", "Web Dev", "5 min", "PHASE-5 doc"],
            ["Add \u201CSolutions\u201D dropdown to main navigation menu", "Web Dev", "10 min", "Appearance > Menus"],
            ["Fix homepage H1 tags (5 \u2192 1) in Flatsome editor", "Web Dev", "15 min", "PHASE-4 doc"],
            ["Add security headers to .htaccess", "IT", "30 min", "Prior audit package"],
          ],
          [3600, 1200, 1000, 3560]
        ),

        p(""),
        h2("Week 2: Lead Capture (Web Dev + Marketing)"),
        makeTable(
          ["Task", "Owner", "Time", "Guide"],
          [
            ["Verify customer portal (webapp.sic.co.th) lead flow", "IT", "30 min", "PHASE-2 doc"],
            ["Create Download Gate CF7 form", "Web Dev", "1 hour", "PHASE-2 doc"],
            ["Create Sample Request + Talk to Engineer forms", "Web Dev", "1 hour", "PHASE-2 doc"],
            ["Create /request-sample/ and /talk-to-engineer/ pages", "Web Dev", "1 hour", "PHASE-2 doc"],
            ["Replace brochure PDF links with gated flow", "Web Dev", "1 hour", "PHASE-2 doc"],
            ["Add \u201CRequest Sample\u201D + \u201CTalk to Engineer\u201D CTAs to product pages", "Web Dev", "2 hours", "PHASE-2 doc"],
            ["Test all forms on desktop + mobile", "QA", "1 hour", "\u2014"],
          ],
          [3600, 1200, 1000, 3560]
        ),

        p(""),
        h2("Weeks 3\u20134: SEO + Content (Marketing)"),
        makeTable(
          ["Task", "Owner", "Time", "Guide"],
          [
            ["Review and refine hub page content", "Marketing", "2 hours", "PHASE-3 doc"],
            ["Write meta descriptions for top 20 pages", "Marketing", "1 hour", "PHASE-4 doc"],
            ["Add image alt text (39 images)", "Marketing", "2 hours", "Prior audit: 06-image-alt-text"],
            ["Add internal cross-links between categories", "Web Dev", "1 hour", "PHASE-3 doc"],
            ["Add Product schema (Yoast WooCommerce or manual)", "Web Dev", "3 hours", "Prior audit: 03-product-schema"],
            ["Upload llms.txt + update robots.txt", "IT", "15 min", "Prior audit package"],
          ],
          [3600, 1200, 1000, 3560]
        ),

        p(""),
        h2("Weeks 5\u20136: Analytics Dashboard (Marketing)"),
        makeTable(
          ["Task", "Owner", "Time", "Guide"],
          [
            ["Create GA4 \u201CReal Traffic\u201D segment (exclude bots)", "Marketing", "30 min", "PHASE-5 doc"],
            ["Set up 5 GA4 conversion events", "Marketing", "1 hour", "PHASE-5 doc"],
            ["Create weekly 404 monitoring report", "Marketing", "30 min", "PHASE-5 doc"],
            ["Build CCO dashboard in GA4/Looker Studio", "Marketing", "2 hours", "PHASE-5 doc"],
            ["Create UTM reference sheet for team", "Marketing", "30 min", "PHASE-5 doc"],
            ["Schedule first weekly report to Marc", "Marketing", "15 min", "\u2014"],
          ],
          [3600, 1200, 1000, 3560]
        ),

        new Paragraph({ children: [new PageBreak()] }),

        // SUCCESS METRICS
        h1("Success Metrics"),

        makeTable(
          ["Metric", "Before", "After Phase 1", "After All Phases"],
          [
            ["404 page views", "9,782 / 2 months", "**Zero**", "Zero"],
            ["Leads from downloads", "0", "10+ / quarter", "**30+ / quarter**"],
            ["Vertical landing pages", "0", "**4 live**", "4 live"],
            ["Mobile engagement", "39.3%", "39.3%", "**50%+**"],
            ["LinkedIn referral traffic", "37 / 2 months", "37 / 2 months", "**100+ / month**"],
            ["Form submissions", "39 / year", "20 / quarter", "**20 / quarter**"],
          ],
          [2400, 2000, 2480, 2480]
        ),

        new Paragraph({ spacing: { before: 200, after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT_LIGHT, space: 1 } } }),

        // KEY FINDINGS
        h1("Key Findings"),

        h2("404 Audit Results"),
        bullet("**82 broken URLs fixed** via Redirection plugin (deployed and verified)"),
        bullet("**14 immobilizer product URLs** were dead (SIC61xx short URL patterns)"),
        bullet("**41 common page paths** returning 404 (/about/, /downloads/, /support/, etc.)"),
        bullet("**12 product category paths** returning 404 (/product-category/rfid/, etc.)"),
        bullet("**Root cause:** Site restructure changed URL patterns but no redirects were set up"),

        p(""),
        h2("Domain Clarification"),
        bullet("**Active domain:** www.sic.co.th (Thai country code TLD)"),
        bullet("**siliconcraftth.com:** Does NOT resolve \u2014 not an active domain"),
        bullet("**Sitemap:** Yoast-generated, 500+ indexed URLs, all healthy"),

        p(""),
        h2("Lead Capture Gaps"),
        bullet("Datasheets route through webapp.sic.co.th customer portal \u2014 verify if it captures leads"),
        bullet("Brochures are direct ungated PDF links (gap)"),
        bullet("No \u201CRequest Sample\u201D CTA on any product page"),
        bullet("Contact form exists (CF7) but lacks Product Interest field"),
        bullet("Broken brochure link: SICAllBrochure.pdf returns 404"),

        p(""),
        h2("Site Technology"),
        bullet("WordPress + Flatsome theme v3.19.7 + WooCommerce"),
        bullet("Yoast SEO + WP Rocket (caching) + Contact Form 7"),
        bullet("GTM container: GTM-PQBDWFRW (active)"),
        bullet("Apache/2 server"),

        new Paragraph({ children: [new PageBreak()] }),

        // RISKS
        h1("Risks and Dependencies"),

        makeTable(
          ["Risk", "Mitigation"],
          [
            ["No server/.htaccess access", "Using Redirection plugin (WordPress-only, no server needed)"],
            ["Customer portal may already capture leads", "Verify with IT before building duplicate system"],
            ["Bot traffic requires server-level blocking", "GA4 filtering now; server blocking when hosting access available"],
            ["Hub pages need content review", "Specs contain buyer-focused copy \u2014 marketing to review before promoting"],
            ["GA4 segments need manual setup", "Step-by-step guide provided in PHASE-5 document"],
          ],
          [3500, 5860]
        ),

        p(""),
        h1("File Reference"),
        p("All implementation files are located in the SEO-Repair project folder. Each phase document contains detailed step-by-step instructions, code snippets, and validation checklists."),

        makeTable(
          ["#", "File", "Contents"],
          [
            ["01", "01-redirect-rules.htaccess", "82 redirect rules (.htaccess format)"],
            ["02", "02-redirects-csv-import.csv", "Same redirects for Redirection plugin CSV import"],
            ["03", "PHASE-1-IMPLEMENTATION.md", "404 fixes + bot filtering + homepage canonical"],
            ["04", "PHASE-2-LEAD-CAPTURE.md", "Form specs, gating flow, CTA placement"],
            ["05", "PHASE-3-HUB-PAGES.md", "4 hub page content specs with SEO data"],
            ["06", "PHASE-4-SEO-MOBILE.md", "Title/meta optimization + mobile CSS code"],
            ["07", "PHASE-5-ANALYTICS.md", "GA4 dashboard setup + UTM naming convention"],
          ],
          [500, 3200, 5660]
        ),

        p(""),
        p(""),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 },
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: ACCENT_LIGHT, space: 1 } },
          children: [new TextRun({ text: "End of Briefing", font: "Arial", size: 20, color: "999999", italics: true })] }),
      ]
    }
  ]
});

const OUTPUT = "C:/Users/intln/Claude/Projects/Business-SICT/IT/SEO-Repair/SIC-SEO-Repair-Briefing.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log("DOCX created: " + OUTPUT);
  console.log("Size: " + (buffer.length / 1024).toFixed(1) + " KB");
});
