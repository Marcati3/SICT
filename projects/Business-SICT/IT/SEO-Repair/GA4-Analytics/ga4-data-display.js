const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click "Data display" to expand it
  const dd = await page.locator('text=/^Data display$/').first();
  await dd.click();
  await page.waitForTimeout(2000);

  // Get all visible text
  const texts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*'))
      .filter(el => el.offsetParent !== null && el.children.length === 0)
      .map(el => el.textContent.trim())
      .filter(t => t.length > 0 && t.length < 60);
  });
  const unique = [...new Set(texts)];
  console.log('All items:', JSON.stringify(unique));

  await page.screenshot({ path: 'ga4-data-display.png' });

  // Look for Events and click it
  const events = await page.locator('text=/^Events$/').first();
  const evCount = await page.locator('text=/^Events$/').count();
  console.log('Events found: ' + evCount);
  if (evCount > 0) {
    await events.click();
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'ga4-events-list.png' });
    console.log('Clicked Events - URL: ' + page.url());
  }

  process.exit(0);
})();
