import type { DownloadFormat } from '../types.ts';
import { format as formatDate } from 'date-fns';

interface DownloadOptionsProps {
  formats: DownloadFormat[];
  selectedFormat: DownloadFormat | null;
  onFormatSelect: (format: DownloadFormat) => void;
  onDownload: () => void;
  disabled?: boolean;
  videoTitle?: string;
  channel?: string;
  uploadDate?: string;
}

const DownloadOptions: React.FC<DownloadOptionsProps> = ({
  formats,
  selectedFormat,
  onFormatSelect,
  onDownload,
  disabled = false,
  videoTitle = 'Video',
  channel = 'Channel',
  uploadDate
}) => {
  const videoFormats = formats.filter(f => f.format === 'mp4');
  const audioFormats = formats.filter(f => f.format === 'mp3');

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case '2160p': return '🎬'; // 4K
      case '1440p': return '📺'; // 2K
      case '1080p': return '🖥️'; // Full HD
      case '720p': return '💻'; // HD
      case '480p': return '📱'; // SD
      case 'audio': return '🎵'; // Audio
      default: return '📄';
    }
  };

  const getQualityLabel = (quality: string) => {
    switch (quality) {
      case '2160p': return '4K Ultra HD';
      case '1440p': return '2K Quad HD';
      case '1080p': return 'Full HD';
      case '720p': return 'HD';
      case '480p': return 'Standard';
      case 'audio': return 'Audio Only';
      default: return quality;
    }
  };
  const generateFileName = (format: DownloadFormat, videoTitle: string, channel: string, uploadDate?: string) => {
    // File naming scheme: [Channel]_[YYYY-MM-DD]_[Title]_[DL-YYYY-MM-DD-HH-MM].[ext]
    const now = new Date();
    const downloadDate = formatDate(now, 'yyyy-MM-dd-HH-mm');
    const formattedUploadDate = uploadDate ? formatDate(new Date(uploadDate), 'yyyy-MM-dd') : 'unknown';
    
    const cleanTitle = videoTitle.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
    const cleanChannel = channel.replace(/[^\w\s-]/g, '').replace(/\s+/g, '_');
    
    return `${cleanChannel}_${formattedUploadDate}_${cleanTitle}_DL-${downloadDate}.${format.format}`;
  };

  return (
    <div className="download-options">
      {videoFormats.length > 0 && (
        <div className="format-section">
          <h4>🎥 Video Formats</h4>
          <div className="format-grid">
            {videoFormats.map((format, index) => (
              <div
                key={index}
                className={`format-option ${selectedFormat === format ? 'selected' : ''}`}
                onClick={() => !disabled && onFormatSelect(format)}
              >
                <div className="format-header">
                  <span className="format-icon">{getQualityIcon(format.quality)}</span>
                  <span className="format-quality">{getQualityLabel(format.quality)}</span>
                </div>
                <div className="format-details">
                  <span className="format-type">{format.format.toUpperCase()}</span>
                  <span className="format-size">{format.fileSize}</span>
                  {format.fps && <span className="format-fps">{format.fps} FPS</span>}
                </div>
                {selectedFormat === format && (
                  <div className="selected-indicator">✅ SELECTED</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {audioFormats.length > 0 && (
        <div className="format-section">
          <h4>🎵 Audio Formats</h4>
          <div className="format-grid">
            {audioFormats.map((format, index) => (
              <div
                key={index}
                className={`format-option ${selectedFormat === format ? 'selected' : ''}`}
                onClick={() => !disabled && onFormatSelect(format)}
              >
                <div className="format-header">
                  <span className="format-icon">{getQualityIcon(format.quality)}</span>
                  <span className="format-quality">{getQualityLabel(format.quality)}</span>
                </div>
                <div className="format-details">
                  <span className="format-type">{format.format.toUpperCase()}</span>
                  <span className="format-size">{format.fileSize}</span>
                  {format.bitrate && <span className="format-bitrate">{format.bitrate}</span>}
                </div>
                {selectedFormat === format && (
                  <div className="selected-indicator">✅ SELECTED</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFormat && (
        <div className="download-section">
          <div className="selected-format-info">
            <h4>📋 Download Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Format:</span>
                <span className="info-value">
                  {getQualityIcon(selectedFormat.quality)} {getQualityLabel(selectedFormat.quality)} 
                  ({selectedFormat.format.toUpperCase()})
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">File Size:</span>
                <span className="info-value">{selectedFormat.fileSize}</span>
              </div>
              <div className="info-item">
                <span className="info-label">File Name:</span>                <span className="info-value filename-preview">
                  {generateFileName(selectedFormat, videoTitle, channel, uploadDate)}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={onDownload}
            disabled={disabled}
            className="retro-button primary download-button"
          >
            {disabled ? '⏳ DOWNLOADING...' : '⬇️ START DOWNLOAD'}
          </button>
        </div>
      )}

      {!selectedFormat && (
        <div className="no-selection">
          <p>👆 Select a format above to start downloading</p>
        </div>
      )}
    </div>
  );
};

export default DownloadOptions;
