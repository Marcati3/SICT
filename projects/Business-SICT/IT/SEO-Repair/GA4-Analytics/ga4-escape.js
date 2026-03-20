const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click the ← back arrow at the top of the Create comparison panel
  await page.evaluate(() => {
    // Find the back arrow - it's the ← button at the top left of the panel
    const els = document.querySelectorAll('button, [role="button"], mat-icon, .material-icons');
    for (const el of els) {
      const t = el.textContent.trim();
      if (t === 'arrow_back' || t === '←' || t === 'arrow_back_ios') {
        el.click();
        return;
      }
    }
    // Try the first button that looks like a back arrow
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.querySelector('[class*="back"]') || btn.getAttribute('aria-label')?.includes('Back') || btn.getAttribute('aria-label')?.includes('back')) {
        btn.click();
        return;
      }
    }
  });
  await page.waitForTimeout(2000);

  // Close the X on Apply a comparison panel too
  await page.evaluate(() => {
    const els = document.querySelectorAll('button, [role="button"]');
    for (const el of els) {
      const t = el.textContent.trim();
      if (t === 'close') {
        el.click();
        return;
      }
    }
  });
  await page.waitForTimeout(2000);

  // Navigate directly to the overview page to reset
  await page.goto('https://analytics.google.com/analytics/web/#/a152567674p484953142/reports/dashboard?r=firebase-overview&params=_u..comparisons%3D%5B%7B%22name%22%3A%22All+Users%22%7D%2C%7B%22name%22%3A%22Organic+traffic%22%2C%22filters%22%3A%5B%7B%22fieldName%22%3A%22sessionDefaultChannelGroup%22%2C%22filterType%22%3A%22stringFilter%22%2C%22matchType%22%3A%22EXACT%22%2C%22values%22%3A%5B%22Organic+Search%22%2C%22Organic+Video%22%2C%22Organic+Social%22%2C%22Organic+Shopping%22%5D%7D%5D%7D%5D', {
    waitUntil: 'domcontentloaded',
    timeout: 20000
  });
  await page.waitForTimeout(8000);
  await page.screenshot({ path: 'ga4-overview-organic.png' });
  console.log('URL: ' + page.url());

  process.exit(0);
})();
