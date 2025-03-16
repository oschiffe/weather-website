const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser with Brave executable path
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    args: ['--start-maximized']
  });

  try {
    console.log('Opening browser...');
    const page = await browser.newPage();
    
    // Set viewport to a reasonable size
    await page.setViewport({ width: 1280, height: 800 });
    
    // Navigate to the local server
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 60000 // 60 second timeout
    });
    
    // Take a screenshot of the initial page
    console.log('Taking initial screenshot...');
    await page.screenshot({ path: 'initial-page.png' });

    // Wait for the search input to be available
    await page.waitForSelector('input[placeholder="Enter city name, zipcode, etc."]');
    
    // Test search functionality with "Miami"
    console.log('Testing search with "Miami"...');
    await page.type('input[placeholder="Enter city name, zipcode, etc."]', 'Miami');
    
    // Click the search button
    const searchButton = await page.$('button[type="submit"]');
    await searchButton.click();
    
    // Wait for results to load
    console.log('Waiting for results...');
    await page.waitForSelector('.text-3xl.font-bold', { timeout: 10000 });
    
    // Take a screenshot of the results
    console.log('Taking results screenshot...');
    await page.screenshot({ path: 'miami-results.png' });
    
    // Check for Instagram images
    await page.waitForSelector('.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4');
    
    // Take a screenshot of the Instagram section
    console.log('Taking Instagram section screenshot...');
    await page.screenshot({ path: 'instagram-section.png' });
    
    // Try another search
    console.log('Testing search with "New York"...');
    await page.evaluate(() => { document.querySelector('input[placeholder="Enter city name, zipcode, etc."]').value = ''; });
    await page.type('input[placeholder="Enter city name, zipcode, etc."]', 'New York');
    await searchButton.click();
    
    // Wait for results to load
    await page.waitForSelector('.text-3xl.font-bold', { timeout: 10000 });
    
    // Take a screenshot of the New York results
    console.log('Taking New York results screenshot...');
    await page.screenshot({ path: 'newyork-results.png' });
    
    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('An error occurred during testing:', error);
  } finally {
    // Close the browser
    await browser.close();
    console.log('Browser closed.');
  }
})(); 