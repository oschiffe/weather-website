import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import HeroWeather from '../components/HeroWeather';
import WeatherForecast from '../components/WeatherForecast';
import ScrollReveal from '../components/animations/ScrollReveal';
import { WeatherData, HourlyForecast, DailyForecast } from '../types/api';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import AutocompleteInput from '../components/AutocompleteInput';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';

// Example data for demonstration
const demoWeatherData: WeatherData = {
  name: 'San Francisco',
  country: 'US',
  condition: 'Clear',
  temp: 9.4,
  feelsLike: 8,
  humidity: 65,
  wind: 12,
  pressure: 1012,
  visibility: 10000,
  lat: 37.7749,
  lon: -122.4194,
  timezone: -25200
};

// Weather condition mapping for demo purposes
const weatherConditionMap = {
  'clear': 'Clear',
  'partly': 'Partly Cloudy',
  'cloudy': 'Cloudy',
  'rain': 'Rainy',
  'thunderstorm': 'Thunderstorm',
  'snow': 'Snow',
  'fog': 'Fog'
};

const mockHourlyForecast: HourlyForecast[] = [
  { time: '12 PM', condition: 'Sunny', temp: 18, precipitation: 0 },
  { time: '1 PM', condition: 'Sunny', temp: 19, precipitation: 0 },
  { time: '2 PM', condition: 'Partly Cloudy', temp: 19, precipitation: 0 },
  { time: '3 PM', condition: 'Partly Cloudy', temp: 20, precipitation: 0 },
  { time: '4 PM', condition: 'Cloudy', temp: 19, precipitation: 10 },
  { time: '5 PM', condition: 'Cloudy', temp: 18, precipitation: 20 },
  { time: '6 PM', condition: 'Cloudy', temp: 17, precipitation: 10 },
  { time: '7 PM', condition: 'Clear', temp: 16, precipitation: 0 }
];

