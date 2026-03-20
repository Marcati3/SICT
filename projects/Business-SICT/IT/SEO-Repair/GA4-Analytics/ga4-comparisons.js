const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Navigate to Admin > Data display > Comparisons
  await page.goto('https://analytics.google.com/analytics/web/#/a152567674p484953142/admin/comparisons', {
    waitUntil: 'domcontentloaded',
    timeout: 20000
  });
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'ga4-comparisons.png' });
  console.log('URL: ' + page.url());

  const text = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log('Content:', text.substring(0, 800));

  process.exit(0);
})();
