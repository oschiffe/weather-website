// Test script to verify search functionality works in the browser
const puppeteer = require('puppeteer');
require('dotenv').config({ path: '.env.local' });

// Helper function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testLocationSearch() {
  console.log('Starting search functionality test...');
  
  // Launch browser
  const browser = await puppeteer.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({ width: 1280, height: 800 });
    
    // Enable logging from the browser console
    page.on('console', message => console.log(`Browser console: ${message.text()}`));
    
    // Go to homepage
    console.log('Loading home page...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Test multiple city searches
    const citiesToTest = [
      'Seattle',
      'New York', 
      'London',
      'Tokyo',
      'Miami',
      'Vancouver'
    ];
    
    for (const city of citiesToTest) {
      console.log(`\n=== Testing search for "${city}" ===`);
      
      // For each search, directly focus and click the input field which will clear it
      const inputField = await page.$('input[aria-label="Location search"]');
      await inputField.click();
      await delay(500);
      
      // Type the city name
      console.log(`Typing: ${city}`);
      await inputField.type(city, { delay: 100 });
      
      // Wait for dropdown results
      console.log('Waiting for search results...');
      await delay(1500);
      
      // Take screenshot of dropdown
      await page.screenshot({ path: `search-${city}-dropdown.png` });
      console.log(`Screenshot saved: search-${city}-dropdown.png`);
      
      // Select the first result
      const firstResult = await page.$('.absolute ul li');
      if (firstResult) {
        console.log('Selecting first result');
        await firstResult.click();
        await delay(1500);
        
        // Take screenshot of weather results
        await page.screenshot({ path: `search-${city}-results.png` });
        console.log(`Screenshot saved: search-${city}-results.png`);
        
        // Check if weather information is displayed
        const weatherInfo = await page.evaluate(() => {
          const locationElement = document.querySelector('h1');
          return locationElement ? locationElement.innerText : '';
        });
        
        console.log(`Weather displayed for: ${weatherInfo}`);
      } else {
        console.log('No search results found in dropdown');
      }
      
      await delay(1000);
    }
    
    console.log('\nAll search tests completed successfully!');
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    // Close browser
    await browser.close();
    console.log('Browser closed');
  }
}

// Run the test
testLocationSearch(); 