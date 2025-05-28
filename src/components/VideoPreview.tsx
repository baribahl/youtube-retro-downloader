import type { VideoInfo } from '../types.ts';

interface VideoPreviewProps {
  videoInfo: VideoInfo;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({ videoInfo }) => {
  const formatDuration = (duration: string) => {
    // Duration is already formatted as "MM:SS" or "HH:MM:SS"
    return duration;
  };

  const formatViewCount = (count?: string) => {
    if (!count) return 'N/A';
    return count;
  };

  const formatUploadDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="video-preview">
      <div className="video-thumbnail">
        <img 
          src={videoInfo.thumbnail} 
          alt={`Thumbnail for ${videoInfo.title}`}
          className="thumbnail-image"
        />
        <div className="duration-badge">
          ⏱️ {formatDuration(videoInfo.duration)}
        </div>
        {videoInfo.isSubscriptionOnly && (
          <div className="subscription-badge">
            🔒 MEMBERS ONLY
          </div>
        )}
      </div>
      
      <div className="video-details">
        <h3 className="video-title">{videoInfo.title}</h3>
        
        <div className="video-meta">
          <div className="meta-item">
            <span className="meta-label">📺 Channel:</span>
            <span className="meta-value">{videoInfo.channel}</span>
          </div>
          
          <div className="meta-item">
            <span className="meta-label">📅 Upload Date:</span>
            <span className="meta-value">{formatUploadDate(videoInfo.uploadDate)}</span>
          </div>
          
          {videoInfo.viewCount && (
            <div className="meta-item">
              <span className="meta-label">👀 Views:</span>
              <span className="meta-value">{formatViewCount(videoInfo.viewCount)}</span>
            </div>
          )}
          
          <div className="meta-item">
            <span className="meta-label">🎬 Video ID:</span>
            <span className="meta-value">{videoInfo.id}</span>
          </div>
        </div>
        
        {videoInfo.description && (
          <div className="video-description">
            <details>
              <summary>📝 Description</summary>
              <p>{videoInfo.description}</p>
            </details>
          </div>
        )}
        
        <div className="available-formats-summary">
          <span className="meta-label">💽 Available Formats:</span>
          <span className="meta-value">
            {videoInfo.availableFormats.length} options 
            ({videoInfo.availableFormats.filter(f => f.format === 'mp4').length} video, 
            {videoInfo.availableFormats.filter(f => f.format === 'mp3').length} audio)
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
