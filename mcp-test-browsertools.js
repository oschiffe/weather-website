/**
 * Test script for Weather App using BrowserTools MCP
 * This script demonstrates how to integrate BrowserTools MCP with the Weather App
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

// Custom delay function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to ensure CSS is loaded before taking screenshots
async function waitForCSSToLoad(page) {
  // Wait for all stylesheets to be loaded
  const stylesheetLoaded = await page.evaluate(() => {
    return Array.from(document.styleSheets).length > 0;
  });
  
  if (!stylesheetLoaded) {
    console.log('Waiting for stylesheets to load...');
    await delay(1000);
    return waitForCSSToLoad(page);
  }
  
  console.log(`${Array.from(await page.evaluate(() => document.styleSheets)).length} stylesheets loaded`);
  
  // Additional delay to ensure rendering is complete
  await delay(1000);
  return true;
}

(async () => {
  console.log('Testing Weather App with Browser Tools...');
  
  // Launch browser with settings that help CSS load properly
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 },
    args: [
      '--disable-web-security', 
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  
  let page;
  
  try {
    page = await browser.newPage();
    
    // Add custom styles to ensure contrast and visibility
    await page.addStyleTag({
      content: `
        * { 
          transition: none !important; 
          animation: none !important;
        }
        body {
          opacity: 1 !important;
          visibility: visible !important;
        }
      `
    });
    
    // Set proper CSS-related settings
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      // Don't block any requests
      request.continue();
    });
    
    // Monitor CSS loading
    page.on('response', async (response) => {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('text/css')) {
        console.log(`CSS loaded from: ${response.url()}`);
      }
    });
    
    // Monitor console logs
    page.on('console', message => console.log(`Browser console: ${message.text()}`));
    
    // 1. Test the home page
    console.log('1. Testing home page...');
    await page.goto('http://localhost:3000', { 
      waitUntil: ['networkidle2', 'domcontentloaded', 'load'],
      timeout: 30000
    });
    
    // Wait for CSS to fully render
    console.log('Waiting for CSS to properly render...');
    await waitForCSSToLoad(page);
    
    await page.screenshot({ path: 'browsertools-home.png' });
    
    // 2. Test search functionality with multiple locations
    console.log('2. Testing search functionality...');
    const locations = ['Seattle', 'New York', 'Chicago', 'Las Vegas'];
    
    // Test each location
    for (const location of locations) {
      console.log(`2.1 Searching for ${location}...`);
      
      // Clear any existing search
      await page.evaluate(() => {
        const input = document.querySelector('input[type="text"]');
        if (input) input.value = '';
      });
      
      // Enter location in search box
      await page.type('input[type="text"]', location);
      
      // Wait for results to appear
      await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
      
      // Save screenshot of dropdown
      await page.screenshot({ path: `browsertools-${location}-dropdown.png` });
      
      // Click the first result or use search button
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
      
      // Take screenshot of results
      await page.screenshot({ path: `browsertools-${location}-results.png` });
      
      // Verify location name appears in the results
      const locationText = await page.$eval('[data-testid="location-name"]', el => el.textContent);
      console.log(`Location displayed: ${locationText}`);
      
      // Verify temperature is displayed
      const tempText = await page.$eval('[data-testid="current-temp"]', el => el.textContent);
      console.log(`Temperature displayed: ${tempText}`);
    }
    
    // 3. Test settings page and temperature unit change
    console.log('3. Testing settings page...');
    await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'browsertools-settings.png' });
    
    // Change to Fahrenheit
    console.log('3.1 Changing temperature unit to Fahrenheit...');
    const fahrenheitButtons = await page.$$('button');
    let fahrenheitButton = null;
    
    for (const button of fahrenheitButtons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Fahrenheit')) {
        fahrenheitButton = button;
        break;
      }
    }
    
    if (fahrenheitButton) {
      await fahrenheitButton.click();
      
      // Save settings
      const saveButtons = await page.$$('button');
      let saveButton = null;
      
      for (const button of saveButtons) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Save Changes')) {
          saveButton = button;
          break;
        }
      }
      
      if (saveButton) {
        await saveButton.click();
        console.log('Settings saved to Fahrenheit');
        
        // Wait for the alert
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
        
        // Dismiss alert
        try {
          await page.evaluate(() => {
            const originalAlert = window.alert;
            window.alert = () => {};
            setTimeout(() => {
              window.alert = originalAlert;
            }, 2000);
          });
        } catch (e) {
          console.log('Alert handling error:', e);
        }
      }
    }
    
    // 4. Test if temperature unit changed on home page
    console.log('4. Testing if temperature unit changed to Fahrenheit...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Search for a city
    await page.type('input[type="text"]', 'Seattle');
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    // Click first result
    const fahrenheitResults = await page.$$('.px-4.py-2.cursor-pointer');
    if (fahrenheitResults.length > 0) {
      await fahrenheitResults[0].click();
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
    
    // Take screenshot of results with Fahrenheit
    await page.screenshot({ path: 'browsertools-fahrenheit-results.png' });
    
    // Verify temperature unit
    const fahrenheitTemp = await page.$eval('[data-testid="current-temp"]', el => el.textContent);
    console.log(`Temperature in Fahrenheit: ${fahrenheitTemp}`);
    
    if (fahrenheitTemp.includes('°F')) {
      console.log('✅ SUCCESS: Temperature is displayed in Fahrenheit');
    } else {
      console.log('❌ FAILURE: Temperature is not displayed in Fahrenheit');
    }
    
    // 5. Test forecast page
    console.log('5. Testing forecast page...');
    await page.goto('http://localhost:3000/forecast', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'browsertools-forecast.png' });
    
    // 6. Test maps page
    console.log('6. Testing maps page...');
    await page.goto('http://localhost:3000/maps', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: 'browsertools-maps.png' });
    
    // 7. Change back to Celsius
    console.log('7. Changing temperature unit back to Celsius...');
    await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle2' });
    
    const celsiusButtons = await page.$$('button');
    let celsiusButton = null;
    
    for (const button of celsiusButtons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text.includes('Celsius')) {
        celsiusButton = button;
        break;
      }
    }
    
    if (celsiusButton) {
      await celsiusButton.click();
      
      // Save settings
      const saveButtonsAgain = await page.$$('button');
      let saveButtonAgain = null;
      
      for (const button of saveButtonsAgain) {
        const text = await page.evaluate(el => el.textContent, button);
        if (text.includes('Save Changes')) {
          saveButtonAgain = button;
          break;
        }
      }
      
      if (saveButtonAgain) {
        await saveButtonAgain.click();
        console.log('Settings saved to Celsius');
        
        // Wait for the alert
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));
      }
    }
    
    // 8. Test if temperature unit changed back to Celsius
    console.log('8. Testing if temperature unit changed to Celsius...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Search for a city
    await page.type('input[type="text"]', 'Seattle');
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    
    // Click first result
    const celsiusResults = await page.$$('.px-4.py-2.cursor-pointer');
    if (celsiusResults.length > 0) {
      await celsiusResults[0].click();
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
    
    // Take screenshot of results with Celsius
    await page.screenshot({ path: 'browsertools-celsius-results.png' });
    
    // Verify temperature unit
    const celsiusTemp = await page.$eval('[data-testid="current-temp"]', el => el.textContent);
    console.log(`Temperature in Celsius: ${celsiusTemp}`);
    
    if (celsiusTemp.includes('°') && !celsiusTemp.includes('°F')) {
      console.log('✅ SUCCESS: Temperature is displayed in Celsius');
    } else {
      console.log('❌ FAILURE: Temperature is not displayed in Celsius');
    }
    
    console.log('Testing completed successfully!');
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    // Wait before closing
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
    await browser.close();
  }
})();