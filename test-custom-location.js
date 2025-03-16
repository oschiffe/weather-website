// Import Puppeteer for fallback if MCP functions aren't available
const puppeteer = require('puppeteer');

// Helper function for delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Check if running in MCP environment or standalone
const isMCP = typeof mcp_puppeteer_puppeteer_navigate !== 'undefined';

// Create wrapper functions to handle both MCP and direct Puppeteer usage
const navigate = async (url) => {
  if (isMCP) {
    await mcp_puppeteer_puppeteer_navigate({ url });
  } else {
    if (!global.browser) {
      global.browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 800 }
      });
      global.page = await global.browser.newPage();
    }
    await global.page.goto(url, { waitUntil: 'networkidle2' });
  }
};

const screenshot = async (name) => {
  if (isMCP) {
    await mcp_puppeteer_puppeteer_screenshot({ name });
  } else {
    await global.page.screenshot({ path: `${name}.png` });
  }
};

const click = async (selector) => {
  if (isMCP) {
    await mcp_puppeteer_puppeteer_click({ selector });
  } else {
    await global.page.click(selector);
  }
};

const fill = async (selector, value) => {
  if (isMCP) {
    await mcp_puppeteer_puppeteer_fill({ selector, value });
  } else {
    await global.page.type(selector, value);
  }
};

const evaluate = async (script) => {
  if (isMCP) {
    await mcp_puppeteer_puppeteer_evaluate({ script });
  } else {
    await global.page.evaluate(script);
  }
};

const testCustomLocation = async (searchTerm = "Bali, Indonesia") => {
  console.log(`Starting test for custom location: "${searchTerm}"...`);
  
  // Navigate to the website
  await navigate('http://localhost:3000');
  
  console.log('Taking screenshot of initial page...');
  // Take screenshot of initial page
  await screenshot('custom-location-initial');
  
  // Wait for the page to fully load
  await delay(2000);
  
  console.log(`Filling the search input with "${searchTerm}"...`);
  // Find the search input and type the search term
  try {
    await fill('input[type="text"]', searchTerm);
    await delay(1500); // Wait for autocomplete to show
  } catch (error) {
    console.error('Error filling search input:', error);
    throw error;
  }
  
  // Wait for the autocomplete dropdown to appear
  await delay(2000);
  
  console.log('Taking screenshot of autocomplete dropdown...');
  // Take screenshot of autocomplete dropdown
  await screenshot('custom-location-dropdown');
  
  // Check if there's a dropdown item
  const hasDropdownItem = await evaluate(`
    !!document.querySelector('.pac-item')
  `);
  
  if (hasDropdownItem) {
    console.log('Found dropdown item, clicking it...');
    await evaluate(`
      document.querySelector('.pac-item').click();
    `);
  } else {
    console.log('No dropdown item found, clicking search button...');
    try {
      await click('button.flex-shrink-0');
    } catch (e) {
      console.error('Could not click search button:', e);
    }
  }
  
  // Wait for the weather data to load
  await delay(5000);
  
  console.log(`Taking screenshot of ${searchTerm} results...`);
  // Take screenshot of results
  await screenshot('custom-location-results');
  
  console.log('Test completed successfully!');
  
  // Close browser if running in standalone mode
  if (!isMCP && global.browser) {
    await global.browser.close();
  }
};

// This allows running the script directly or importing it
if (typeof require !== 'undefined' && require.main === module) {
  const searchTerm = process.argv[2] || "Bali, Indonesia";
  testCustomLocation(searchTerm).catch(console.error);
}

module.exports = testCustomLocation; 