const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Find the star next to "contact" event and click it to mark as key event
  // The stars are in the same row as the event name
  // Find all rows, locate the one with "contact", click its star
  const rows = await page.locator('tr, [role="row"]').all();
  console.log('Found ' + rows.length + ' rows');

  // Try clicking the star icon in the contact row
  // Stars appear to be clickable icons before the event name
  const contactStar = await page.evaluate(() => {
    const allCells = document.querySelectorAll('td, [class*="cell"]');
    for (const cell of allCells) {
      if (cell.textContent.trim() === 'contact') {
        // Found the contact cell, find the star in the same row
        const row = cell.closest('tr') || cell.parentElement;
        const star = row.querySelector('[class*="star"], button, [role="button"], mat-icon, .material-icons');
        if (star) {
          star.click();
          return 'clicked star';
        }
        return 'star not found in row, row HTML: ' + row.innerHTML.substring(0, 200);
      }
    }
    return 'contact not found';
  });
  console.log('Result:', contactStar);

  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'ga4-contact-starred.png' });

  process.exit(0);
})();
