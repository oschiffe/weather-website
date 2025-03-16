// Simple test script to verify Google Maps & Places API keys
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

console.log('Using Google Places API Key:', PLACES_API_KEY);
console.log('Using Google Maps API Key:', MAPS_API_KEY);

async function testGooglePlacesAPI() {
  console.log('\n==== Testing Places API ====');
  try {
    // Test a simple Places API autocomplete request
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=New%20York&types=(cities)&key=${PLACES_API_KEY}`
    );
    
    console.log('API Response Status:', response.status);
    console.log('API Response Status Code:', response.data.status);
    
    if (response.data.status === 'OK') {
      console.log('✅ Google Places API is working correctly!');
      console.log(`Found ${response.data.predictions.length} predictions`);
      
      // Show first prediction
      if (response.data.predictions.length > 0) {
        console.log('First prediction:', response.data.predictions[0].description);
      }
    } else {
      console.error('❌ Google Places API returned an error:', response.data.status);
      console.error('Error message:', response.data.error_message);
    }
  } catch (error) {
    console.error('❌ Error testing Google Places API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function testGoogleGeocodingAPI() {
  console.log('\n==== Testing Geocoding API ====');
  try {
    // Test a simple Geocoding API request
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=Seattle&key=${MAPS_API_KEY}`
    );
    
    console.log('API Response Status:', response.status);
    console.log('API Response Status Code:', response.data.status);
    
    if (response.data.status === 'OK') {
      console.log('✅ Google Geocoding API is working correctly!');
      console.log(`Found ${response.data.results.length} results`);
      
      // Show first result
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        console.log('First result:', response.data.results[0].formatted_address);
        console.log('Location:', location.lat, location.lng);
      }
    } else {
      console.error('❌ Google Geocoding API returned an error:', response.data.status);
      console.error('Error message:', response.data.error_message);
    }
  } catch (error) {
    console.error('❌ Error testing Google Geocoding API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the tests
async function runTests() {
  await testGooglePlacesAPI();
  await testGoogleGeocodingAPI();
}

runTests(); 