/**
 * Comprehensive test for Weather App
 * Tests all main features:
 * - Search functionality with different locations
 * - Temperature unit switching
 * - Forecast page functionality
 * - Maps page with different map types
 * - Settings page
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'test-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

// Helper function to take screenshots
async function takeScreenshot(page, name) {
  await page.screenshot({ 
    path: path.join(screenshotsDir, `${name}.png`),
    fullPage: true 
  });
  console.log(`Screenshot saved: ${name}.png`);
}

// Helper function to wait a bit
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Custom timeout function since waitForTimeout isn't available 
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to ensure CSS is loaded before taking screenshots
async function waitForCSSToLoad(page) {
  // Wait for all stylesheets to be loaded
  const stylesheetLoaded = await page.evaluate(() => {
    return Array.from(document.styleSheets).length > 0;
  });
  
  if (!stylesheetLoaded) {
    console.log('Waiting for stylesheets to load...');
    await timeout(1000);
    return waitForCSSToLoad(page);
  }
  
  console.log(`${Array.from(await page.evaluate(() => document.styleSheets)).length} stylesheets loaded`);
  
  // Additional delay to ensure rendering is complete
  await timeout(1000);
  return true;
}

(async () => {
  console.log('Starting comprehensive test of the Weather Website...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 },
    args: ['--window-size=1280,800']
  });
  
  try {
    const page = await browser.newPage();
    
    // Test 1: Homepage
    console.log('Testing homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await wait(1000);
    await takeScreenshot(page, '01-homepage-initial');
    
    // Test search functionality
    console.log('Testing search functionality...');
    await page.type('input[placeholder="Search for a city..."]', 'Seattle');
    await wait(1000);
    await takeScreenshot(page, '02-search-dropdown');
    
    // Select the first suggestion
    await page.click('.absolute ul li:first-child');
    await wait(2000);
    await takeScreenshot(page, '03-search-results');
    
    // Test 2: Forecast page
    console.log('Testing forecast page...');
    await page.click('a[href="/forecast"]');
    await wait(2000);
    await takeScreenshot(page, '04-forecast-page');
    
    // Test daily/hourly toggle
    console.log('Testing forecast toggle...');
    await wait(1000);
    
    // Use more robust selectors
    const hourlyButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Hourly'));
    });
    
    if (hourlyButton) {
      await hourlyButton.click();
      await wait(1000);
      await takeScreenshot(page, '05-forecast-hourly');
    }
    
    const dailyButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Daily'));
    });
    
    if (dailyButton) {
      await dailyButton.click();
      await wait(1000);
      await takeScreenshot(page, '06-forecast-daily');
    }
    
    // Test 3: Maps page
    console.log('Testing maps page...');
    await page.click('a[href="/maps"]');
    await wait(3000); // Wait for map to load
    await takeScreenshot(page, '07-maps-initial');
    
    // Test layer switching with more robust selectors
    console.log('Testing map layers...');
    
    const precipButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Precipitation'));
    });
    
    if (precipButton) {
      await precipButton.click();
      await wait(2000);
      await takeScreenshot(page, '08-maps-precipitation');
    }
    
    const cloudsButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Clouds'));
    });
    
    if (cloudsButton) {
      await cloudsButton.click();
      await wait(2000);
      await takeScreenshot(page, '09-maps-clouds');
    }
    
    // Test 4: Settings page
    console.log('Testing settings page...');
    await page.click('a[href="/settings"]');
    await wait(1000);
    await takeScreenshot(page, '10-settings-initial');
    
    // Test temperature unit change
    console.log('Testing settings changes...');
    
    const fahrenheitButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Fahrenheit'));
    });
    
    if (fahrenheitButton) {
      await fahrenheitButton.click();
      await wait(500);
    }
    
    // Test theme change
    const darkButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Dark'));
    });
    
    if (darkButton) {
      await darkButton.click();
      await wait(1000);
      await takeScreenshot(page, '11-settings-dark-mode');
    }
    
    // Save settings
    const saveButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent.includes('Save Changes'));
    });
    
    if (saveButton) {
      await saveButton.click();
      await wait(1000);
    }
    
    // Go back to homepage to verify settings applied
    await page.click('a[href="/"]');
    await wait(2000);
    await takeScreenshot(page, '12-homepage-with-settings');
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await browser.close();
  }
})(); 