import type { ImgHTMLAttributes } from 'react';

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | { src: string; width?: number; height?: number };
  alt: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
};

export default function Image({ src, fill, priority, quality: _quality, unoptimized: _unoptimized, style, ...props }: ImageProps) {
  const url = typeof src === 'string' ? src : src.src;
  return (
    <img
      {...props}
      src={url}
      loading={priority ? 'eager' : props.loading ?? 'lazy'}
      fetchPriority={priority ? 'high' : props.fetchPriority}
      style={{ ...(fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } as const : {}), ...style }}
    />
  );
}
