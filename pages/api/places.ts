import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type PlacesResponse = {
  predictions: any[];
  status: string;
  error_message?: string;
};

type OpenWeatherGeocodingResult = {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlacesResponse | { error: string }>
) {
  const { input } = req.query;

  if (!input || typeof input !== 'string') {
    return res.status(400).json({ 
      predictions: [],
      status: 'ERROR',
      error_message: 'Input parameter is required'
    });
  }

  try {
    // Use the OpenWeather API key
    const apiKey = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.error('OpenWeatherMap API key is missing');
      return res.status(500).json({ 
        predictions: [],
        status: 'ERROR',
        error_message: 'API key configuration error'
      });
    }

    console.log(`[API] Fetching places for query: "${input}"`);
    
    // OpenWeatherMap Geocoding API
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(input)}&limit=5&appid=${apiKey}`
    );

    const geoResults: OpenWeatherGeocodingResult[] = response.data;
    
    // Format the results to match the structure our app expects
    const predictions = geoResults.map(result => {
      const secondaryText = [
        result.state,
        result.country
      ].filter(Boolean).join(', ');
      
      // Create a consistent place_id format that works with negative coordinates
      const placeId = `geo-${result.lat}-${result.lon}`;
      
      console.log(`[API] Created place_id: ${placeId} for location: ${result.name}`);
      
      return {
        place_id: placeId,
        description: `${result.name}${secondaryText ? `, ${secondaryText}` : ''}`,
        structured_formatting: {
          main_text: result.name,
          secondary_text: secondaryText
        },
        geometry: {
          location: {
            lat: result.lat,
            lng: result.lon
          }
        }
      };
    });
    
    console.log(`[API] OpenWeatherMap Geocoding API found ${predictions.length} results`);
    
    // Return places API response
    return res.status(200).json({
      predictions: predictions,
      status: 'OK'
    });
  } catch (error) {
    console.error('Error fetching places:', error);
    return res.status(500).json({
      predictions: [],
      status: 'ERROR',
      error_message: 'An error occurred while fetching places.'
    });
  }
}

