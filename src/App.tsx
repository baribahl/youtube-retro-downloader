import { useState, useEffect } from 'react';
import './App.css';
import UrlInput from './components/UrlInput.tsx';
import VideoPreview from './components/VideoPreview.tsx';
import DownloadOptions from './components/DownloadOptions.tsx';
import DownloadProgress from './components/DownloadProgress.tsx';
import CookieManager from './components/CookieManager.tsx';
import type { VideoInfo, DownloadFormat } from './types';
import { parseYouTubeUrl, fetchVideoInfo, fetchPlaylistInfo, downloadVideo, checkBackendAvailability } from './utils/youtube.ts';

function App() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [cookiesEnabled, setCookiesEnabled] = useState(false);
  const [cookies, setCookies] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);

  // Check backend availability on component mount
  useEffect(() => {
    const checkBackend = async () => {
      const isAvailable = await checkBackendAvailability();
      setBackendAvailable(isAvailable);
      
      if (!isAvailable && window.location.hostname.includes('github.io')) {
        setError('ℹ️ You\'re viewing the frontend demo on GitHub Pages. For full download functionality, deploy to a platform with Node.js backend support (Railway, Heroku, DigitalOcean).');
      }
    };
    
    checkBackend();
  }, []);

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setVideoInfo(null);
    setSelectedFormat(null);
    
    try {
      console.log('Processing URL:', url);
      
      const urlInfo = parseYouTubeUrl(url);
      
      if (!urlInfo.isVideo && !urlInfo.isPlaylist) {
        throw new Error('Invalid YouTube URL. Please enter a valid video or playlist URL.');
      }
      
      if (urlInfo.isVideo && urlInfo.videoId) {
        // Fetch single video information
        const cookieData = cookiesEnabled && cookies ? cookies : undefined;
        const video = await fetchVideoInfo(urlInfo.videoId, cookieData);
        setVideoInfo(video);
      } else if (urlInfo.isPlaylist && urlInfo.playlistId) {
        // For now, just fetch the first video of the playlist
        // In a full implementation, we'd show playlist management UI
        const cookieData = cookiesEnabled && cookies ? cookies : undefined;
        const playlist = await fetchPlaylistInfo(urlInfo.playlistId, cookieData);
        
        if (playlist.videos.length > 0) {
          setVideoInfo(playlist.videos[0]);
        } else {
          throw new Error('Playlist is empty or could not be loaded.');
        }
      }
      
    } catch (err) {
      console.error('Error processing URL:', err);
      setError(err instanceof Error ? err.message : 'Failed to process URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!selectedFormat || !videoInfo) return;
    
    console.log('Starting download process...');
    console.log('Video:', videoInfo);
    console.log('Format:', selectedFormat);
    console.log('Cookies enabled:', cookiesEnabled);
    console.log('Cookies data:', cookies ? 'Present' : 'None');
    
    setIsDownloading(true);
    setDownloadProgress(0);
    setError(null);
    
    try {
      const cookieData = cookiesEnabled && cookies ? cookies : undefined;
      await downloadVideo(videoInfo, selectedFormat, (progress) => {
        console.log('Download progress:', progress);
        setDownloadProgress(progress);
      }, cookieData);
      
      console.log('Download completed successfully!');
      setError('✅ Download completed successfully!');
    } catch (err) {
      console.error('Download failed:', err);
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  // Test backend connectivity
  const testBackendConnectivity = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('Testing backend connectivity...');
      
      const response = await fetch('http://localhost:3001/api/test');
      const data = await response.json();
      
      console.log('Backend test response:', data);
      setError(`✅ Backend connected successfully! ${data.message}`);
    } catch (err) {
      console.error('Backend connectivity test failed:', err);
      setError(`❌ Backend connectivity failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="text-center mb-20">
        <h1 className="neon-text">RETRO TUBE DOWNLOADER</h1>
      </header>

      {/* GitHub Pages Notice */}
      {backendAvailable === false && window.location.hostname.includes('github.io') && (
        <div className="retro-panel" style={{ borderColor: '#ff6b00', backgroundColor: 'rgba(255, 107, 0, 0.1)' }}>
          <h3>ℹ️ GitHub Pages Demo Mode</h3>
          <p>You're viewing the frontend interface on GitHub Pages. For full download functionality, deploy to:</p>
          <div style={{ marginTop: '10px' }}>
            <strong>Recommended platforms:</strong> Railway, Heroku, DigitalOcean, Render
          </div>
          <div style={{ marginTop: '5px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            This demo shows the complete UI but requires a Node.js backend for actual downloads.
          </div>
        </div>
      )}

      <div className="retro-panel">
        <h2>🔗 Video URL Input</h2>
        <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} />
        
        {/* Quick Test Buttons */}
        <div className="test-urls">
          <h4>🧪 Quick Test URLs:</h4>
          <div style={{ marginBottom: '10px', fontSize: '14px' }}>
            Backend Status: {backendAvailable === null ? '🟡 Checking...' : backendAvailable ? '🟢 Connected' : '🔴 Unavailable'}
          </div>
          <div className="test-buttons">
            <button 
              className="retro-button secondary small"
              onClick={() => handleUrlSubmit('https://youtu.be/K0A5-afEJsk?si=Iqdxe9SIJ7bnSxq4')}
              disabled={isLoading}
            >
              📺 Test Video (Public)
            </button>
            <button 
              className="retro-button secondary small"
              onClick={() => handleUrlSubmit('https://www.youtube.com/shorts/sQ0IeYyNnFk')}
              disabled={isLoading}
            >
              📱 Test Shorts
            </button>
            <button 
              className="retro-button secondary small"
              onClick={() => handleUrlSubmit('https://youtu.be/Ai17lla31aU?si=Q0Rni8Hs085of5jO')}
              disabled={isLoading}
            >
              🔒 Test Private Video
            </button>
            <button 
              className="retro-button secondary small"
              onClick={() => handleUrlSubmit('https://youtube.com/playlist?list=PLuKg-Whduhkn1YLm9lvP_7lPRmRknpIyA&si=nNQPyxdWqifSOH7y')}
              disabled={isLoading}
            >
              📋 Test Playlist
            </button>
            <button 
              className="retro-button primary small"
              onClick={testBackendConnectivity}
              disabled={isLoading}
            >
              🔗 Test Backend
            </button>
          </div>
        </div>
        
        {error && (
          <div className="error-display">
            <p>❌ {error}</p>
            <button 
              onClick={() => setError(null)}
              className="retro-button secondary small"
              style={{ marginTop: '10px' }}
            >
              ✖️ DISMISS
            </button>
          </div>
        )}
        
        {isLoading && (
          <div className="loading-display">
            <div className="loading"></div>
            <p>🔍 Analyzing YouTube URL...</p>
          </div>
        )}
      </div>

      <div className="retro-panel">
        <h2>🍪 Cookie Settings</h2>
        <CookieManager 
          enabled={cookiesEnabled} 
          onToggle={setCookiesEnabled}
          onCookiesChange={setCookies}
        />
      </div>

      {videoInfo && (
        <div className="retro-panel">
          <h2>📺 Video Preview</h2>
          <VideoPreview videoInfo={videoInfo} />
        </div>
      )}

      {videoInfo && (
        <div className="retro-panel">
          <h2>⚙️ Download Options</h2>
          <DownloadOptions 
            formats={videoInfo.availableFormats}
            selectedFormat={selectedFormat}
            onFormatSelect={setSelectedFormat}
            onDownload={handleDownload}
            disabled={isDownloading}
            videoTitle={videoInfo.title}
            channel={videoInfo.channel}
            uploadDate={videoInfo.uploadDate}
          />
        </div>
      )}

      {isDownloading && (
        <div className="retro-panel">
          <h2>📥 Download Progress</h2>
          <DownloadProgress 
            progress={downloadProgress}
            videoTitle={videoInfo?.title || ''}
            format={selectedFormat}
          />
        </div>
      )}

      <footer className="text-center mt-20">
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          💾 Built with retro vibes | GitHub Pages Compatible 💾
        </p>
      </footer>
    </div>
  );
}

export default App;
