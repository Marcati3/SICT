const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Scroll down to find Filter state section
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'ga4-filter-state.png' });

  // Look for "Active" radio button or "Testing" state selector
  const activeRadio = await page.locator('text=/^Active$/').all();
  console.log('Active radio found: ' + activeRadio.length);

  // Get all visible text in the modal
  const modalText = await page.evaluate(() => {
    const modal = document.querySelector('[class*="modal"], [class*="dialog"], [class*="drawer"], [role="dialog"]');
    if (modal) return modal.innerText;
    return document.body.innerText.substring(0, 3000);
  });
  console.log('Modal text:', modalText.substring(0, 1000));

  process.exit(0);
})();
