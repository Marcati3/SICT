const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Try the direct URL for Events in the new GA4 layout
  await page.goto('https://analytics.google.com/analytics/web/#/a152567674p484953142/admin/events', {
    waitUntil: 'domcontentloaded',
    timeout: 20000
  });
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'ga4-events-direct.png' });
  console.log('URL: ' + page.url());

  // Get all visible text to understand the page
  const texts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*'))
      .filter(el => el.offsetParent !== null && el.children.length === 0)
      .map(el => el.textContent.trim())
      .filter(t => t.length > 0 && t.length < 60);
  });
  const unique = [...new Set(texts)];
  console.log('Page items:', JSON.stringify(unique.slice(0, 80)));

  process.exit(0);
})();
