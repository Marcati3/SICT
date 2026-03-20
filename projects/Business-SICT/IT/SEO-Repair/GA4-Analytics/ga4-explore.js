const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Close any open modal first
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Navigate to Explore
  await page.goto('https://analytics.google.com/analytics/web/#/a152567674p484953142/analysis/new', {
    waitUntil: 'domcontentloaded',
    timeout: 20000
  });
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'ga4-explore.png' });
  console.log('URL: ' + page.url());

  process.exit(0);
})();