const mockDailyForecast: DailyForecast[] = [
  { day: 'Today', date: 'Mar 16', condition: 'Clear', tempMax: 20, tempMin: 14, precipitation: 0 },
  { day: 'Tomorrow', date: 'Mar 17', condition: 'Partly Cloudy', tempMax: 22, tempMin: 15, precipitation: 10 },
  { day: 'Wed', date: 'Mar 18', condition: 'Cloudy', tempMax: 19, tempMin: 14, precipitation: 30 },
  { day: 'Thu', date: 'Mar 19', condition: 'Rainy', tempMax: 18, tempMin: 13, precipitation: 70 },
  { day: 'Fri', date: 'Mar 20', condition: 'Rainy', tempMax: 17, tempMin: 12, precipitation: 60 },
  { day: 'Sat', date: 'Mar 21', condition: 'Partly Cloudy', tempMax: 19, tempMin: 14, precipitation: 20 },
  { day: 'Sun', date: 'Mar 22', condition: 'Sunny', tempMax: 21, tempMin: 15, precipitation: 0 }
];

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [weatherType, setWeatherType] = useState<string>('clear');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const { theme } = useTheme();
  const router = useRouter();

  // Load initial weather data for a default location
  useEffect(() => {
    // Get weather type from URL query param for testing
    if (router.isReady) {
      const { weather, intensity: intensityParam } = router.query;
      
      // Set weather type if provided in URL
      if (weather && typeof weather === 'string' && 
          Object.keys(weatherConditionMap).includes(weather)) {
        const weatherCondition = weatherConditionMap[weather as keyof typeof weatherConditionMap];
        setWeatherType(weather);
        setWeatherData({
          ...demoWeatherData,
          condition: weatherCondition
        });
      } else {
        setWeatherData(demoWeatherData);
      }
      
      // Set intensity if provided in URL
      if (intensityParam && 
          typeof intensityParam === 'string' && 
          ['low', 'medium', 'high'].includes(intensityParam)) {
        setIntensity(intensityParam as 'low' | 'medium' | 'high');
      }
      
      // Fetch real forecast data for the default location
      fetchForecastData(demoWeatherData.lat, demoWeatherData.lon);
    }
  }, [router.isReady, router.query]);

  // Fetch forecast data from API
  const fetchForecastData = async (lat: number, lon: number) => {
    try {
      // Fetch hourly forecast
      const hourlyResponse = await fetch(`/api/forecast?lat=${lat}&lon=${lon}&forecast_type=hourly`);
      if (!hourlyResponse.ok) {
        throw new Error('Failed to fetch hourly forecast data');
      }
      const hourlyData = await hourlyResponse.json();
      
      // Fetch daily forecast
      const dailyResponse = await fetch(`/api/forecast?lat=${lat}&lon=${lon}&forecast_type=daily`);
      if (!dailyResponse.ok) {
        throw new Error('Failed to fetch daily forecast data');
      }
      const dailyData = await dailyResponse.json();
      
      setHourlyForecast(hourlyData.hourlyForecast);
      setDailyForecast(dailyData.dailyForecast);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching forecast data:', err);
      // Don't fallback to mock data
      setLoading(false);
      // Show error state instead
      setError('Unable to fetch forecast data. Please try again later.');
    }
  };

  const handlePlaceSelect = async (placeId: string, description: string, lat: number, lng: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Extract city name from description
      const cityMatch = description.match(/^([^,]+)/);
      const originalCityName = cityMatch ? cityMatch[0].trim() : description.trim();
      
      // Make a real API call to get weather data, passing the original city name
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lng}&originalLocationName=${encodeURIComponent(originalCityName)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const weatherApiData = await response.json();
      
      // Use the city name from the API response (which should now be the original city name)
      const cityName = weatherApiData.name;
      
      // Map the API response to our WeatherData structure
      const realWeatherData: WeatherData = {
        name: cityName,
        country: weatherApiData.sys.country,
        condition: weatherApiData.weather[0].main,
        temp: weatherApiData.main.temp,
        feelsLike: weatherApiData.main.feels_like,
        humidity: weatherApiData.main.humidity,
        wind: weatherApiData.wind.speed,
        pressure: weatherApiData.main.pressure,
        visibility: weatherApiData.visibility,
        lat: weatherApiData.coord.lat,
        lon: weatherApiData.coord.lon,
        timezone: weatherApiData.timezone
      };
      
      setWeatherData(realWeatherData);
      
      // Set weather type based on condition
      const conditionLower = weatherApiData.weather[0].main.toLowerCase();
      setWeatherType(conditionLower.includes('clear') ? 'clear' :
                     conditionLower.includes('cloud') ? 'cloudy' :
                     conditionLower.includes('rain') ? 'rain' :
                     conditionLower.includes('snow') ? 'snow' :
                     conditionLower.includes('thunder') ? 'thunderstorm' :
                     conditionLower.includes('fog') || conditionLower.includes('mist') ? 'fog' :
                     'clear');
      
      // Fetch real forecast data for the selected location
      fetchForecastData(realWeatherData.lat, realWeatherData.lon);
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handlePlaceSelect(
            'user_location',
            'Current Location',
            latitude,
            longitude
          );
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Could not get your location. Please try searching for a city.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please try searching for a city.');
    }
  };

  return (
    <Layout 
      title="Modern Weather App - Home"
      description="Check the current weather and forecast with our beautiful modern weather app" 
      weatherType={weatherType as 'clear' | 'partly' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog'}
      intensity={intensity}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ScrollReveal type="fade-down">
          <div className="pt-8 pb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gray-900 dark:text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700 dark:from-primary dark:to-blue-500">
                Modern Weather
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Beautiful, real-time weather for anywhere in the world
            </p>
          </div>
        </ScrollReveal>
        
        <ScrollReveal type="fade-up">
          <div className="max-w-xl mx-auto mb-12">
            <div className="glass rounded-xl p-4 shadow-xl">
              <AutocompleteInput 
                onPlaceSelect={handlePlaceSelect}
                placeholder="Search for a city..."
                loading={loading}
              />
              
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={getUserLocation} 
                  className="btn btn-secondary flex items-center space-x-2"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Use my location</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
        
        {error && (
          <ScrollReveal type="fade-up">
            <div className="max-w-xl mx-auto mb-8">
              <div className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-md">
                <p>{error}</p>
              </div>
            </div>
          </ScrollReveal>
        )}

        {weatherData && (
          <>
            <ScrollReveal type="fade-up" delay={0.2}>
              <HeroWeather 
                weatherData={weatherData} 
                hourlyForecast={hourlyForecast} 
              />
            </ScrollReveal>
            
            <ScrollReveal type="fade-up" delay={0.4}>
              <div className="mt-12 mb-20">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  7-Day Forecast
                </h2>
                <WeatherForecast 
                  dailyForecast={dailyForecast}
                  hourlyForecast={hourlyForecast}
                  cityName={weatherData.name}
                />
              </div>
            </ScrollReveal>
            
            <ScrollReveal type="fade-up" delay={0.6}>
              <div className="glass rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Weather Insights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-md">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Humidity & Air Quality
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Current humidity is at {weatherData.humidity}%, which feels {weatherData.humidity > 70 ? 'quite humid' : weatherData.humidity < 30 ? 'very dry' : 'comfortable'}.
                    </p>
                  </div>
                  <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg shadow-md">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                      Wind Conditions
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Wind speed is currently {weatherData.wind} km/h, which is {weatherData.wind > 20 ? 'strong' : weatherData.wind > 10 ? 'moderate' : 'light'}.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </>
        )}
        
        <ScrollReveal type="fade-up" delay={0.8}>
          <div className="mt-16 text-center">
            {/* Removed nonfunctional downward arrow */}
          </div>
        </ScrollReveal>
      </div>
    </Layout>
  );
} 