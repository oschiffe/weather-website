import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

type WeatherType = 'clear' | 'partly' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog';

interface WeatherBackgroundProps {
  weatherType: WeatherType;
  intensity?: 'low' | 'medium' | 'high';
  fullScreen?: boolean;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ 
  weatherType, 
  intensity = 'medium',
  fullScreen = true
}) => {
  const [elements, setElements] = useState<React.ReactNode[]>([]);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  // Fix for hydration mismatch with theme
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Generate weather elements based on the weather type and intensity
  useEffect(() => {
    if (!mounted) return;
    
    const count = {
      low: { rain: 30, snow: 20, clouds: 3, fog: 3 },
      medium: { rain: 70, snow: 50, clouds: 6, fog: 6 },
      high: { rain: 120, snow: 100, clouds: 10, fog: 10 }
    };
    
    const generateElements = () => {
      switch (weatherType) {
        case 'clear':
          return generateSunElements();
        case 'partly':
          return generatePartlyCloudyElements(count[intensity].clouds);
        case 'cloudy':
          return generateCloudyElements(count[intensity].clouds);
        case 'rain':
          return [...generateCloudyElements(Math.ceil(count[intensity].clouds / 2)), ...generateRainElements(count[intensity].rain)];
        case 'thunderstorm':
          return [...generateCloudyElements(Math.ceil(count[intensity].clouds / 2)), ...generateRainElements(count[intensity].rain), ...generateLightningElements(5)];
        case 'snow':
          return [...generateCloudyElements(Math.ceil(count[intensity].clouds / 2)), ...generateSnowElements(count[intensity].snow)];
        case 'fog':
          return generateFogElements(count[intensity].fog);
        default:
          return [];
      }
    };
    
    setElements(generateElements());
  }, [weatherType, intensity, mounted, resolvedTheme]);
  
  const generateSunElements = () => {
    return [
      <motion.div 
        key="sun"
        className="absolute w-48 h-48 rounded-full bg-gradient-radial from-yellow-300 to-amber-500 shadow-lg animate-pulse"
        style={{
          top: '10%',
          right: '10%',
          filter: 'blur(2px)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 2 }}
      />,
      <motion.div
        key="sun-rays"
        className="absolute w-72 h-72 rounded-full bg-gradient-radial from-yellow-200 to-transparent shadow-lg animate-pulse"
        style={{
          top: '7%',
          right: '7%',
          filter: 'blur(4px)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 2 }}
      />,
      <motion.div
        key="sun-flare"
        className="absolute w-32 h-32"
        style={{
          top: '15%',
          right: '12%',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(5px)'
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 0.7, 0],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }}
      />
    ];
  };
  
  const generatePartlyCloudyElements = (count: number) => {
    const clouds = [];
    const positions = [
      { top: '15%', left: '10%' },
      { top: '25%', right: '15%' },
      { top: '40%', left: '25%' },
      { top: '30%', right: '30%' },
      { top: '60%', left: '50%' },
      { top: '70%', right: '20%' },
      { top: '80%', left: '30%' },
      { top: '20%', right: '40%' },
      { top: '55%', left: '15%' },
      { top: '35%', right: '50%' },
    ];
    
    for (let i = 0; i < count; i++) {
      const position = positions[i % positions.length];
      const delay = i * 0.5;
      const duration = 30 + Math.random() * 20;
      const baseSize = 100 + Math.floor(Math.random() * 100);
      
      clouds.push(
        <motion.div 
          key={`cloud-${i}`}
          className="absolute cloud"
          style={{ 
            ...position, 
            width: `${baseSize}px`, 
            height: `${baseSize * 0.6}px`,
            filter: 'blur(4px)',
            willChange: 'transform, opacity'
          }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ 
            opacity: [0, 0.8, 0.8, 0],
            x: ['-100%', '120%'],
          }}
          transition={{ 
            duration: duration, 
            times: [0, 0.1, 0.9, 1],
            repeat: Infinity, 
            delay: delay, 
            ease: "linear" 
          }}
        >
          <div className="absolute w-full h-full bg-white dark:bg-gray-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-1/2 h-1/2 bg-white dark:bg-gray-300 rounded-full"></div>
          <div className="absolute top-1/3 left-1/2 w-1/2 h-1/2 bg-white dark:bg-gray-300 rounded-full"></div>
        </motion.div>
      );
    }
    
    return [...generateSunElements(), ...clouds];
  };
  
  const generateCloudyElements = (count: number) => {
    const clouds = [];
    const positions = [
      { top: '10%', left: '5%' },
      { top: '15%', right: '10%' },
      { top: '30%', left: '20%' },
      { top: '25%', right: '25%' },
      { top: '50%', left: '40%' },
      { top: '60%', right: '15%' },
      { top: '70%', left: '25%' },
      { top: '20%', right: '35%' },
      { top: '45%', left: '10%' },
      { top: '35%', right: '40%' },
    ];
    
    for (let i = 0; i < count; i++) {
      const position = positions[i % positions.length];
      const delay = i * 0.5;
      const duration = 40 + Math.random() * 30;
      const baseSize = 120 + Math.floor(Math.random() * 150);
      const opacity = 0.7 + Math.random() * 0.3;
      
      clouds.push(
        <motion.div 
          key={`cloud-${i}`}
          className="absolute cloud"
          style={{ 
            ...position, 
            width: `${baseSize}px`, 
            height: `${baseSize * 0.6}px`,
            filter: 'blur(5px)',
            willChange: 'transform, opacity'
          }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ 
            opacity: [0, opacity, opacity, 0],
            x: ['-100%', '120%'],
          }}
          transition={{ 
            duration: duration, 
            times: [0, 0.1, 0.9, 1],
            repeat: Infinity, 
            delay: delay, 
            ease: "linear" 
          }}
        >
          <div className="absolute w-full h-full bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-1/2 h-1/2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="absolute top-1/3 left-1/2 w-1/2 h-1/2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </motion.div>
      );
    }
    
    return clouds;
  };
  
  const generateRainElements = (count: number) => {
    const raindrops = [];
    
    for (let i = 0; i < count; i++) {
      const left = `${Math.random() * 100}%`;
      const delay = Math.random() * 2;
      const duration = 0.5 + Math.random() * 0.5;
      const size = 1 + Math.random() * 1;
      
      raindrops.push(
        <motion.div
          key={`raindrop-${i}`}
          className="absolute bg-gradient-to-b from-transparent to-blue-400 dark:to-blue-600 rounded-full"
          style={{
            left,
            width: `${size}px`,
            height: `${size * 10}px`,
            filter: 'blur(0.5px)',
            willChange: 'transform'
          }}
          initial={{ top: '-5%' }}
          animate={{ top: '105%' }}
          transition={{
            duration,
            repeat: Infinity,
            delay,
            ease: 'linear',
          }}
        />
      );
    }
    
    return raindrops;
  };
  
  const generateLightningElements = (count: number) => {
    const lightningElements = [];
    
    for (let i = 0; i < count; i++) {
      const delay = 3 + Math.random() * 5;
      
      lightningElements.push(
        <motion.div
          key={`lightning-${i}`}
          className="absolute inset-0 opacity-0 mix-blend-overlay"
          style={{
            background: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(255,240,210,0.9)',
            zIndex: 1,
            willChange: 'opacity'
          }}
          animate={{ opacity: [0, 0, 0.8, 0, 0.9, 0] }}
          transition={{
            duration: 1,
            times: [0, 0.5, 0.55, 0.6, 0.65, 0.7],
            repeat: Infinity,
            delay,
            repeatDelay: 5 + Math.random() * 5,
          }}
        />
      );
    }
    
    return lightningElements;
  };
  
  const generateSnowElements = (count: number) => {
    const snowflakes = [];
    
    for (let i = 0; i < count; i++) {
      const left = `${Math.random() * 100}%`;
      const delay = Math.random() * 5;
      const duration = 6 + Math.random() * 10;
      const size = 3 + Math.random() * 4;
      const swayAmount = 30 + Math.random() * 30;
      
      snowflakes.push(
        <motion.div
          key={`snowflake-${i}`}
          className="absolute bg-white dark:bg-gray-100 rounded-full"
          style={{
            left,
            width: `${size}px`,
            height: `${size}px`,
            filter: 'blur(1px)',
            opacity: 0.8,
            willChange: 'transform'
          }}
          initial={{ top: '-5%' }}
          animate={{ 
            top: '105%',
            x: [
              `-${Math.random() * swayAmount}px`, 
              `${Math.random() * swayAmount}px`, 
              `-${Math.random() * swayAmount}px`
            ]
          }}
          transition={{ 
            duration: duration, 
            times: [0, 0.5, 1],
            repeat: Infinity, 
            delay: delay, 
            ease: "easeInOut" 
          }}
        />
      );
    }
    
    return snowflakes;
  };
  
  const generateFogElements = (count: number) => {
    const fogBanks = [];
    
    for (let i = 0; i < count; i++) {
      const top = `${15 + Math.random() * 70}%`;
      const delay = i * 1.5;
      const duration = 25 + Math.random() * 35;
      const height = 100 + Math.random() * 150;
      const opacity = 0.15 + Math.random() * 0.15;
      
      fogBanks.push(
        <motion.div
          key={`fog-${i}`}
          className="absolute left-0 w-full"
          style={{
            top,
            height: `${height}px`,
            background: isDark 
              ? 'linear-gradient(90deg, rgba(150,150,150,0) 0%, rgba(150,150,150,0.4) 50%, rgba(150,150,150,0) 100%)'
              : 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%)',
            opacity,
            filter: 'blur(20px)',
            willChange: 'transform, opacity'
          }}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ 
            x: ['100%', '-100%'],
            opacity: [0, opacity, opacity, 0],
          }}
          transition={{ 
            duration: duration, 
            times: [0, 0.1, 0.9, 1],
            repeat: Infinity, 
            delay: delay,
            ease: "linear" 
          }}
        />
      );
    }
    
    return fogBanks;
  };
  
  // Function to determine the weather background color based on weather type
  const getWeatherBackground = (weatherType: WeatherType) => {
    switch (weatherType) {
      case 'clear':
        return isDark 
          ? 'linear-gradient(to bottom, #0f172a, #1e293b)' 
          : 'linear-gradient(to bottom, #3498db, #5dade2)';
      case 'partly':
        return isDark 
          ? 'linear-gradient(to bottom, #1e293b, #334155)' 
          : 'linear-gradient(to bottom, #5dade2, #85c1e9)';
      case 'cloudy':
        return isDark 
          ? 'linear-gradient(to bottom, #334155, #475569)' 
          : 'linear-gradient(to bottom, #85c1e9, #aed6f1)';
      case 'rain':
        return isDark 
          ? 'linear-gradient(to bottom, #1e293b, #0f172a)' 
          : 'linear-gradient(to bottom, #2c3e50, #34495e)';
      case 'thunderstorm':
        return isDark 
          ? 'linear-gradient(to bottom, #0f172a, #020617)' 
          : 'linear-gradient(to bottom, #1c2833, #273746)';
      case 'snow':
        return isDark 
          ? 'linear-gradient(to bottom, #334155, #475569)' 
          : 'linear-gradient(to bottom, #d6eaf8, #ebf5fb)';
      case 'fog':
        return isDark 
          ? 'linear-gradient(to bottom, #334155, #475569)' 
          : 'linear-gradient(to bottom, #d6dbdf, #eaeded)';
      default:
        return isDark 
          ? 'linear-gradient(to bottom, #0f172a, #1e293b)' 
          : 'linear-gradient(to bottom, #3498db, #5dade2)';
    }
  };

  if (!mounted) return null;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={`weather-bg-${weatherType}-${resolvedTheme}`}
        ref={containerRef}
        className={`weather-animation-container ${fullScreen ? 'fixed inset-0 -z-10' : 'absolute inset-0 z-0'}`}
        style={{ 
          background: getWeatherBackground(weatherType),
          overflow: 'hidden'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        {elements}
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherBackground;