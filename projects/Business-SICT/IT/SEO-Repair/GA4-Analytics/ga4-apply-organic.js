const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click "Add comparison" button
  await page.evaluate(() => {
    const els = document.querySelectorAll('button, [role="button"]');
    for (const el of els) {
      if (el.textContent.includes('Add comparison')) { el.click(); return; }
    }
  });
  await page.waitForTimeout(3000);

  // Check the "Organic traffic" checkbox
  await page.evaluate(() => {
    const els = document.querySelectorAll('*');
    for (const el of els) {
      if (el.textContent.trim() === 'Organic traffic' && el.children.length === 0) {
        // Find the checkbox in the same row
        const row = el.closest('tr') || el.parentElement;
        const checkbox = row.querySelector('input[type="checkbox"], mat-checkbox, [role="checkbox"]');
        if (checkbox) { checkbox.click(); return; }
        // Try clicking the row itself
        row.click();
        return;
      }
    }
  });
  await page.waitForTimeout(1000);

  // Click Apply
  await page.evaluate(() => {
    const els = document.querySelectorAll('button, [role="button"]');
    for (const el of els) {
      if (el.textContent.trim() === 'Apply') { el.click(); return; }
    }
  });
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'ga4-organic-applied.png' });
  console.log('Done');

  process.exit(0);
})();
