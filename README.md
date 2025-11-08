# Spotify Wrapped Analytics

A privacy-focused web application for visualizing and analyzing your Spotify listening history. Upload your Spotify data export to gain insights into your music consumption patterns, discover your most-played artists and tracks, and explore how your musical taste evolved over time.

## Features

- **Comprehensive Statistics**: Total listening time, track count, unique artists, and daily averages
- **Top Charts**: Most-played artists and tracks with detailed play counts and listening duration
- **Timeline Analysis**: Interactive graphs showing individual artist/track listening patterns over time
- **Comparison Tools**: Compare listening trends across multiple artists or tracks simultaneously
- **Listening Trends**: Monthly listening patterns visualized through interactive charts
- **Music Evolution**: Explore how your music taste evolved throughout the year (when Wrapped data is available)
- **Date Range Filtering**: Filter statistics by specific time periods
- **Search & Discovery**: Fuzzy search across artists and tracks with pagination
- **Privacy First**: All data processing occurs locally in your browser—nothing is uploaded to any server

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first styling
- **shadcn/ui** - Modern UI component library
- **Recharts** - Interactive data visualization
- **Lucide React** - Icon system
- **Fuse.js** - Fuzzy search implementation

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd spotify-wrapped
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be available in the `dist` directory.

## Obtaining Your Spotify Data

1. Navigate to [Spotify Privacy Settings](https://www.spotify.com/account/privacy/)
2. Scroll to "Download your data" section
3. Request your **Extended streaming history** (recommended) or **Account data**
4. Wait for Spotify's email confirmation (typically 5-30 days)
5. Download and extract the ZIP file
6. Upload the JSON files to this application

### Supported File Types

The application processes the following data files:

- `StreamingHistory_music_*.json` - Detailed listening history with timestamps
- `Wrapped*.json` - Official Spotify Wrapped analytics (if available)
- `Userdata.json` - Account information and preferences

## Project Structure

```
src/
├── components/
│   ├── ui/                      # Base UI components (buttons, inputs, cards, etc.)
│   ├── ArtistComparison.tsx     # Multi-artist comparison modal
│   ├── DateRangeSelector.tsx    # Date filtering interface
│   ├── FileUpload.tsx           # Drag-and-drop file upload
│   ├── ItemTimeline.tsx         # Individual artist/track timeline modal
│   ├── ListeningTrends.tsx      # Monthly trends chart
│   ├── MonthPicker.tsx          # Custom month/year selector
│   ├── MusicEvolution.tsx       # Music taste evolution display
│   ├── StatsOverview.tsx        # Key statistics cards
│   ├── TopItems.tsx             # Top artists and tracks tables
│   └── TrackComparison.tsx      # Multi-track comparison modal
├── lib/
│   ├── dataProcessor.ts         # Data parsing and statistics calculation
│   ├── sorting.ts               # Centralized sorting utilities
│   └── utils.ts                 # Helper functions
├── types/
│   └── spotify.ts               # TypeScript type definitions
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── index.css                    # Global styles and theme
```

## Key Features Explained

### Statistics Dashboard
- Aggregate listening metrics (total time, tracks, artists)
- Daily listening averages
- Top listener percentile (when Wrapped data is available)
- Most active listening day identification

### Advanced Charts
- **Artist/Track Tables**: Paginated tables with fuzzy search, sortable by play count or listening time
- **Individual Timelines**: Click any artist or track to view detailed monthly listening patterns
- **Comparison Mode**: Compare up to 8 artists or tracks simultaneously on a single chart
- **Interactive Tooltips**: Hover over any data point for detailed information

### Date Range Filtering
- Custom month/year picker with modern UI
- Filter all statistics by specific time periods
- Defaults to current calendar year
- Respects available data boundaries

### Privacy & Security

- **100% Client-Side Processing**: All computations run in your browser
- **Zero Server Communication**: No data is transmitted over the network
- **No Tracking or Analytics**: Your listening history remains completely private
- **Open Source**: Full transparency—audit the code yourself

## Performance Considerations

The application efficiently handles large datasets:
- Streaming history files with 50,000+ entries
- Pagination prevents UI lag with large result sets
- Optimized React rendering with `useMemo` and `useCallback`
- Debounced search for responsive filtering

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Modern ES2020+ features are used, so older browsers are not supported.

## Contributing

Contributions are welcome. Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Disclaimer

This is an independent project and is not affiliated with, endorsed by, or connected to Spotify AB. All Spotify trademarks and intellectual property belong to Spotify AB.

## Acknowledgments

- Spotify for providing data export functionality
- React, Vite, and TailwindCSS teams for excellent developer tools
- shadcn for the component design system
- The open-source community

---

Built for music enthusiasts who love data.
