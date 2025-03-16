import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kph' | 'mph';
export type TimeFormat = '12h' | '24h';
export type Theme = 'system' | 'light' | 'dark';

interface SettingsContextType {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  timeFormat: TimeFormat;
  theme: Theme;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setSpeedUnit: (unit: SpeedUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setTheme: (theme: Theme) => void;
  saveSettings: () => void;
  resetSettings: () => void;
  convertTemperature: (tempC: number) => number;
  convertSpeed: (speedKph: number) => number;
  formatTimeString: (time: string) => string;
}

// Create context with default values
export const SettingsContext = createContext<SettingsContextType>({
  temperatureUnit: 'celsius',
  speedUnit: 'kph',
  timeFormat: '24h',
  theme: 'system',
  setTemperatureUnit: () => {},
  setSpeedUnit: () => {},
  setTimeFormat: () => {},
  setTheme: () => {},
  saveSettings: () => {},
  resetSettings: () => {},
  convertTemperature: (temp) => temp,
  convertSpeed: (speed) => speed,
  formatTimeString: (time) => time,
});

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  // Default settings
  const [temperatureUnit, setTemperatureUnit] = useState<TemperatureUnit>('celsius');
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>('kph');
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('24h');
  const [theme, setTheme] = useState<Theme>('system');

  // Load settings from localStorage on initial render
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('weather-app-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setTemperatureUnit(settings.temperatureUnit || 'celsius');
        setSpeedUnit(settings.speedUnit || 'kph');
        setTimeFormat(settings.timeFormat || '24h');
        setTheme(settings.theme || 'system');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      const settings = {
        temperatureUnit,
        speedUnit,
        timeFormat,
        theme
      };
      localStorage.setItem('weather-app-settings', JSON.stringify(settings));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    }
  };

  // Reset to default settings
  const resetSettings = () => {
    setTemperatureUnit('celsius');
    setSpeedUnit('kph');
    setTimeFormat('24h');
    setTheme('system');
  };

  // Utility function to convert temperature based on selected unit
  const convertTemperature = (tempC: number): number => {
    if (temperatureUnit === 'fahrenheit') {
      return (tempC * 9/5) + 32; // Convert to Fahrenheit
    }
    return tempC; // Already in Celsius
  };

  // Utility function to convert speed based on selected unit
  const convertSpeed = (speedKph: number): number => {
    if (speedUnit === 'mph') {
      return speedKph * 0.621371; // Convert to mph
    }
    return speedKph; // Already in km/h
  };

  // Utility function to format time string based on selected format
  const formatTimeString = (time: string): string => {
    if (timeFormat === '12h' && time.includes(':')) {
      // Very simple conversion for hour:minute format
      const [hour, minute] = time.split(':').map(Number);
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
    }
    return time;
  };

  return (
    <SettingsContext.Provider
      value={{
        temperatureUnit,
        speedUnit,
        timeFormat,
        theme,
        setTemperatureUnit,
        setSpeedUnit,
        setTimeFormat,
        setTheme,
        saveSettings,
        resetSettings,
        convertTemperature,
        convertSpeed,
        formatTimeString
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for using the settings context
export const useSettings = () => useContext(SettingsContext); 