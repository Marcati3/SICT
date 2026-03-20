const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));
  if (!page) { console.log('GA4 tab not found'); process.exit(1); }

  // Try to find "Page title" in the dropdown by scrolling
  // The dropdown is a material design select - find visible options
  const options = await page.$$('mat-option, [role="option"], li, .mdc-list-item');
  console.log('Found options: ' + options.length);

  // Try scrolling inside the select dropdown
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(1000);

  // Look for any text containing "Page" in the filter panel
  const allText = await page.evaluate(() => {
    const panel = document.querySelector('[class*="filter"], [class*="sidebar"], [class*="panel"]');
    if (panel) return panel.textContent.substring(0, 2000);
    return 'no panel found';
  });
  console.log('Panel text: ' + allText.substring(0, 500));

  await page.screenshot({ path: 'ga4-dim-page.png' });
  console.log('Screenshot saved');
  process.exit(0);
})();
