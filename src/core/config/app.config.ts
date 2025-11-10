/**
 * Application Configuration
 * Central configuration file for the application
 */

export const appConfig = {
  name: 'Spotify Wrapped Analytics',
  shortName: 'Spotify Wrapped',
  description: 'Your Year in Music, Visualized',
  version: '1.0.0',
  
  // URLs
  spotifyPrivacyUrl: 'https://www.spotify.com/account/privacy/',
  
  // Data processing
  maxFileSize: 100 * 1024 * 1024, // 100MB
  supportedFileFormats: ['.json'],
  
  // UI
  defaultTheme: 'dark' as const,
  animationDuration: 300,
} as const;

