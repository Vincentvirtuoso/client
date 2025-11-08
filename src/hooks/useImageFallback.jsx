import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export default function useImageFallback(src, options = {}) {
  const {
    fallbackSrc = "/images/fallbac.png",
    fallbackIcon: FallbackIcon = null,
    withShimmer = true,
    effect = "blur",
    onLoad: externalOnLoad,
    onError: externalOnError,
  } = options;

  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  const imgRef = useRef(null);

  // Reset when the source changes (new image)
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoading(true);
    setAttemptedFallback(false);
  }, [src]);

  const handleLoad = useCallback(
    (event) => {
      setIsLoading(false);
      setHasError(false);
      externalOnLoad?.(event);
    },
    [externalOnLoad]
  );

  const handleError = useCallback(
    (event) => {
      setIsLoading(false);
      setHasError(true);

      // Only attempt fallback once
      if (fallbackSrc && !attemptedFallback && currentSrc !== fallbackSrc) {
        setAttemptedFallback(true);
        setCurrentSrc(fallbackSrc);
        setIsLoading(true);
        setHasError(false);
        return;
      }

      // If even fallback fails
      externalOnError?.(event);
    },
    [attemptedFallback, currentSrc, fallbackSrc, externalOnError]
  );

  // Timeout safeguard for loading
  useEffect(() => {
    if (!isLoading) return;
    const timeoutId = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const render = useCallback(
    (props = {}) => {
      const {
        className = "w-full h-full object-cover rounded-md",
        alt = "image",
        ...rest
      } = props;

      if (isLoading && withShimmer) {
        return (
          <div className={`flex items-center justify-center ${className}`}>
            <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin" />
          </div>
        );
      }

      if (hasError && FallbackIcon) {
        return (
          <div
            className={`flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-md ${className}`}
          >
            <FallbackIcon className="w-8 h-8" />
          </div>
        );
      }

      return (
        <LazyLoadImage
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={`absolute inset-0 transition-transform duration-500 ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          wrapperClassName="absolute inset-0"
          effect={effect}
          {...rest}
        />
      );
    },
    [
      currentSrc,
      hasError,
      isLoading,
      FallbackIcon,
      handleLoad,
      handleError,
      effect,
      withShimmer,
    ]
  );

  return {
    currentSrc,
    hasError,
    isLoading,
    render,
  };
}
