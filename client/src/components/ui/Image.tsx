
import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

const imageContainerVariants = cva(
  "relative overflow-hidden bg-gray-100 dark:bg-gray-800",
  {
    variants: {
      ratio: {
        auto: "",
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]",
        wide: "aspect-[2/1]",
      },
      rounded: {
        none: "rounded-none",
        md: "rounded-xl",
        full: "rounded-full",
      }
    },
    defaultVariants: {
      ratio: "auto",
      rounded: "none",
    },
  }
);

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  containerClassName?: string;
  ratio?: VariantProps<typeof imageContainerVariants>['ratio'];
  rounded?: VariantProps<typeof imageContainerVariants>['rounded'];
  priority?: boolean;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  fallbackSrc = 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80',
  ratio,
  rounded,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", // Default responsive sizes
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Auto-optimize Unsplash URLs for performance
  let optimizedSrc = src;
  if (typeof src === 'string' && src.includes('images.unsplash.com')) {
    const separator = src.includes('?') ? '&' : '?';
    // Auto-format to webp/avif via auto=format, and responsive resize hint
    if (!src.includes('w=')) {
      optimizedSrc = `${src}${separator}auto=format&fit=crop&w=800&q=80`;
    }
  }

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsLoaded(true); // Stop loading state
    setError(true);
  };

  return (
    <div className={cn(imageContainerVariants({ ratio, rounded }), containerClassName)}>
      {/* Loading Skeleton */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-200 dark:bg-gray-800 animate-pulse">
          <Icon name="image" className="text-gray-400 text-2xl opacity-20" />
        </div>
      )}

      {/* Error State */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 z-20">
          <Icon name="broken_image" className="text-3xl mb-1 opacity-50" />
          <span className="text-[10px] font-medium">加载失败</span>
        </div>
      ) : (
        <img
          src={optimizedSrc as string}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-in-out",
            isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-110 blur-lg",
            className
          )}
          {...props}
          {...(priority ? { fetchpriority: "high" } : {})}
        />
      )}
    </div>
  );
};
