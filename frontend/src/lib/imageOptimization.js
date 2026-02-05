// src/lib/imageOptimization.js
export const imageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export const optimizedImageProps = {
  quality: 85,
  loading: 'lazy',
  decoding: 'async',
};

export const imageSizes = {
  hero: '(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px',
  feature: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  avatar: '(max-width: 640px) 48px, 64px',
};
