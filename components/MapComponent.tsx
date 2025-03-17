import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Import Leaflet only on client-side
const L = typeof window !== 'undefined' ? require('leaflet') : null;

// Fix for Leaflet marker icon issue in Next.js
const fixLeafletIcon = () => {
  // Only run on client side
  if (typeof window === 'undefined' || !L) return;

  // Delete the default icon
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  // Set up the default icon paths
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
  });
};

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  layer: string;
  onError?: () => void;
  onLoad?: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom, layer, onError, onLoad }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const weatherLayerRef = useRef<L.TileLayer | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Import Leaflet CSS on client side
  useEffect(() => {
    // Only import CSS on client side
    require('leaflet/dist/leaflet.css');
    
    // These specific fixes are for the control layers icons
    const styleEl = document.createElement('style');
    styleEl.appendChild(document.createTextNode(`
      .leaflet-control-layers-toggle {
        background-image: url('/images/layers.png') !important;
        width: 36px;
        height: 36px;
      }
      .leaflet-retina .leaflet-control-layers-toggle {
        background-image: url('/images/layers-2x.png') !important;
        background-size: 26px 26px;
      }
    `));
    document.head.appendChild(styleEl);

    return () => {
      // Clean up added styles when component unmounts
      styleEl.remove();
    };
  }, []);

  useEffect(() => {
    // Fix Leaflet icon issue
    fixLeafletIcon();

    if (!mapRef.current) return;
    
    setIsLoading(true);
    setMapError(null);
    
    // Get API key from env or use default
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '7b4a766ffb18c999689c79b166a6d446';
    
    // Map the layer name to correct format for OpenWeatherMap tile API
    const layerMap: Record<string, string> = {
      temp_new: 'temp_new',
      precipitation_new: 'precipitation_new',
      clouds_new: 'clouds_new',
      wind_new: 'wind',  // OpenWeatherMap API uses "wind" not "wind_new"
      pressure_new: 'pressure_new'
    };
    
    const tileLayer = layerMap[layer] || layer;
    
    try {
      // Initialize map if it doesn't exist
      if (!mapInstanceRef.current) {
        // Create map instance
        mapInstanceRef.current = L.map(mapRef.current, {
          zoomControl: true,
          attributionControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          worldCopyJump: true, // Allows the map to wrap around the world
        }).setView(center, zoom);
        
        // Add base tile layer (OpenStreetMap)
        tileLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          minZoom: 1, // Allow more zoomed out view
        }).addTo(mapInstanceRef.current);
        
        // Add weather layer
        weatherLayerRef.current = L.tileLayer(`https://tile.openweathermap.org/map/${tileLayer}/{z}/{x}/{y}.png?appid=${apiKey}`, {
          attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
          opacity: 0.8,
          maxZoom: 19,
          minZoom: 1, // Allow more zoomed out view
        }).addTo(mapInstanceRef.current);
        
        // Add error handler for tile loading errors
        if (weatherLayerRef.current) {
          weatherLayerRef.current.on('tileerror', (error) => {
            console.error('Tile error:', error);
            setMapError('Failed to load weather tiles. Please try again later.');
            if (onError) onError();
          });
          
          // Add success handler for tile loading completion
          weatherLayerRef.current.on('load', () => {
            setIsLoading(false);
          });
        }
        
        // Custom icon for better visibility
        const customIcon = L.icon({
          iconUrl: '/images/marker-icon.png',
          iconRetinaUrl: '/images/marker-icon-2x.png',
          shadowUrl: '/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        
        // Add marker for the location with popup
        markerRef.current = L.marker(center, { icon: customIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`<div class="font-medium">Selected Location</div><div>${center[0].toFixed(4)}, ${center[1].toFixed(4)}</div>`)
          .on('click', () => {
            // You could add more detailed weather data here in the future
            console.log('Marker clicked at coordinates:', center);
          });
        
        // Notify map loaded successfully
        if (onLoad) onLoad();
      } else {
        // Update existing map view
        mapInstanceRef.current.setView(center, zoom);
        
        // Update weather layer
        if (weatherLayerRef.current) {
          mapInstanceRef.current.removeLayer(weatherLayerRef.current);
        }
        
        weatherLayerRef.current = L.tileLayer(`https://tile.openweathermap.org/map/${tileLayer}/{z}/{x}/{y}.png?appid=${apiKey}`, {
          attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
          opacity: 0.8,
          maxZoom: 19,
          minZoom: 1, // Allow more zoomed out view
        }).addTo(mapInstanceRef.current);
        
        // Add error handler for tile loading errors
        if (weatherLayerRef.current) {
          weatherLayerRef.current.on('tileerror', (error) => {
            console.error('Tile error:', error);
            setMapError('Failed to load weather tiles. Please try again later.');
            if (onError) onError();
          });
          
          // Add success handler for tile loading completion
          weatherLayerRef.current.on('load', () => {
            setIsLoading(false);
          });
        }
        
        // Update marker position
        if (markerRef.current) {
          markerRef.current.setLatLng(center);
          markerRef.current.setPopupContent(`<div class="font-medium">Selected Location</div><div>${center[0].toFixed(4)}, ${center[1].toFixed(4)}</div>`);
        } else {
          // Custom icon for better visibility
          const customIcon = L.icon({
            iconUrl: '/images/marker-icon.png',
            iconRetinaUrl: '/images/marker-icon-2x.png',
            shadowUrl: '/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          
          markerRef.current = L.marker(center, { icon: customIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`<div class="font-medium">Selected Location</div><div>${center[0].toFixed(4)}, ${center[1].toFixed(4)}</div>`)
            .on('click', () => {
              console.log('Marker clicked at coordinates:', center);
            });
        }
        
        // Notify map loaded successfully
        if (onLoad) onLoad();
      }
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error initializing map. Please try again later.');
      setIsLoading(false);
      if (onError) onError();
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [center, zoom, layer, onError, onLoad]);
  
  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg overflow-hidden shadow-md"
        style={{ 
          minHeight: '500px',
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1
        }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Loading map...</span>
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100/20 dark:bg-red-900/20 backdrop-blur-sm">
          <div className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 px-5 py-4 rounded-lg max-w-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{mapError}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent; 