const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click "Free form" template
  const freeform = await page.locator('text=/Free form/').first();
  await freeform.click();
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'ga4-freeform.png' });
  console.log('URL: ' + page.url());

  // Get visible text to understand the layout
  const text = await page.evaluate(() => {
    return document.body.innerText.substring(0, 1500);
  });
  console.log('Page:', text.substring(0, 600));

  process.exit(0);
})();
