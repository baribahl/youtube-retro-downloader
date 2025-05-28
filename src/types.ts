// TypeScript type definitions for YouTube Retro Downloader

export interface VideoInfo {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
  uploadDate: string;
  availableFormats: DownloadFormat[];
  description?: string;
  viewCount?: string;
  isSubscriptionOnly?: boolean;
}

export interface DownloadFormat {
  quality: string; // '2160p', '1440p', '1080p', '720p', '480p', 'audio'
  format: string; // 'mp4', 'mp3'
  fileSize: string;
  bitrate?: string;
  fps?: number;
}

export interface PlaylistInfo {
  id: string;
  title: string;
  channel: string;
  videoCount: number;
  videos: VideoInfo[];
  thumbnail: string;
}

export interface DownloadProgress {
  progress: number; // 0-100
  speed?: string;
  eta?: string;
  downloadedSize?: string;
  totalSize?: string;
}

export interface CookieData {
  enabled: boolean;
  sessionData?: string;
  expiryDate?: string;
}

export interface UserPreferences {
  defaultQuality: string;
  namingFormat: string;
  downloadPath: string;
  autoStart: boolean;
}

// YouTube URL patterns for validation
export const YOUTUBE_URL_PATTERNS = [
  // Standard watch URLs
  /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
  // Short URLs
  /^https?:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}/,
  // Shorts URLs
  /^https?:\/\/(www\.)?youtube\.com\/shorts\/[a-zA-Z0-9_-]{11}/,
  // Playlist URLs
  /^https?:\/\/(www\.)?youtube\.com\/playlist\?list=[a-zA-Z0-9_-]+/,
  // Live stream URLs
  /^https?:\/\/(www\.)?youtube\.com\/live\/[a-zA-Z0-9_-]{11}/,
  // Embed URLs
  /^https?:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]{11}/,
  // Music YouTube URLs
  /^https?:\/\/music\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}/,
  // Old format URLs
  /^https?:\/\/(www\.)?youtube\.com\/v\/[a-zA-Z0-9_-]{11}/
];

// Supported video qualities
export const VIDEO_QUALITIES = [
  '2160p', '1440p', '1080p', '720p', '480p'
] as const;

export type VideoQuality = typeof VIDEO_QUALITIES[number];

// File naming scheme: [Channel]_[YYYY-MM-DD]_[Title]_[DL-YYYY-MM-DD-HH-MM].[ext]
export interface FileNamingData {
  channel: string;
  uploadDate: string;
  title: string;
  downloadDate: string;
  extension: string;
}
