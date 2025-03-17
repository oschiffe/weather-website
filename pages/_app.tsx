import { useEffect } from 'react';
import '../styles/globals.css';
import '../styles/output.css';
import '../styles/animations.css';
import '../styles/leaflet-custom.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '../context/SettingsContext';
import { LocationProvider } from '../context/LocationContext';

function MyApp({ Component, pageProps }: AppProps) {
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