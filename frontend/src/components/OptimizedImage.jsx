// src/components/OptimizedImage.jsx

import Image from 'next/image';

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  className = '',
  ...props
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={85}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
      {...props}
    />
  );
}
