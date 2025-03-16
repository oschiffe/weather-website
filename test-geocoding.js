// Test script to verify the Geocoding API works with different cities
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
console.log('Using Google Maps API Key:', API_KEY);

// Cities to test
const testCities = [
  'Seattle',
  'New York',
  'London',
  'Tokyo',
  'Vancouver',
  'Paris',
  'Dubai'
];

async function testGeocodingAPI(city) {
  console.log(`\n==== Testing Geocoding for "${city}" ====`);
  try {
    // Test a simple Geocoding API request
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${API_KEY}`
    );
    
    if (response.data.status === 'OK') {
      console.log('✅ Geocoding successful!');
      
      // Show results
      if (response.data.results.length > 0) {
        const result = response.data.results[0];
        const location = result.geometry.location;
        console.log('  - Full address:', result.formatted_address);
        console.log('  - Location:', location.lat, location.lng);
        
        // Show address components
        if (result.address_components) {
          console.log('  - Components:');
          result.address_components.forEach(component => {
            console.log(`    • ${component.long_name} (${component.types.join(', ')})`);
          });
        }
      } else {
        console.log('No results found');
      }
    } else {
      console.error('❌ Geocoding failed:', response.data.status);
      console.error('Error message:', response.data.error_message || 'No error message provided');
    }
  } catch (error) {
    console.error('❌ Error testing Geocoding API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run all the tests
async function runTests() {
  for (const city of testCities) {
    await testGeocodingAPI(city);
  }
  console.log('\nAll geocoding tests completed!');
}

// Run the tests
runTests(); 