const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const STATE_FILE = path.join(__dirname, 'browser-state.json');
const GA4_PROPERTY = '484953142';

(async () => {
  const args = process.argv.slice(2);
  const command = args[0] || 'launch';

  if (command === 'launch') {
    // Launch browser with persistent context so login persists
    const userDataDir = path.join(__dirname, '.playwright-profile');
    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      viewport: { width: 1400, height: 900 },
      args: ['--start-maximized']
    });

    const page = context.pages()[0] || await context.newPage();
    await page.goto('https://accounts.google.com/');

    // Save the CDP endpoint for reconnection
    const wsEndpoint = context.browser()?.wsEndpoint?.() || 'persistent-context';
    fs.writeFileSync(STATE_FILE, JSON.stringify({
      userDataDir,
      pid: process.pid,
      started: new Date().toISOString()
    }));

    console.log('BROWSER LAUNCHED');
    console.log('PID: ' + process.pid);
    console.log('Profile: ' + userDataDir);
    console.log('');
    console.log('>>> LOG INTO GOOGLE in the browser window <<<');
    console.log('>>> Then come back here and run: node ga4-browser.js ready <<<');
    console.log('');
    console.log('Press Ctrl+C to close the browser when done.');

    // Keep alive
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.on('close', async () => {
      await context.close();
      process.exit(0);
    });

    // Wait forever
    await new Promise(() => {});

  } else if (command === 'ready') {
    // Reconnect to the persistent context and navigate to GA4
    const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    const context = await chromium.launchPersistentContext(state.userDataDir, {
      headless: false,
      viewport: { width: 1400, height: 900 }
    });

    const page = context.pages()[0] || await context.newPage();

    // Navigate to GA4 Admin > Events
    console.log('Navigating to GA4...');
    await page.goto(`https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY}/admin/events`);
    await page.waitForTimeout(5000);

    // Take screenshot
    const screenshot = await page.screenshot({ path: path.join(__dirname, 'ga4-screenshot.png') });
    console.log('Screenshot saved: ga4-screenshot.png');
    console.log('Page title: ' + await page.title());
    console.log('Page URL: ' + page.url());

    await context.close();

  } else if (command === 'screenshot') {
    const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    const context = await chromium.launchPersistentContext(state.userDataDir, {
      headless: false,
      viewport: { width: 1400, height: 900 }
    });
    const page = context.pages()[0] || await context.newPage();
    const url = args[1] || `https://analytics.google.com/analytics/web/#/p${GA4_PROPERTY}/reports/dashboard`;
    await page.goto(url);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(__dirname, 'ga4-screenshot.png') });
    console.log('Screenshot: ga4-screenshot.png');
    console.log('Title: ' + await page.title());
    await context.close();
  }
})();
