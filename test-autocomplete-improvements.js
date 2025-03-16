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
  console.log('Starting autocomplete improvement tests...');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Set viewport size
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // Navigate to the app
    console.log('Navigating to the app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await takeScreenshot(page, '01-initial-page');
    
    // Test 1: Test that suggestions appear as user types
    console.log('Test 1: Testing that suggestions appear as user types...');
    
    // Find the search input
    const searchInput = await page.waitForSelector('input[name="location"]');
    await searchInput.click();
    
    // Type "lon" and wait for suggestions to appear
    await searchInput.type('lon', { delay: 100 });
    await wait(1000); // Wait for debounce
    await takeScreenshot(page, '02-typing-lon');
    
    // Check if suggestions appear
    const suggestionsVisible = await page.evaluate(() => {
      const suggestionsList = document.querySelector('.absolute ul');
      return suggestionsList && suggestionsList.children.length > 0;
    });
    
    console.log(`Suggestions visible: ${suggestionsVisible}`);
    
    // Test 2: Verify that only 3 suggestions maximum are shown
    console.log('Test 2: Verifying that only 3 suggestions maximum are shown...');
    
    // Type "l" to get more general results
    await searchInput.click({ clickCount: 3 }); // Select all text
    await searchInput.type('l', { delay: 100 });
    await wait(1000); // Wait for debounce
    await takeScreenshot(page, '03-typing-l');
    
    // Count suggestions
    const suggestionsCount = await page.evaluate(() => {
      const suggestionsList = document.querySelector('.absolute ul');
      return suggestionsList ? suggestionsList.children.length : 0;
    });
    
    console.log(`Number of suggestions: ${suggestionsCount}`);
    console.log(`Maximum 3 suggestions test: ${suggestionsCount <= 3 ? 'PASSED' : 'FAILED'}`);
    
    // Test 3: Test that the suggestions are relevant to what the user types
    console.log('Test 3: Testing that suggestions are relevant...');
    
    // Type "london" to get specific results
    await searchInput.click({ clickCount: 3 }); // Select all text
    await searchInput.type('london', { delay: 100 });
    await wait(1000); // Wait for debounce
    await takeScreenshot(page, '04-typing-london');
    
    // Check if London is in the suggestions
    const londonInSuggestions = await page.evaluate(() => {
      const suggestionsList = document.querySelector('.absolute ul');
      if (!suggestionsList) return false;
      
      const items = Array.from(suggestionsList.querySelectorAll('li'));
      return items.some(item => item.textContent.toLowerCase().includes('london'));
    });
    
    console.log(`London in suggestions: ${londonInSuggestions ? 'PASSED' : 'FAILED'}`);
    
    // Test 4: Test that clicking on a suggestion loads the city's weather data
    console.log('Test 4: Testing that clicking on a suggestion loads weather data...');
    
    // Click on the London suggestion
    await page.evaluate(() => {
      const suggestionsList = document.querySelector('.absolute ul');
      if (suggestionsList) {
        const londonItem = Array.from(suggestionsList.querySelectorAll('li'))
          .find(item => item.textContent.toLowerCase().includes('london'));
        
        if (londonItem) londonItem.click();
      }
    });
    
    // Wait for data to load
    await wait(2000);
    await takeScreenshot(page, '05-after-selecting-london');
    
    // Check if weather data is displayed
    const weatherDataDisplayed = await page.evaluate(() => {
      // Look for weather-related elements
      const weatherElements = document.querySelectorAll('.text-4xl, .text-3xl, .text-2xl');
      for (const el of weatherElements) {
        if (el.textContent.includes('°') || el.textContent.toLowerCase().includes('london')) {
          return true;
        }
      }
      return false;
    });
    
    console.log(`Weather data displayed: ${weatherDataDisplayed ? 'PASSED' : 'FAILED'}`);
    
    // Try another city
    console.log('Testing with another city (Tokyo)...');
    await searchInput.click({ clickCount: 3 }); // Select all text
    await searchInput.type('tokyo', { delay: 100 });
    await wait(1000); // Wait for debounce
    await takeScreenshot(page, '06-typing-tokyo');
    
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
    await takeScreenshot(page, '07-after-selecting-tokyo');
    
    // Test a partial match
    console.log('Testing with a partial match (new)...');
    await searchInput.click({ clickCount: 3 }); // Select all text
    await searchInput.type('new', { delay: 100 });
    await wait(1000); // Wait for debounce
    await takeScreenshot(page, '08-typing-new');
    
    console.log('All tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
    await takeScreenshot(page, 'error-state');
  } finally {
    // Close the browser
    await browser.close();
  }
})(); 