const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click Explore in the left nav
  const explore = await page.locator('text=/^Explore$/').first();
  await explore.click();
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'ga4-explore-page.png' });
  console.log('URL: ' + page.url());

  process.exit(0);
})();
