import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a location
export interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Define the context interface
interface LocationContextType {
  locations: LocationData[];
  selectedLocation: LocationData | null;
  isLoading: boolean;
  error: string | null;
  setLocations: (locations: LocationData[]) => void;
  setSelectedLocation: (location: LocationData) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearLocations: () => void;
}

// Create the context with default values
const LocationContext = createContext<LocationContextType>({
  locations: [],
  selectedLocation: null,
  isLoading: false,
  error: null,
  setLocations: () => {},
  setSelectedLocation: () => {},
  setIsLoading: () => {},
  setError: () => {},
  clearLocations: () => {},
});

// Props for the provider component
interface LocationProviderProps {
  children: ReactNode;
}

// Provider component
export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearLocations = () => {
    setLocations([]);
  };

  const value = {
    locations,
    selectedLocation,
    isLoading,
    error,
    setLocations,
    setSelectedLocation,
    setIsLoading,
    setError,
    clearLocations,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the location context
export const useLocationContext = () => useContext(LocationContext); 