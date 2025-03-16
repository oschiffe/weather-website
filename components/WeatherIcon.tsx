import React from 'react';
import { motion, Variants } from 'framer-motion';

// Weather condition types
type WeatherCondition = 'clear' | 'partly-cloudy' | 'cloudy' | 'rain' | 'heavy-rain' | 'snow' | 'thunderstorm' | 'fog' | 'unknown';
type IconSize = 'small' | 'medium' | 'large' | 'xl';

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: IconSize;
  animate?: boolean;
  className?: string;
  isDay?: boolean;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  condition, 
  size = 'medium', 
  animate = true,
  className = '',
  isDay = true
}) => {
  // Map size to tailwind classes
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'text-xl';
      case 'medium':
        return 'text-3xl';
      case 'large':
        return 'text-5xl';
      case 'xl':
        return 'text-7xl';
      default:
        return 'text-3xl';
    }
  };

  // Get color based on condition and time of day
  const getIconColor = () => {
    if (!isDay && condition === 'clear') {
      return 'text-slate-300 drop-shadow-glow-blue'; // Moon color with subtle blue glow
    }

    switch (condition) {
      case 'clear':
        return 'text-amber-400 drop-shadow-glow-yellow filter brightness-110'; // Brighter yellow with enhanced glow
      case 'partly-cloudy':
        return isDay ? 'text-slate-500 drop-shadow-md' : 'text-slate-400 drop-shadow-sm';
      case 'cloudy':
        return 'text-gray-400 drop-shadow-md';
      case 'rain':
        return 'text-blue-400 drop-shadow-glow-blue';
      case 'heavy-rain':
        return 'text-blue-500 drop-shadow-glow-blue filter brightness-110';
      case 'snow':
        return 'text-blue-100 drop-shadow-glow-blue filter brightness-110';
      case 'thunderstorm':
        return 'text-purple-500 drop-shadow-glow-purple';
      case 'fog':
        return 'text-gray-300 opacity-80';
      default:
        return 'text-gray-500';
    }
  };

  // Animation variants based on weather condition
  const getAnimationVariants = (): Variants => {
    if (!animate) return {};

    switch (condition) {
      case 'clear':
        return {
          initial: { scale: 0.95, opacity: 0.8 },
          animate: {
            scale: 1.05,
            opacity: 1,
            rotate: isDay ? [0, 2, 0, -2, 0] : [0, 1, 0, -1, 0],
            y: [0, -2, 0, 2, 0],
            transition: {
              repeat: Infinity,
              duration: isDay ? 5 : 7,
              ease: "easeInOut"
            }
          }
        };
      case 'partly-cloudy':
        return {
          initial: { x: -5, opacity: 0.8 },
          animate: {
            x: [0, 5, 0, -5, 0],
            opacity: [0.9, 1, 0.9],
            transition: {
              repeat: Infinity,
              duration: 8,
              ease: "easeInOut"
            }
          }
        };
      case 'cloudy':
        return {
          initial: { x: 0, opacity: 0.8 },
          animate: {
            x: [0, 5, 0, -5, 0],
            opacity: [0.8, 0.9, 0.8],
            transition: {
              repeat: Infinity,
              duration: 10,
              ease: "easeInOut"
            }
          }
        };
      case 'rain':
      case 'heavy-rain':
        return {
          initial: { y: -5, opacity: 0.8 },
          animate: {
            y: [0, 2, 0],
            opacity: [0.8, 1, 0.8],
            transition: {
              repeat: Infinity,
              duration: condition === 'heavy-rain' ? 2.5 : 3.5,
              ease: "easeInOut"
            }
          }
        };
      case 'snow':
        return {
          initial: { rotate: 0, y: 0, filter: "drop-shadow(0 0 0 rgba(219, 234, 254, 0))" },
          animate: {
            rotate: [0, 15, -15, 0],
            y: [0, 3, 0],
            filter: [
              "drop-shadow(0 0 2px rgba(219, 234, 254, 0.3))",
              "drop-shadow(0 0 4px rgba(219, 234, 254, 0.5))",
              "drop-shadow(0 0 2px rgba(219, 234, 254, 0.3))"
            ],
            transition: {
              rotate: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              },
              y: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              },
              filter: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }
          }
        };
      case 'thunderstorm':
        return {
          initial: { scale: 1, filter: "drop-shadow(0 0 0 rgba(234, 179, 8, 0))" },
          animate: {
            scale: [1, 1.1, 1],
            filter: [
              "drop-shadow(0 0 2px rgba(234, 179, 8, 0.3))",
              "drop-shadow(0 0 8px rgba(234, 179, 8, 0.7))",
              "drop-shadow(0 0 2px rgba(234, 179, 8, 0.3))"
            ],
            transition: {
              scale: {
                duration: 0.7,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              },
              filter: {
                duration: 0.7,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
              }
            }
          }
        };
      case 'fog':
        return {
          initial: { opacity: 0.7, filter: "blur(0px)" },
          animate: {
            opacity: [0.7, 0.9, 0.7],
            filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
            transition: {
              opacity: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              },
              filter: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }
          }
        };
      default:
        return {
          initial: { scale: 0.9, opacity: 0.8 },
          animate: {
            scale: 1,
            opacity: 1,
            transition: {
              repeat: Infinity,
              duration: 3,
              repeatType: "reverse"
            }
          }
        };
    }
  };

  const sizeClass = getSizeClass();
  const colorClass = getIconColor();
  const animationVariants = getAnimationVariants();

  // Render SVG icons based on condition
  const renderIcon = () => {
    switch (condition) {
      case 'clear':
        return isDay ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0.5" stroke="rgba(0,0,0,0.1)">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0.5" stroke="rgba(0,0,0,0.1)">
            <path d="M12 3a9 9 0 0 1 9 9c0 2.22-.8 4.23-2.12 5.88.77.6 1.7.94 2.68.94.55 0 1 .45 1 1s-.45 1-1 1h-19c-.55 0-1-.45-1-1s.45-1 1-1c.98 0 1.91-.34 2.68-.94A8.98 8.98 0 0 1 3 12a9 9 0 0 1 9-9zm0 3.6V6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
          </svg>
        );
      case 'partly-cloudy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0.5" stroke="rgba(0,0,0,0.1)">
            <path d="M12 2v2M12 8v2M4.22 4.22l1.42 1.42M18.36 5.64l1.42-1.42M2 12h2M20 12h2M17 17h-6a4 4 0 1 1 0-8h1a5.5 5.5 0 0 1 11 0v1a3 3 0 0 1-6 0" />
          </svg>
        );
      case 'cloudy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0.5" stroke="rgba(0,0,0,0.1)">
            <path d="M17 7h-2a5 5 0 0 0-9.7 1A3 3 0 1 0 5 15h12a4 4 0 0 0 0-8z" />
          </svg>
        );
      case 'rain':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0.5" stroke="rgba(0,0,0,0.1)">
            <path d="M17 7h-2a5 5 0 0 0-9.7 1A3 3 0 1 0 5 15h12a4 4 0 0 0 0-8z" />
            <path d="M8 19v2M12 19v2M16 19v2" />
          </svg>
        );
      case 'heavy-rain':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0.5" stroke="rgba(0,0,0,0.1)">
            <path d="M17 7h-2a5 5 0 0 0-9.7 1A3 3 0 1 0 5 15h12a4 4 0 0 0 0-8z" />
            <path d="M7 19v2M10 19v2M13 19v2M16 19v2" />
          </svg>
        );
      case 'snow':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0.5" stroke="rgba(0,0,0,0.1)">
            <path d="M17 7h-2a5 5 0 0 0-9.7 1A3 3 0 1 0 5 15h12a4 4 0 0 0 0-8z" />
            <path d="M8 19h.01M12 19h.01M16 19h.01M8 22h.01M12 22h.01M16 22h.01" />
          </svg>
        );
      case 'thunderstorm':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0.5" stroke="rgba(0,0,0,0.1)">
            <path d="M17 7h-2a5 5 0 0 0-9.7 1A3 3 0 1 0 5 15h12a4 4 0 0 0 0-8z" />
            <path d="M12 15l-2 5h4l-2 4" />
          </svg>
        );
      case 'fog':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0.5" stroke="rgba(0,0,0,0.1)">
            <path d="M5 5h14M5 9h14M5 13h14M5 17h14" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" strokeWidth="0.5" stroke="rgba(0,0,0,0.1)">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      className={`flex items-center justify-center ${sizeClass} ${colorClass} ${className}`}
      initial="initial"
      animate="animate"
      variants={animationVariants}
    >
      {renderIcon()}
    </motion.div>
  );
};

export default WeatherIcon; 