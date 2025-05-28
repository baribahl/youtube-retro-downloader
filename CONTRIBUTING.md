# Contributing to YouTube Retro Downloader

Thank you for your interest in contributing! This project welcomes contributions from developers who appreciate retro aesthetics and modern web technologies.

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/youtube-retro-downloader.git
   cd youtube-retro-downloader
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/          # React components
├── utils/              # Utility functions
├── types.ts            # TypeScript definitions
├── App.tsx             # Main application
└── index.css           # Retro styling
```

## Coding Standards

- **TypeScript**: All new code should be written in TypeScript
- **Components**: Use functional components with hooks
- **Styling**: Maintain the retro 90s aesthetic with neon colors
- **Imports**: Use explicit file extensions (`.tsx`, `.ts`)

## Retro Design Guidelines

- **Colors**: Stick to the neon palette (magenta, cyan, green)
- **Fonts**: Use Press Start 2P for headers, Orbitron for body text
- **Effects**: Include glowing effects and animated backgrounds
- **Layout**: Maintain the nostalgic feel with proper spacing

## Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
3. **Test thoroughly:**
   ```bash
   npm run build
   npm run preview
   ```

4. **Submit a pull request**

## Adding New Features

### New Components
- Place in `src/components/`
- Follow existing naming conventions
- Include proper TypeScript interfaces
- Add retro styling

### API Functions
- Add to `src/utils/youtube.ts`
- Update type definitions in `src/types.ts`
- Maintain backend compatibility for full functionality

### Styling
- Add styles to `src/index.css`
- Use CSS custom properties for consistency
- Maintain responsiveness

## Backend Integration (Future)

Currently, this is a frontend-only implementation. For real YouTube downloading:

1. **Backend Requirements:**
   - YouTube API integration
   - Download service (yt-dlp, youtube-dl)
   - Session management

2. **Legal Considerations:**
   - YouTube Terms of Service compliance
   - Copyright and fair use
   - Rate limiting

## Bug Reports

When reporting bugs, please include:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

## Feature Requests

We welcome suggestions for:
- UI/UX improvements
- New retro effects
- Additional functionality
- Performance optimizations

## Pull Request Guidelines

- Keep changes focused and atomic
- Include proper commit messages
- Update documentation if needed
- Ensure all tests pass
- Maintain the retro aesthetic

Thank you for contributing to this nostalgic project! 🎮✨
