import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WeatherAnimationProps {
  weatherCondition: string;
  isDay: boolean;
}

const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ 
  weatherCondition, 
  isDay = true 
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; size: number; speed: number; delay: number }>>([]);
  
  useEffect(() => {
    // Generate random particles based on weather condition
    const generateParticles = () => {
      const newParticles = [];
      const count = weatherCondition.includes('rain') ? 100 : 
                    weatherCondition.includes('snow') ? 50 :
                    weatherCondition.includes('cloud') ? 15 : 10;
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // random position across screen width (%)
          size: weatherCondition.includes('rain') ? 
                Math.random() * 3 + 1 : // rain drops
                weatherCondition.includes('snow') ? 
                Math.random() * 5 + 2 : // snow flakes
                Math.random() * 80 + 40, // clouds or sun rays
          speed: weatherCondition.includes('rain') ? 
                 Math.random() * 1 + 0.5 : // rain speed
                 weatherCondition.includes('snow') ? 
                 Math.random() * 0.5 + 0.2 : // snow speed
                 Math.random() * 0.2 + 0.05, // cloud speed
          delay: Math.random() * 5
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
  }, [weatherCondition]);

  const getBackground = () => {
    if (!isDay) {
      return 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)'; // Night
    }
    
    if (weatherCondition.includes('clear')) {
      return 'linear-gradient(to bottom, #2980B9, #6DD5FA, #FFFFFF)'; // Sunny
    } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
      return 'linear-gradient(to bottom, #616161, #9bc5c3)'; // Rainy
    } else if (weatherCondition.includes('cloud')) {
      return 'linear-gradient(to bottom, #757F9A, #D7DDE8)'; // Cloudy
    } else if (weatherCondition.includes('thunderstorm')) {
      return 'linear-gradient(to bottom, #232526, #414345)'; // Stormy
    } else if (weatherCondition.includes('snow')) {
      return 'linear-gradient(to bottom, #E6DADA, #274046)'; // Snowy
    } else if (weatherCondition.includes('fog') || weatherCondition.includes('mist')) {
      return 'linear-gradient(to bottom, #D3CCE3, #E9E4F0)'; // Foggy
    } else {
      return 'linear-gradient(to bottom, #2980B9, #6DD5FA, #FFFFFF)'; // Default
    }
  };

  return (
    <div 
      className="weather-animation-container"
      style={{ 
        background: getBackground(),
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
        transition: 'background 1.5s ease-in-out'
      }}
    >
      <AnimatePresence>
        {/* Sun or Moon */}
        {(weatherCondition.includes('clear') || weatherCondition.includes('cloud')) && (
          <motion.div
            key="celestial-body"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              x: [0, 10, -10, 0],
              transition: { 
                opacity: { duration: 2 },
                y: { duration: 2 },
                scale: { duration: 2 },
                x: { repeat: Infinity, duration: 10, ease: "easeInOut" }
              }
            }}
            style={{
              position: 'absolute',
              top: '15%',
              right: '15%',
              width: isDay ? '100px' : '70px',
              height: isDay ? '100px' : '70px',
              borderRadius: '50%',
              background: isDay ? 
                'radial-gradient(circle, rgba(255,255,190,1) 0%, rgba(255,233,138,1) 80%, rgba(255,223,87,1) 100%)' : 
                'radial-gradient(circle, rgba(240,240,240,1) 0%, rgba(220,220,220,1) 80%, rgba(200,200,200,1) 100%)',
              boxShadow: isDay ? 
                '0 0 80px 20px rgba(255, 255, 190, 0.8)' : 
                '0 0 40px 10px rgba(240, 240, 240, 0.4)',
              zIndex: 1
            }}
          />
        )}

        {/* Animated particles based on weather */}
        {particles.map((particle) => {
          // Raindrops
          if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
            return (
              <motion.div
                key={`rain-${particle.id}`}
                initial={{ 
                  top: -20, 
                  left: `${particle.x}%`,
                  opacity: 0.7 + Math.random() * 0.3
                }}
                animate={{ 
                  top: '105%',
                  opacity: 0.3
                }}
                transition={{ 
                  duration: weatherCondition.includes('drizzle') ? particle.speed * 2 : particle.speed * 1.5,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'linear'
                }}
                style={{
                  position: 'absolute',
                  width: '1px',
                  height: `${particle.size * 15}px`,
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.8))',
                  borderRadius: '40%',
                  zIndex: 2
                }}
              />
            );
          }
          
          // Snowflakes
          if (weatherCondition.includes('snow')) {
            return (
              <motion.div
                key={`snow-${particle.id}`}
                initial={{ 
                  top: -20, 
                  left: `${particle.x}%` 
                }}
                animate={{
                  top: '105%',
                  left: [`${particle.x}%`, `${particle.x + (Math.random() * 20 - 10)}%`, `${particle.x}%`]
                }}
                transition={{ 
                  duration: particle.speed * 15,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: 'linear',
                  left: {
                    duration: particle.speed * 5,
                    repeat: Infinity,
                    repeatType: 'mirror'
                  }
                }}
                style={{
                  position: 'absolute',
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  background: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 0 3px rgba(255, 255, 255, 0.8)',
                  zIndex: 2
                }}
              />
            );
          }
          
          // Clouds
          if (weatherCondition.includes('cloud') || weatherCondition.includes('overcast')) {
            return (
              <motion.div
                key={`cloud-${particle.id}`}
                initial={{ 
                  left: -100, 
                  top: `${20 + (Math.random() * 30)}%`,
                  opacity: 0.3 + Math.random() * 0.7
                }}
                animate={{
                  left: '105%',
                }}
                transition={{ 
                  duration: particle.speed * 200,
                  repeat: Infinity,
                  delay: particle.delay * 5,
                  ease: 'linear'
                }}
                style={{
                  position: 'absolute',
                  width: `${particle.size}px`,
                  height: `${particle.size * 0.6}px`,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.8)',
                  filter: 'blur(10px)',
                  zIndex: 1
                }}
              />
            );
          }
          
          // Lightning for thunderstorms
          if (weatherCondition.includes('thunderstorm') && particle.id % 20 === 0) {
            return (
              <motion.div
                key={`lightning-${particle.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0.2, 0.8, 0] }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 5 + Math.random() * 7,
                  delay: particle.delay * 2,
                  ease: 'easeOut'
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.3)',
                  zIndex: 3
                }}
              />
            );
          }
          
          // Fog/mist particles
          if (weatherCondition.includes('fog') || weatherCondition.includes('mist')) {
            return (
              <motion.div
                key={`fog-${particle.id}`}
                initial={{ 
                  opacity: 0.2 + Math.random() * 0.4,
                  left: `${particle.x}%`,
                  top: `${20 + (Math.random() * 60)}%`,
                }}
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                  left: [`${particle.x}%`, `${particle.x + 5}%`, `${particle.x}%`],
                }}
                transition={{ 
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut'
                }}
                style={{
                  position: 'absolute',
                  width: `${particle.size * 2}px`,
                  height: `${particle.size}px`,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.5)',
                  filter: 'blur(20px)',
                  zIndex: 1
                }}
              />
            );
          }
          
          // Sunny day rays
          if (weatherCondition.includes('clear') && isDay) {
            return (
              <motion.div
                key={`sun-ray-${particle.id}`}
                initial={{ 
                  opacity: 0.1 + Math.random() * 0.2,
                  top: '15%',
                  right: '15%',
                  scale: 0
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: 1.5,
                }}
                transition={{ 
                  duration: 3 + Math.random() * 5,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: particle.delay * 2,
                  ease: 'easeInOut'
                }}
                style={{
                  position: 'absolute',
                  width: `${particle.size * 3}px`,
                  height: `${particle.size * 3}px`,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 190, 0.3)',
                  filter: 'blur(30px)',
                  zIndex: 0,
                  transform: 'translate(50%, -50%)'
                }}
              />
            );
          }
          
          // Default fallback
          return null;
        })}
      </AnimatePresence>
    </div>
  );
};

export default WeatherAnimation;