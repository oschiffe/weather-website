import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bars3Icon as MenuIcon, XMarkIcon as XIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Handle scroll effect for the sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/forecast', label: 'Forecast' },
    { href: '/maps', label: 'Maps' },
    { href: '/settings', label: 'Settings' },
  ];

  return (
    <header className={`sticky-header w-full ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link 
              href="/"
              className="flex items-center"
            >
              <span className="sr-only">Weather App</span>
              <div className="h-8 w-8 sm:h-10 sm:w-10 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white ml-2">
                Weather<span className="text-primary font-bold">App</span>
              </span>
            </Link>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="rounded-md p-2 inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open menu</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                href={link.href} 
                key={link.label}
                className={`text-base font-medium transition-colors duration-200 hover:text-primary ${
                  router.pathname === link.href
                    ? 'text-primary'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? 'fixed inset-0 z-40 overflow-y-auto' : 'hidden'
        } md:hidden`}
        aria-hidden={!isOpen}
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
        <div className="relative bg-white dark:bg-gray-900 max-w-xs w-full h-full shadow-xl py-4 pb-12 flex flex-col overflow-y-auto">
          <div className="px-4 flex items-center justify-between">
            <div>
              <Link 
                href="/"
                className="flex items-center"
                onClick={() => setIsOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                <span className="text-xl font-bold text-gray-900 dark:text-white ml-2">
                  Weather<span className="text-primary font-bold">App</span>
                </span>
              </Link>
            </div>
            <button
              type="button"
              className="ml-4 inline-flex items-center justify-center h-10 w-10 rounded-md bg-white dark:bg-gray-800 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6 px-4 space-y-1">
            {navLinks.map((link) => (
              <Link 
                href={link.href} 
                key={link.label}
                className={`block rounded-md py-3 px-4 text-base font-medium transition-colors duration-200 ${
                  router.pathname === link.href
                    ? 'bg-gray-100 dark:bg-gray-800 text-primary'
                    : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto px-4 py-4">
            <div className="flex justify-center">{children}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 