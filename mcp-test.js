const testWeatherApp = async () => {
  console.log('Starting MCP Puppeteer test...');
  
  // Navigate to the website
  await mcp_puppeteer_puppeteer_navigate({
    url: 'http://localhost:8080'
  });
  
  // Take screenshot of initial page
  await mcp_puppeteer_puppeteer_screenshot({
    name: 'initial-page-mcp'
  });
  
  // Fill the search input with 'Miami'
  await mcp_puppeteer_puppeteer_fill({
    selector: 'input[placeholder="Enter city name, zipcode, etc."]',
    value: 'Miami'
  });
  
  // Click the search button
  await mcp_puppeteer_puppeteer_click({
    selector: 'button[type="submit"]'
  });
  
  // Wait 3 seconds for data to load
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Take screenshot of results
  await mcp_puppeteer_puppeteer_screenshot({
    name: 'miami-results-mcp'
  });
  
  // Try another search with 'New York'
  // First, clear the input using JavaScript
  await mcp_puppeteer_puppeteer_evaluate({
    script: "document.querySelector('input[placeholder=\"Enter city name, zipcode, etc.\"]').value = '';"
  });
  
  // Fill with the new search term
  await mcp_puppeteer_puppeteer_fill({
    selector: 'input[placeholder="Enter city name, zipcode, etc."]',
    value: 'New York'
  });
  
  // Click the search button again
  await mcp_puppeteer_puppeteer_click({
    selector: 'button[type="submit"]'
  });
  
  // Wait again for data to load
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Take final screenshot
  await mcp_puppeteer_puppeteer_screenshot({
    name: 'newyork-results-mcp'
  });
  
  console.log('MCP Puppeteer test completed successfully!');
};

/**
 * Test the fallback autocomplete implementation that uses Geocoding API
 */
const testFallbackAutocomplete = async () => {
  console.log('Testing fallback autocomplete implementation...');
  
  try {
    // Navigate to the website
    await mcp_puppeteer_puppeteer_navigate({
      url: 'http://localhost:8080'
    });
    
    // Wait for 6 seconds to ensure fallback is activated (fallback timeout is 5s)
    console.log('Waiting for fallback to activate...');
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    // Take a screenshot of the initial state
    await mcp_puppeteer_puppeteer_screenshot({
      name: 'fallback-initial'
    });
    
    // Fill the search input with 'New'
    await mcp_puppeteer_puppeteer_fill({
      selector: 'input[aria-label="Location search"]',
      value: 'New'
    });
    
    // Wait for dropdown to appear
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot of dropdown
    await mcp_puppeteer_puppeteer_screenshot({
      name: 'fallback-dropdown'
    });
    
    // Click on the first result (should be New York)
    await mcp_puppeteer_puppeteer_click({
      selector: '.absolute.z-10 div:first-child'
    });
    
    // Wait for weather data to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take screenshot of weather data
    await mcp_puppeteer_puppeteer_screenshot({
      name: 'fallback-weather-result'
    });
    
    console.log('Fallback autocomplete test completed successfully');
    return true;
  } catch (error) {
    console.error('Error testing fallback autocomplete:', error);
    return false;
  }
};

// Export functions
module.exports = {
  testWeatherApp,
  testFallbackAutocomplete
};

// If running this file directly, run the tests
if (require.main === module) {
  (async () => {
    try {
      // Add the fallback test
      await testFallbackAutocomplete();
      
      console.log('All tests completed');
    } catch (error) {
      console.error('Error running tests:', error);
    }
  })();
}

// Port configuration for all tests: 8080 