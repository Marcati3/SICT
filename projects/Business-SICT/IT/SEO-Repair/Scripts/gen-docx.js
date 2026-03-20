const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak } = require('docx');

const b = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const bs = { top: b, bottom: b, left: b, right: b };
const m = { top: 80, bottom: 80, left: 120, right: 120 };
const hs = { fill: '1B3A5C', type: ShadingType.CLEAR };
const a = { fill: 'F2F7FC', type: ShadingType.CLEAR };

const hc = (t, w) => new TableCell({ borders: bs, width: { size: w, type: WidthType.DXA }, shading: hs, margins: m, children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: 'FFFFFF', font: 'Arial', size: 20 })] })] });
const cc = (t, w, s) => new TableCell({ borders: bs, width: { size: w, type: WidthType.DXA }, shading: s, margins: m, children: [new Paragraph({ children: [new TextRun({ text: t, font: 'Arial', size: 20 })] })] });

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 36, bold: true, color: '1B3A5C' }, paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 28, bold: true, color: '2E75B6' }, paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [{
      reference: 'bl',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
    }]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '2E75B6', space: 1 } },
          children: [new TextRun({ text: 'SIC Website SEO Repair Handoff | March 2026', size: 18, color: '999999', italics: true })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'Page ', size: 18, color: '999999' }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '999999' })]
        })]
      })
    },
    children: [
      // TITLE
      new Paragraph({ spacing: { before: 2000 }, children: [] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'SIC WEBSITE SEO REPAIR', size: 56, bold: true, color: '1B3A5C' })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: 'Implementation Handoff', size: 32, color: '2E75B6' })] }),
      new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, border: { top: { style: BorderStyle.SINGLE, size: 6, color: '2E75B6', space: 1 } }, children: [] }),
      new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Silicon Craft Technology PLC | www.sic.co.th', size: 24 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Prepared for: Marc Spiegel, CCO | March 20, 2026', size: 22 })] }),
      new Paragraph({ children: [new PageBreak()] }),

      // EXECUTIVE SUMMARY
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Executive Summary')] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: "SIC's website has three critical failures costing approximately 5,000 visitors per month in lost traffic. This handoff package contains all specifications, code, and content needed to fix every issue across 5 phases.", size: 22 })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Critical Issues')] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA }, columnWidths: [1500, 4360, 3500],
        rows: [
          new TableRow({ children: [hc('Issue', 1500), hc('Problem', 4360), hc('Impact', 3500)] }),
          new TableRow({ children: [cc('Red Flag 1', 1500, a), cc('Page Not Found is #1 page (9,782 views in 2 months)', 4360, a), cc('~5,000 lost visitors/month', 3500, a)] }),
          new TableRow({ children: [cc('Red Flag 2', 1500), cc('96.6% of traffic is unattributed bot traffic', 4360), cc('All analytics metrics unreliable', 3500)] }),
          new TableRow({ children: [cc('Red Flag 3', 1500, a), cc('Zero lead capture on 1,332 datasheet downloads', 4360, a), cc('0.04% conversion rate (industry avg 2-5%)', 3500, a)] }),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // DEPLOYED
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Completed: Deployed to Production')] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'The following changes were deployed directly to the production WordPress site via REST API on March 19-20, 2026:', size: 22 })] }),

      new Table({
        width: { size: 9360, type: WidthType.DXA }, columnWidths: [600, 4260, 2000, 2500],
        rows: [
          new TableRow({ children: [hc('#', 600), hc('Action', 4260), hc('Status', 2000), hc('Verification', 2500)] }),
          new TableRow({ children: [cc('1', 600, a), cc('Redirection plugin installed and activated', 4260, a), cc('LIVE', 2000, a), cc('Confirmed via API', 2500, a)] }),
          new TableRow({ children: [cc('2', 600), cc('82 redirect rules imported from CSV', 4260), cc('LIVE', 2000), cc('All returning HTTP 301', 2500)] }),
          new TableRow({ children: [cc('3', 600, a), cc('404 monitoring enabled (auto-logging)', 4260, a), cc('LIVE', 2000, a), cc('Plugin active', 2500, a)] }),
          new TableRow({ children: [cc('4', 600), cc('Solutions parent page created', 4260), cc('LIVE', 2000), cc('/solutions/', 2500)] }),
          new TableRow({ children: [cc('5', 600, a), cc('Automotive Security hub page', 4260, a), cc('LIVE', 2000, a), cc('/solutions/automotive-security/', 2500, a)] }),
          new TableRow({ children: [cc('6', 600), cc('Healthcare Biosensor hub page', 4260), cc('LIVE', 2000), cc('/solutions/healthcare-biosensor/', 2500)] }),
          new TableRow({ children: [cc('7', 600, a), cc('Smart Manufacturing hub page', 4260, a), cc('LIVE', 2000, a), cc('/solutions/smart-manufacturing/', 2500, a)] }),
          new TableRow({ children: [cc('8', 600), cc('Brand Protection hub page', 4260), cc('LIVE', 2000), cc('/solutions/brand-protection/', 2500)] }),
          new TableRow({ children: [cc('9', 600, a), cc('3 lead capture pages (Request Sample, Talk to Engineer, Download Brochure)', 4260, a), cc('LIVE', 2000, a), cc('Pages created, need CF7 forms', 2500, a)] }),
          new TableRow({ children: [cc('10', 600), cc('Yoast SEO titles updated on key pages', 4260), cc('LIVE', 2000), cc('Verified via API', 2500)] }),
        ]
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // REMAINING
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Remaining: Manual Tasks for Web Team')] }),
      new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'These tasks require browser access to WordPress admin or GA4. Step-by-step guides are in the Phase documents.', size: 22 })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Priority 1: Contact Form 7 Setup (PHASE-2)')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Create Download Gate form in CF7 (Name, Email, Company, Country, Product Interest)')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Create Sample Request form (pre-filled product name from URL parameter)')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Create Talk to Engineer form')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Add CF7 shortcodes to the 3 lead capture pages already created')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Add CTA buttons to every product page linking to these forms')] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Reference: PHASE-2-LEAD-CAPTURE.md (contains exact form HTML and shortcodes)', italics: true, size: 20, color: '666666' })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Priority 2: Navigation Menu Update (PHASE-3)')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Add "Solutions" dropdown to Main Menu - EN Desktop (Menu ID: 16)')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Sub-items: Automotive Security, Healthcare Biosensor, Smart Manufacturing, Brand Protection')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Add same structure to Main Menu - EN Mobile (Menu ID: 79)')] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Priority 3: Mobile CSS (PHASE-4)')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Paste responsive CSS into Appearance > Customize > Additional CSS')] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Reference: PHASE-4-SEO-MOBILE.md (contains exact CSS code to copy-paste)', italics: true, size: 20, color: '666666' })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun('Priority 4: GA4 Configuration (PHASE-5)')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Create "Real Traffic" segment (exclude direct/none + Chinese cities + <2s engagement)')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Mark form submissions as conversion events')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Create monthly/weekly custom reports')] }),
      new Paragraph({ numbering: { reference: 'bl', level: 0 }, children: [new TextRun('Build CCO dashboard: real visitors, leads, top pages, 404 count, LinkedIn referrals')] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Reference: PHASE-5-ANALYTICS.md (contains exact segment definitions and report specs)', italics: true, size: 20, color: '666666' })] }),

      new Paragraph({ children: [new PageBreak()] }),

      // SUCCESS METRICS
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Success Metrics')] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA }, columnWidths: [2800, 2280, 2140, 2140],
        rows: [
          new TableRow({ children: [hc('Metric', 2800), hc('Before', 2280), hc('Phase 1 Target', 2140), hc('All Phases Target', 2140)] }),
          new TableRow({ children: [cc('404 page views', 2800, a), cc('9,782 / 2 months', 2280, a), cc('Zero', 2140, a), cc('Zero', 2140, a)] }),
          new TableRow({ children: [cc('Leads from downloads', 2800), cc('0', 2280), cc('10+ / quarter', 2140), cc('30+ / quarter', 2140)] }),
          new TableRow({ children: [cc('Vertical landing pages', 2800, a), cc('0', 2280, a), cc('4 (deployed)', 2140, a), cc('4 live + indexed', 2140, a)] }),
          new TableRow({ children: [cc('Mobile engagement', 2800), cc('39.3%', 2280), cc('39.3%', 2140), cc('50%+', 2140)] }),
          new TableRow({ children: [cc('LinkedIn referral traffic', 2800, a), cc('37 / 2 months', 2280, a), cc('37 / 2 months', 2140, a), cc('100+ / month', 2140, a)] }),
          new TableRow({ children: [cc('Form submissions', 2800), cc('39 / year', 2280), cc('20 / quarter', 2140), cc('20 / quarter', 2140)] }),
        ]
      }),

      // FILES
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun('Reference Files')] }),
      new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'All files located in the SEO-Repair project folder:', size: 22 })] }),
      new Table({
        width: { size: 9360, type: WidthType.DXA }, columnWidths: [3500, 5860],
        rows: [
          new TableRow({ children: [hc('File', 3500), hc('Purpose', 5860)] }),
          new TableRow({ children: [cc('MASTER-HANDOFF.md', 3500, a), cc('Full executive summary and timeline', 5860, a)] }),
          new TableRow({ children: [cc('01-redirect-rules.htaccess', 3500), cc('82 redirect rules for server-level deploy', 5860)] }),
          new TableRow({ children: [cc('02-redirects-csv-import.csv', 3500, a), cc('CSV import for Redirection plugin (already imported)', 5860, a)] }),
          new TableRow({ children: [cc('PHASE-1-IMPLEMENTATION.md', 3500), cc('404 fix + bot filter + homepage canonical', 5860)] }),
          new TableRow({ children: [cc('PHASE-2-LEAD-CAPTURE.md', 3500, a), cc('CF7 form specs, gating flow, CTA placement', 5860, a)] }),
          new TableRow({ children: [cc('PHASE-3-HUB-PAGES.md', 3500), cc('4 hub page content specs (pages deployed)', 5860)] }),
          new TableRow({ children: [cc('PHASE-4-SEO-MOBILE.md', 3500, a), cc('Title/meta for top 20 pages + mobile CSS', 5860, a)] }),
          new TableRow({ children: [cc('PHASE-5-ANALYTICS.md', 3500), cc('GA4 dashboard + UTM convention', 5860)] }),
        ]
      }),

      new Paragraph({ spacing: { before: 400 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: '2E75B6', space: 1 } }, children: [] }),
      new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'End of Handoff Document', size: 20, color: '999999', italics: true })] }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('SIC-Website-SEO-Handoff.docx', buf);
  console.log('DOCX created: ' + buf.length + ' bytes');
}).catch(err => {
  console.error('Error:', err.message);
});
