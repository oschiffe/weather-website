const puppeteer = require('puppeteer');

// Test configuration
const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;
const TIMEOUT = 10000;

// Custom selectors
const SELECTORS = {
  SEARCH_INPUT: 'input[aria-label="Location search"]',
  SEARCH_BUTTON: 'button[type="submit"]',
  CLEAR_BUTTON: 'button[aria-label="Clear input"]',
  LOCATION_HEADER: 'h1[data-testid="location-name"]',
  TEMPERATURE: '[data-testid="current-temp"]',
  ERROR_MESSAGE: '.text-red-500',
  WEATHER_CONDITION: '[data-testid="weather-condition"]',
  FORECAST_SECTION: '[data-testid="forecast-section"]',
};

describe('Weather App End-to-End Tests', () => {
  let browser;
  let page;

  // Setup browser before tests
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  // Clean up after tests
  afterAll(async () => {
    await browser.close();
  });

  // Setup new page before each test
  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setDefaultTimeout(TIMEOUT);
    
    // Navigate to application
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
  });

  // Close page after each test
  afterEach(async () => {
    await page.close();
  });

  // Test cases
  test('Page loads with default weather data', async () => {
    // Check if the page loaded with default weather data
    await page.waitForSelector(SELECTORS.LOCATION_HEADER);
    await page.waitForSelector(SELECTORS.TEMPERATURE);
    
    // Verify basic elements are present
    const locationExists = await page.$(SELECTORS.LOCATION_HEADER);
    const temperatureExists = await page.$(SELECTORS.TEMPERATURE);
    const forecastExists = await page.$(SELECTORS.FORECAST_SECTION);
    
    expect(locationExists).toBeTruthy();
    expect(temperatureExists).toBeTruthy();
    expect(forecastExists).toBeTruthy();
  });

  test('Searching for a valid location works', async () => {
    // Wait for search input to be available
    await page.waitForSelector(SELECTORS.SEARCH_INPUT);
    
    // Type in a city name
    await page.type(SELECTORS.SEARCH_INPUT, 'Tokyo');
    
    // Wait for autocomplete to appear (if applicable)
    await page.waitForTimeout(2000);
    
    // Click the first autocomplete result using JavaScript
    await page.evaluate(() => {
      const pacItem = document.querySelector('.pac-item');
      if (pacItem) pacItem.click();
    });
    
    // Wait for the data to update
    await page.waitForTimeout(3000);
    
    // Check if the page updated with Tokyo data
    const locationText = await page.$eval(SELECTORS.LOCATION_HEADER, el => el.textContent);
    expect(locationText).toContain('Tokyo');
  });

  test('Clearing the search input works', async () => {
    // Type something in the search input
    await page.waitForSelector(SELECTORS.SEARCH_INPUT);
    await page.type(SELECTORS.SEARCH_INPUT, 'Test');
    
    // Verify text is entered
    const inputValue = await page.$eval(SELECTORS.SEARCH_INPUT, el => el.value);
    expect(inputValue).toBe('Test');
    
    // Click clear button
    await page.waitForSelector(SELECTORS.CLEAR_BUTTON);
    await page.click(SELECTORS.CLEAR_BUTTON);
    
    // Verify input is cleared
    const clearedValue = await page.$eval(SELECTORS.SEARCH_INPUT, el => el.value);
    expect(clearedValue).toBe('');
  });

  test('Handling invalid location search', async () => {
    // Enter invalid location
    await page.waitForSelector(SELECTORS.SEARCH_INPUT);
    await page.type(SELECTORS.SEARCH_INPUT, 'XYZABCNONEXISTENT');
    
    // Submit search directly (bypassing autocomplete)
    await page.click(SELECTORS.SEARCH_BUTTON);
    
    // Wait for error message
    try {
      await page.waitForSelector(SELECTORS.ERROR_MESSAGE, { timeout: 5000 });
      const errorText = await page.$eval(SELECTORS.ERROR_MESSAGE, el => el.textContent);
      expect(errorText).toContain('Location not found');
    } catch (e) {
      // If no error message appears, the test should fail
      expect(false).toBe(true);
    }
  });

  test('Searching with special characters doesn\'t crash the app', async () => {
    // Enter special characters
    await page.waitForSelector(SELECTORS.SEARCH_INPUT);
    await page.type(SELECTORS.SEARCH_INPUT, '!@#$%^&*()');
    
    // Submit search
    await page.click(SELECTORS.SEARCH_BUTTON);
    
    // Wait for possible error message or just verify the app is still responsive
    await page.waitForTimeout(2000);
    
    // Verify app is still responsive by checking for a core element
    const locationHeaderExists = await page.$(SELECTORS.LOCATION_HEADER);
    expect(locationHeaderExists).toBeTruthy();
  });
});