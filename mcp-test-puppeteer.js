/**
 * MCP Puppeteer Test for Weather Website
 * This script tests the website using Puppeteer through the MCP interface
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'mcp-screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

/**
 * Delay function for waiting between actions
 * @param {number} ms - Milliseconds to wait
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function testWeatherWebsite() {
  console.log('🧪 Testing Weather Website with MCP Puppeteer...');
  let browser;
  
  try {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { 
        width: 1280, 
        height: 800 
      }
    });
    
    console.log('✅ Browser launched successfully');
    const page = await browser.newPage();
    console.log('✅ New page created');
    
    // 1. Visit the Weather Website
    console.log('🌐 Navigating to Weather Website...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    console.log('✅ Navigation successful');
    
    // Take screenshot of initial state
    console.log('📸 Taking screenshot of home page...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mcp-home.png'),
      fullPage: true 
    });
    console.log('✅ Home page screenshot saved');
    
    // Wait a moment for any animations to complete
    await delay(1000);
    
    // 2. Search for a city
    console.log('🔍 Testing search functionality...');
    await page.waitForSelector('input[placeholder="Search for a city"]');
    await page.type('input[placeholder="Search for a city"]', 'London');
    
    // Wait for autocomplete dropdown
    await delay(1000);
    
    // Take screenshot of dropdown
    console.log('📸 Taking screenshot of search dropdown...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mcp-search-dropdown.png'),
      fullPage: true 
    });
    
    // Press Enter to search
    await page.keyboard.press('Enter');
    
    // Wait for results to load
    await delay(2000);
    
    // Take screenshot of search results
    console.log('📸 Taking screenshot of search results...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mcp-search-results.png'),
      fullPage: true 
    });
    console.log('✅ Search test completed');
    
    // 3. Test temperature unit toggle
    console.log('🌡️ Testing temperature unit toggle...');
    // Find and click the settings button
    await page.waitForSelector('[data-testid="settings-button"]');
    await page.click('[data-testid="settings-button"]');
    
    // Wait for settings modal to appear
    await delay(1000);
    
    // Take screenshot of settings modal
    console.log('📸 Taking screenshot of settings modal...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mcp-settings-modal.png'),
      fullPage: true 
    });
    
    // Toggle temperature unit to Fahrenheit
    await page.waitForSelector('[data-testid="fahrenheit-toggle"]');
    await page.click('[data-testid="fahrenheit-toggle"]');
    
    // Close settings modal
    await page.waitForSelector('[data-testid="close-settings"]');
    await page.click('[data-testid="close-settings"]');
    
    // Wait for page to update
    await delay(1000);
    
    // Take screenshot with Fahrenheit units
    console.log('📸 Taking screenshot with Fahrenheit units...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mcp-fahrenheit-units.png'),
      fullPage: true 
    });
    console.log('✅ Temperature unit test completed');
    
    // 4. Test forecast view
    console.log('🗓️ Testing forecast view...');
    // Click on forecast tab
    await page.waitForSelector('[data-testid="forecast-tab"]');
    await page.click('[data-testid="forecast-tab"]');
    
    // Wait for forecast to load
    await delay(1000);
    
    // Take screenshot of forecast view
    console.log('📸 Taking screenshot of forecast view...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mcp-forecast-view.png'),
      fullPage: true 
    });
    console.log('✅ Forecast view test completed');
    
    // 5. Test maps view
    console.log('🗺️ Testing maps view...');
    // Click on maps tab
    await page.waitForSelector('[data-testid="maps-tab"]');
    await page.click('[data-testid="maps-tab"]');
    
    // Wait for map to load
    await delay(2000);
    
    // Take screenshot of maps view
    console.log('📸 Taking screenshot of maps view...');
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'mcp-maps-view.png'),
      fullPage: true 
    });
    
    // Test different map layers
    const mapLayers = ['temperature', 'precipitation', 'clouds', 'wind', 'pressure'];
    
    for (const layer of mapLayers) {
      console.log(`🔄 Testing ${layer} map layer...`);
      await page.waitForSelector(`[data-testid="${layer}-layer"]`);
      await page.click(`[data-testid="${layer}-layer"]`);
      
      // Wait for layer to update
      await delay(1000);
      
      // Take screenshot of layer
      console.log(`📸 Taking screenshot of ${layer} layer...`);
      await page.screenshot({ 
        path: path.join(screenshotsDir, `mcp-${layer}-layer.png`),
        fullPage: true 
      });
    }
    
    console.log('✅ Maps view test completed');
    
    console.log('✅ All Weather Website tests completed successfully!');
    console.log(`📁 All screenshots saved to ${screenshotsDir}`);
    
  } catch (error) {
    console.error('❌ Error in Weather Website test:', error);
  } finally {
    if (browser) {
      console.log('🏁 Closing browser');
      await browser.close();
    }
  }
}

// Run the test
testWeatherWebsite().catch(err => {
  console.error('Unhandled error in test execution:', err);
  process.exit(1);
}); 