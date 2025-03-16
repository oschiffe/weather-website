import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { lat, lon, q, originalLocationName } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing' });
  }

  try {
    let url = 'https://api.openweathermap.org/data/2.5/weather?';
    
    // Build the URL based on provided parameters
    if (lat && lon) {
      url += `lat=${lat}&lon=${lon}`;
    } else if (q) {
      url += `q=${q}`;
    } else {
      return res.status(400).json({ error: 'Missing required parameters: lat & lon or q' });
    }
    
    // Add common parameters
    url += `&units=metric&appid=${apiKey}`;
    
    console.log('Proxying request to OpenWeatherMap:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Create the response data with potential overrides
    const responseData = {
      ...response.data,
    };
    
    // Override the city name if originalLocationName is provided
    if (originalLocationName && typeof originalLocationName === 'string') {
      console.log(`Using original location name: ${originalLocationName} instead of: ${response.data.name}`);
      
      // Store the original city name from API for reference
      responseData.actualLocationFromApi = response.data.name;
      
      // Override the city name with the one the user searched for
      responseData.name = originalLocationName;
    }
    
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    
    // Check if it's an Axios error with response
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({
        error: `Error from OpenWeatherMap API: ${error.response.statusText}`,
        details: error.response.data
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 