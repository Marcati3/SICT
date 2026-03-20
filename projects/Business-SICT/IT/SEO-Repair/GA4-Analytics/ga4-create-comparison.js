const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click "+ Create new" button
  const createNew = await page.evaluate(() => {
    const els = document.querySelectorAll('button, [role="button"]');
    for (const el of els) {
      if (el.textContent.includes('Create new')) {
        el.click();
        return 'clicked';
      }
    }
    return 'not found';
  });
  console.log('Create new:', createNew);

  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'ga4-create-new.png' });

  // Get page content to understand the form
  const text = await page.evaluate(() => document.body.innerText.substring(0, 2000));
  console.log('Form:', text.substring(0, 800));

  process.exit(0);
})();
