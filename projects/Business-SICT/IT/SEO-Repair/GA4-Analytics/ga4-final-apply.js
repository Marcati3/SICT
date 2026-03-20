const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0];
  const pages = context.pages();
  let page = pages.find(p => p.url().includes('analytics.google.com'));

  // We're on the "Apply a comparison" panel
  // 1. Find and check "Organic traffic" checkbox
  const checked = await page.evaluate(() => {
    // Find the row containing "Organic traffic"
    const rows = document.querySelectorAll('tr');
    for (const row of rows) {
      if (row.textContent.includes('Organic traffic')) {
        const cb = row.querySelector('input[type="checkbox"], mat-checkbox, [role="checkbox"]');
        if (cb) {
          if (!cb.checked && !cb.classList.contains('mat-mdc-checkbox-checked')) {
            cb.click();
            return 'clicked checkbox';
          }
          return 'already checked';
        }
        // Just click the row
        const nameCell = row.querySelector('td:nth-child(2)');
        if (nameCell) { nameCell.click(); return 'clicked name cell'; }
        row.click();
        return 'clicked row';
      }
    }
    return 'not found';
  });
  console.log('Checkbox:', checked);
  await page.waitForTimeout(1000);

  // 2. Click Apply button
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (const btn of btns) {
      if (btn.textContent.trim() === 'Apply' && !btn.disabled) {
        btn.click();
        return;
      }
    }
  });
  console.log('Apply clicked');
  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'ga4-final-result.png' });
  console.log('URL: ' + page.url());

  process.exit(0);
})();
