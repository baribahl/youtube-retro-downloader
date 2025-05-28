import { useState } from 'react';

interface CookieManagerProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onCookiesChange: (cookies: string) => void;
}

const CookieManager: React.FC<CookieManagerProps> = ({ enabled, onToggle, onCookiesChange }) => {
  const [sessionData, setSessionData] = useState('');
  const [showSessionInput, setShowSessionInput] = useState(false);
  const [isValidSession, setIsValidSession] = useState(true);
  const handleSessionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setSessionData(value);
    onCookiesChange(value); // Pass cookies to parent
    
    // Basic validation for session data format
    if (value.trim()) {
      // Check if it looks like cookie data (contains common YouTube cookie names)
      const hasValidCookies = /(?:__Secure-YEC|VISITOR_INFO1_LIVE|LOGIN_INFO|PREF)/i.test(value);
      setIsValidSession(hasValidCookies);
    } else {
      setIsValidSession(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setSessionData(content);
        handleSessionChange({ target: { value: content } } as React.ChangeEvent<HTMLTextAreaElement>);
      };
      reader.readAsText(file);
    }
  };
  const clearSessionData = () => {
    setSessionData('');
    setIsValidSession(true);
    onCookiesChange(''); // Clear cookies in parent
  };

  const exportSession = () => {
    if (!sessionData.trim()) return;
    
    const blob = new Blob([sessionData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'youtube-session.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="cookie-manager">
      <div className="cookie-toggle">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            {enabled ? '🍪 Session Enabled' : '🚫 Session Disabled'}
          </span>
        </label>
      </div>

      <div className="cookie-info">
        <h4>🔐 Session Management</h4>
        <p>
          Enable session data to access subscription-only videos and playlists.
          Your session data stays in your browser and is never sent to external servers.
        </p>
        
        <div className="info-points">
          <div className="info-point">
            <span className="point-icon">✅</span>
            <span>Access members-only content</span>
          </div>
          <div className="info-point">
            <span className="point-icon">🔒</span>
            <span>Data stored locally only</span>
          </div>
          <div className="info-point">
            <span className="point-icon">🍪</span>
            <span>Uses your YouTube cookies</span>
          </div>
        </div>
      </div>

      {enabled && (
        <div className="session-input-section">
          <div className="session-controls">
            <button
              onClick={() => setShowSessionInput(!showSessionInput)}
              className="retro-button secondary"
            >
              {showSessionInput ? '🙈 Hide Session Input' : '🍪 Enter Session Data'}
            </button>
            
            <label className="file-upload-label retro-button secondary">
              📁 Upload Session File
              <input
                type="file"
                accept=".txt,.json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {showSessionInput && (
            <div className="session-input">
              <textarea
                value={sessionData}
                onChange={handleSessionChange}
                placeholder="Paste your YouTube session cookies here...
Example format:
__Secure-YEC=value; VISITOR_INFO1_LIVE=value; LOGIN_INFO=value;"
                className={`session-textarea ${!isValidSession ? 'error' : ''}`}
                rows={6}
              />
              
              {!isValidSession && sessionData && (
                <div className="error-message">
                  ⚠️ Session data doesn't appear to contain valid YouTube cookies
                </div>
              )}
              
              <div className="session-actions">
                <button
                  onClick={clearSessionData}
                  className="retro-button secondary"
                  disabled={!sessionData}
                >
                  🗑️ Clear
                </button>
                <button
                  onClick={exportSession}
                  className="retro-button secondary"
                  disabled={!sessionData.trim()}
                >
                  💾 Export
                </button>
              </div>
            </div>
          )}

          <div className="session-status">
            <div className={`status-indicator ${sessionData && isValidSession ? 'active' : 'inactive'}`}>
              <span className="status-icon">
                {sessionData && isValidSession ? '🟢' : '🔴'}
              </span>
              <span className="status-text">
                {sessionData && isValidSession 
                  ? 'Session data loaded' 
                  : 'No valid session data'
                }
              </span>
            </div>
          </div>        </div>
      )}
    </div>
  );
};

export default CookieManager;
