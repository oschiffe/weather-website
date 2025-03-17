import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { DailyForecast, HourlyForecast } from '../../types/api';

// Helper function to format date
function formatDate(timestamp: number, timezone: number) {
  // Create a date with the correct timezone offset
  const date = new Date((timestamp + timezone) * 1000);
  
  // Get day name
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[date.getUTCDay()];
  
  // Get month and day
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[date.getUTCMonth()];
  const dayNum = date.getUTCDate();
  
  // Format time (for hourly forecasts)
  let hours = date.getUTCHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  return {
    day: dayName,
    date: `${monthName} ${dayNum}`,
    time: `${hours} ${ampm}`
  };
}

// Helper function to determine if it's the first day
function isFirstDay(dt: number, timezone: number, currentTime: number) {
  const forecastDate = new Date((dt + timezone) * 1000);
  const currentDate = new Date((currentTime + timezone) * 1000);
  
  return forecastDate.getUTCDate() === currentDate.getUTCDate();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get latitude and longitude from query parameters
  const { lat, lon, forecast_type = 'daily' } = req.query;
  
  // Validate required parameters
  if (!lat || !lon) {
    console.error('[API] Forecast API missing required lat and lon parameters');
    return res.status(400).json({ error: 'lat and lon parameters are required' });
  }
  
  // Handle MapComponent images issue by checking for forecast_type
  if (forecast_type === 'fix-map') {
    return res.status(200).json({ 
      daily: [], 
      hourly: [],
      message: 'This is a placeholder response to fix the map issue'
    });
  }
  
  try {
    // Get API key from environment variables
    const apiKey = process.env.OPENWEATHER_API_KEY || process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.error('[API] Forecast API key is missing');
      throw new Error('OpenWeather API key not configured');
    }
    
    console.log(`[API] Fetching forecast data for coordinates: lat=${lat}, lon=${lon}, type=${forecast_type}`);
    
    // Get current weather first to get timezone
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    console.log(`[API] Fetching current weather for timezone information: ${currentWeatherUrl}`);
    
    const currentWeatherResponse = await axios.get(currentWeatherUrl);
    
    if (!currentWeatherResponse.data) {
      console.error('[API] Empty response when fetching current weather');
      return res.status(500).json({ error: 'Failed to get timezone information' });
    }
    
    const timezone = currentWeatherResponse.data.timezone; // Timezone offset in seconds
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    
    // Get the forecast data from OpenWeather API
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    console.log(`[API] Proxying forecast request to OpenWeatherMap: ${forecastUrl}`);
    
    const response = await axios.get(forecastUrl);
    
    if (!response.data || !response.data.list) {
      console.error('[API] Invalid or empty forecast data received');
      return res.status(500).json({ error: 'Invalid forecast data received' });
    }
    
    const forecastData = response.data;
    
    if (forecast_type === 'hourly') {
      // Process hourly forecast data
      const hourlyForecast: HourlyForecast[] = forecastData.list
        .slice(0, 8) // Get first 8 entries (24 hours)
        .map((item: any) => {
          const { time } = formatDate(item.dt, timezone);
          return {
            time,
            condition: item.weather[0].main,
            temp: Math.round(item.main.temp),
            precipitation: Math.round(item.pop * 100) // Convert probability to percentage
          };
        });
      
      console.log(`[API] Successfully processed hourly forecast with ${hourlyForecast.length} entries`);
      return res.status(200).json({ hourly: hourlyForecast });
    } else {
      // Process daily forecast data
      // Group forecast by day
      const dailyData: { [key: string]: any[] } = {};
      
      forecastData.list.forEach((item: any) => {
        const date = new Date((item.dt + timezone) * 1000);
        const day = date.toISOString().split('T')[0];
        
        if (!dailyData[day]) {
          dailyData[day] = [];
        }
        
        dailyData[day].push(item);
      });
      
      // Process daily forecast
      const dailyForecast: DailyForecast[] = Object.entries(dailyData)
        .slice(0, 7) // Limit to 7 days
        .map(([date, items], index) => {
          // Get min and max temperature for the day
          const temperatures = items.map((item: any) => item.main.temp);
          const tempMin = Math.min(...temperatures);
          const tempMax = Math.max(...temperatures);
          
          // Get most common weather condition for the day
          const conditionMap: { [key: string]: number } = {};
          items.forEach((item: any) => {
            const condition = item.weather[0].main;
            conditionMap[condition] = (conditionMap[condition] || 0) + 1;
          });
          
          const condition = Object.entries(conditionMap)
            .sort((a, b) => b[1] - a[1])
            .map(([cond]) => cond)[0];
          
          // Get average precipitation probability
          const avgPop = items.reduce((sum: number, item: any) => sum + item.pop, 0) / items.length;
          
          // Format the date
          const firstItem = items[0];
          const dateFormat = formatDate(firstItem.dt, timezone);
          
          // Check if it's today
          const isToday = isFirstDay(firstItem.dt, timezone, currentTime);
          
          return {
            day: isToday ? 'Today' : (index === 1 ? 'Tomorrow' : dateFormat.day),
            date: dateFormat.date,
            condition,
            tempMin: Math.round(tempMin),
            tempMax: Math.round(tempMax),
            precipitation: Math.round(avgPop * 100) // Convert to percentage
          };
        });
      
      console.log(`[API] Successfully processed daily forecast with ${dailyForecast.length} days`);
      return res.status(200).json({ daily: dailyForecast });
    }
  } catch (error) {
    console.error('[API] Error fetching forecast data:', error);
    
    // Check if it's an Axios error with response
    if (axios.isAxiosError(error) && error.response) {
      console.error(`[API] OpenWeatherMap API responded with status ${error.response.status}: ${error.response.statusText}`);
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