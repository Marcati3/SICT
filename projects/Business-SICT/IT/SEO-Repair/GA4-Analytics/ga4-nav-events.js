const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));
  if (!page) { console.log('No GA4 tab'); process.exit(1); }

  // Click "Data collection and modifications" to expand it
  const dataCollection = await page.locator('text="Data collection and modifica"').first();
  const count = await page.locator('text="Data collection and modifica"').count();
  console.log('Found Data collection: ' + count);

  if (count > 0) {
    await dataCollection.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'ga4-data-collection.png' });
    console.log('Clicked Data collection');
  }

  // Look for Events link
  const events = await page.locator('text="Events"').first();
  const evCount = await page.locator('text="Events"').count();
  console.log('Found Events links: ' + evCount);

  await page.screenshot({ path: 'ga4-data-collection.png' });
  process.exit(0);
})();
