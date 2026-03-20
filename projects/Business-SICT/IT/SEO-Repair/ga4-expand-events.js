const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // The "Data collection and modification" item needs to be expanded
  // Click the arrow/expand button next to it
  // Try clicking directly on the text to expand the submenu
  const dataItem = await page.locator('text=/Data collection and modification/').first();
  await dataItem.click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'ga4-events-expanded.png' });

  // Check what sub-items appeared
  const sidebarText = await page.evaluate(() => {
    const items = document.querySelectorAll('a, button, span');
    const texts = [];
    items.forEach(el => {
      const t = el.textContent.trim();
      if (t.length > 0 && t.length < 50 && el.offsetParent !== null) {
        texts.push(t);
      }
    });
    return [...new Set(texts)].filter(t => t.length < 40);
  });
  console.log('All items:', JSON.stringify(sidebarText));

  process.exit(0);
})();
