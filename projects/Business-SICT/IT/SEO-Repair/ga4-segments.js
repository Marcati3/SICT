const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // Navigate to Admin > Data display > Segments
  // First go to Admin
  const admin = await page.locator('text=/^Admin$/').first();
  await admin.click();
  await page.waitForTimeout(3000);

  // Expand Data display
  const dd = await page.locator('text=/^Data display$/').first();
  await dd.click();
  await page.waitForTimeout(2000);

  // Click Segments
  const seg = await page.locator('text=/^Segments$/').first();
  const segCount = await page.locator('text=/^Segments$/').count();
  console.log('Segments found: ' + segCount);

  if (segCount > 0) {
    await seg.click();
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'ga4-segments.png' });
    console.log('URL: ' + page.url());

    // Get page content
    const text = await page.evaluate(() => document.body.innerText.substring(0, 1500));
    console.log('Content:', text.substring(0, 600));
  }

  process.exit(0);
})();
