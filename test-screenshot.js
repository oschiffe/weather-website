const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function takeScreenshots() {
  console.log('Taking screenshots of the Weather App...');
  
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }
  
  // Launch browser with proper arguments for better rendering
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1280,800'
    ],
    defaultViewport: {
      width: 1280,
      height: 800
    }
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable request interception for CSS
    await page.setRequestInterception(true);
    
    // Track CSS loading
    const cssFiles = new Set();
    let cssLoaded = false;
    
    page.on('request', (request) => {
      request.continue();
    });
    
    page.on('response', async (response) => {
      const url = response.url();
      const contentType = response.headers()['content-type'] || '';
      
      if (contentType.includes('text/css') || url.endsWith('.css')) {
        cssFiles.add(url);
        console.log(`CSS loaded from: ${url}`);
      }
    });
    
    // Helper function to wait for CSS to load
    const waitForCSSToLoad = async () => {
      await page.evaluate(() => {
        return new Promise((resolve) => {
          let checkCount = 0;
          const checkCSS = () => {
            const styleSheets = document.styleSheets;
            let allLoaded = true;
            
            for (let i = 0; i < styleSheets.length; i++) {
              try {
                const rules = styleSheets[i].cssRules;
                if (!rules || rules.length === 0) {
                  allLoaded = false;
                  break;
                }
              } catch (e) {
                // Cross-origin stylesheet, can't check rules
                // We'll assume it's loaded after a timeout
                allLoaded = false;
                break;
              }
            }
            
            if (allLoaded || checkCount > 20) {
              resolve();
            } else {
              checkCount++;
              setTimeout(checkCSS, 100);
            }
          };
          
          checkCSS();
        });
      });
    };
    
    // Helper function to wait for a specific time
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    // Add custom styles to disable animations during testing
    await page.addStyleTag({
      content: `
        * {
          animation-duration: 0.001s !important;
          transition-duration: 0.001s !important;
        }
      `
    });
    
    // Take screenshot of home page (light mode)
    console.log('Taking screenshot of home page (light mode)...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await waitForCSSToLoad();
    await wait(1000); // Extra wait for any dynamic content
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'home-light.png'),
      fullPage: true 
    });
    
    // Switch to dark mode
    console.log('Switching to dark mode...');
    await page.evaluate(() => {
      document.querySelector('button[aria-label="Toggle dark mode"]')?.click();
    });
    await wait(1000); // Wait for theme change
    
    // Take screenshot of home page (dark mode)
    console.log('Taking screenshot of home page (dark mode)...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'home-dark.png'),
      fullPage: true 
    });
    
    // Take screenshot of forecast page
    console.log('Taking screenshot of forecast page...');
    await page.goto('http://localhost:3000/forecast', { waitUntil: 'networkidle2' });
    await waitForCSSToLoad();
    await wait(1000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'forecast.png'),
      fullPage: true 
    });
    
    // Take screenshot of maps page
    console.log('Taking screenshot of maps page...');
    await page.goto('http://localhost:3000/maps', { waitUntil: 'networkidle2' });
    await waitForCSSToLoad();
    await wait(1000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'maps.png'),
      fullPage: true 
    });
    
    // Take screenshot of settings page
    console.log('Taking screenshot of settings page...');
    await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle2' });
    await waitForCSSToLoad();
    await wait(1000);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'settings.png'),
      fullPage: true 
    });
    
    console.log('All screenshots taken successfully!');
    console.log(`Screenshots saved to: ${screenshotsDir}`);
    
  } catch (error) {
    console.error('Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshots(); 