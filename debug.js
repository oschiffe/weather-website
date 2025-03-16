const puppeteer = require('puppeteer');

async function debugApp() {
  console.log('Starting debug session...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1200, height: 800 },
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  
  const page = await browser.newPage();
  
  // Intercept requests to watch CSS loading
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    console.log(`Request: ${request.resourceType()} - ${request.url()}`);
    request.continue();
  });
  
  page.on('response', async (response) => {
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('text/css')) {
      console.log(`CSS loaded from: ${response.url()}`);
    }
  });
  
  // Capture console logs
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE: ${msg.type().toUpperCase()}: ${msg.text()}`);
  });
  
  // Capture errors
  page.on('pageerror', error => {
    console.error(`BROWSER PAGE ERROR: ${error.message}`);
  });
  
  // Capture request failures
  page.on('requestfailed', request => {
    console.error(`BROWSER REQUEST FAILED: ${request.url()} - ${request.failure().errorText}`);
  });
  
  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: ['networkidle2', 'domcontentloaded', 'load'],
      timeout: 30000 
    });
    console.log('Navigation complete');
    
    // Wait for a while to ensure CSS is fully applied
    console.log('Waiting for CSS to render properly...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png' });
    console.log('Screenshot saved to debug-screenshot.png');
    
  } catch (error) {
    console.error('Error during debugging:', error);
  } finally {
    await browser.close();
    console.log('Debug session ended');
  }
}

debugApp(); 