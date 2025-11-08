# Spotify Wrapped

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/spotify-wrapped)

This project is optimized for deployment on Vercel.

### Quick Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will auto-detect the settings
5. Click Deploy!

### Manual Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

No environment variables are required - all processing happens client-side!

### Build Configuration

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Dev Command**: `npm run dev`

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- 🎵 Analyze your Spotify listening history
- 📊 Beautiful statistics and visualizations
- 🔒 100% client-side - your data never leaves your browser
- 📱 Fully responsive design
- 🎨 Modern UI with TailwindCSS and shadcn/ui

## How to Use

1. Request your Spotify data from [Spotify Privacy Settings](https://www.spotify.com/account/privacy/)
2. Wait for the email (usually takes a few days)
3. Download and extract the ZIP file
4. Upload the JSON files to this app
5. Explore your personalized Spotify Wrapped!

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Recharts
- Fuse.js (fuzzy search)
- Lucide React (icons)

