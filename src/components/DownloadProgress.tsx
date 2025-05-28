import { useEffect, useState } from 'react';
import type { DownloadFormat } from '../types.ts';

interface DownloadProgressProps {
  progress: number;
  videoTitle: string;
  format: DownloadFormat | null;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({
  progress,
  videoTitle,
  format
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('0 MB/s');
  const [eta, setEta] = useState('Calculating...');

  useEffect(() => {
    // Smooth progress animation
    const progressInterval = setInterval(() => {
      setAnimatedProgress(prev => {
        const diff = progress - prev;
        if (Math.abs(diff) < 0.1) return progress;
        return prev + diff * 0.1;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [progress]);

  useEffect(() => {
    // Simulate realistic download metrics
    if (progress > 0 && progress < 100) {
      const simulatedSpeed = (Math.random() * 5 + 2).toFixed(1);
      setDownloadSpeed(`${simulatedSpeed} MB/s`);
      
      if (progress > 10) {
        const remainingTime = Math.ceil((100 - progress) / 2);
        setEta(`${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`);
      }
    } else if (progress >= 100) {
      setDownloadSpeed('Complete');
      setEta('Done!');
    }
  }, [progress]);

  const getProgressBarClass = () => {
    if (progress >= 100) return 'complete';
    if (progress >= 75) return 'high';
    if (progress >= 50) return 'medium';
    if (progress >= 25) return 'low';
    return 'starting';
  };

  const getStatusIcon = () => {
    if (progress >= 100) return '✅';
    if (progress >= 75) return '🚀';
    if (progress >= 50) return '⚡';
    if (progress >= 25) return '📊';
    return '⏳';
  };

  const getStatusMessage = () => {
    if (progress >= 100) return 'Download Complete!';
    if (progress >= 75) return 'Almost there...';
    if (progress >= 50) return 'More than halfway!';
    if (progress >= 25) return 'Making good progress...';
    return 'Starting download...';
  };

  return (
    <div className="download-progress">
      <div className="progress-header">
        <h4>{getStatusIcon()} Downloading: {videoTitle}</h4>
        {format && (
          <div className="format-info">
            <span className="format-badge">
              {format.quality} • {format.format.toUpperCase()} • {format.fileSize}
            </span>
          </div>
        )}
      </div>

      <div className="progress-container">
        <div className="progress-bar-wrapper">
          <div className={`progress-bar ${getProgressBarClass()}`}>
            <div 
              className="progress-fill"
              style={{ width: `${animatedProgress}%` }}
            >
              <div className="progress-glow"></div>
            </div>
            <div className="progress-text">
              {Math.round(animatedProgress)}%
            </div>
          </div>
        </div>

        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-label">Speed:</span>
            <span className="stat-value">{downloadSpeed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">ETA:</span>
            <span className="stat-value">{eta}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Status:</span>
            <span className="stat-value">{getStatusMessage()}</span>
          </div>
        </div>
      </div>

      {progress >= 100 && (
        <div className="completion-actions">
          <button className="retro-button secondary">
            📁 Open Folder
          </button>
          <button className="retro-button primary">
            🎵 Play File
          </button>
        </div>
      )}

      <div className="progress-visualization">
        <div className="download-blocks">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className={`download-block ${
                (i + 1) * 5 <= animatedProgress ? 'filled' : 'empty'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadProgress;
