const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click "Data collection" using partial text match
  const links = await page.locator('text=/Data collection/').all();
  console.log('Found ' + links.length + ' matches for Data collection');

  if (links.length > 0) {
    await links[0].click();
    await page.waitForTimeout(2000);
  }

  await page.screenshot({ path: 'ga4-expanded.png' });

  // Now look for Events
  const evLinks = await page.locator('text=/^Events$/').all();
  console.log('Found ' + evLinks.length + ' Events links');

  // Get all visible text in the sidebar
  const sidebarText = await page.evaluate(() => {
    const items = document.querySelectorAll('a, button, span, div');
    const texts = [];
    items.forEach(el => {
      const t = el.textContent.trim();
      if (t.length > 0 && t.length < 50 && el.offsetParent !== null) {
        texts.push(t);
      }
    });
    return [...new Set(texts)].slice(0, 80);
  });
  console.log('Sidebar items:', JSON.stringify(sidebarText.filter(t => t.length < 40)));

  process.exit(0);
})();
