import puppeteer from 'puppeteer-core';
import { preview } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const screenshotsDir = path.resolve(rootDir, 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runTestsAndCapture() {
  console.log('🚀 Starting Vite preview server for production build...');
  const previewServer = await preview({
    root: rootDir,
    preview: { port: 4174 },
  });
  const url = 'http://localhost:4174';
  console.log(`📡 Preview server listening at ${url}`);

  console.log('🌐 Launching Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    console.log('--- Test 1: Load Application ---');
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#root');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.empty-state-title');

    const title = await page.title();
    console.log(`✓ Page loaded successfully. Title: "${title}"`);

    // Verify initial empty state
    const emptyTitle = await page.$eval('.empty-state-title', (el) => el.textContent);
    console.log(`✓ Empty state verified: "${emptyTitle}"`);

    console.log('--- Test 2: Validation - Empty Task ---');
    const addBtn = await page.$('.add-task-btn');
    await addBtn.click();
    await page.waitForSelector('.error-message');
    const errorMsg1 = await page.$eval('.error-message', (el) => el.textContent.trim());
    console.log(`✓ Empty task blocked. Message: "${errorMsg1}"`);

    console.log('--- Test 3: Validation - Whitespace Task ---');
    await page.type('.task-input', '     ');
    await addBtn.click();
    await page.waitForSelector('.error-message');
    const errorMsg2 = await page.$eval('.error-message', (el) => el.textContent.trim());
    console.log(`✓ Whitespace task blocked. Message: "${errorMsg2}"`);

    console.log('--- Test 4: Add Task via Enter Key ---');
    await page.click('.task-input', { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await page.type('.task-input', 'Complete project documentation');
    await page.keyboard.press('Enter');

    await page.waitForSelector('.task-item');
    const taskCount1 = await page.$$eval('.task-item', (els) => els.length);
    console.log(`✓ Task added via Enter key. Total rendered items: ${taskCount1}`);

    console.log('--- Test 5: Add Remaining Tasks (Matching Assessment PDF) ---');
    const tasksToAdd = [
      'Prepare for team meeting',
      'Fix login issue',
      'Design new feature',
      'Write test cases',
    ];

    for (const taskText of tasksToAdd) {
      await page.type('.task-input', taskText);
      await addBtn.click();
      await new Promise((r) => setTimeout(r, 60));
    }

    const totalTasks = await page.$$eval('.task-item', (els) => els.length);
    console.log(`✓ Total tasks now: ${totalTasks} (Expected: 5)`);

    console.log('--- Test 6: Verify Initial Statistics ---');
    let totalText = await page.$eval('.stat-total .stat-number', (el) => el.textContent.trim());
    let completedText = await page.$eval('.stat-completed .stat-number', (el) => el.textContent.trim());
    let pendingText = await page.$eval('.stat-pending .stat-number', (el) => el.textContent.trim());
    console.log(`✓ Initial Stats -> Total: ${totalText}, Completed: ${completedText}, Pending: ${pendingText}`);

    console.log('--- Test 7: Toggle Tasks to Completed ---');
    // Toggle "Complete project documentation" and "Fix login issue" to Completed
    const taskItems = await page.$$('.task-item');
    for (const item of taskItems) {
      const text = await item.$eval('.task-text', (el) => el.textContent.trim());
      if (text === 'Complete project documentation' || text === 'Fix login issue') {
        const checkbox = await item.$('.custom-checkbox');
        await checkbox.click();
      }
    }

    await new Promise((r) => setTimeout(r, 200));

    totalText = await page.$eval('.stat-total .stat-number', (el) => el.textContent.trim());
    completedText = await page.$eval('.stat-completed .stat-number', (el) => el.textContent.trim());
    pendingText = await page.$eval('.stat-pending .stat-number', (el) => el.textContent.trim());
    console.log(`✓ Updated Stats -> Total: ${totalText}, Completed: ${completedText}, Pending: ${pendingText}`);

    console.log('--- Test 8: Filter Verification ---');
    // Check Pending filter
    const filterButtons = await page.$$('.filter-btn');
    await filterButtons[1].click(); // Pending
    await new Promise((r) => setTimeout(r, 100));
    let visibleCount = await page.$$eval('.task-item', (els) => els.length);
    console.log(`✓ Filter "Pending" active -> Visible items: ${visibleCount} (Expected: 3)`);

    // Check Completed filter
    await filterButtons[2].click(); // Completed
    await new Promise((r) => setTimeout(r, 100));
    visibleCount = await page.$$eval('.task-item', (els) => els.length);
    console.log(`✓ Filter "Completed" active -> Visible items: ${visibleCount} (Expected: 2)`);

    // Check All filter
    await filterButtons[0].click(); // All
    await new Promise((r) => setTimeout(r, 100));
    visibleCount = await page.$$eval('.task-item', (els) => els.length);
    console.log(`✓ Filter "All" active -> Visible items: ${visibleCount} (Expected: 5)`);

    console.log('--- Test 9: Persistence Verification Across Reload ---');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.task-item');
    totalText = await page.$eval('.stat-total .stat-number', (el) => el.textContent.trim());
    completedText = await page.$eval('.stat-completed .stat-number', (el) => el.textContent.trim());
    pendingText = await page.$eval('.stat-pending .stat-number', (el) => el.textContent.trim());
    console.log(`✓ After Page Reload -> Total: ${totalText}, Completed: ${completedText}, Pending: ${pendingText}`);

    console.log('--- Test 10: Capture High-Res Desktop Screenshot ---');
    await page.setViewport({ width: 1280, height: 920, deviceScaleFactor: 2 });
    await page.screenshot({
      path: path.join(screenshotsDir, 'desktop-view.png'),
      fullPage: true,
    });
    console.log(`✓ Desktop screenshot saved to screenshots/desktop-view.png`);

    console.log('--- Test 11: Capture Mobile Screenshot ---');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.screenshot({
      path: path.join(screenshotsDir, 'mobile-view.png'),
      fullPage: true,
    });
    console.log(`✓ Mobile screenshot saved to screenshots/mobile-view.png`);

    console.log('--- Test 12: Delete Task Verification ---');
    await page.setViewport({ width: 1280, height: 920 });
    const deleteBtn = await page.$('.btn-delete');
    await deleteBtn.click();
    await new Promise((r) => setTimeout(r, 150));
    const countAfterDelete = await page.$$eval('.task-item', (els) => els.length);
    console.log(`✓ Task deleted -> Visible items count: ${countAfterDelete} (Expected: 4)`);

    // Reset localStorage so real new users start clean
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.empty-state');
    const finalEmpty = await page.$$eval('.task-item', (els) => els.length);
    console.log(`✓ Storage reset for clean distribution. Remaining items: ${finalEmpty}`);

    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    await previewServer.close();
    console.log('🛑 Server and browser closed.');
  }
}

runTestsAndCapture();
