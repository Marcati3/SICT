const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click on the "Internal Traffic" row to view/edit it
  const internalRow = await page.locator('text=/Internal Traffic/').first();
  await internalRow.click();
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'ga4-internal-filter-detail.png' });
  console.log('URL: ' + page.url());

  // Get all visible text on the detail page
  const text = await page.evaluate(() => {
    const main = document.querySelector('[class*="main"], [role="main"], main');
    if (main) return main.innerText.substring(0, 2000);
    return document.body.innerText.substring(0, 2000);
  });
  console.log('Detail:', text.substring(0, 800));

  process.exit(0);
})();
