const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'debug-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

async function captureScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(screenshotsDir, `${name}-${timestamp}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`Screenshot saved to: ${filePath}`);
  return filePath;
}

// Extract console errors
async function captureConsoleErrors(page) {
  const errorMessages = [];
  
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error') {
      console.error(`Console Error: ${msg.text()}`);
      errorMessages.push(msg.text());
    }
    if (type === 'warning') {
      console.warn(`Console Warning: ${msg.text()}`);
    }
  });
  
  page.on('pageerror', (err) => {
    console.error(`Page Error: ${err.message}`);
    errorMessages.push(err.message);
  });
  
  return errorMessages;
}

async function debugWeatherWebsite() {
  console.log('Starting Puppeteer debugging...');
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 120000 // Increased timeout
  });
  
  try {
    console.log('Browser launched');
    const page = await browser.newPage();
    
    // Set up console logging
    const consoleErrors = [];
    page.on('console', (msg) => {
      const type = msg.type();
      if (type === 'error') {
        const text = msg.text();
        console.error(`Console Error: ${text}`);
        consoleErrors.push(text);
      }
      if (type === 'warning') {
        console.warn(`Console Warning: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', (err) => {
      console.error(`Page Error: ${err.message}`);
      consoleErrors.push(err.message);
    });
    
    // Navigate to the website
    console.log('Navigating to http://localhost:3000...');
    let navigationSuccessful = false;
    try {
      await page.goto('http://localhost:3000', { 
        waitUntil: 'networkidle2', 
        timeout: 60000 // Increased timeout
      });
      console.log('Page loaded successfully');
      navigationSuccessful = true;
    } catch (err) {
      console.error(`Error navigating to page: ${err.message}`);
      // Don't exit - try to continue debugging
      console.log('Attempting to continue debugging despite navigation error');
    }
    
    if (navigationSuccessful) {
      // Pause to check errors
      console.log('Waiting 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Print all collected errors
      console.log('\n--- COLLECTED CONSOLE ERRORS ---');
      if (consoleErrors.length > 0) {
        consoleErrors.forEach((error, index) => {
          console.error(`${index + 1}. ${error}`);
        });
      } else {
        console.log('No console errors detected');
      }
      
      try {
        // Take screenshot whether navigation succeeded or not
        const screenshotPath = await captureScreenshot(page, 'debug-screenshot');
        console.log(`Captured screenshot: ${screenshotPath}`);
      } catch (err) {
        console.error(`Error taking screenshot: ${err.message}`);
      }
      
      // Try to analyze DOM structure
      try {
        const domInfo = await page.evaluate(() => {
          // Check for error elements
          const errorElements = document.querySelectorAll('.error, [class*="error"], [class*="Error"]');
          const visibleErrors = Array.from(errorElements).map(el => el.textContent);
          
          // Check if WeatherForecast exists
          const forecastElement = document.querySelector('[data-testid="forecast-section"]');
          
          // Check React error boundary content
          const errorBoundaries = document.querySelectorAll('[data-reactroot] > div > div');
          const errorBoundaryText = Array.from(errorBoundaries)
            .map(el => el.textContent)
            .filter(text => text && text.includes('Error'));
          
          return {
            url: window.location.href,
            title: document.title,
            bodyText: document.body.innerText.substring(0, 500) + '...',
            visibleErrors,
            hasForecastSection: !!forecastElement,
            errorBoundaryMessages: errorBoundaryText
          };
        });
        
        console.log('\n--- PAGE ANALYSIS ---');
        console.log(JSON.stringify(domInfo, null, 2));
      } catch (err) {
        console.error(`Error analyzing DOM: ${err.message}`);
      }
    } else {
      console.log('Navigation failed, skipping page analysis');
    }
    
    console.log('Puppeteer debugging completed. Press Enter to exit...');
    
    // Keep browser open until user presses Enter
    await new Promise(resolve => {
      process.stdin.once('data', () => {
        console.log('Received input, closing browser...');
        resolve();
      });
    });
  } catch (error) {
    console.error('Puppeteer test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the debug function
debugWeatherWebsite().catch(err => {
  console.error('Fatal error in debug script:', err);
  process.exit(1);
}); 