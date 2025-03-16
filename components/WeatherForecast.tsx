import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import WeatherIcon from './WeatherIcon';
import { DailyForecast, HourlyForecast } from '../types/api';
import { useSettings } from '../context/SettingsContext';

// Define the WeatherCondition type to match WeatherIcon props
type WeatherCondition = 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'heavy-rain' | 'snow' | 'thunderstorm' | 'fog' | 'unknown';

interface WeatherForecastProps {
  dailyForecast: DailyForecast[];
  hourlyForecast?: HourlyForecast[];
  cityName?: string;
  isLoading?: boolean;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ 
  dailyForecast, 
  hourlyForecast = [], 
  cityName = '',
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('daily');
  
  // Map API weather condition to our icon type
  const mapConditionToIcon = (condition: string): WeatherCondition => {
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
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <Card className="w-full animate-pulse p-4">
          <div className="h-8 bg-gray-200 rounded-md w-40 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        data-testid="forecast-section"
      >
        <Card variant="default" padding="lg" className="overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'hourly'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary-light hover:text-secondary hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('hourly')}
            >
              Hourly Forecast
            </button>
            <button
              className={`ml-8 px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'daily'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-secondary-light hover:text-secondary hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('daily')}
            >
              7-Day Forecast
            </button>
          </div>
          
          {activeTab === 'hourly' ? (
            <div className="overflow-x-auto pb-2">
              <div className="flex space-x-4 min-w-max">
                {hourlyForecast.map((hour, index) => (
                  <HourlyForecastCard key={index} data={hour} isNow={index === 0} />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyForecast.map((day, index) => (
                <DailyForecastCard key={index} data={day} isToday={index === 0} />
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

interface HourlyForecastCardProps {
  data: HourlyForecast;
  isNow?: boolean;
}

const HourlyForecastCard: React.FC<HourlyForecastCardProps> = ({ data, isNow = false }) => {
  // Get settings from context
  const { convertTemperature, temperatureUnit } = useSettings();
  
  // Convert temperature based on user settings
  const displayTemp = Math.round(convertTemperature(data.temp));
  
  // Get temperature unit display
  const tempUnitSymbol = temperatureUnit === 'celsius' ? '°' : '°F';
  
  // Map condition to icon
  const iconCondition: WeatherCondition = data.condition.toLowerCase().includes('clear') ? 'clear' : 
                        data.condition.toLowerCase().includes('rain') ? 'rain' : 
                        'cloudy';
  
  return (
    <motion.div 
      className={`flex flex-col items-center p-3 rounded-apple-md ${
        isNow ? 'bg-primary/10' : 'hover:bg-gray-50'
      }`}
      whileHover={{ y: -2 }}
    >
      <div className="text-xs font-medium text-secondary-light">
        {isNow ? 'Now' : data.time}
      </div>
      <div className="my-2">
        <WeatherIcon condition={iconCondition} size="small" />
      </div>
      <div className="text-lg font-semibold text-secondary">
        {displayTemp}{tempUnitSymbol}
      </div>
      {data.precipitation > 0 && (
        <div className="mt-1 flex items-center text-xs text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {data.precipitation}%
        </div>
      )}
    </motion.div>
  );
};

interface DailyForecastCardProps {
  data: DailyForecast;
  isToday?: boolean;
}

const DailyForecastCard: React.FC<DailyForecastCardProps> = ({ data, isToday = false }) => {
  // Get settings from context
  const { convertTemperature, temperatureUnit } = useSettings();
  
  // Convert temperatures based on user settings
  const displayTempMax = Math.round(convertTemperature(data.tempMax));
  const displayTempMin = Math.round(convertTemperature(data.tempMin));
  
  // Get temperature unit display
  const tempUnitSymbol = temperatureUnit === 'celsius' ? '°' : '°F';
  
  // Map condition to icon
  const iconCondition: WeatherCondition = data.condition.toLowerCase().includes('clear') ? 'clear' : 
                        data.condition.toLowerCase().includes('rain') ? 'rain' : 
                        'cloudy';
  
  return (
    <motion.div 
      className={`flex items-center justify-between p-3 rounded-apple-md ${
        isToday ? 'bg-primary/10' : 'hover:bg-gray-50'
      }`}
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-secondary">
          {isToday ? 'Today' : data.day}
        </span>
        <span className="text-xs text-secondary-light">{data.date}</span>
      </div>
      
      <div className="flex items-center">
        <WeatherIcon condition={iconCondition} size="small" />
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-secondary">{displayTempMax}{tempUnitSymbol}</span>
        <span className="text-sm text-secondary-light">{displayTempMin}{tempUnitSymbol}</span>
      </div>
    </motion.div>
  );
};

export default WeatherForecast; 