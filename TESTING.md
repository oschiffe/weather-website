# Testing the Weather Website with Google Places Autocomplete

This guide will help you test the new Google Places Autocomplete functionality in the Weather Website.

## Running the website

1. Start the Next.js development server with the following command:
   ```bash
   npm run dev -- -H 0.0.0.0
   ```

2. The server should start and be available at:
   - Local: http://localhost:3001 (or http://localhost:3000 if port 3001 isn't in use)
   - Network: http://YOUR_IP_ADDRESS:3001 (or :3000)

## Testing the Google Places Autocomplete

1. **Basic Search Test**:
   - In the search bar, start typing a city name (e.g., "New York", "London", "Tokyo")
   - You should see autocomplete suggestions appear below the search field
   - Select one of the suggestions
   - The weather information should update for the selected location

2. **Address Test**:
   - Try entering a full address (e.g., "1600 Pennsylvania Avenue, Washington DC")
   - Select one of the autocomplete suggestions
   - Verify the weather information updates for that location

3. **Zip Code Test**:
   - Try entering a zip/postal code (e.g., "90210", "10001")
   - Select one of the suggestions that appear
   - Verify the weather information updates for that location

4. **Edge Cases**:
   - Try entering special characters or very short inputs
   - Try entering a non-existent location
   - Test the clear button (X) to ensure it clears the input field

## What to Look For

- **Autocomplete Dropdown**: Should appear as you type (after 2+ characters)
- **Selection**: When you select a location, the weather should update
- **Clear Button**: Should clear the input field
- **Error Handling**: Should display appropriate error messages if location not found

## Troubleshooting

If the autocomplete doesn't work:
1. Check the browser console for errors
2. Verify the Google Places API key is correct in `.env.local` and `next.config.js`
3. Ensure you're connected to the internet
4. Try restarting the server

## Autocomplete Search Testing

### Testing the Fallback Implementation

Due to current issues with the Google Places API, a fallback implementation has been added. The fallback uses the Google Geocoding API and a static list of cities as a backup.

To test the fallback:

1. Open the application in a browser
2. The fallback should automatically activate after 5 seconds if the Google Places API doesn't load
3. Type at least 3 characters in the search box (e.g., "Mia" for Miami)
4. A dropdown should appear with suggestions from either:
   - Google Geocoding API results (if working)
   - The static fallback city list
5. Select a city from the dropdown
6. Verify that weather information loads for the selected location

### Testing with Puppeteer

The fallback implementation can be tested with Puppeteer by running:

```bash
node mcp-test-browsertools.js
```

This script will:
- Navigate to the weather application
- Enter text in the search box
- Wait for and test the autocomplete dropdown
- Select a city and verify weather data is displayed

### Testing with Browser Tools MCP

Browser Tools MCP can be used to:
- Capture network requests to Google APIs
- Monitor console logs for API errors
- Inspect the DOM for proper rendering of the autocomplete dropdown

Example debugging approach:
1. Start Browser Tools MCP
2. Open the weather application
3. Use the Console capturing tool to check for API-related errors
4. Use Network request capturing to verify API calls are being made correctly 