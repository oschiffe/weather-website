const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'test-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

// Helper function to take screenshots
async function takeScreenshot(page, name) {
  const screenshotPath = path.join(screenshotsDir, `${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);
}

// Helper function to wait for a specific time
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('Starting city name fix test...');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // Navigate to the app
    console.log('Navigating to the app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await takeScreenshot(page, 'city-name-01-initial-page');
    
    // Test searching for Tokyo
    console.log('Testing search for Tokyo...');
    
    // Find the search input
    const searchInput = await page.waitForSelector('input[name="location"]');
    await searchInput.click();
    
    // Type "tokyo" and wait for suggestions to appear
    await searchInput.type('tokyo', { delay: 100 });
    await wait(1000); // Wait for debounce
    await takeScreenshot(page, 'city-name-02-typing-tokyo');
    
    // Click on the Tokyo suggestion
    await page.evaluate(() => {
      const suggestionsList = document.querySelector('.absolute ul');
      if (suggestionsList) {
        const tokyoItem = Array.from(suggestionsList.querySelectorAll('li'))
          .find(item => item.textContent.toLowerCase().includes('tokyo'));
        
        if (tokyoItem) tokyoItem.click();
      }
    });
    
    // Wait for data to load
    await wait(2000);
    await takeScreenshot(page, 'city-name-03-after-selecting-tokyo');
    
    // Check if "Tokyo" appears in the weather data
    const cityNameDisplayed = await page.evaluate(() => {
      // Look for heading elements containing the city name
      const cityElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      for (const el of cityElements) {
        if (el.textContent.includes('Tokyo')) {
          return { found: true, name: 'Tokyo' };
        } else if (el.textContent.includes('Horinouchi')) {
          return { found: true, name: 'Horinouchi' };
        }
      }
      return { found: false };
    });
    
    if (cityNameDisplayed.found) {
      console.log(`City name test: ${cityNameDisplayed.name === 'Tokyo' ? 'PASSED' : 'FAILED'}`);
      console.log(`Displayed city name: ${cityNameDisplayed.name}`);
    } else {
      console.log('City name test: FAILED - Could not find any city name in the weather display');
    }
    
    console.log('Test completed!');
  } catch (error) {
    console.error('Test failed:', error);
    await takeScreenshot(page, 'city-name-error-state');
  } finally {
    // Close the browser
    await browser.close();
  }
})(); 