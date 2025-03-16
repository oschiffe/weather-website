import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import ScrollReveal from '../components/animations/ScrollReveal';
import { motion } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

export default function Settings() {
  // Get settings from context
  const {
    temperatureUnit,
    speedUnit,
    timeFormat,
    theme,
    setTemperatureUnit,
    setSpeedUnit,
    setTimeFormat,
    setTheme,
    saveSettings,
    resetSettings
  } = useSettings();
  
  // Toggle settings for location services
  const [locationTracking, setLocationTracking] = React.useState(true);
  
  return (
    <Layout 
      title="Settings | Modern Weather"
      description="Customize your weather experience"
      weatherType="clear"
      intensity="low"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ScrollReveal type="fade-down">
          <div className="pt-8 pb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center text-gray-900 dark:text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700 dark:from-primary dark:to-blue-500">
                Settings
              </span>
            </h1>
            <p className="text-lg text-center text-gray-700 dark:text-gray-200 mb-4">
              Customize your weather experience
            </p>
          </div>
        </ScrollReveal>
      
        <ScrollReveal type="fade-up">
          <Card variant="glass" padding="lg" className="shadow-xl mb-10 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">Display Preferences</h2>
            
            {/* Temperature Units */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Temperature Unit</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant={temperatureUnit === 'celsius' ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setTemperatureUnit('celsius')}
                  className="min-w-[120px]"
                >
                  Celsius (°C)
                </Button>
                <Button 
                  variant={temperatureUnit === 'fahrenheit' ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setTemperatureUnit('fahrenheit')}
                  className="min-w-[120px]"
                >
                  Fahrenheit (°F)
                </Button>
              </div>
            </div>
            
            {/* Wind Speed Units */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Wind Speed Unit</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant={speedUnit === 'kph' ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setSpeedUnit('kph')}
                  className="min-w-[120px]"
                >
                  km/h
                </Button>
                <Button 
                  variant={speedUnit === 'mph' ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setSpeedUnit('mph')}
                  className="min-w-[120px]"
                >
                  mph
                </Button>
              </div>
            </div>
            
            {/* Time Format */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Time Format</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant={timeFormat === '24h' ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setTimeFormat('24h')}
                  className="min-w-[120px]"
                >
                  24-hour
                </Button>
                <Button 
                  variant={timeFormat === '12h' ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setTimeFormat('12h')}
                  className="min-w-[120px]"
                >
                  12-hour
                </Button>
              </div>
            </div>
            
            {/* Theme */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Theme</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant={theme === 'system' ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setTheme('system')}
                  className="min-w-[120px]"
                >
                  System
                </Button>
                <Button 
                  variant={theme === 'light' ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setTheme('light')}
                  className="min-w-[120px]"
                >
                  Light
                </Button>
                <Button 
                  variant={theme === 'dark' ? 'primary' : 'ghost'}
                  size="md"
                  onClick={() => setTheme('dark')}
                  className="min-w-[120px]"
                >
                  Dark
                </Button>
              </div>
            </div>
          </Card>
        </ScrollReveal>
        
        <ScrollReveal type="fade-up" delay={0.2}>
          <Card variant="glass" padding="lg" className="shadow-xl mb-10 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-800 pb-3">Privacy & Location</h2>
            
            {/* Location Tracking */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Location Services</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Allow automatic location detection for weather updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={locationTracking}
                    onChange={() => setLocationTracking(!locationTracking)}
                  />
                  <div className="w-12 h-6 bg-gray-300 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">Data Privacy</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  We collect minimal data to provide you with accurate weather information. Your data is never shared with third parties.
                </p>
              </div>
            </div>
          </Card>
        </ScrollReveal>
        
        <ScrollReveal type="fade-up" delay={0.3}>
          <div className="flex justify-between mt-8">
            <Button 
              variant="ghost" 
              size="lg"
              onClick={resetSettings}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-200 dark:border-gray-700"
            >
              Reset to Defaults
            </Button>
            <Button 
              variant="primary" 
              size="lg"
              onClick={saveSettings}
            >
              Save Changes
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </Layout>
  );
} 