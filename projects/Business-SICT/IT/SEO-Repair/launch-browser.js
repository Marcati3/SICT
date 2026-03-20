const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const userDataDir = path.join(__dirname, '.playwright-profile');

  console.log('Launching browser...');
  console.log('Profile: ' + userDataDir);

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: null,
    args: ['--start-maximized'],
    ignoreDefaultArgs: ['--enable-automation'],
    timeout: 0
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto('https://accounts.google.com/');

  console.log('');
  console.log('=== BROWSER IS OPEN ===');
  console.log('1. Log into Google');
  console.log('2. Come back to Claude Code and type "logged in"');
  console.log('3. DO NOT close this browser window');
  console.log('');

  // Keep process alive until manually killed
  process.on('SIGINT', async () => {
    console.log('Closing browser...');
    await context.close();
    process.exit(0);
  });

  // Prevent exit
  setInterval(() => {}, 60000);
})();
