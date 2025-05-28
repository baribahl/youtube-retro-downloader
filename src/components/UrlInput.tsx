import { useState } from 'react';
import { YOUTUBE_URL_PATTERNS } from '../types.ts';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading = false }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateUrl = (inputUrl: string): boolean => {
    if (!inputUrl.trim()) return true; // Empty is valid (not yet entered)
    return YOUTUBE_URL_PATTERNS.some(pattern => pattern.test(inputUrl));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setIsValid(validateUrl(newUrl));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !isValid || isLoading) return;

    setIsSubmitting(true);
    try {
      await onSubmit(url.trim());
    } catch (error) {
      console.error('Error processing URL:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then(text => {
      setUrl(text);
      setIsValid(validateUrl(text));
    }).catch(err => {
      console.error('Failed to read clipboard:', err);
    });
  };

  const handleClear = () => {
    setUrl('');
    setIsValid(true);
  };

  return (
    <form onSubmit={handleSubmit} className="url-input-form">
      <div className="input-container">        <input
          type="text"
          value={url}
          onChange={handleInputChange}
          placeholder="https://www.youtube.com/watch?v=..."
          className={`retro-input ${!isValid ? 'error' : ''}`}
          disabled={isLoading || isSubmitting}
        />
        <div className="input-buttons">          <button
            type="button"
            onClick={handlePaste}
            className="retro-button secondary"
            disabled={isLoading || isSubmitting}
            title="Paste from clipboard"
          >
            📋 PASTE
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="retro-button secondary"
            disabled={isLoading || isSubmitting || !url}
            title="Clear input"
          >
            🗑️ CLEAR
          </button>
          <button
            type="submit"
            className="retro-button primary"
            disabled={!url.trim() || !isValid || isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? '⏳ LOADING...' : '🚀 ANALYZE'}
          </button>
        </div>
      </div>
        {!isValid && url && (
        <div className="error-message">
          ⚠️ Please enter a valid YouTube URL
        </div>
      )}
    </form>
  );
};

export default UrlInput;
