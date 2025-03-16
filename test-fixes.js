const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

(async () => {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });
  
  const page = await browser.newPage();
  console.log('Testing weather application issues...');
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    console.log('✅ Loaded the homepage');
    
    // Take initial screenshot
    await page.screenshot({ path: path.join(screenshotsDir, 'initial-state.png') });
    
    // Test 1: Check dropdown UI issue
    console.log('\n🔍 Testing search dropdown UI issue...');
    await page.click('input[name="location"]');
    await page.type('input[name="location"]', 'Seattle');
    // Wait for dropdown to appear
    await page.waitForSelector('.absolute.z-50', { visible: true, timeout: 5000 })
      .catch(() => console.log('❌ Dropdown not visible or not found'));
    
    // Take screenshot of dropdown
    await page.screenshot({ path: path.join(screenshotsDir, 'dropdown-issue.png') });
    console.log('Screenshot taken of dropdown UI');
    
    // Test 2: Check weather data accuracy for zip code 98660
    console.log('\n🔍 Testing weather data accuracy for zip code 98660...');
    await page.click('input[name="location"]', { clickCount: 3 }); // Select all text
    await page.type('input[name="location"]', '98660');
    
    // Wait for dropdown and select first result
    try {
      await page.waitForSelector('.absolute.z-50 .cursor-pointer', { visible: true, timeout: 5000 });
      await page.click('.absolute.z-50 .cursor-pointer');
      
      // Wait for weather data to load
      await page.waitForFunction(
        () => document.querySelector('.text-6xl') !== null,
        { timeout: 10000 }
      );
      
      // Capture the displayed temperature
      const displayedTemp = await page.evaluate(() => {
        const tempElement = document.querySelector('.text-6xl');
        return tempElement ? tempElement.textContent.trim() : null;
      });
      
      console.log(`Displayed temperature for 98660: ${displayedTemp}`);
      await page.screenshot({ path: path.join(screenshotsDir, 'weather-98660.png') });
    } catch (error) {
      console.log(`❌ Error testing zip code 98660: ${error.message}`);
    }
    
    // Test 3: Test scroll to explore feature
    console.log('\n🔍 Testing "scroll to explore" feature...');
    
    // Scroll to the bottom of the page
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Take screenshot of bottom area
    await page.screenshot({ path: path.join(screenshotsDir, 'scroll-feature.png') });
    console.log('Screenshot taken of bottom area');
    
    console.log('\n✅ Testing completed');
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
})(); 