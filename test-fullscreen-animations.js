/**
 * Test script for full-screen weather animations
 * Tests all weather types and animation enhancements
 */
const puppeteer = require('puppeteer');
const fs = require('fs');

// Custom timeout function
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

// Test each weather type
async function testWeatherAnimations() {
  console.log('Starting test for full-screen weather animations...');
  
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
  
  const page = await browser.newPage();
  
  try {
    // Create screenshots directory if it doesn't exist
    const screenshotsDir = './screenshots/fullscreen-animations';
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    // List of weather types to test
    const weatherTypes = [
      'clear',
      'partly',
      'cloudy',
      'rain',
      'thunderstorm',
      'snow',
      'fog'
    ];
    
    // Test each weather type
    for (const weatherType of weatherTypes) {
      console.log(`Testing ${weatherType} weather animation...`);
      
      // Navigate to the page with the specific weather type
      await page.goto(`http://localhost:3000/?weather=${weatherType}`, { waitUntil: 'networkidle2' });
      
      // Wait for CSS and animations to load
      await waitForCSSToLoad(page);
      await timeout(2000); // Additional time for animations to begin
      
      // Take screenshot
      await page.screenshot({
        path: `${screenshotsDir}/${weatherType}.png`,
        fullPage: false
      });
      
      console.log(`Screenshot saved for ${weatherType}`);
      
      // Wait before next test
      await timeout(1000);
    }
    
    // Test different intensities for rain
    const intensities = ['low', 'medium', 'high'];
    
    for (const intensity of intensities) {
      console.log(`Testing rain with ${intensity} intensity...`);
      
      // Navigate to the page with specific intensity
      await page.goto(`http://localhost:3000/?weather=rain&intensity=${intensity}`, { waitUntil: 'networkidle2' });
      
      // Wait for CSS and animations to load
      await waitForCSSToLoad(page);
      await timeout(2000);
      
      // Take screenshot
      await page.screenshot({
        path: `${screenshotsDir}/rain-${intensity}.png`,
        fullPage: false
      });
      
      console.log(`Screenshot saved for rain-${intensity}`);
      
      // Wait before next test
      await timeout(1000);
    }
    
    // Test dark mode with rain and snow
    console.log('Testing dark mode animations...');
    
    // Enable dark mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      window.location.href = '/';
    });
    
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await waitForCSSToLoad(page);
    await timeout(2000);
    
    // Take screenshot of dark mode home
    await page.screenshot({
      path: `${screenshotsDir}/dark-mode-clear.png`,
      fullPage: false
    });
    
    // Test dark mode rain
    await page.goto(`http://localhost:3000/?weather=rain`, { waitUntil: 'networkidle2' });
    await waitForCSSToLoad(page);
    await timeout(2000);
    
    await page.screenshot({
      path: `${screenshotsDir}/dark-mode-rain.png`,
      fullPage: false
    });
    
    // Test dark mode snow
    await page.goto(`http://localhost:3000/?weather=snow`, { waitUntil: 'networkidle2' });
    await waitForCSSToLoad(page);
    await timeout(2000);
    
    await page.screenshot({
      path: `${screenshotsDir}/dark-mode-snow.png`,
      fullPage: false
    });
    
    console.log('All animation tests completed successfully!');
    
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await browser.close();
  }
}

// Run tests
testWeatherAnimations().catch(console.error); 