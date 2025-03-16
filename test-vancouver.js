const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing Vancouver, WA zip code (98660) display...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    await page.setDefaultTimeout(15000);
    
    // Setup console log monitoring
    page.on('console', message => console.log(`Browser console: ${message.text()}`));
    
    console.log('Navigating to weather app...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Type in the search box - 98660 for Vancouver, WA
    await page.waitForSelector('input[type="text"]');
    await page.click('input[type="text"]');
    await page.type('input[type="text"]', '98660');
    console.log('Typed: 98660');
    
    // Wait for dropdown to appear (use delay instead of waitForTimeout)
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    // Take a screenshot of the dropdown
    await page.screenshot({ path: 'dropdown-results.png' });
    console.log('Screenshot saved: dropdown-results.png');
    
    // Click the first search result
    const results = await page.$$('.px-4.py-2.cursor-pointer');
    if (results.length > 0) {
      // Get text of first result
      const resultText = await page.evaluate(el => el.textContent, results[0]);
      console.log(`Clicking search result: ${resultText}`);
      await results[0].click();
    } else {
      console.log('No dropdown results found');
      // If no dropdown, just use the search button
      await page.click('button.flex-shrink-0');
    }
    
    // Wait for weather data to load
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));
    
    // Take a screenshot of the weather results
    await page.screenshot({ path: 'weather-results.png' });
    console.log('Screenshot saved: weather-results.png');
    
    // Check the location displayed - looking for the location-name element
    const locationElement = await page.$('[data-testid="location-name"]');
    if (!locationElement) {
      console.log('Location element not found, trying with class selector...');
      const alternateLocationElement = await page.$('.text-xl.md\\:text-2xl.font-medium.text-secondary');
      
      if (alternateLocationElement) {
        const locationText = await page.evaluate(el => el.textContent, alternateLocationElement);
        console.log(`Location displayed: ${locationText}`);
        
        // Check if it includes our original location, not Felida
        if (locationText.includes('98660') || locationText.includes('Vancouver')) {
          console.log('✅ SUCCESS: Showing correct location name');
        } else {
          console.log(`❌ FAILURE: Expected Vancouver/98660 but got "${locationText}"`);
        }
      } else {
        console.log('❌ FAILURE: Could not find location element');
      }
    } else {
      const locationText = await page.evaluate(el => el.textContent, locationElement);
      console.log(`Location displayed: ${locationText}`);
      
      // Check if it includes our original location, not Felida
      if (locationText.includes('98660') || locationText.includes('Vancouver')) {
        console.log('✅ SUCCESS: Showing correct location name');
      } else {
        console.log(`❌ FAILURE: Expected Vancouver/98660 but got "${locationText}"`);
      }
    }
    
    console.log('Test completed!');
    
    // Wait for a moment to see the results before closing
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 5000)));
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await browser.close();
  }
})(); 