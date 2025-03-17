import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Use local fonts instead of Google Fonts */}
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" href="/weather-icons/sunny.svg" type="image/svg+xml" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <body className="bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text">
        <Main />
        <NextScript />
        
        {/* Dark mode initialization script to prevent flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Check for saved theme preference or use default
                function getInitialTheme() {
                  const storedTheme = localStorage.getItem('theme');
                  if (typeof storedTheme === 'string') return storedTheme;
                  
                  // Check for media preference
                  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                  if (mediaQuery.matches) return 'dark';
                  
                  // Default theme
                  return 'dark';
                }
                
                const theme = getInitialTheme();
                
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                // Prevent transition animations during page load
                window.setTimeout(function() {
                  document.body.classList.add('transitions-enabled');
                }, 300);
              })();
            `,
          }}
        />
      </body>
    </Html>
  );
} 