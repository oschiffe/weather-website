import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from './Header';
import AnimationLoader from './AnimationLoader';
import ThemeToggle from './ThemeToggle';
import WeatherBackground from './animations/WeatherBackground';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  weatherType?: 'clear' | 'partly' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog';
  intensity?: 'low' | 'medium' | 'high';
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Weather App',
  description = 'A beautiful weather application with real-time forecasts',
  weatherType = 'clear',
  intensity = 'medium',
}) => {
  const [animationsLoaded, setAnimationsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Effect to handle animation loading
  useEffect(() => {
    // Listen for animation loaded event
    const handleAnimationsLoaded = () => {
      console.log('Animations loaded successfully');
      setAnimationsLoaded(true);
    };
    
    window.addEventListener('animations-loaded', handleAnimationsLoaded);
    
    // Set animations loaded after a timeout as fallback
    const timeoutId = setTimeout(() => {
      setAnimationsLoaded(true);
    }, 1500);
    
    return () => {
      window.removeEventListener('animations-loaded', handleAnimationsLoaded);
      clearTimeout(timeoutId);
    };
  }, []);

  // Hydration fix for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#007AFF" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
        {/* Preload critical assets */}
        <link rel="preload" href="/weather-icons/clear.svg" as="image" type="image/svg+xml" />
        {/* Add animation styles */}
        <style jsx global>{`
          body {
            transition: background-color 0.5s ease-in-out;
            background-attachment: fixed;
            overflow-x: hidden;
          }
          
          /* Animation-ready transitions */
          body.animations-ready * {
            transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
          }
          
          /* Fades in the entire app once animations are loaded */
          body.animations-ready main {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          /* Modern gradient overlay with enhanced colors */
          .gradient-overlay {
            background: linear-gradient(
              135deg, 
              rgba(79, 70, 229, 0.15) 0%, 
              rgba(139, 92, 246, 0.1) 50%, 
              rgba(236, 72, 153, 0.08) 100%
            );
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -2;
            pointer-events: none;
          }
          
          /* Animated shape with improved animation */
          .animated-shape {
            position: fixed;
            width: 45vmax;
            height: 45vmax;
            border-radius: 46% 54% 52% 48% / 45% 38% 62% 55%;
            background: linear-gradient(
              45deg, 
              rgba(79, 70, 229, 0.12), 
              rgba(139, 92, 246, 0.08)
            );
            animation: morph 18s ease-in-out infinite;
            opacity: 0.6;
            z-index: -1;
            pointer-events: none;
            will-change: transform, border-radius;
            filter: blur(2px);
          }
          
          @keyframes morph {
            0% {
              border-radius: 46% 54% 52% 48% / 45% 38% 62% 55%;
              transform: translate(0%, 0%) rotate(0deg) scale(1);
            }
            25% {
              border-radius: 62% 38% 48% 52% / 60% 35% 65% 40%;
              transform: translate(-2%, 3%) rotate(2deg) scale(1.05);
            }
            50% {
              border-radius: 42% 58% 35% 65% / 50% 55% 45% 50%;
              transform: translate(-3%, 5%) rotate(180deg) scale(1);
            }
            75% {
              border-radius: 55% 45% 65% 35% / 40% 60% 40% 60%;
              transform: translate(-1%, 2%) rotate(250deg) scale(0.95);
            }
            100% {
              border-radius: 46% 54% 52% 48% / 45% 38% 62% 55%;
              transform: translate(0%, 0%) rotate(360deg) scale(1);
            }
          }

          /* Improved glassmorphism effect */
          .glassmorphism {
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.03);
          }

          /* Enhanced sticky header styling */
          .sticky-header {
            position: sticky;
            top: 0;
            z-index: 40;
            transition: all 0.3s ease-in-out;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }

          .sticky-header.scrolled {
            background-color: rgba(255, 255, 255, 0.7);
            box-shadow: 0 4px 20px -1px rgba(0, 0, 0, 0.1);
          }

          .dark .sticky-header.scrolled {
            background-color: rgba(17, 24, 39, 0.7);
          }

          /* Enhanced card styling with subtle hover animations */
          .card-hover {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
          }

          /* Modern rounded corners */
          .rounded-apple {
            border-radius: 16px;
          }

          .rounded-apple-sm {
            border-radius: 12px;
          }
          
          /* Responsive typography */
          @media (max-width: 640px) {
            h1 {
              font-size: 1.75rem !important;
              line-height: 1.2 !important;
            }
            h2 {
              font-size: 1.5rem !important;
              line-height: 1.3 !important;
            }
          }
        `}</style>
      </Head>

      {/* Preload animations */}
      <AnimationLoader />
      
      {/* Weather Background Animation */}
      {mounted && (
        <WeatherBackground 
          weatherType={weatherType} 
          intensity={intensity}
          fullScreen={true}
        />
      )}

      <div className={`relative z-10 flex flex-col min-h-screen ${animationsLoaded ? 'animations-ready' : ''}`}>
        <Header>
          <ThemeToggle />
        </Header>
        
        <motion.main 
          className="flex-grow py-8 px-4 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          layoutId="main-content"
        >
          {children}
        </motion.main>
        
        <footer className="relative z-10 mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  &copy; {new Date().getFullYear()} Weather App | Designed with modern design principles
                </p>
                <div className="mt-4 md:mt-0 flex space-x-4">
                  <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary transition">
                    Terms
                  </Link>
                  <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary transition">
                    Privacy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout; 