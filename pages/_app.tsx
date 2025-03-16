import { useEffect } from 'react';
import '../styles/globals.css';
import '../styles/output.css';
import '../styles/PlaceAutocomplete.css';
import '../styles/animations.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '../context/SettingsContext';
import { LocationProvider } from '../context/LocationContext';

// Extend Window interface to include custom error property
declare global {
  interface Window {
    googleMapsApiError?: string;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  // Add global error handler for Google Maps API
  useEffect(() => {
    // Create a global error handler to catch Places API errors
    const handleGoogleMapsError = (event: ErrorEvent) => {
      if (event.message && (
        event.message.includes('Google Maps API') || 
        event.message.includes('Google Maps JavaScript API') ||
        event.message.includes('googleapis.com') ||
        event.message.includes('places') ||
        event.message.includes('geocode')
      )) {
        console.error('Google Maps API error detected:', event.message);
        // Store the error in window object for components to access
        window.googleMapsApiError = event.message;
        
        // Dispatch an event to notify components
        const errorEvent = new CustomEvent('google-maps-error', { 
          detail: { message: event.message } 
        });
        window.dispatchEvent(errorEvent);
      }
    };

    // Add error handler
    window.addEventListener('error', handleGoogleMapsError);
    
    return () => {
      // Clean up
      window.removeEventListener('error', handleGoogleMapsError);
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Head>
        <title>Weather App</title>
        <meta name="description" content="Check the weather for any location" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SettingsProvider>
        <LocationProvider>
          <Component {...pageProps} />
        </LocationProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default MyApp; 