// Real API implementation for YouTube downloading
import axios from 'axios';
import type { VideoInfo, PlaylistInfo, DownloadFormat } from '../types.ts';

// Dynamic API base - works for both development and production
const API_BASE = process.env.NODE_ENV === 'production' 
  ? '/api'  // Relative path for production
  : 'http://localhost:3001/api';

// Extract video ID from various YouTube URL formats
export function extractVideoId(url: string): string | null {
  const patterns = [
    // Standard watch URLs: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Short URLs: youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Shorts URLs: youtube.com/shorts/VIDEO_ID
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    // Embed URLs: youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Old format: youtube.com/v/VIDEO_ID
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    // Live URLs: youtube.com/live/VIDEO_ID
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    // Music URLs: music.youtube.com/watch?v=VIDEO_ID
    /(?:music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// Extract playlist ID from YouTube URL
export function extractPlaylistId(url: string): string | null {
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Parse YouTube URL to determine content type
export function parseYouTubeUrl(url: string) {
  const videoId = extractVideoId(url);
  const playlistId = extractPlaylistId(url);
  
  return {
    videoId,
    playlistId,
    isVideo: !!videoId,
    isPlaylist: !!playlistId,
    isShorts: url.includes('/shorts/'),
    isLive: url.includes('/live/')
  };
}

// Generate available download formats (populated by backend with real data)
export function generateAvailableFormats(availableFormats?: DownloadFormat[]): DownloadFormat[] {
  // Use real formats from backend if available, otherwise fallback to standard options
  if (availableFormats && availableFormats.length > 0) {
    return availableFormats;
  }
  
  // Fallback standard formats for initial display
  return [
    { quality: '1080p', format: 'mp4', fileSize: 'Auto', fps: 30 },
    { quality: '720p', format: 'mp4', fileSize: 'Auto', fps: 30 },
    { quality: '480p', format: 'mp4', fileSize: 'Auto', fps: 30 },
    { quality: 'audio', format: 'mp3', fileSize: 'Auto', bitrate: '128kbps' }
  ];
}

// Generate filename according to the specified format
export function generateFileName(
  channel: string,
  uploadDate: string,
  title: string,
  format: DownloadFormat
): string {
  const now = new Date();
  const downloadDate = now.toISOString().slice(0, 16).replace(/[-:T]/g, match => 
    match === 'T' ? '-' : match === ':' ? '-' : match
  );
  
  // Clean strings for filename safety
  const cleanChannel = channel.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').slice(0, 50);
  const cleanTitle = title.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_').slice(0, 100);
  
  return `${cleanChannel}_${uploadDate}_${cleanTitle}_DL-${downloadDate}.${format.format}`;
}

// Real function to fetch video information using yt-dlp backend
export async function fetchVideoInfo(
  videoId: string, 
  cookies?: string
): Promise<VideoInfo> {
  try {
    const url = `https://youtube.com/watch?v=${videoId}`;
    const response = await axios.post(`${API_BASE}/video-info`, {
      url,
      cookies
    });
    
    return response.data;  } catch (error) {
    console.error('API request failed:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Network error: Unable to connect to backend server. Make sure the backend is running on port 3001.');
      }
      if (error.response) {
        throw new Error(error.response.data.error || `Server error: ${error.response.status}`);
      }
    }
    throw new Error('Network error: Unable to connect to backend server');
  }
}

// Real function to fetch playlist information
export async function fetchPlaylistInfo(
  playlistId: string,
  cookies?: string
): Promise<PlaylistInfo> {
  try {
    const url = `https://youtube.com/playlist?list=${playlistId}`;
    const response = await axios.post(`${API_BASE}/video-info`, {
      url,
      cookies
    });
    
    // For now, treat playlist as single video
    // In a full implementation, you'd modify the backend to handle playlists
    const videoInfo = response.data;
    
    return {
      id: playlistId,
      title: 'Playlist: ' + videoInfo.title,
      channel: videoInfo.channel,
      videoCount: 1,
      videos: [videoInfo],
      thumbnail: videoInfo.thumbnail
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch playlist information');
    }
    throw new Error('Network error: Unable to connect to backend server');
  }
}

// Validate YouTube cookies format
export function validateCookies(cookieString: string): boolean {
  if (!cookieString.trim()) return false;
  
  // Check for common YouTube cookie names
  const requiredCookies = ['VISITOR_INFO1_LIVE', 'LOGIN_INFO'];
  const hasRequiredCookies = requiredCookies.some(cookieName => 
    cookieString.includes(cookieName)
  );
  
  return hasRequiredCookies;
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Real download function using backend API
export async function downloadVideo(
  videoInfo: VideoInfo,
  format: DownloadFormat,
  onProgress: (progress: number) => void,
  cookieData?: string
): Promise<void> {
  try {
    console.log('Starting download:', videoInfo.title, format);
    console.log('API_BASE:', API_BASE);
    
    // Prepare request body
    const requestBody: {
      url: string;
      format: string;
      quality: string;
      videoTitle: string;
      channel: string;
      cookies?: string;
    } = {
      url: `https://youtube.com/watch?v=${videoInfo.id}`,
      format: format.format,
      quality: format.quality,
      videoTitle: videoInfo.title,
      channel: videoInfo.channel
    };
    
    // Add cookies if provided
    if (cookieData) {
      requestBody.cookies = cookieData;
    }
    
    console.log('Download request body:', requestBody);
    
    // Start download
    console.log('Making download request to:', `${API_BASE}/download`);
    const downloadResponse = await axios.post(`${API_BASE}/download`, requestBody);
    
    const { downloadId } = downloadResponse.data;
    console.log('Download started with ID:', downloadId);
      // Poll for progress
    const pollProgress = async () => {
      try {
        console.log('Polling progress for download ID:', downloadId);
        const progressResponse = await axios.get(`${API_BASE}/download/${downloadId}/progress`);
        const { progress, status, error, filename } = progressResponse.data;
        
        console.log('Progress response:', { progress, status, error, filename });
        
        onProgress(progress);
        
        if (status === 'completed') {
          console.log('Download completed, triggering file download');
          // Trigger file download
          const fileUrl = `${API_BASE}/download/${downloadId}/file`;
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = filename || 'video';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        }
        
        if (status === 'error') {
          throw new Error(error || 'Download failed');
        }
        
        if (status !== 'completed') {
          console.log('Download still in progress, polling again in 1 second');
          setTimeout(pollProgress, 1000);
        }
      } catch (error) {
        console.error('Error polling progress:', error);
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data.error || 'Download failed');
        }
        throw error;
      }
    };    
    await pollProgress();
    
  } catch (error) {
    console.error('Download failed:', error);
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Network error: Unable to connect to backend server. Make sure the backend is running on port 3001.');
      }
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.error || `Download failed: ${error.response.status}`);
      }
    }
    throw new Error('Network error: Unable to connect to backend server');
  }
}

// Get video quality badge
export function getQualityBadge(quality: string): string {
  switch (quality) {
    case '2160p': return '4K';
    case '1440p': return '2K';
    case '1080p': return 'FHD';
    case '720p': return 'HD';
    case '480p': return 'SD';
    case 'audio': return 'MP3';
    default: return quality;
  }
}
