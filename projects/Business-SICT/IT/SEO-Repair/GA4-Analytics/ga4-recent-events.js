const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click "Recent events" tab
  const recentTab = await page.locator('text=/Recent events/').first();
  await recentTab.click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'ga4-recent-events.png' });

  // Get all event names visible
  const eventNames = await page.evaluate(() => {
    const cells = document.querySelectorAll('td, [class*="event-name"]');
    return Array.from(cells).map(c => c.textContent.trim()).filter(t => t.length > 0 && t.length < 60);
  });
  console.log('Events:', JSON.stringify(eventNames));

  process.exit(0);
})();
