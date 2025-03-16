const puppeteer = require('puppeteer');
const axios = require('axios');

(async () => {
  console.log('Testing temperature data accuracy for 98660...');
  
  // First, query the OpenWeatherMap API directly for current weather in 98660
  try {
    const response = await axios.get(
      'http://localhost:3000/api/weather?q=98660'
    );
    
    console.log('Weather API Response:', JSON.stringify(response.data, null, 2));
    
    // Extract temperature values
    const tempCelsius = response.data.main.temp;
    const tempFahrenheit = (tempCelsius * 9/5) + 32;
    
    console.log(`Temperature from API (Celsius): ${tempCelsius}°C`);
    console.log(`Temperature from API (Fahrenheit): ${tempFahrenheit}°F`);
    
    // Now check how the UI displays this
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 800 }
    });
    
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Search for 98660
    await page.waitForSelector('input[name="location"]');
    await page.click('input[name="location"]');
    await page.type('input[name="location"]', '98660');
    
    // Wait for dropdown and select first result
    await page.waitForSelector('.absolute.z-50 .cursor-pointer', { visible: true, timeout: 5000 })
      .catch(() => console.log('Dropdown not visible or not found'));
    
    // Select first result
    await page.click('.absolute.z-50 .cursor-pointer');
    
    // Wait for the temperature display
    await page.waitForFunction(
      () => document.querySelector('.text-6xl') !== null,
      { timeout: 10000 }
    ).catch(() => console.log('Temperature element not found'));
    
    // Capture displayed temperature
    const displayedTemp = await page.evaluate(() => {
      const tempElement = document.querySelector('.text-6xl');
      return tempElement ? tempElement.textContent.trim() : 'Not found';
    });
    
    console.log(`Displayed temperature: ${displayedTemp}`);
    
    // Take a screenshot
    await page.screenshot({ path: 'temperature-test.png' });
    
    // Check settings to see current temperature unit
    await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle2' });
    
    const temperatureUnit = await page.evaluate(() => {
      const fahrenheitButton = document.querySelector('button:contains("Fahrenheit")');
      const celsiusButton = document.querySelector('button:contains("Celsius")');
      
      if (fahrenheitButton && fahrenheitButton.classList.contains('bg-primary')) {
        return 'fahrenheit';
      } else if (celsiusButton && celsiusButton.classList.contains('bg-primary')) {
        return 'celsius';
      } else {
        return 'unknown';
      }
    });
    
    console.log(`Current temperature unit setting: ${temperatureUnit}`);
    
    await browser.close();
    
  } catch (error) {
    console.error('Error during testing:', error);
  }
})(); 