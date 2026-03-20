const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // The dropdown is a material select. Find all visible option text
  const dropdownItems = await page.evaluate(() => {
    // Get all elements in the right side panel
    const rightPanel = document.querySelector('.build-filter')
      || document.querySelector('[class*="build-filter"]')
      || document.querySelector('[class*="sidebar"]');

    // Find all clickable items in the dropdown
    const items = document.querySelectorAll('mat-option, [role="option"], .mdc-deprecated-list-item, .mdc-list-item');
    return Array.from(items).map(el => ({
      text: el.textContent.trim(),
      visible: el.offsetParent !== null
    })).filter(i => i.text.length > 0).slice(0, 50);
  });
  console.log('Dropdown items:', JSON.stringify(dropdownItems, null, 2));

  // Try to find and click "Page title" option
  const pageTitleOption = await page.locator('text="Page title"').first();
  const count = await page.locator('text="Page title"').count();
  console.log('Page title matches:', count);

  if (count > 0) {
    // Scroll it into view and click
    await pageTitleOption.scrollIntoViewIfNeeded();
    await pageTitleOption.click();
    await page.waitForTimeout(2000);
    console.log('Clicked Page title');
  } else {
    // Scroll the dropdown to reveal more options
    const selectEl = await page.$('.mat-select-panel, .mdc-menu-surface, [role="listbox"]');
    if (selectEl) {
      await selectEl.evaluate(el => el.scrollTop += 500);
      await page.waitForTimeout(500);
    }
    console.log('Scrolled dropdown');
  }

  await page.screenshot({ path: 'ga4-pagetitle.png' });
  process.exit(0);
})();
