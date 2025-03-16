import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';
import WeatherIcon from './WeatherIcon';
import Card from './Card';

interface WeatherData {
  name: string;
  country: string;
  condition: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  pressure: number;
  visibility: number;
}

interface CurrentWeatherProps {
  data: WeatherData | null;
  isLoading?: boolean;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, isLoading = false }) => {
  const { temperatureUnit, windSpeedUnit, convertTemperature, convertWindSpeed } = useSettings();
  
  // Map OpenWeatherMap condition to our icon type
  const getIconForCondition = (condition: string): 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'snow' | 'thunderstorm' | 'fog' | 'unknown' => {
    if (!condition) return 'unknown';
    
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sun')) {
      return 'clear';
    } else if (conditionLower.includes('few clouds') || conditionLower.includes('scattered clouds')) {
      return 'partly-cloudy';
    } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
      return 'cloudy';
    } else if (conditionLower.includes('drizzle') || conditionLower.includes('rain')) {
      return 'rain';
    } else if (conditionLower.includes('snow')) {
      return 'snow';
    } else if (conditionLower.includes('thunder')) {
      return 'thunderstorm';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) {
      return 'fog';
    }
    return 'unknown';
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full h-64 animate-pulse p-4">
        <div className="h-8 bg-gray-200 rounded-md w-40 mb-4"></div>
        <div className="flex">
          <div className="h-32 w-32 bg-gray-200 rounded-md"></div>
          <div className="ml-4 flex-1">
            <div className="h-8 bg-gray-200 rounded-md mb-2 w-24"></div>
            <div className="h-6 bg-gray-200 rounded-md mb-2 w-40"></div>
            <div className="h-6 bg-gray-200 rounded-md mb-2 w-32"></div>
          </div>
        </div>
      </Card>
    );
  }
  
  // Error or no data state
  if (!data) {
    return (
      <Card>
        <div className="p-6 text-center">
          <div className="text-xl font-medium text-gray-700 dark:text-gray-300">
            No weather data available
          </div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Please search for a location to get the current weather.
          </p>
        </div>
      </Card>
    );
  }
  
  const { name, country, condition, temp, feelsLike, humidity, wind, pressure, visibility } = data;
  
  // Determine temperature unit display
  const tempUnit = temperatureUnit === 'celsius' ? '°C' : '°F';
  const windUnit = windSpeedUnit === 'kph' ? 'km/h' : 'mph';
  
  // Convert temperature and wind speed
  const displayTemp = Math.round(convertTemperature(temp));
  const displayFeelsLike = Math.round(convertTemperature(feelsLike));
  const displayWindSpeed = Math.round(convertWindSpeed(wind));
  
  // Format visibility
  const displayVisibility = visibility >= 1000 ? `${(visibility / 1000).toFixed(1)} km` : `${visibility} m`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
      data-testid="current-weather"
    >
      <Card variant="default" padding="lg">
        <div className="flex flex-col md:flex-row md:items-center">
          {/* Weather icon and temperature */}
          <div className="flex items-center md:w-1/2">
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <WeatherIcon condition={getIconForCondition(condition)} size="large" />
            </div>
            
            <div className="ml-4">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {displayTemp}{tempUnit}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Feels like {displayFeelsLike}{tempUnit}
              </div>
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-1">
                {condition}
              </div>
            </div>
          </div>
          
          {/* Location and details */}
          <div className="mt-4 md:mt-0 md:w-1/2 md:text-right">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {name}, {country}
            </h2>
            
            <div className="mt-1 text-gray-500 dark:text-gray-400">
              <div className="flex flex-wrap gap-x-4 md:justify-end mt-2">
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
                  </svg>
                  <span>{humidity}%</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  <span>{displayWindSpeed} {windUnit}</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <span>{pressure} hPa</span>
                </div>
                
                <div className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <span>{displayVisibility}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CurrentWeather; 