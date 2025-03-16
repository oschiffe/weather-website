const puppeteer = require('puppeteer');

(async () => {
  console.log('Testing temperature unit settings...');
  
  // Launch browser
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Monitor console logs
    page.on('console', message => console.log(`Browser console: ${message.text()}`));
    
    // First, go to settings page and change to Fahrenheit
    console.log('1. Navigating to settings page...');
    await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle2' });
    
    // Click the Fahrenheit button - use a more reliable selector
    console.log('2. Setting temperature unit to Fahrenheit...');
    const fahrenheitButtons = await page.$$('button');
    let fahrenheitButton = null;
    
    for (const button of fahrenheitButtons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Fahrenheit')) {
        fahrenheitButton = button;
        break;
      }
    }
    
    if (!fahrenheitButton) {
      throw new Error('Fahrenheit button not found');
    }
    
    await fahrenheitButton.click();
    
    // Save settings
    console.log('3. Saving settings...');
    const saveButtons = await page.$$('button');
    let saveButton = null;
    
    for (const button of saveButtons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Save Changes')) {
        saveButton = button;
        break;
      }
    }
    
    if (!saveButton) {
      throw new Error('Save button not found');
    }
    
    await saveButton.click();
    
    // Wait for the alert and handle it
    console.log('4. Waiting for alert...');
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    // Dismiss alert
    try {
      await page.evaluate(() => {
        // Store the original alert
        const originalAlert = window.alert;
        // Override alert
        window.alert = () => {};
        // Restore after a delay
        setTimeout(() => {
          window.alert = originalAlert;
        }, 2000);
      });
    } catch (e) {
      console.log('Alert handling error:', e);
    }
    
    // Navigate to homepage
    console.log('5. Navigating to homepage to check temperature display...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait for weather data to load
    console.log('6. Waiting for weather data to load...');
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    // Search for a city to trigger weather display
    console.log('7. Searching for Seattle...');
    await page.type('input[type="text"]', 'Seattle');
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    // Click the first search result
    const results = await page.$$('.px-4.py-2.cursor-pointer');
    if (results.length > 0) {
      await results[0].click();
    } else {
      console.log('No search results found, using search button');
      const searchButtons = await page.$$('button');
      for (const button of searchButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Search')) {
          await button.click();
          break;
        }
      }
    }
    
    // Wait for weather data to load
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    // Take a screenshot
    await page.screenshot({ path: 'fahrenheit-display.png' });
    console.log('Screenshot saved: fahrenheit-display.png');
    
    // Check temperature format (should include °F)
    const tempElement = await page.$('[data-testid="current-temp"]');
    if (!tempElement) {
      throw new Error('Temperature element not found');
    }
    const tempText = await page.evaluate(el => el.textContent, tempElement);
    console.log(`Temperature displayed: ${tempText}`);
    
    if (tempText.includes('°F')) {
      console.log('✅ SUCCESS: Temperature is displayed in Fahrenheit');
    } else {
      console.log('❌ FAILURE: Temperature is not displayed in Fahrenheit');
    }
    
    // Now go back to settings and switch to Celsius
    console.log('\n8. Navigating back to settings...');
    await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle2' });
    
    // Click the Celsius button
    console.log('9. Setting temperature unit to Celsius...');
    const celsiusButtons = await page.$$('button');
    let celsiusButton = null;
    
    for (const button of celsiusButtons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Celsius')) {
        celsiusButton = button;
        break;
      }
    }
    
    if (!celsiusButton) {
      throw new Error('Celsius button not found');
    }
    
    await celsiusButton.click();
    
    // Save settings
    console.log('10. Saving settings...');
    const saveButtonsAgain = await page.$$('button');
    let saveButtonAgain = null;
    
    for (const button of saveButtonsAgain) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Save Changes')) {
        saveButtonAgain = button;
        break;
      }
    }
    
    if (!saveButtonAgain) {
      throw new Error('Save button not found');
    }
    
    await saveButtonAgain.click();
    
    // Wait for the alert
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    // Navigate to homepage
    console.log('11. Navigating to homepage to check temperature display...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait for weather data to load
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    // Search for a city to trigger weather display
    console.log('12. Searching for Seattle again...');
    await page.type('input[type="text"]', 'Seattle');
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    // Click the first search result
    const resultsAgain = await page.$$('.px-4.py-2.cursor-pointer');
    if (resultsAgain.length > 0) {
      await resultsAgain[0].click();
    } else {
      console.log('No search results found, using search button');
      const searchButtonsAgain = await page.$$('button');
      for (const button of searchButtonsAgain) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Search')) {
          await button.click();
          break;
        }
      }
    }
    
    // Wait for weather data to load
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    // Take a screenshot
    await page.screenshot({ path: 'celsius-display.png' });
    console.log('Screenshot saved: celsius-display.png');
    
    // Check temperature format (should include ° without F)
    const tempElementAgain = await page.$('[data-testid="current-temp"]');
    if (!tempElementAgain) {
      throw new Error('Temperature element not found');
    }
    const tempTextAgain = await page.evaluate(el => el.textContent, tempElementAgain);
    console.log(`Temperature displayed: ${tempTextAgain}`);
    
    if (tempTextAgain.includes('°') && !tempTextAgain.includes('°F')) {
      console.log('✅ SUCCESS: Temperature is displayed in Celsius');
    } else {
      console.log('❌ FAILURE: Temperature is not displayed in Celsius');
    }
    
    console.log('\nTest completed successfully!');
    
    // Wait before closing
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    await browser.close();
    
  } catch (error) {
    console.error('Test error:', error);
    await browser.close();
  }
})(); 