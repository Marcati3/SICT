const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Navigate to Data Filters
  const df = await page.locator('text=/^Data filters$/').first();
  const count = await page.locator('text=/^Data filters$/').count();
  console.log('Data filters found: ' + count);

  if (count > 0) {
    await df.click();
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'ga4-data-filters.png' });
    console.log('URL: ' + page.url());

    // Get page content
    const text = await page.evaluate(() => {
      return document.body.innerText.substring(0, 2000);
    });
    console.log('Page text:', text.substring(0, 500));
  }

  process.exit(0);
})();
