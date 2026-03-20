const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Close the current filter panel first - go back
  const backBtn = await page.locator('text="Build filter"').first();
  // Click the back arrow
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Instead of fighting with filters, let's navigate directly to GA4 Admin > Events
  // to set up conversion events. That's more productive.
  // Let's go to Admin first
  await page.goto('https://analytics.google.com/analytics/web/#/a152567674p484953142/admin/events', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'ga4-admin-events.png' });
  console.log('Title: ' + await page.title());
  console.log('URL: ' + page.url());
  process.exit(0);
})();
