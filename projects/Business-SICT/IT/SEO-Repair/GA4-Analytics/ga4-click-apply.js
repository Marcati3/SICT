const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click Apply button
  await page.evaluate(() => {
    const els = document.querySelectorAll('button, [role="button"]');
    for (const el of els) {
      if (el.textContent.trim() === 'Apply') { el.click(); return; }
    }
  });
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'ga4-comparison-active.png' });
  console.log('Applied');

  process.exit(0);
})();
