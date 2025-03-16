import React, { useEffect, useState } from 'react';

// This component ensures animations load properly across the application
const AnimationLoader: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Preload animation assets
    const preloadAnimations = async () => {
      // Simulate loading animation assets
      setTimeout(() => {
        setLoaded(true);
        
        // Dispatch an event to notify the app that animations are loaded
        window.dispatchEvent(new CustomEvent('animations-loaded'));
        
        // Add animation-ready class to the body for global styling
        document.body.classList.add('animations-ready');
      }, 300);
    };
    
    preloadAnimations();
    
    return () => {
      // Clean up
      document.body.classList.remove('animations-ready');
    };
  }, []);
  
  return null; // This component doesn't render anything visible
};

export default AnimationLoader;