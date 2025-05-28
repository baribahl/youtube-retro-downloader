# 🎮 YouTube Retro Downloader

A nostalgic 90s-style YouTube video downloader with neon aesthetics and modern functionality. Built with React, TypeScript, and Vite for a blazing-fast retro experience.

![Retro Style](https://img.shields.io/badge/style-90s%20retro-ff00ff?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkYwMEZGIi8+Cjwvc3ZnPgo=)
![License](https://img.shields.io/badge/license-MIT-00ffff?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)

## ✨ Features

- 🎨 **Authentic 90s Retro UI** - Neon colors, animated grid background, and glowing elements
- 📺 **Multiple Video Formats** - Download in 2160p, 1440p, 1080p, 720p, 480p MP4 or MP3 audio
- 📝 **Smart File Naming** - Automatic naming: `[Channel]_[YYYY-MM-DD]_[Title]_[DL-YYYY-MM-DD-HH-MM].[ext]`
- 🎵 **Playlist Support** - Download entire playlists or individual videos
- 🔐 **Subscription Content** - Support for subscription-only videos via cookie management
- 🎯 **URL Validation** - Smart YouTube URL detection and parsing
- 📱 **Quick Test Buttons** - Pre-loaded sample URLs for easy testing
- ⚡ **Real-time Progress** - Animated download progress with retro styling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.7+ (for yt-dlp backend)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/youtube-retro-downloader.git
   cd youtube-retro-downloader
   ```

2. **Install dependencies**
   ```bash
   npm install
   pip install yt-dlp
   ```

3. **Start the application**
   ```bash
   npm start
   ```
   This will start both the frontend (localhost:5173) and backend (localhost:3001) servers.

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview  # Preview the production build
```

## 🎮 Usage

1. **Enter YouTube URL** - Paste any YouTube video or playlist URL
2. **Preview Video** - See thumbnail, title, channel, and metadata
3. **Choose Format** - Select your preferred quality and format (MP4/MP3)
4. **Download** - Watch the retro progress bar fill up!

### Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/playlist?list=PLAYLIST_ID`
- `https://music.youtube.com/watch?v=VIDEO_ID`

### File Naming Convention

Downloaded files follow this pattern:
```
[Channel Name]_[YYYY-MM-DD]_[Video Title]_[DL-YYYY-MM-DD-HH-MM].[ext]
```

Example:
```
TechChannel_2024-01-15_Amazing_Tutorial_DL-2024-01-15-14-30.mp4
```

## 🛠 Technical Stack

- **Frontend Framework**: React 18 with TypeScript
- **Backend**: Node.js with Express
- **Download Engine**: yt-dlp (Python)
- **Build Tool**: Vite for lightning-fast development
- **Styling**: Pure CSS with custom 90s retro theme
- **Fonts**: Press Start 2P, Orbitron (Google Fonts)
- **State Management**: React hooks and context
- **Date Handling**: date-fns library
- **HTTP Client**: Axios for API calls

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── UrlInput.tsx     # URL input with validation
│   ├── VideoPreview.tsx # Video information display
│   ├── DownloadOptions.tsx # Format selection
│   ├── DownloadProgress.tsx # Progress tracking
│   └── CookieManager.tsx # Session management
├── utils/
│   └── youtube.ts       # YouTube API utilities
├── types.ts             # TypeScript definitions
├── App.tsx              # Main application
└── index.css            # Retro styling
```

## 🎨 Retro Design System

### Color Palette
- **Primary Pink**: `#ff00ff` (Neon Magenta)
- **Cyan**: `#00ffff` (Electric Cyan)
- **Green**: `#00ff00` (Neon Green)
- **Dark Background**: `#0a0a0a` (Near Black)

### Typography
- **Headers**: Press Start 2P (pixel font)
- **Body**: Orbitron (futuristic monospace)

### Visual Effects
- Animated grid background
- Glowing button effects
- Neon text shadows
- Gradient borders
- Retro panel styling

## 🚀 Deployment

### GitHub Pages

This project is designed to work with GitHub Pages. To deploy:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   - Push your code to GitHub
   - Enable GitHub Pages in repository settings
   - Set source to `dist` folder

### Other Platforms

The built files in the `dist` directory can be deployed to:
- Netlify
- Vercel
- Firebase Hosting
- Any static hosting service

## ⚠️ Important Notes

### Real YouTube Downloading

This application includes a **fully functional backend** with real YouTube downloading capabilities:

1. **Backend Server** - Node.js/Express server with yt-dlp integration
2. **Real Downloads** - Actual video/audio file downloading using yt-dlp
3. **Cookie Support** - Handles subscription-only content with cookie authentication
4. **Multiple Formats** - Supports MP4 (2160p-480p) and MP3 audio downloads
5. **Progress Tracking** - Real-time download progress monitoring

### Cookie Authentication

For subscription-only content:
1. Use the Cookie Manager component in the app
2. Paste your YouTube cookies (from browser dev tools)
3. Downloads will use your authentication for premium content

### Legal Considerations

- Only download content you have rights to download
- Respect copyright laws and YouTube's Terms of Service
- Use responsibly and ethically

### Legal Compliance

- Ensure compliance with YouTube's Terms of Service
- Respect copyright and fair use policies
- Consider implementing rate limiting and usage restrictions

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Components** - Add to `src/components/`
2. **API Functions** - Extend `src/utils/youtube.ts`
3. **Types** - Update `src/types.ts`
4. **Styling** - Modify `src/index.css`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by 90s web design and neon aesthetics
- Built with modern React and TypeScript
- Fonts from Google Fonts (Press Start 2P, Orbitron)

---

*Made with 💖 and lots of neon glow*
  },
})
```
