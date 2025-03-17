import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type PlaceDetailsResponse = {
  result?: {
    geometry?: {
      location?: {
        lat: number;
        lng: number;
      }
    },
    formatted_address?: string;
    name?: string;
  };
  status: string;
  error_message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PlaceDetailsResponse | { error: string }>
) {
  const { place_id } = req.query;

  if (!place_id || typeof place_id !== 'string') {
    return res.status(400).json({ 
      status: 'ERROR',
      error_message: 'place_id parameter is required'
    });
  }

  try {
    // Handle geo- prefixed place_ids (from OpenWeatherMap direct results)
    if (place_id.startsWith('geo-')) {
      // Extract lat and lon from the place_id using regex to handle negative coordinates
      // This regex handles decimal numbers with optional negative sign
      const geoMatch = place_id.match(/^geo-(-?\d+\.?\d*)-(-?\d+\.?\d*)$/);
      
      if (geoMatch && geoMatch.length === 3) {
        const lat = geoMatch[1];
        const lon = geoMatch[2];
        
        console.log(`[API] Parsed coordinates from place_id: lat=${lat}, lon=${lon}`);
        
        // Use OpenWeatherMap Reverse Geocoding to get the place name
        const apiKey = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        
        if (!apiKey) {
          console.error('OpenWeatherMap API key is missing');
          return res.status(500).json({
            status: 'ERROR',
            error_message: 'API key configuration error'
          });
        }
        
        try {
          const reverseGeocodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
          console.log(`[API] Reverse geocoding URL: ${reverseGeocodingUrl}`);
          
          const reverseResponse = await axios.get(reverseGeocodingUrl);
          const reverseResults = reverseResponse.data;
          
          if (reverseResults && Array.isArray(reverseResults) && reverseResults.length > 0) {
            const location = reverseResults[0];
            const formattedAddress = [
              location.name,
              location.state,
              location.country
            ].filter(Boolean).join(', ');
            
            return res.status(200).json({
              result: {
                geometry: {
                  location: {
                    lat: parseFloat(lat),
                    lng: parseFloat(lon)
                  }
                },
                formatted_address: formattedAddress,
                name: location.name
              },
              status: 'OK'
            });
          } else {
            console.log(`[API] No results from reverse geocoding for coordinates: ${lat}, ${lon}`);
          }
        } catch (error) {
          console.error('Error with reverse geocoding:', error);
        }
        
        // If we can't get a name or the reverse geocoding fails, just use coordinates
        return res.status(200).json({
          result: {
            geometry: {
              location: {
                lat: parseFloat(lat),
                lng: parseFloat(lon)
              }
            },
            formatted_address: `Location at ${lat}, ${lon}`,
            name: `Location at ${lat}, ${lon}`
          },
          status: 'OK'
        });
      } else {
        console.error(`[API] Failed to parse coordinates from place_id: ${place_id}`);
      }
    }
    
    // If not a geo- prefixed place_id, try to geocode it as a city name
    // Extract a potential city name from the place_id
    let cityName = place_id;
    
    if (cityName) {
      const apiKey = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${apiKey}`;
      
      console.log(`[API] Attempting to geocode place_id "${place_id}" as city name "${cityName}"`);
      const geocodingResponse = await axios.get(geocodingUrl);
      const geocodingResults = geocodingResponse.data;
      
      if (geocodingResults.length > 0) {
        const location = geocodingResults[0];
        const formattedAddress = [
          location.name,
          location.state,
          location.country
        ].filter(Boolean).join(', ');
        
        return res.status(200).json({
          result: {
            geometry: {
              location: {
                lat: location.lat,
                lng: location.lon
              }
            },
            formatted_address: formattedAddress,
            name: location.name
          },
          status: 'OK'
        });
      }
    }
    
    // If all attempts fail, return ZERO_RESULTS
    return res.status(200).json({
      status: 'ZERO_RESULTS'
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    return res.status(500).json({
      status: 'ERROR',
      error_message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
