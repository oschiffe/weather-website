import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render the toggle client-side to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';
  
  return (
    <motion.button 
      aria-label="Toggle dark mode"
      type="button"
      className="relative inline-flex h-10 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-200 p-1 text-gray-900 transition-all duration-300 dark:bg-gray-800"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      whileTap={{ scale: 0.95 }}
    >
      <span className="sr-only">Toggle theme</span>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Sun Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Moon Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="h-7 w-7 rounded-full bg-white shadow-lg"
        initial={false}
        animate={{ x: isDark ? 22 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;