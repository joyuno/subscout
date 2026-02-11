'use client';

import { useState } from 'react';
import { getServicePreset } from '@/lib/constants/servicePresets';

interface BrandIconProps {
  name: string;
  icon: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandIcon({ name, icon, size = 'md' }: BrandIconProps) {
  const preset = getServicePreset(name);
  const brandColor = preset?.brandColor;
  const domain = preset?.domain;
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-16 h-16 text-3xl',
  };

  // If we have a domain and the image hasn't errored, show the favicon
  if (domain && !imgError) {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return (
      <div className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden bg-white`}>
        <img
          src={faviconUrl}
          alt={`${name} logo`}
          className="w-full h-full object-contain p-1"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // If we have a brand color, show colored initial (fallback for failed images)
  if (brandColor) {
    const initial = name.charAt(0).toUpperCase();
    return (
      <div
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm`}
        style={{ backgroundColor: brandColor }}
      >
        {initial}
      </div>
    );
  }

  // Fallback to emoji
  return (
    <div className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center shrink-0 shadow-sm bg-muted`}>
      <span className={size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-xl'}>{icon}</span>
    </div>
  );
}
