# Weather Website with BrowserTools MCP Integration

A modern weather application with Google Places autocomplete integration and BrowserTools MCP support for enhanced debugging and testing.

## Features

- Real-time weather data from OpenWeatherMap API
- Location search with Google Places Autocomplete
- Beautiful, responsive UI with glass-morphism effects
- 7-day and hourly weather forecasts
- Integration with BrowserTools MCP for advanced debugging

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env.local` file with your API keys (already set up):
   ```
   OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_google_places_api_key
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The website will be available at http://localhost:8080

## BrowserTools MCP Integration

This project is configured to work with BrowserTools MCP for enhanced debugging and testing capabilities.

### Setup BrowserTools

1. Install the BrowserTools Chrome extension
2. Open Chrome DevTools and navigate to the AgentDeskAI tab
3. Configure the extension to connect to the BrowserTools server:
   - Server Host: localhost
   - Server Port: 8080 (important: use the port parameter when starting the BrowserTools server)

### Running with BrowserTools

1. Start the Cursor IDE with MCP support
2. Start the BrowserTools server with port 8080:
   ```
   npx @agentdeskai/browser-tools-server --port 8080
   ```
3. Start the Next.js server:
   ```
   npm run dev
   ```
4. Visit the website at http://localhost:8080
5. Connect the Chrome extension to capture logs, network requests, and more

## Testing

### Automated Tests

This project includes comprehensive testing using Jest and Puppeteer:

```
npm run test         # Run all Jest tests
npm run test:e2e     # Run end-to-end tests
```

### MCP Test Scripts

For testing with MCP:

```
npm run test:mcp             # Run basic MCP tests
npm run test:autocomplete    # Test autocomplete functionality
npm run test:browsertools    # Test BrowserTools integration
```

### Running All Tests

Use the test-all.sh script to run all tests in sequence:

```
./test-all.sh
```

## Troubleshooting

### Port Conflicts

If port 8080 is already in use, you can change the port in package.json:

```json
"scripts": {
  "dev": "next dev -p 8081",
  "start": "next start -p 8081"
}
```

Remember to update the port in test files as well.

### BrowserTools Connection Issues

If you're having issues connecting to the BrowserTools server:

1. Ensure the BrowserTools server is running
2. Verify the Next.js server is running on port 8080
3. Check Chrome extension connection settings
4. Restart Chrome and the DevTools panel

### Google Places Autocomplete API Issue

The application is currently experiencing an issue with the Google Places API for location autocomplete. The symptoms include:

- The autocomplete dropdown not appearing when typing in the search box
- Console errors related to Google Maps script loading
- Search functionality being limited or unavailable

A fallback solution has been implemented that:

1. Automatically detects when Google Places API fails to load (after 5 seconds)
2. Switches to using the Google Geocoding API which is currently working
3. Provides a simple dropdown interface for selecting locations
4. Falls back to a static list of major cities if both APIs fail

The issue is likely related to:
- API key configuration or restrictions
- Google Places API billing or quota issues
- Cross-origin resource sharing (CORS) policies

To fix this issue permanently:
1. Verify the Google API key has Places API enabled in the Google Cloud Console
2. Check billing status for the Google Cloud project
3. Ensure the API key has proper restrictions (HTTP referrers, IP addresses)
4. Test the API key directly using the Geocoding API endpoint

```bash
# Test the API key with the Geocoding API
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Miami&key=YOUR_API_KEY"

# Test the API key with the Places API
curl "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Miami&key=YOUR_API_KEY"
```

For now, the fallback implementation ensures users can still search for weather data while the Places API issue is being resolved.

## License

ISC