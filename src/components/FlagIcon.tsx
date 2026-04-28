import { useState } from 'react';

interface FlagIconProps {
  cca2: string;
  emoji: string;
  label: string;
  size?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function FlagIcon({
  cca2,
  emoji,
  label,
  size = '1.2rem',
  className = '',
  style = {},
}: FlagIconProps) {
  const [showEmojiFallback, setShowEmojiFallback] = useState(false);
  const normalizedCca2 = cca2?.toLowerCase?.() || '';
  const imageUrl = normalizedCca2 ? `https://flagcdn.com/${normalizedCca2}.svg` : '';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        ...style,
      }}
      aria-label={label}
      role="img"
    >
      {!showEmojiFallback && imageUrl ? (
        <img
          src={imageUrl}
          alt={`${label} flag`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
          onError={() => setShowEmojiFallback(true)}
        />
      ) : (
        <span
          style={{
            fontFamily: "Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, Segoe UI Symbol, sans-serif",
            fontSize: 'inherit',
            lineHeight: 1,
          }}
        >
          {emoji}
        </span>
      )}
    </span>
  );
}
