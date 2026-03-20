const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Scroll to bottom of the modal to see the radio buttons
  await page.evaluate(() => {
    const scrollable = document.querySelector('[class*="drawer"], [class*="modal"], [class*="dialog"]');
    if (scrollable) scrollable.scrollTop = scrollable.scrollHeight;
    else window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(1000);

  // Click "Active" radio button
  // The text "Active" appears as a label next to a radio button
  const activeLabel = await page.locator('text=/^Active$/').first();
  const count = await page.locator('text=/^Active$/').count();
  console.log('Active labels: ' + count);

  if (count > 0) {
    await activeLabel.click();
    await page.waitForTimeout(1000);
    console.log('Clicked Active');
  }

  await page.screenshot({ path: 'ga4-filter-active.png' });

  // Now click Save
  const saveBtn = await page.locator('text=/^Save$/').first();
  const saveCount = await page.locator('text=/^Save$/').count();
  console.log('Save buttons: ' + saveCount);

  if (saveCount > 0) {
    await saveBtn.click();
    await page.waitForTimeout(3000);
    console.log('Clicked Save');
  }

  await page.screenshot({ path: 'ga4-filter-saved.png' });

  process.exit(0);
})();
