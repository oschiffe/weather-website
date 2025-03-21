import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import ScrollReveal from '../components/animations/ScrollReveal';
import AutocompleteInput from '../components/AutocompleteInput';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

// Define the MapType type
type MapType = 'temperature' | 'precipitation' | 'wind' | 'pressure' | 'clouds';

// Update the interface to match the expected props in MapComponent
interface MapComponentProps {
  center: [number, number];
  zoom: number;
  layer: string;
  onError?: () => void;
  onLoad?: () => void;
}

// Dynamically import the Map component with no SSR to avoid hydration issues
const MapComponent = dynamic(() => import('../components/MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-700 dark:text-gray-300">Loading map...</p>
      </div>
    </div>
  )
});

export default function WeatherMaps() {
  const [activeMap, setActiveMap] = useState<MapType>('temperature');
  
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({
    name: 'New York, NY',
    lat: 40.7128,
    lon: -74.0060,
    zoom: 3  // Start more zoomed out to show a larger area
  });
  
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(Date.now()); // Add key to force map refresh
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Map type options
  const mapOptions = [
    { id: 'temperature', label: 'Temperature' },
    { id: 'precipitation', label: 'Precipitation' },
    { id: 'clouds', label: 'Clouds' },
    { id: 'wind', label: 'Wind' },
    { id: 'pressure', label: 'Pressure' },
  ];

  const router = useRouter();

  // Handle location selection from the autocomplete input
  const handlePlaceSelect = (placeId: string, description: string, lat: number, lng: number) => {
    setIsLoading(true);
    setMapError(null);
    
    console.log('Selected location for map:', description, lat, lng);
    
    setLocation({
      name: description,
      lat: lat,
      lon: lng,
      zoom: 5 // Use a medium zoom level for specific locations
    });

    // Force map to refresh with new location
    setMapKey(Date.now());
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };
  
  // Function to get user's current location
  const getUserLocation = () => {
    setIsLoading(true);
    setLocationError(null);
    setMapError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Got user location for maps:', latitude, longitude);
          setLocation({
            name: 'Current Location',
            lat: latitude,
            lon: longitude,
            zoom: 6 // Better zoom for current location
          });
          
          // Force map to refresh with new location
          setMapKey(Date.now());
          
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
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
  
  // Handle map type change
  const handleMapTypeChange = (mapType: MapType) => {
    setActiveMap(mapType);
    setMapError(null);
    // Force map to refresh with new map type
    setMapKey(Date.now());
  };
  
  // Get OpenWeatherMap layer ID based on active map type
  const getMapLayer = () => {
    // Map type to OpenWeatherMap layer ID
    const layerMapping = {
      temperature: 'temp_new',
      precipitation: 'precipitation_new',
      clouds: 'clouds_new',
      wind: 'wind_new',
      pressure: 'pressure_new'
    };
    
    return layerMapping[activeMap];
  };

  // Handle map load error
  const handleMapError = () => {
    setMapError("Unable to load the weather map. This could be due to API limits or connectivity issues. Please try a different map type or location.");
    console.error("Map failed to load for type:", activeMap, "at location:", location.name);
  };

  // Add a new function to handle map load success
  const handleMapLoad = () => {
    // Clear any previous errors when the map loads successfully
    if (mapError) setMapError(null);
    console.log(`Map loaded successfully: ${activeMap} at location: ${location.name}`);
  };

  // Function to get a weather condition based on the active map
  const getWeatherConditionForMap = () => {
    switch(activeMap) {
      case 'precipitation':
        return 'rain';
      case 'clouds':
        return 'cloudy';
      case 'wind':
        return 'clear'; // Use clear for wind to show wind particles
      case 'pressure':
        return 'fog'; // Use fog for pressure visualization
      case 'temperature':
      default:
        return 'clear';
    }
  };

  return (
    <Layout 
      title="Weather Maps | Modern Weather"
      description="Interactive weather maps showing current conditions around the world"
      weatherType={getWeatherConditionForMap() as 'clear' | 'partly' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog'}
      intensity="medium"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Add extra top padding to create better spacing between header and content */}
        <div className="pt-12 pb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            Weather Maps
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Interactive weather maps showing current conditions around the world
          </p>
        </div>
                
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Left sidebar with controls */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-5 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Location
              </h2>
              <AutocompleteInput
                onPlaceSelect={handlePlaceSelect}
                placeholder="Search for a location"
                loading={isLoading}
              />
              
              {locationError && (
                <div className="mt-4 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-md">
                  <p>{locationError}</p>
                </div>
              )}
              
              <div className="mt-4">
                <Button 
                  onClick={getUserLocation} 
                  variant="secondary"
                  isDisabled={isLoading}
                  className="flex items-center space-x-2 w-full justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Use my location</span>
                </Button>
              </div>
              
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Currently showing: <strong>{location.name}</strong>
              </div>
            </div>
            
            <div className="glass rounded-xl p-5">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Map Type
              </h2>
              <select 
                value={activeMap}
                onChange={(e) => handleMapTypeChange(e.target.value as MapType)}
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {mapOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <div className="mt-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">{getMapTitle(activeMap)}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{getMapDescription(activeMap)}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <div>{getMinValue(activeMap)}</div>
                  <div>{getMaxValue(activeMap)}</div>
                </div>
                
                <div className="h-2 w-full mt-1 rounded-full bg-gradient-to-r from-blue-300 to-red-500"></div>
              </div>
            </div>
          </div>
            
          {/* Main map area */}
          <div className="lg:col-span-3">
            <div className="glass rounded-xl p-2 overflow-hidden h-[600px] relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-10 backdrop-blur-sm">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">Loading map...</p>
                  </div>
                </div>
              )}
              
              {mapError ? (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                  <div>
                    <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-gray-700 dark:text-gray-300">{mapError}</p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setMapKey(Date.now());
                        setMapError(null);
                      }}
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full relative">
                  {/* @ts-ignore - Ignore type checking for the dynamic component */}
                  <MapComponent
                    key={mapKey}
                    center={[location.lat, location.lon]}
                    zoom={location.zoom}
                    layer={getMapLayer()}
                    onError={handleMapError}
                    onLoad={handleMapLoad}
                  />
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-center text-xs text-gray-500 dark:text-gray-400">
                Map data provided by OpenWeatherMap | Tiles © OpenStreetMap contributors
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Helper functions for map information
function getMapTitle(type: string): string {
  const titles = {
    temperature: 'Temperature',
    precipitation: 'Precipitation',
    clouds: 'Cloud Coverage',
    wind: 'Wind Speed',
    pressure: 'Atmospheric Pressure'
  };
  return titles[type as keyof typeof titles] || 'Weather Map';
}

function getMapDescription(type: string): string {
  const descriptions = {
    temperature: 'Current temperature across the region in °C',
    precipitation: 'Current precipitation intensity in mm/h',
    clouds: 'Cloud cover percentage across the region',
    wind: 'Wind speed in meters per second (m/s)',
    pressure: 'Atmospheric pressure in hectopascals (hPa)'
  };
  return descriptions[type as keyof typeof descriptions] || '';
}

function getMinValue(type: string): string {
  const mins = {
    temperature: '-40°C',
    precipitation: '0 mm',
    clouds: '0%',
    wind: '0 m/s',
    pressure: '970 hPa'
  };
  return mins[type as keyof typeof mins] || 'Min';
}

function getMaxValue(type: string): string {
  const maxs = {
    temperature: '40°C',
    precipitation: '20 mm',
    clouds: '100%',
    wind: '30 m/s',
    pressure: '1050 hPa'
  };
  return maxs[type as keyof typeof maxs] || 'Max';
} 