const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Click the "Select dimension" dropdown
  await page.evaluate(() => {
    const els = document.querySelectorAll('*');
    for (const el of els) {
      if (el.textContent.trim() === 'Select dimension' && el.children.length <= 1) {
        el.click();
        return;
      }
    }
  });

  await page.waitForTimeout(2000);

  // Find and click "Session default channel group"
  const clicked = await page.evaluate(() => {
    const els = document.querySelectorAll('*');
    for (const el of els) {
      const t = el.textContent.trim();
      if (t === 'Session default channel group' && el.children.length === 0) {
        el.click();
        return 'clicked';
      }
    }
    // List what's available
    const options = [];
    for (const el of els) {
      const t = el.textContent.trim();
      if (t.length > 3 && t.length < 50 && el.children.length === 0 && el.offsetParent !== null) {
        options.push(t);
      }
    }
    return 'not found. Options: ' + [...new Set(options)].slice(0, 40).join(', ');
  });
  console.log('Result:', clicked);

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ga4-channel-selected.png' });

  // If channel group was selected, now set the match type to "does not exactly match"
  // and value to "Direct"
  if (clicked === 'clicked') {
    // Look for match type selector and dimension value
    const formText = await page.evaluate(() => {
      return document.body.innerText.substring(0, 2000);
    });
    console.log('Form after selection:', formText.substring(0, 600));
  }

  process.exit(0);
})();
