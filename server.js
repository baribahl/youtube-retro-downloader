/**
 * YouTube Retro Downloader Backend Server
 * 
 * Node.js/Express server that provides real YouTube downloading functionality
 * using yt-dlp. Supports multiple formats, cookie authentication, and 
 * real-time progress tracking.
 * 
 * Features:
 * - Real video information fetching via yt-dlp
 * - Multiple download formats (MP4: 2160p-480p, MP3 audio)
 * - Cookie-based authentication for subscription content
 * - Progress tracking with real-time updates
 * - Smart file naming: [Channel]_[Date]_[Title]_DL-[Timestamp].[ext]
 */

import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Security middleware
app.use((req, res, next) => {
  // Basic security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Simple rate limiting (basic implementation)
const rateLimit = new Map();
app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 50; // Max 50 requests per 15 minutes
  
  if (!rateLimit.has(clientIP)) {
    rateLimit.set(clientIP, { count: 1, resetTime: now + windowMs });
  } else {
    const limit = rateLimit.get(clientIP);
    if (now > limit.resetTime) {
      limit.count = 1;
      limit.resetTime = now + windowMs;
    } else {
      limit.count++;
      if (limit.count > maxRequests) {
        return res.status(429).json({ 
          error: 'Too many requests', 
          message: 'Rate limit exceeded. Please try again later.' 
        });
      }
    }
  }
  next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/downloads', express.static('downloads'));

// Simple test endpoint for connectivity testing
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend server is running!', 
    timestamp: new Date().toISOString() 
  });
});

// Create downloads directory
if (!fs.existsSync('downloads')) {
  fs.mkdirSync('downloads');
}

// Store for tracking downloads with cleanup
const downloads = new Map();

// Clean up old downloads periodically (1 hour)
setInterval(() => {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [id, info] of downloads.entries()) {
    if (info.timestamp < oneHourAgo) {
      downloads.delete(id);
    }
  }
}, 60 * 60 * 1000);

