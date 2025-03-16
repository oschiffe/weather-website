import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Address parameter is required' });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenWeatherMap API key is missing' });
    }
    
    // Using OpenWeatherMap geocoding API
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        address as string
      )}&limit=1&appid=${apiKey}`
    );

    const results = response.data;
    
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    // Format the response to match the structure expected by the client
    const location = results[0];
    const formattedResponse = {
      results: [
        {
          formatted_address: `${location.name}${location.state ? `, ${location.state}` : ''}${location.country ? `, ${location.country}` : ''}`,
          geometry: {
            location: {
              lat: location.lat,
              lng: location.lon
            }
          }
        }
      ],
      status: 'OK'
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    res.status(500).json({ error: 'Failed to fetch geocoding data' });
  }
} 