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
    
    // Always check for mock data first for better performance
    const mockPredictions = getMockPredictions(input);
    
    // Make request to OpenWeatherMap Geocoding API if mock data doesn't provide results
    if (mockPredictions.length === 0) {
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
        
        return {
          place_id: `geo-${result.lat}-${result.lon}`,
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
    } else {
      console.log(`[API] Using mock data for query "${input}"`);
      const mockPredictions = getMockPredictions(input as string);
      
      return res.status(200).json({
        predictions: mockPredictions,
        status: 'OK'
      });
    }
  } catch (error) {
    console.error('Error fetching places:', error);
    return res.status(500).json({
      predictions: [],
      status: 'ERROR',
      error_message: 'An error occurred while fetching places.'
    });
  }
}

// Provide mock data for common cities to use when API key has issues
function getMockPredictions(input: string): any[] {
  input = input.toLowerCase().trim();
  
  const commonCities = [
    {
      place_id: 'mock-newyork',
      description: 'New York, NY, USA',
      structured_formatting: {
        main_text: 'New York',
        secondary_text: 'NY, USA'
      }
    },
    {
      place_id: 'mock-london',
      description: 'London, UK',
      structured_formatting: {
        main_text: 'London',
        secondary_text: 'UK'
      }
    },
    {
      place_id: 'mock-seattle',
      description: 'Seattle, WA, USA',
      structured_formatting: {
        main_text: 'Seattle',
        secondary_text: 'WA, USA'
      }
    },
    {
      place_id: 'mock-chicago',
      description: 'Chicago, IL, USA',
      structured_formatting: {
        main_text: 'Chicago',
        secondary_text: 'IL, USA'
      }
    },
    {
      place_id: 'mock-miami',
      description: 'Miami, FL, USA',
      structured_formatting: {
        main_text: 'Miami',
        secondary_text: 'FL, USA'
      }
    },
    {
      place_id: 'mock-tokyo',
      description: 'Tokyo, Japan',
      structured_formatting: {
        main_text: 'Tokyo',
        secondary_text: 'Japan'
      }
    },
    {
      place_id: 'mock-paris',
      description: 'Paris, France',
      structured_formatting: {
        main_text: 'Paris',
        secondary_text: 'France'
      }
    },
    // New cities added
    {
      place_id: 'mock-helsinki',
      description: 'Helsinki, Finland',
      structured_formatting: {
        main_text: 'Helsinki',
        secondary_text: 'Finland'
      }
    },
    {
      place_id: 'mock-berlin',
      description: 'Berlin, Germany',
      structured_formatting: {
        main_text: 'Berlin',
        secondary_text: 'Germany'
      }
    },
    {
      place_id: 'mock-sydney',
      description: 'Sydney, Australia',
      structured_formatting: {
        main_text: 'Sydney',
        secondary_text: 'Australia'
      }
    },
    {
      place_id: 'mock-toronto',
      description: 'Toronto, Canada',
      structured_formatting: {
        main_text: 'Toronto',
        secondary_text: 'Canada'
      }
    },
    {
      place_id: 'mock-vancouver',
      description: 'Vancouver, Canada',
      structured_formatting: {
        main_text: 'Vancouver',
        secondary_text: 'Canada'
      }
    },
    {
      place_id: 'mock-sanfrancisco',
      description: 'San Francisco, CA, USA',
      structured_formatting: {
        main_text: 'San Francisco',
        secondary_text: 'CA, USA'
      }
    },
    {
      place_id: 'mock-losangeles',
      description: 'Los Angeles, CA, USA',
      structured_formatting: {
        main_text: 'Los Angeles',
        secondary_text: 'CA, USA'
      }
    },
    {
      place_id: 'mock-lasvegas',
      description: 'Las Vegas, NV, USA',
      structured_formatting: {
        main_text: 'Las Vegas',
        secondary_text: 'NV, USA'
      }
    },
    {
      place_id: 'mock-barcelona',
      description: 'Barcelona, Spain',
      structured_formatting: {
        main_text: 'Barcelona',
        secondary_text: 'Spain'
      }
    },
    {
      place_id: 'mock-amsterdam',
      description: 'Amsterdam, Netherlands',
      structured_formatting: {
        main_text: 'Amsterdam',
        secondary_text: 'Netherlands'
      }
    },
    {
      place_id: 'mock-rome',
      description: 'Rome, Italy',
      structured_formatting: {
        main_text: 'Rome',
        secondary_text: 'Italy'
      }
    }
  ];
  
  // First, look for exact matches or cities that start with the input
  const exactMatches = commonCities.filter(city => {
    const mainText = city.structured_formatting.main_text.toLowerCase();
    return mainText === input || mainText.startsWith(input);
  });
  
  // If we have exact matches, prioritize them
  if (exactMatches.length > 0) {
    return exactMatches.slice(0, 3); // Return max 3 results
  }
  
  // Otherwise, look for partial matches anywhere in the name or description
  const partialMatches = commonCities.filter(city => {
    const mainText = city.structured_formatting.main_text.toLowerCase();
    const secondaryText = city.structured_formatting.secondary_text.toLowerCase();
    const fullText = city.description.toLowerCase();
    
    return mainText.includes(input) || secondaryText.includes(input) || fullText.includes(input);
  });
  
  // Sort by relevance (prioritize matches at the beginning of the name)
  partialMatches.sort((a, b) => {
    const aMainText = a.structured_formatting.main_text.toLowerCase();
    const bMainText = b.structured_formatting.main_text.toLowerCase();
    
    // If one starts with the input and the other doesn't, prioritize the one that does
    if (aMainText.startsWith(input) && !bMainText.startsWith(input)) return -1;
    if (!aMainText.startsWith(input) && bMainText.startsWith(input)) return 1;
    
    // Otherwise sort alphabetically
    return aMainText.localeCompare(bMainText);
  });
  
  return partialMatches.slice(0, 3); // Return max 3 results
}

