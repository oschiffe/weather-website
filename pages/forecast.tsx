import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import WeatherIcon from '../components/WeatherIcon';
import WeatherForecast from '../components/WeatherForecast';
import WeatherAnimation from '../components/animations/WeatherAnimation';
import ScrollReveal from '../components/animations/ScrollReveal';
import { motion } from 'framer-motion';
import { HourlyForecast, DailyForecast } from '../types/api';
import { useSettings } from '../context/SettingsContext';
import { useLocationContext } from '../context/LocationContext';
import AutocompleteInput from '../components/AutocompleteInput';
import Button from '../components/Button';

// Define the WeatherCondition type to match WeatherIcon props
type WeatherCondition = 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'heavy-rain' | 'snow' | 'thunderstorm' | 'fog' | 'unknown';

export default function Forecast() {
  const [activeView, setActiveView] = useState<'daily' | 'hourly'>('daily');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentWeather, setCurrentWeather] = useState<string>('clear');
  const [isDay, setIsDay] = useState<boolean>(true);
  
  // State for forecast data
  const [hourlyData, setHourlyData] = useState<HourlyForecast[]>([]);
  const [dailyData, setDailyData] = useState<DailyForecast[]>([]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const { temperatureUnit, convertTemperature } = useSettings();

  // Function to get user's current location
  const getUserLocation = () => {
    setIsLoading(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Got user location for forecast:', latitude, longitude);
          handleSearch('Current Location', latitude, longitude);
        },
        // Error callback
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to get your location. Please try searching for a specific location.');
          setIsLoading(false);
        },
        // Options
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLoading(false);
    }
  };

  // Handle search from the autocomplete input
  const handleSearch = async (location: string, lat?: number, lon?: number) => {
    setIsLoading(true);
    setLocationError(null);
    
    try {
      // Make API call to get weather data
      console.log(`Fetching forecast for ${location} at coordinates:`, lat, lon);
      
      if (!lat || !lon) {
        throw new Error('Latitude and longitude are required.');
      }
      
      // Fetch current weather
      const weatherResponse = await fetch(`/api/weather?lat=${lat}&lon=${lon}&originalLocationName=${encodeURIComponent(location)}`);
      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch current weather data');
      }
      const weatherData = await weatherResponse.json();
      
      // Fetch forecast data from our new API endpoint
      const forecastResponse = await fetch(`/api/forecast?lat=${lat}&lon=${lon}&originalLocationName=${encodeURIComponent(location)}`);
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      const forecastData = await forecastResponse.json();
      
      setLocationName(weatherData.name);
      setWeatherData(weatherData);
      
      // Set current weather condition based on API response
      const condition = weatherData.weather[0].main.toLowerCase();
      setCurrentWeather(
        condition.includes('clear') ? 'clear' :
        condition.includes('cloud') ? 'cloudy' :
        condition.includes('rain') ? 'rain' :
        condition.includes('snow') ? 'snow' :
        condition.includes('thunder') ? 'thunderstorm' :
        condition.includes('fog') || condition.includes('mist') ? 'fog' :
        'clear'
      );
      
      // Set the hourly and daily forecast data from the API response
      setHourlyData(forecastData.hourly);
      setDailyData(forecastData.daily);
      
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error fetching forecast:', error);
      setLocationError('Failed to fetch forecast data. Please try again.');
      setIsLoading(false);
    }
  };

  // Function to handle place selection from the autocomplete input
  const handlePlaceSelect = (placeId: string, description: string, lat: number, lng: number) => {
    handleSearch(description, lat, lng);
  };

  return (
    <Layout 
      title="Weather Forecast | Modern Weather"
      description="Detailed weather forecast for your location" 
      weatherType={currentWeather as 'clear' | 'partly' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog'}
      intensity="medium"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ScrollReveal type="fade-down">
          <div className="pt-8 pb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700 dark:from-primary dark:to-blue-500">
                Weather Forecast
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Detailed multi-day weather predictions
            </p>
          </div>
        </ScrollReveal>
        
        <ScrollReveal type="fade-up">
          <div className="max-w-xl mx-auto mb-8">
            <div className="glass rounded-xl p-4 shadow-xl">
              <AutocompleteInput 
                onPlaceSelect={handlePlaceSelect}
                placeholder="Search for a location..."
                loading={isLoading}
              />
              
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={getUserLocation} 
                  variant="secondary"
                  isDisabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Use my location</span>
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {locationError && (
          <ScrollReveal type="fade-up">
            <div className="max-w-xl mx-auto mb-8">
              <div className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-md">
                <p>{locationError}</p>
              </div>
            </div>
          </ScrollReveal>
        )}
        
        <ScrollReveal type="fade-up" delay={0.2}>
          <Card className="glass p-6 shadow-xl mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Forecast for {locationName}
              </h2>
              
              <div className="flex space-x-2">
                <Button 
                  variant={activeView === 'daily' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('daily')}
                >
                  Daily
                </Button>
                <Button 
                  variant={activeView === 'hourly' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('hourly')}
                >
                  Hourly
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            ) : (
              <>
                {activeView === 'daily' ? (
                  <div className="space-y-2">
                    {dailyData.map((day, index) => (
                      <DailyForecastRow key={day.date} day={day} isToday={index === 0} />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto pb-2">
                    <div className="flex space-x-4 min-w-max">
                      {hourlyData.map((hour, index) => (
                        <HourlyForecastItem key={`${hour.time}-${index}`} hour={hour} isNow={index === 0} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </Card>
        </ScrollReveal>
        
        <ScrollReveal type="fade-up" delay={0.4}>
          <Card className="glass p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Weather Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-xl mb-2">
                  <svg className="h-8 w-8 mx-auto text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Pressure</h3>
                <p className="text-lg text-gray-900 dark:text-white">1015 hPa</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl mb-2">
                  <svg className="h-8 w-8 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Humidity</h3>
                <p className="text-lg text-gray-900 dark:text-white">65%</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl mb-2">
                  <svg className="h-8 w-8 mx-auto text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">Visibility</h3>
                <p className="text-lg text-gray-900 dark:text-white">10 km</p>
              </div>
              
              <div className="text-center">
                <div className="p-4 bg-green-500/10 dark:bg-green-500/20 rounded-xl mb-2">
                  <svg className="h-8 w-8 mx-auto text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300">UV Index</h3>
                <p className="text-lg text-gray-900 dark:text-white">Moderate</p>
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </Layout>
  );
}

interface DailyForecastRowProps {
  day: DailyForecast;
  isToday?: boolean;
}

const DailyForecastRow: React.FC<DailyForecastRowProps> = ({ day, isToday = false }) => {
  const { temperatureUnit, convertTemperature } = useSettings();
  const tempSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';
  
  // Map condition to icon
  const getIconForCondition = (condition: string): WeatherCondition => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return 'clear';
    } else if (conditionLower.includes('partly')) {
      return 'partly-cloudy';
    } else if (conditionLower.includes('cloud')) {
      return 'cloudy';
    } else if (conditionLower.includes('rain') && conditionLower.includes('heavy')) {
      return 'heavy-rain';
    } else if (conditionLower.includes('rain')) {
      return 'rain';
    } else if (conditionLower.includes('snow')) {
      return 'snow';
    } else if (conditionLower.includes('thunder')) {
      return 'thunderstorm';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return 'fog';
    }
    return 'unknown';
  };

  return (
    <div className={`${isToday ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'} rounded-xl p-4 flex items-center justify-between transition-colors`}>
      <div className="flex items-center w-40 md:w-48">
        <div className="w-16 text-center">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{day.day}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{day.date}</div>
        </div>
        
        <div className="ml-4 flex items-center">
          <WeatherIcon condition={getIconForCondition(day.condition)} size="medium" />
        </div>
      </div>
      
      <div className="flex-grow mx-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{day.condition}</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <span className="text-sm text-blue-600 dark:text-blue-400 mr-1">
            {Math.round(convertTemperature(day.tempMin))}{tempSymbol}
          </span>
          <span className="text-gray-400 mx-1">-</span>
          <span className="text-sm font-medium text-gray-800 dark:text-white">
            {Math.round(convertTemperature(day.tempMax))}{tempSymbol}
          </span>
        </div>
        
        <div className="flex items-center">
          <svg className="h-4 w-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-gray-600 dark:text-gray-400">{day.precipitation}%</span>
        </div>
      </div>
    </div>
  );
};

interface HourlyForecastItemProps {
  hour: HourlyForecast;
  isNow?: boolean;
}

const HourlyForecastItem: React.FC<HourlyForecastItemProps> = ({ hour, isNow = false }) => {
  const { temperatureUnit, convertTemperature } = useSettings();
  const tempSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';
  
  // Map condition to icon
  const getIconForCondition = (condition: string): WeatherCondition => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      return 'clear';
    } else if (conditionLower.includes('partly')) {
      return 'partly-cloudy';
    } else if (conditionLower.includes('cloud')) {
      return 'cloudy';
    } else if (conditionLower.includes('rain') && conditionLower.includes('heavy')) {
      return 'heavy-rain';
    } else if (conditionLower.includes('rain')) {
      return 'rain';
    } else if (conditionLower.includes('snow')) {
      return 'snow';
    } else if (conditionLower.includes('thunder')) {
      return 'thunderstorm';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
      return 'fog';
    }
    return 'unknown';
  };

  return (
    <div className={`${isNow ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'} rounded-xl p-4 min-w-[100px] flex flex-col items-center justify-between transition-colors`}>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {isNow ? 'Now' : hour.time}
      </div>
      
      <div className="my-2">
        <WeatherIcon condition={getIconForCondition(hour.condition)} size="medium" />
      </div>
      
      <div className="text-lg font-semibold text-gray-800 dark:text-white mt-1">
        {Math.round(convertTemperature(hour.temp))}{tempSymbol}
      </div>
      
      {hour.precipitation > 0 && (
        <div className="mt-2 flex items-center text-sm text-blue-600 dark:text-blue-400">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span>{hour.precipitation}%</span>
        </div>
      )}
    </div>
  );
}; 