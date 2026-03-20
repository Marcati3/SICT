const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click the expand arrow on "Data collection and modification"
  const item = await page.locator('text=/Data collection/').first();
  await item.click();
  await page.waitForTimeout(3000);

  // Now click "Events" if it appeared
  const events = await page.locator('text=/^Events$/').first();
  const evCount = await page.locator('text=/^Events$/').count();
  if (evCount > 0) {
    await events.click();
    await page.waitForTimeout(5000);
    console.log('Clicked Events');
  } else {
    console.log('Events not found - checking sub-items');
    // Get all visible text
    const texts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*'))
        .filter(el => el.offsetParent !== null && el.children.length === 0)
        .map(el => el.textContent.trim())
        .filter(t => t.length > 0 && t.length < 50);
    });
    const unique = [...new Set(texts)];
    console.log('Visible items:', JSON.stringify(unique.slice(0, 60)));
  }

  await page.screenshot({ path: 'ga4-events-page.png' });
  process.exit(0);
})();
