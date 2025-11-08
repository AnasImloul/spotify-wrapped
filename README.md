# 🎵 Spotify Wrapped - Your Year in Music

A beautiful, privacy-focused web application that lets you visualize your Spotify listening history. Upload your Spotify data export and discover insights about your musical journey throughout the year.

## ✨ Features

- 📊 **Comprehensive Statistics**: See your total listening time, number of tracks, and unique artists
- 🏆 **Top Charts**: Discover your most-played artists and tracks
- 📈 **Listening Trends**: Visualize your listening patterns over time
- ✨ **Music Evolution**: Explore how your music taste evolved throughout the year
- 🔒 **Privacy First**: All data processing happens locally in your browser - nothing is sent to any server
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Installation

1. Clone the repository or download the source code

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

The built files will be in the `dist` directory.

## 📥 How to Get Your Spotify Data

1. Go to your [Spotify Privacy Settings](https://www.spotify.com/account/privacy/)
2. Scroll down to "Download your data"
3. Request your "Extended streaming history" (recommended) or "Account data"
4. Wait for the email from Spotify (usually takes a few days)
5. Download the ZIP file and extract it
6. Upload the JSON files to this app

### Supported Files

- `StreamingHistory_music_*.json` - Your listening history
- `Wrapped*.json` - Official Spotify Wrapped data
- `Userdata.json` - Your account information

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Base UI components (shadcn)
│   ├── FileUpload.tsx  # Drag & drop file upload
│   ├── StatsOverview.tsx
│   ├── TopItems.tsx
│   ├── ListeningTrends.tsx
│   └── MusicEvolution.tsx
├── lib/
│   ├── utils.ts        # Utility functions
│   └── dataProcessor.ts # Data parsing and statistics
├── types/
│   └── spotify.ts      # TypeScript type definitions
├── App.tsx             # Main application
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Features in Detail

### Statistics Overview
- Total listening time (hours and days)
- Number of unique tracks played
- Number of unique artists discovered
- Daily listening average
- Top listener percentile (from Wrapped data)
- Most active listening day

### Top Charts
- Top 10 Artists with play counts and listening time
- Top 10 Tracks with play counts
- Detailed tables with hover effects

### Listening Trends
- Interactive line chart showing monthly listening patterns
- Visual representation of your music consumption over time

### Music Evolution
- Spotify's music evolution eras (from Wrapped data)
- Genre, mood, and descriptor tags for each era
- Defining tracks for each musical period

## 🔐 Privacy & Security

- **100% Client-Side**: All data processing happens in your browser
- **No Server Upload**: Your data never leaves your device
- **No Tracking**: No analytics or tracking scripts
- **Open Source**: You can review the entire codebase

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This is an unofficial tool and is not affiliated with, endorsed by, or connected to Spotify AB. All Spotify trademarks, service marks, trade names, logos, and other intellectual property are the property of Spotify AB.

## 🙏 Acknowledgments

- Spotify for providing the data export feature
- The React and Vite teams for excellent tools
- The shadcn/ui project for beautiful components
- All contributors and users of this project

---

Made with 💚 for music lovers

