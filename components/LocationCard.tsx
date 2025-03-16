import React from 'react';
import { motion } from 'framer-motion';
import WeatherIcon from './WeatherIcon';
import Card from './Card';

interface LocationCardProps {
  name: string;
  country: string;
  temperature: number;
  condition: string;
  onClick?: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
  name,
  country,
  temperature,
  condition,
  onClick,
}) => {
  // Map condition to icon
  const mapConditionToIcon = (condition: string): any => {
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

  return (
    <Card
      variant="glass"
      padding="md"
      onClick={onClick}
      className="w-full cursor-pointer"
      hoverEffect={true}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-secondary">{name}</h3>
          <p className="text-sm text-secondary-light">{country}</p>
        </div>
        
        <div className="flex items-center">
          <WeatherIcon 
            condition={mapConditionToIcon(condition)} 
            size="medium" 
            className="mr-2"
          />
          <span className="text-2xl font-semibold text-secondary">
            {Math.round(temperature)}°
          </span>
        </div>
      </div>
    </Card>
  );
};

export default LocationCard; 