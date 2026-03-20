const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click X to close the panel
  await page.evaluate(() => {
    const els = document.querySelectorAll('button, [role="button"]');
    for (const el of els) {
      if (el.textContent.trim() === 'close' || el.getAttribute('aria-label') === 'Close') {
        el.click();
        return;
      }
    }
    // Try the X icon
    for (const el of els) {
      const t = el.textContent.trim();
      if (t === '×' || t === 'X' || t === 'Close') {
        el.click();
        return;
      }
    }
  });
  await page.waitForTimeout(1000);

  // Press Escape as fallback
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Click the back arrow
  await page.evaluate(() => {
    const els = document.querySelectorAll('button, [role="button"]');
    for (const el of els) {
      if (el.textContent.includes('arrow_back') || el.getAttribute('aria-label') === 'Back') {
        el.click();
        return;
      }
    }
  });
  await page.waitForTimeout(3000);

  // Try clicking Apply one more time if visible
  await page.evaluate(() => {
    const els = document.querySelectorAll('button');
    for (const el of els) {
      if (el.textContent.trim() === 'Apply' && el.offsetParent !== null) {
        el.click();
        return;
      }
    }
  });
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'ga4-after-apply.png' });
  console.log('Done');

  process.exit(0);
})();
