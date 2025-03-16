import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';

interface Place {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  lat?: number;
  lng?: number;
}

interface AutocompleteInputProps {
  onSelectPlace?: (placeId: string, description: string, lat: number, lng: number) => void;
  onPlaceSelect?: (placeId: string, description: string, lat: number, lng: number) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  initialValue?: string;
  onInputChange?: (value: string) => void;
  loading?: boolean;
}

// Add minimal type definitions for the Google Maps Places API
declare global {
  interface Window {
    initGoogleMapsPlaces: () => void;
    google: any;
    googleMapsApiError?: string;
  }
}

// Define the City type to match the expected type in handleSelectCity
interface City {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  onSelectPlace,
  onPlaceSelect,
  placeholder = 'Enter location (city, zip code, address)',
  className = '',
  error,
  initialValue = '',
  onInputChange,
  loading: externalLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedValue = useDebounce(inputValue, 300);
  const [generalError, setGeneralError] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Update inputValue when initialValue changes (e.g. from parent)
  useEffect(() => {
    if (initialValue !== inputValue) {
      setInputValue(initialValue);
      setIsSearchActive(!!initialValue);
    }
  }, [initialValue]);

  // Fetch place suggestions from API
  useEffect(() => {
    // Only fetch if we have at least 2 characters
    const trimmedValue = debouncedValue.trim();
    
    if (trimmedValue.length >= 2) {
      setIsLoading(true);
      setIsSearchActive(true);
      setShowSuggestions(true); // Always show dropdown when we have query
      
      // Call the places API
      fetch(`/api/places?input=${encodeURIComponent(trimmedValue)}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'OK') {
            // Limit to 3 suggestions maximum
            const limitedSuggestions = (data.predictions || []).slice(0, 3);
            setSuggestions(limitedSuggestions);
            // Reset highlighted index when suggestions change
            setHighlightedIndex(-1);
          } else {
            console.error('API returned non-OK status:', data.status);
            setSuggestions([]);
            if (data.error_message) {
              setGeneralError(data.error_message);
            }
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching places:', err);
          setSuggestions([]);
          setGeneralError('Failed to fetch location suggestions. Please try again.');
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
      setHighlightedIndex(-1);
      setShowSuggestions(false);
    }
  }, [debouncedValue]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (onInputChange) {
      onInputChange(value);
    }
    
    // Clear any errors when user starts typing again
    if (generalError) {
      setGeneralError('');
    }
    
    // If input is cleared, hide suggestions and reset search state
    if (!value.trim()) {
      setShowSuggestions(false);
      setIsSearchActive(false);
      setSuggestions([]);
    }
  };

  // Handle selection of a place from suggestions
  const handleSelectPlace = async (place: Place) => {
    setInputValue(place.description);
    setShowSuggestions(false);
    setIsLoading(true);
    
    try {
      // If place already has lat/lng, use those directly
      if (place.lat && place.lng) {
        if (onSelectPlace) {
          onSelectPlace(place.place_id, place.description, place.lat, place.lng);
        }
        if (onPlaceSelect) {
          onPlaceSelect(place.place_id, place.description, place.lat, place.lng);
        }
        setIsLoading(false);
        return;
      }
      
      // Otherwise, call place-details API to get lat/lng
      const response = await fetch(`/api/place-details?place_id=${place.place_id}`);
      const data = await response.json();
      
      if (data.status === 'OK' && data.result && data.result.geometry) {
        const { lat, lng } = data.result.geometry.location;
        
        if (onSelectPlace) {
          onSelectPlace(place.place_id, place.description, lat, lng);
        }
        if (onPlaceSelect) {
          onPlaceSelect(place.place_id, place.description, lat, lng);
        }
      } else {
        console.error('Error getting place details:', data);
        setGeneralError('Failed to get location details. Please try again.');
      }
    } catch (err) {
      console.error('Error in place selection:', err);
      setGeneralError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    // Only show suggestions if there's input and some suggestions
    if (inputValue.trim().length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
    setIsSearchActive(true);
  };

  // Handle clearing the input field
  const handleClearInput = () => {
    setInputValue('');
    setShowSuggestions(false);
    setIsSearchActive(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    
    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Notify parent component
    if (onInputChange) {
      onInputChange('');
    }
  };

  // Handle keyboard navigation in the suggestions dropdown
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Only process keyboard navigation if suggestions are shown
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectPlace(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine if we're loading (either internal or external loading state)
  const isInputLoading = isLoading || externalLoading;

  return (
    <div className={`relative ${className}`}>
      <div className={`relative flex items-center overflow-hidden ${isSearchActive ? 'ring-2 ring-primary/50' : ''} rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-300 dark:border-gray-700 focus-within:border-primary dark:focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30`}>
        <div className="flex-shrink-0 pl-3">
          <MagnifyingGlassIcon className={`h-5 w-5 ${isSearchActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className="flex-grow p-3 bg-transparent outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          aria-label="Search for a location"
          aria-autocomplete="list"
          aria-controls={showSuggestions ? "location-suggestions" : undefined}
          aria-expanded={showSuggestions}
          aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
        />
        
        {isInputLoading && (
          <div className="flex-shrink-0 pr-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        )}
        
        {inputValue && !isInputLoading && (
          <button
            type="button"
            onClick={handleClearInput}
            className="flex-shrink-0 pr-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            aria-label="Clear input"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Error message */}
      {(error || generalError) && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error || generalError}
        </div>
      )}

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            id="location-suggestions"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            role="listbox"
          >
            <ul className="py-1 max-h-60 overflow-auto">
              {suggestions.map((place, index) => (
                <li 
                  key={place.place_id}
                  id={`suggestion-${index}`}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    highlightedIndex === index
                      ? 'bg-primary/10 dark:bg-primary/20'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleSelectPlace(place)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={highlightedIndex === index}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {place.structured_formatting?.main_text || place.description.split(',')[0]}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {place.structured_formatting?.secondary_text || 
                      place.description.includes(',') ? place.description.split(',').slice(1).join(',').trim() : ''}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AutocompleteInput; 