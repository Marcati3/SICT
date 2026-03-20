const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Go to Reports overview first
  await page.goto('https://analytics.google.com/analytics/web/#/a152567674p484953142/reports/dashboard?r=firebase-overview', {
    waitUntil: 'domcontentloaded',
    timeout: 20000
  });
  await page.waitForTimeout(8000);

  // Click "Add comparison +" button
  const addComp = await page.evaluate(() => {
    const els = document.querySelectorAll('button, [role="button"]');
    for (const el of els) {
      if (el.textContent.includes('Add comparison') || el.textContent.includes('comparison')) {
        el.click();
        return 'clicked: ' + el.textContent.trim();
      }
    }
    return 'not found';
  });
  console.log('Add comparison:', addComp);

  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'ga4-add-comparison.png' });

  process.exit(0);
})();
