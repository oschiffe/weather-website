import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type SpeedUnit = 'kph' | 'mph';
export type TimeFormat = '12h' | '24h';
export type Theme = 'system' | 'light' | 'dark';
export type WindSpeedUnit = 'kph' | 'mph';
export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsContextType {
  temperatureUnit: TemperatureUnit;
  speedUnit: SpeedUnit;
  timeFormat: TimeFormat;
  theme: Theme;
  windSpeedUnit: WindSpeedUnit;
  themeMode: ThemeMode;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setSpeedUnit: (unit: SpeedUnit) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setTheme: (theme: Theme) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setThemeMode: (mode: ThemeMode) => void;
  saveSettings: () => void;
  resetSettings: () => void;
  convertTemperature: (tempC: number) => number;
  convertSpeed: (speedKph: number) => number;
  formatTimeString: (time: string) => string;
  convertWindSpeed: (speedInMetersPerSecond: number) => number;
}

// Create context with default values
export const SettingsContext = createContext<SettingsContextType>({
  temperatureUnit: 'celsius',
  speedUnit: 'kph',
  timeFormat: '24h',
  theme: 'system',
  windSpeedUnit: 'kph',
  themeMode: 'system',
  setTemperatureUnit: () => {},
  setSpeedUnit: () => {},
  setTimeFormat: () => {},
  setTheme: () => {},
  setWindSpeedUnit: () => {},
  setThemeMode: () => {},
  saveSettings: () => {},
  resetSettings: () => {},
  convertTemperature: (temp) => temp,
  convertSpeed: (speed) => speed,
  formatTimeString: (time) => time,
  convertWindSpeed: (speed) => speed,
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
  const [windSpeedUnit, setWindSpeedUnit] = useState<WindSpeedUnit>('kph');
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

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
        setWindSpeedUnit(settings.windSpeedUnit || 'kph');
        setThemeMode(settings.themeMode || 'system');
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
        theme,
        windSpeedUnit,
        themeMode
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
    setWindSpeedUnit('kph');
    setThemeMode('system');
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

  // Save to localStorage when settings change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('temperatureUnit', temperatureUnit);
    }
  }, [temperatureUnit]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('speedUnit', speedUnit);
    }
  }, [speedUnit]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timeFormat', timeFormat);
    }
  }, [timeFormat]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      
      // Apply theme
      const root = window.document.documentElement;
      const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);
  
  // Setup system theme change listener
  useEffect(() => {
    if (typeof window !== 'undefined' && theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const root = window.document.documentElement;
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Function to convert wind speed based on user setting
  const convertWindSpeed = (speedInMetersPerSecond: number): number => {
    // Convert from m/s to km/h first
    const speedInKph = speedInMetersPerSecond * 3.6;
    
    if (windSpeedUnit === 'mph') {
      // Convert from km/h to mph
      return speedInKph * 0.621371;
    }
    
    // Return in km/h
    return speedInKph;
  };

  return (
    <SettingsContext.Provider
      value={{
        temperatureUnit,
        speedUnit,
        timeFormat,
        theme,
        windSpeedUnit,
        themeMode,
        setTemperatureUnit,
        setSpeedUnit,
        setTimeFormat,
        setTheme,
        setWindSpeedUnit,
        setThemeMode,
        saveSettings,
        resetSettings,
        convertTemperature,
        convertSpeed,
        formatTimeString,
        convertWindSpeed
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for using the settings context
export const useSettings = () => useContext(SettingsContext); 