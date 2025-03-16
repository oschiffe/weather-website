const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing multiple location searches...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    await page.setDefaultTimeout(15000);
    
    // Define test cases
    const testCases = [
      { search: '98660', description: 'Vancouver, WA zip code' },
      { search: '10001', description: 'New York zip code' },
      { search: 'Seattle', description: 'Simple city name' },
      { search: 'Las Vegas, NV', description: 'City with state' }
    ];
    
    // Test each location with a fresh page load for each test
    for (const testCase of testCases) {
      console.log(`\n--- Testing ${testCase.description}: ${testCase.search} ---`);
      
      // Start with a fresh page for each test to avoid state issues
      console.log('Navigating to weather app...');
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
      
      // Type in the search box
      await page.waitForSelector('input[type="text"]');
      await page.click('input[type="text"]');
      await page.type('input[type="text"]', testCase.search);
      console.log(`Typed: ${testCase.search}`);
      
      // Wait for dropdown to appear
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
      
      // Click the first search result
      const results = await page.$$('.px-4.py-2.cursor-pointer');
      let selectedText = '';
      
      if (results.length > 0) {
        // Get text of first result
        selectedText = await page.evaluate(el => el.textContent, results[0]);
        console.log(`Clicking search result: ${selectedText}`);
        await results[0].click();
      } else {
        console.log('No dropdown results found, using search button');
        selectedText = testCase.search;
        await page.click('button.flex-shrink-0');
      }
      
      // Wait for weather data to load
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));
      
      // Take a screenshot with the test case name
      const screenshotPath = `${testCase.search.replace(/[^a-z0-9]/gi, '_')}-result.png`;
      await page.screenshot({ path: screenshotPath });
      console.log(`Screenshot saved: ${screenshotPath}`);
      
      // Check the location displayed
      const locationElement = await page.$('[data-testid="location-name"]');
      
      if (locationElement) {
        const locationText = await page.evaluate(el => el.textContent, locationElement);
        console.log(`Location displayed: "${locationText}"`);
        
        // Check if the displayed location contains either the search term or selected result
        if (locationText.includes(testCase.search) || 
            (selectedText && locationText.includes(selectedText.split(',')[0]))) {
          console.log('✅ SUCCESS: Showing correct location name');
        } else {
          console.log(`❌ FAILURE: Expected to include "${testCase.search}" or "${selectedText.split(',')[0]}" but got "${locationText}"`);
        }
      } else {
        console.log('❌ FAILURE: Could not find location element');
      }
    }
    
    console.log('\nAll tests completed!');
    
    // Wait before closing
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }
})(); 