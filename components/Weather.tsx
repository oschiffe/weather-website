import React from 'react';
import Image from 'next/image';
import { WeatherData } from '../types/api';

interface WeatherProps {
  data: WeatherData;
}

const Weather: React.FC<WeatherProps> = ({ data }) => {
  const { name, condition, temp, feelsLike, humidity, wind, country } = data;
  
  // Convert temperature from Kelvin to Celsius
  const tempC = Math.round(temp);
  const feelsLikeC = Math.round(feelsLike);
  
  // Convert temperature from Kelvin to Fahrenheit
  const tempF = Math.round(temp * 9/5 + 32);
  const feelsLikeF = Math.round(feelsLike * 9/5 + 32);

  return (
    <div className="card p-6 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary">{name}</h2>
          <p className="text-gray-500">{country}</p>
        </div>
        <div className="flex items-center">
          <Image
            src={`https://openweathermap.org/img/wn/${condition}@2x.png`}
            alt={condition || 'Weather icon'}
            width={64}
            height={64}
            className="mr-2"
          />
          <div className="text-right">
            <p className="text-3xl font-bold">{tempF}°F</p>
            <p className="text-gray-500">{tempC}°C</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500 text-sm">Feels like</p>
          <p className="font-semibold">{feelsLikeF}°F / {feelsLikeC}°C</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500 text-sm">Weather</p>
          <p className="font-semibold capitalize">{condition}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500 text-sm">Humidity</p>
          <p className="font-semibold">{humidity}%</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-gray-500 text-sm">Wind</p>
          <p className="font-semibold">{wind} m/s</p>
        </div>
      </div>
    </div>
  );
};

export default Weather; 