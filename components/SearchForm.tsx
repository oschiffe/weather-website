import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import AutocompleteInput from './AutocompleteInput';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SearchFormProps {
  onSearch: (location: string, lat?: number, lon?: number) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<{
    description: string;
    lat: number;
    lng: number;
  } | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Handle selection from autocomplete dropdown
  const handleSelectPlace = async (placeId: string, description: string, lat?: number, lng?: number) => {
    setError(undefined);
    setInputValue(description);
    
    if (lat !== undefined && lng !== undefined) {
      // Set selected location
      setSelectedLocation({ description, lat, lng });
      
      // Automatically trigger search when a place is selected
      onSearch(description, lat, lng);
      setSearchPerformed(true);
    } else {
      setError('Invalid location selected. Please try again.');
    }
  };
  
  // Handle search button click
  const handleSearchClick = () => {
    if (selectedLocation) {
      onSearch(selectedLocation.description, selectedLocation.lat, selectedLocation.lng);
      setSearchPerformed(true);
    } else if (inputValue.trim().length > 0) {
      // If no location is selected but there's input, show an error
      setError('Please select a location from the dropdown');
    } else {
      setError('Please enter a location');
    }
  };

  // Clear search form
  const handleClear = () => {
    setSelectedLocation(null);
    setInputValue('');
    setError(undefined);
    setSearchPerformed(false);
  };

  // Handle input changes
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // When user types something new, clear the selected location
    if (selectedLocation && selectedLocation.description !== value) {
      setSelectedLocation(null);
      // Only reset search status if user is actually changing the input
      if (value.trim() !== selectedLocation.description.trim()) {
        setSearchPerformed(false);
      }
    }
    
    // Clear error when user starts typing
    if (error) {
      setError(undefined);
    }
  };
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedLocation) {
      handleSearchClick();
    }
  };
  
  return (
    <motion.div 
      className="py-6 px-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold text-secondary mb-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Find Weather Anywhere
        </motion.h1>
        
        <motion.p 
          className="text-secondary-light text-center mb-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Enter a city name to get current weather conditions
        </motion.p>
        
        <div className="relative" onKeyDown={handleKeyDown}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow relative">
              <AutocompleteInput
                onSelectPlace={handleSelectPlace}
                placeholder="Enter city name (e.g., New York, London, Tokyo)"
                error={error}
                className="shadow-apple-sm"
                initialValue={inputValue}
                onInputChange={handleInputChange}
                loading={isLoading}
              />
            </div>
            
            <Button 
              variant="primary"
              size="md"
              isDisabled={isLoading || (!selectedLocation && inputValue.trim().length === 0)}
              className="flex-shrink-0 shadow-apple-sm"
              onClick={handleSearchClick}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Searching...
                </>
              ) : 'Search'}
            </Button>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.p 
                className="mt-2 text-sm text-red-500"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          
          {/* Information text to guide users */}
          {!searchPerformed && !error && (
            <motion.p
              className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Start typing a city name and select from the suggestions
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchForm; 