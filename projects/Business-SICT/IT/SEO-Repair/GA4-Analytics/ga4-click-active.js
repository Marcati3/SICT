const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Use evaluate to find and click the Active radio button
  const result = await page.evaluate(() => {
    // Find all elements, look for "Active" text
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      if (el.textContent.trim() === 'Active' && el.children.length === 0) {
        // Found the Active label - click it or its parent
        el.click();
        return 'clicked: ' + el.tagName + ' ' + el.className;
      }
    }
    // Alternative: find radio buttons
    const radios = document.querySelectorAll('input[type="radio"], [role="radio"], mat-radio-button');
    return 'radios found: ' + radios.length + ', tags: ' + Array.from(radios).map(r => r.tagName + '.' + r.className).join(', ');
  });
  console.log('Result:', result);

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'ga4-active-clicked.png' });

  // Now try to find and click Save
  const saveResult = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button, [role="button"]');
    for (const btn of buttons) {
      if (btn.textContent.trim() === 'Save') {
        btn.click();
        return 'clicked Save: ' + btn.tagName;
      }
    }
    return 'Save not found. Buttons: ' + Array.from(buttons).map(b => b.textContent.trim()).filter(t => t.length < 20).join(', ');
  });
  console.log('Save result:', saveResult);

  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'ga4-filter-saved.png' });

  process.exit(0);
})();
