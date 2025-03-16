import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationContext } from '../context/LocationContext';
import Card from './Card';

interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

const SearchResults: React.FC = () => {
  const { locations, setSelectedLocation, isLoading } = useLocationContext();

  const handleSelectLocation = (location: LocationData) => {
    setSelectedLocation(location);
  };

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 15,
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2,
      } 
    },
  };

  if (isLoading) {
    return (
      <div className="my-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} variant="glass" className="animate-pulse">
            <div className="h-14 flex items-center">
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="my-4 space-y-2 max-h-96 overflow-y-auto custom-scrollbar"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {locations.map((location: LocationData, index: number) => (
          <motion.div 
            key={`${location.lat}-${location.lon}`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="transform origin-left"
          >
            <Card 
              variant="glass" 
              padding="md" 
              onClick={() => handleSelectLocation(location)}
              hoverEffect={true}
              className={`transition-all hover:border-indigo-400 ${index === 0 ? 'border-l-4 border-l-indigo-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">{location.name}</h3>
                  <p className="text-sm text-gray-600">
                    {location.state && `${location.state}, `}{location.country}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </motion.button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResults; 