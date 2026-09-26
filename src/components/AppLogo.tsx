import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { normalizeImageUrl } from '../lib/imageUtils';

interface AppLogoProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
}

/**
 * Robust App Logo Image component with graceful error handling and fallbacks.
 * Directly renders external HTTPS URLs without proxying, fetching, or modifying.
 * Supports JPG, JPEG, PNG, and WEBP external URLs.
 * Handles share page URLs (like kommodo.ai/i/xxx) so they resolve directly to the image asset.
 * Falls back cleanly to an initial letter badge or icon only if loading actually fails.
 */
export const AppLogo: React.FC<AppLogoProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  fallbackText,
  size = 'md',
}) => {
  const [hasError, setHasError] = useState(false);
  const [lastSrc, setLastSrc] = useState(src);

  // If the src changes (e.g. admin types in a new URL), reset error state immediately
  if (src !== lastSrc) {
    setLastSrc(src);
    setHasError(false);
  }

  // Normalize image URL: trim whitespace and resolve share links to direct assets
  const rawSrc = (src || '').trim();
  const directSrc = normalizeImageUrl(rawSrc);

  // Size styling helpers if containerClassName doesn't provide custom dimensions
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl',
    lg: 'w-20 h-20 sm:w-24 sm:h-24 rounded-2xl',
    xl: 'w-24 h-24 rounded-2xl',
    custom: '',
  };

  const initialLetter = (fallbackText || alt || '?').trim().charAt(0).toUpperCase();

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center bg-purple-50 border border-purple-100/80 shadow-xs flex-shrink-0 ${sizeClasses[size]} ${containerClassName}`}
    >
      {directSrc && !hasError ? (
        <img
          src={directSrc}
          alt={alt || 'App logo'}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={className}
          onError={() => {
            setHasError(true);
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-purple-100 to-indigo-100 text-purple-800 font-black select-none">
          {initialLetter ? (
            <span className="text-xl sm:text-2xl">{initialLetter}</span>
          ) : (
            <ImageIcon className="w-6 h-6 text-purple-400" />
          )}
        </div>
      )}
    </div>
  );
};
