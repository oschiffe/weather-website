import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import WeatherIcon from './WeatherIcon';
import { WeatherData, HourlyForecast } from '../types/api';
import { useSettings } from '../context/SettingsContext';

interface HeroWeatherProps {
  weatherData: WeatherData;
  hourlyForecast: HourlyForecast[];
  isLoading?: boolean;
}

const HeroWeather: React.FC<HeroWeatherProps> = ({ 
  weatherData,
  hourlyForecast,
  isLoading = false 
}) => {
  // Get settings from context
  const { temperatureUnit, convertTemperature, speedUnit, convertSpeed } = useSettings();

  // Map API weather condition to our icon type
  const mapConditionToIcon = (condition: string | undefined): 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'heavy-rain' | 'snow' | 'thunderstorm' | 'fog' | 'unknown' => {
    if (!condition) {
      console.log('Weather condition is undefined or null, using default icon');
      return 'unknown';
    }
    
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return 'clear';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return 'rain';
    } else if (conditionLower.includes('cloud')) {
      return 'cloudy';
    } else if (conditionLower.includes('snow')) {
      return 'snow';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return 'thunderstorm';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return 'fog';
    } else {
      return 'unknown';
    }
  };
  
  // Get weather gradient based on condition
  const getWeatherGradient = (condition: string | undefined): string => {
    if (!condition) return 'from-blue-200 to-indigo-100';
    
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return 'from-amber-200 to-yellow-100';
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return 'from-blue-300 to-blue-100';
    } else if (conditionLower.includes('cloud')) {
      return 'from-gray-200 to-slate-100';
    } else if (conditionLower.includes('snow')) {
      return 'from-sky-100 to-white';
    } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return 'from-indigo-400 to-purple-100';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return 'from-gray-200 to-gray-100';
    } else {
      return 'from-blue-200 to-indigo-100';
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="w-full h-64 rounded-apple glassmorphism">
          <div className="flex flex-col h-full justify-center items-center p-6">
            <div className="w-16 h-16 loading-skeleton rounded-full mb-4"></div>
            <div className="h-8 w-24 loading-skeleton rounded-md mb-2"></div>
            <div className="h-4 w-48 loading-skeleton rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Get converted temperature values based on user settings
  const displayTemp = Math.round(convertTemperature(weatherData.temp));
  const displayFeelsLike = Math.round(convertTemperature(weatherData.feelsLike));
  const displayWind = Math.round(convertSpeed(weatherData.wind));
  
  // Get unit symbols
  const tempUnit = temperatureUnit === 'celsius' ? '°C' : '°F';
  const displaySpeedUnit = speedUnit === 'kph' ? 'km/h' : 'mph';
  
  // Icon to display based on condition
  const weatherIconType = weatherData && weatherData.condition ? mapConditionToIcon(weatherData.condition) : 'unknown';
  
  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
      >
        <div className={`rounded-apple overflow-hidden glassmorphism glow-effect bg-gradient-to-br ${getWeatherGradient(weatherData.condition)}`}>
          <div className="relative p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-medium text-secondary" data-testid="location-name">
                  {weatherData.name}, {weatherData.country}
                </h2>
                <p className="text-sm text-secondary-light opacity-80">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="flex items-center mt-4 md:mt-0">
                <WeatherIcon 
                  condition={weatherIconType} 
                  size="large"
                  className={`mr-2 ${weatherIconType === 'clear' ? 'sun-icon' : weatherIconType === 'rain' ? 'rain-icon' : 'weather-icon'}`}
                />
                <span className="text-lg font-medium text-secondary" data-testid="weather-condition">
                  {weatherData && weatherData.condition ? weatherData.condition : 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center md:justify-start">
                <div className="text-7xl md:text-8xl font-bold text-gradient" data-testid="current-temp">
                  {displayTemp}{tempUnit}
                </div>
                <div className="ml-4">
                  <div className="text-sm text-secondary-light opacity-75">Feels like</div>
                  <div className="text-2xl font-semibold text-secondary">
                    {displayFeelsLike}{tempUnit}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="bg-white/30 backdrop-blur-sm rounded-apple-sm p-3 border border-white/40"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="text-sm text-secondary-light opacity-75 mb-1">Humidity</div>
                  <div className="text-xl font-semibold text-secondary">
                    {weatherData.humidity}%
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/30 backdrop-blur-sm rounded-apple-sm p-3 border border-white/40"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="text-sm text-secondary-light opacity-75 mb-1">Wind</div>
                  <div className="text-xl font-semibold text-secondary">
                    {displayWind} {displaySpeedUnit}
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/30 backdrop-blur-sm rounded-apple-sm p-3 border border-white/40"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="text-sm text-secondary-light opacity-75 mb-1">Pressure</div>
                  <div className="text-xl font-semibold text-secondary">
                    {weatherData.pressure} hPa
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white/30 backdrop-blur-sm rounded-apple-sm p-3 border border-white/40"
                  whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="text-sm text-secondary-light opacity-75 mb-1">Visibility</div>
                  <div className="text-xl font-semibold text-secondary">
                    {weatherData.visibility / 1000} km
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroWeather; 