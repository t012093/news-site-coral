import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
  webpSrc?: string;
  placeholder?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  onLoad?: () => void;
  onError?: () => void;
}

const ImageContainer = styled.div<{ 
  aspectRatio?: string; 
  width?: number | string; 
  height?: number | string;
}>`
  position: relative;
  display: inline-block;
  overflow: hidden;
  
  ${props => props.aspectRatio && `aspect-ratio: ${props.aspectRatio};`}
  ${props => props.width && `width: ${typeof props.width === 'number' ? `${props.width}px` : props.width};`}
  ${props => props.height && `height: ${typeof props.height === 'number' ? `${props.height}px` : props.height};`}
`;

const Image = styled.img<{ 
  objectFit?: string;
  isLoaded?: boolean;
}>`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.objectFit || 'cover'};
  transition: opacity 0.3s ease;
  opacity: ${props => props.isLoaded ? 1 : 0};
`;

const PlaceholderDiv = styled.div<{ 
  isVisible?: boolean;
  aspectRatio?: string;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-color);
  font-size: 0.9rem;
  transition: opacity 0.3s ease;
  opacity: ${props => props.isVisible ? 1 : 0};
  pointer-events: none;
  
  ${props => props.aspectRatio && `aspect-ratio: ${props.aspectRatio};`}
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid var(--accent-color);
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  lazy = true,
  webpSrc,
  placeholder,
  aspectRatio,
  objectFit = 'cover',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate WebP source if not provided
  const getWebPSrc = (originalSrc: string): string => {
    if (webpSrc) return webpSrc;
    
    // Convert local PNG/JPG to WebP
    if (originalSrc.startsWith('/images/') && (originalSrc.includes('.png') || originalSrc.includes('.jpg') || originalSrc.includes('.jpeg'))) {
      return originalSrc.replace(/\.(png|jpg|jpeg)$/, '.webp');
    }
    
    // For external images, add WebP query parameter if it's Unsplash
    if (originalSrc.includes('unsplash.com')) {
      const url = new URL(originalSrc);
      url.searchParams.set('fm', 'webp');
      url.searchParams.set('q', '80');
      return url.toString();
    }
    
    return originalSrc;
  };

  const webpSource = getWebPSrc(src);
  const shouldShowPlaceholder = !isLoaded && !hasError;

  return (
    <ImageContainer
      ref={containerRef}
      className={className}
      style={style}
      aspectRatio={aspectRatio}
      width={width}
      height={height}
    >
      {isInView && (
        <picture>
          {webpSource !== src && (
            <source srcSet={webpSource} type="image/webp" />
          )}
          <Image
            ref={imgRef}
            src={src}
            alt={alt}
            objectFit={objectFit}
            isLoaded={isLoaded}
            onLoad={handleLoad}
            onError={handleError}
            loading={lazy ? "lazy" : "eager"}
            decoding="async"
          />
        </picture>
      )}
      
      <PlaceholderDiv 
        isVisible={shouldShowPlaceholder}
        aspectRatio={aspectRatio}
      >
        {hasError ? (
          <span style={{ color: '#ef4444' }}>画像の読み込みに失敗しました</span>
        ) : (
          placeholder || ''
        )}
      </PlaceholderDiv>
    </ImageContainer>
  );
};

export default OptimizedImage;