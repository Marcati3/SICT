const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));
  if (!page) { console.log('No GA4 tab found'); process.exit(1); }

  console.log('URL: ' + page.url());
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ga4-current.png' });
  console.log('Screenshot saved');
  process.exit(0);
})();
