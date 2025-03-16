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

  const { lat, lon, originalLocationName } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing' });
  }

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    // Get 5-day/3-hour forecast from OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    
    console.log('Proxying forecast request to OpenWeatherMap:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Create the response data with additional processing
    const forecastData = response.data;
    
    // Process the data to create hourly and daily forecasts
    const hourlyForecast = forecastData.list.slice(0, 24).map((item: any) => {
      const date = new Date(item.dt * 1000);
      const hour = date.getHours();
      const hourLabel = hour === 0 ? '12 AM' : 
                       hour < 12 ? `${hour} AM` : 
                       hour === 12 ? '12 PM' : 
                       `${hour - 12} PM`;
      
      return {
        time: hourLabel,
        temp: item.main.temp,
        condition: item.weather[0].main,
        precipitation: item.pop * 100, // Probability of precipitation (0-1) to percentage
        icon: item.weather[0].icon,
        timestamp: item.dt
      };
    });

    // Create daily forecast by finding min/max temps per day
    const dailyData: { [key: string]: any } = {};
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = {
          date: dateStr,
          day: date.toLocaleDateString('en-US', { weekday: 'long' }),
          dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          tempMax: item.main.temp_max,
          tempMin: item.main.temp_min,
          condition: item.weather[0].main,
          precipitation: item.pop * 100,
          icon: item.weather[0].icon,
          items: [item]
        };
      } else {
        dailyData[dateStr].tempMax = Math.max(dailyData[dateStr].tempMax, item.main.temp_max);
        dailyData[dateStr].tempMin = Math.min(dailyData[dateStr].tempMin, item.main.temp_min);
        dailyData[dateStr].precipitation = Math.max(dailyData[dateStr].precipitation, item.pop * 100);
        dailyData[dateStr].items.push(item);
      }
    });

    // Determine most common weather condition for each day
    Object.keys(dailyData).forEach(dateStr => {
      const conditions: { [condition: string]: number } = {};
      
      dailyData[dateStr].items.forEach((item: any) => {
        const condition = item.weather[0].main;
        conditions[condition] = (conditions[condition] || 0) + 1;
      });
      
      // Find the most frequent condition
      let mostFrequentCondition = '';
      let maxCount = 0;
      
      Object.entries(conditions).forEach(([condition, count]) => {
        if (count > maxCount) {
          mostFrequentCondition = condition;
          maxCount = count as number;
        }
      });
      
      dailyData[dateStr].condition = mostFrequentCondition;
      
      // Clean up the items array to reduce response size
      delete dailyData[dateStr].items;
    });

    // Convert to array and sort by date
    const dailyForecast = Object.values(dailyData)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 7)
      .map((day: any) => ({
        date: day.dateFormatted,
        day: day.day,
        tempMax: day.tempMax,
        tempMin: day.tempMin,
        condition: day.condition,
        precipitation: day.precipitation
      }));

    // Return the processed data
    return res.status(200).json({
      city: {
        name: originalLocationName || forecastData.city.name,
        country: forecastData.city.country,
        timezone: forecastData.city.timezone
      },
      hourly: hourlyForecast,
      daily: dailyForecast,
      raw: forecastData // Include the raw data for debugging if needed
    });
    
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    
    // Check if it's an Axios error with response
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({
        error: `Error from OpenWeatherMap API: ${error.response.statusText}`,
        details: error.response.data
      });
    }
    
    return res.status(500).json({ 
      error: 'Failed to fetch forecast data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 