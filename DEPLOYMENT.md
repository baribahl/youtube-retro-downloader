# Deployment Guide

## Important: Backend Requirements

This application requires a **backend server** with Python and yt-dlp for real YouTube downloading functionality. Simple static hosting (like GitHub Pages) will only provide the frontend interface without download capabilities.

## Full-Stack Deployment Options

### Option 1: Railway (Recommended for Full Functionality)

1. **Prepare your repository:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Railway:**
   - Connect your GitHub repository to Railway
   - Railway will automatically detect Node.js and install dependencies
   - Add environment variables if needed
   - Your app will get a public URL with both frontend and backend

### Option 2: Heroku

1. **Create Procfile:**
   ```
   web: npm start
   ```

2. **Deploy:**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform

1. **Connect GitHub repository**
2. **Configure build settings:**
   - Build command: `npm run build`
   - Run command: `npm start`
   - Node.js version: 18+

## Frontend-Only Deployment (Limited Functionality)

### GitHub Pages (Frontend Interface Only)

**Note:** This will only deploy the frontend interface. Downloads will not work without a backend server.

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   - Enable GitHub Pages in repository settings
   - Set source to `dist` folder or use GitHub Actions

## Alternative Hosting Platforms

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run: `firebase init hosting`
3. Set public directory to `dist`
4. Deploy: `firebase deploy`

## Configuration Notes

- The `vite.config.ts` is configured for GitHub Pages with the correct base path
- All assets are properly bundled and optimized
- The app is fully static and doesn't require a server

## Domain Setup (Optional)

1. Add a `CNAME` file to the `public` directory with your domain
2. Update the `cname` field in `.github/workflows/deploy.yml`
3. Configure your domain's DNS to point to GitHub Pages

## Troubleshooting

- **404 on refresh**: This is normal for SPAs on GitHub Pages
- **Assets not loading**: Check the base path in `vite.config.ts`
- **Build fails**: Ensure all TypeScript errors are resolved
