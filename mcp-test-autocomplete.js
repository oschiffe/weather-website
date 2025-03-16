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

const testWeatherAppAutocomplete = async (searchTerm = null) => {
  console.log('Starting MCP Puppeteer test for Autocomplete...');
  
  // Get the search term from command line args or use default
  const searchCity = searchTerm || 'New York';
  
  // Navigate to the website
  await navigate('http://localhost:3000');
  
  console.log('Taking screenshot of initial page...');
  // Take screenshot of initial page
  await screenshot('initial-page-autocomplete');
  
  // Wait for the page to fully load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log(`Filling the search input with "${searchCity}"...`);
  // Find the search input and type the search term
  try {
    await fill('input[type="text"]', searchCity);
    await delay(1500); // Wait for autocomplete to show
  } catch (error) {
    console.error('Error filling search input:', error);
    throw error;
  }
  
  // Wait for the Google Places autocomplete dropdown to appear
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  console.log('Taking screenshot of autocomplete dropdown...');
  // Take screenshot of autocomplete dropdown
  await screenshot(`${searchCity.toLowerCase().replace(/\s+/g, '-')}-autocomplete-dropdown`);
  
  // Click the first suggestion in the autocomplete dropdown using JavaScript
  console.log('Selecting first autocomplete option...');
  await evaluate(`
    const pacItem = document.querySelector('.pac-item');
    if (pacItem) {
      pacItem.click();
    } else {
      console.error('No autocomplete suggestions found');
    }
  `);
  
  // Wait for the weather data to load
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  console.log(`Taking screenshot of ${searchCity} results...`);
  // Take screenshot of search results
  await screenshot(`${searchCity.toLowerCase().replace(/\s+/g, '-')}-results-autocomplete`);
  
  // Success message
  console.log('MCP Puppeteer test for Autocomplete completed successfully!');
  
  // Close browser if running in standalone mode
  if (!isMCP && global.browser) {
    await global.browser.close();
  }
};

// This allows running the script directly or importing it
if (typeof require !== 'undefined' && require.main === module) {
  const searchTerm = process.argv[2] || null;
  testWeatherAppAutocomplete(searchTerm).catch(console.error);
}

module.exports = testWeatherAppAutocomplete;

// Port configuration for all tests: 3000 