// Get video info using yt-dlp
app.post('/api/video-info', async (req, res) => {
  try {
    const { url, cookies } = req.body;
    
    // Input validation
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }
    
    const args = [
      url,
      '--dump-json',
      '--no-playlist'
    ];
    
    let cookieFile = null;
    if (cookies) {
      // Save cookies to temp file with unique name
      cookieFile = path.join(__dirname, `temp_cookies_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.txt`);
      fs.writeFileSync(cookieFile, cookies, 'utf8');
      args.push('--cookies', cookieFile);
    }
    
    const ytdlp = spawn('yt-dlp', args);
    let output = '';
    let error = '';
    
    ytdlp.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    ytdlp.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    ytdlp.on('close', (code) => {
      try {
        if (code !== 0) {
          throw new Error(error || 'Failed to get video info');
        }
        
        const videoData = JSON.parse(output);
        
        // Transform to our format
        const videoInfo = {
          id: videoData.id,
          title: videoData.title,
          channel: videoData.uploader || videoData.channel,
          duration: formatDuration(videoData.duration),
          thumbnail: videoData.thumbnail,
          uploadDate: videoData.upload_date ? formatDate(videoData.upload_date) : '2025-01-15',
          description: videoData.description,
          viewCount: videoData.view_count ? `${videoData.view_count.toLocaleString()} views` : 'Unknown views',
          availableFormats: extractFormats(videoData.formats || []),
          isSubscriptionOnly: false
        };
          res.json(videoInfo);
        
        // Clean up temp cookie file
        if (cookieFile && fs.existsSync(cookieFile)) {
          fs.unlinkSync(cookieFile);
        }
      } catch (parseError) {
        // Clean up temp cookie file on error
        if (cookieFile && fs.existsSync(cookieFile)) {
          fs.unlinkSync(cookieFile);
        }
        res.status(500).json({ error: 'Failed to parse video data: ' + parseError.message });
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download video
app.post('/api/download', async (req, res) => {
  try {
    const { url, format, quality, cookies, videoTitle, channel } = req.body;
    
    // Input validation
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Invalid URL provided' });
    }
    if (!format || !['mp4', 'mp3'].includes(format)) {
      return res.status(400).json({ error: 'Invalid format. Must be mp4 or mp3' });
    }
    
    const downloadId = uuidv4();
      // Generate filename using real upload date
    const now = new Date();
    const downloadDate = now.toISOString().slice(0, 16).replace(/[-:T]/g, match => 
      match === 'T' ? '-' : match === ':' ? '-' : match
    );
    
    // Use actual upload date from video data, fallback to current date
    let uploadDate = '2025-01-15'; // Default fallback
    if (req.body.uploadDate) {
      uploadDate = req.body.uploadDate;
    }
    
    const cleanChannel = (channel || 'Unknown').replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').slice(0, 50);
    const cleanTitle = (videoTitle || 'Video').replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').slice(0, 100);
    const filename = `${cleanChannel}_${uploadDate}_${cleanTitle}_DL-${downloadDate}.%(ext)s`;
    
    const outputPath = path.join('downloads', filename);
    
    // Build yt-dlp arguments
    let formatSelector = 'best[ext=mp4]';
    if (format === 'mp3') {
      formatSelector = 'bestaudio/best';
    } else if (quality !== 'best') {
      formatSelector = `best[height<=${quality.replace('p', '')}][ext=mp4]/best[ext=mp4]`;
    }
    
    const args = [
      url,
      '--format', formatSelector,
      '--output', outputPath,
      '--no-playlist'
    ];
    
    if (format === 'mp3') {
      args.push('--extract-audio', '--audio-format', 'mp3');
    }
      if (cookies) {
      const cookieFile = path.join(__dirname, `cookies_${downloadId}.txt`);
      fs.writeFileSync(cookieFile, cookies);
      args.push('--cookies', cookieFile);
    }
      const downloadInfo = {
      id: downloadId,
      progress: 0,
      status: 'starting',
      filename: null,
      error: null,
      timestamp: Date.now()
    };
    
    downloads.set(downloadId, downloadInfo);
    
    const ytdlp = spawn('yt-dlp', args);
    
    ytdlp.stdout.on('data', (data) => {
      const output = data.toString();
      
      // Parse progress
      const progressMatch = output.match(/(\d+\.?\d*)%/);
      if (progressMatch) {
        downloadInfo.progress = parseFloat(progressMatch[1]);
        downloadInfo.status = 'downloading';
      }
      
      // Get final filename
      const filenameMatch = output.match(/\[download\] Destination: (.+)/);
      if (filenameMatch) {
        downloadInfo.filename = path.basename(filenameMatch[1]);
      }
    });
    
    ytdlp.stderr.on('data', (data) => {
      console.error('yt-dlp stderr:', data.toString());
    });
      ytdlp.on('close', (code) => {
      // Clean up cookie file first
      if (cookies) {
        const cookieFile = path.join(__dirname, `cookies_${downloadId}.txt`);
        if (fs.existsSync(cookieFile)) {
          fs.unlinkSync(cookieFile);
        }
      }
      
      if (code === 0) {
        downloadInfo.progress = 100;
        downloadInfo.status = 'completed';
      } else {
        downloadInfo.status = 'error';
        downloadInfo.error = 'Download failed - check if video is available';
      }
    });
    
    ytdlp.on('error', (error) => {
      downloadInfo.status = 'error';
      downloadInfo.error = `Process error: ${error.message}`;
      
      // Clean up cookie file on error
      if (cookies) {
        const cookieFile = path.join(__dirname, `cookies_${downloadId}.txt`);
        if (fs.existsSync(cookieFile)) {
          fs.unlinkSync(cookieFile);
        }
      }
    });
    
    res.json({ downloadId });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get download progress
app.get('/api/download/:id/progress', (req, res) => {
  const downloadInfo = downloads.get(req.params.id);
  if (!downloadInfo) {
    return res.status(404).json({ error: 'Download not found' });
  }
  res.json(downloadInfo);
});

// Download file
app.get('/api/download/:id/file', (req, res) => {
  const downloadInfo = downloads.get(req.params.id);
  if (!downloadInfo || !downloadInfo.filename) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  const filePath = path.join('downloads', downloadInfo.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found on disk' });
  }
  
  res.download(filePath);
});

// Helper functions
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '2025-01-15';
  return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
}

function extractFormats(formats) {
  const standardFormats = [
    { quality: '2160p', format: 'mp4', fileSize: '~2.1 GB', fps: 60 },
    { quality: '1440p', format: 'mp4', fileSize: '~1.2 GB', fps: 60 },
    { quality: '1080p', format: 'mp4', fileSize: '~800 MB', fps: 60 },
    { quality: '720p', format: 'mp4', fileSize: '~400 MB', fps: 30 },
    { quality: '480p', format: 'mp4', fileSize: '~250 MB', fps: 30 },
    { quality: 'audio', format: 'mp3', fileSize: '~8 MB', bitrate: '128kbps' }
  ];
  
  // Filter based on available formats
  const availableQualities = new Set();
  formats.forEach(f => {
    if (f.height) {
      availableQualities.add(`${f.height}p`);
    }
  });
  
  return standardFormats.filter(f => 
    f.quality === 'audio' || availableQualities.has(f.quality) || availableQualities.size === 0
  );
}

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📁 Downloads will be saved to: ${path.resolve('downloads')}`);
});
