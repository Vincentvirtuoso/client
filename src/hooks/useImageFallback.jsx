import { useState, useCallback, useMemo, useEffect, useRef } from "react";

export default function useImageReady(src, options = {}) {
  const {
    fallbackSrc = "/images/fallback.png",
    onReady,
    onError: externalOnError,
    checkImmediately = true,
  } = options;

  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attemptedFallback, setAttemptedFallback] = useState(false);

  const imgRef = useRef(null);

  // Reset when source changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsReady(false);
    setHasError(false);
    setAttemptedFallback(false);
  }, [src]);

  // Core image checking function
  const checkImage = useCallback((url) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error("No URL provided"));
        return;
      }

      const img = new Image();

      img.onload = () => {
        resolve({
          src: url,
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        });
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${url}`));
      };

      img.src = url;
    });
  }, []);

  // Main effect to check image readiness
  useEffect(() => {
    if (!checkImmediately) return;

    let isMounted = true;

    const verifyImage = async () => {
      try {
        // Check primary source
        const result = await checkImage(currentSrc);

        if (isMounted) {
          setIsReady(true);
          setHasError(false);
          onReady?.(result);
        }
      } catch (error) {
        if (!isMounted) return;

        setHasError(true);

        // Try fallback if available and not already attempted
        if (fallbackSrc && !attemptedFallback && currentSrc !== fallbackSrc) {
          setAttemptedFallback(true);
          setCurrentSrc(fallbackSrc);
          setIsReady(false); // Reset for fallback attempt

          try {
            const fallbackResult = await checkImage(fallbackSrc);
            if (isMounted) {
              setIsReady(true);
              setHasError(false);
              onReady?.(fallbackResult);
            }
          } catch (fallbackError) {
            if (isMounted) {
              externalOnError?.(fallbackError);
            }
          }
        } else {
          externalOnError?.(error);
        }
      }
    };

    verifyImage();

    return () => {
      isMounted = false;
    };
  }, [
    currentSrc,
    fallbackSrc,
    attemptedFallback,
    checkImmediately,
    checkImage,
    onReady,
    externalOnError,
  ]);

  // Manually trigger image check
  const triggerCheck = useCallback(async () => {
    setIsReady(false);
    setHasError(false);

    try {
      const result = await checkImage(currentSrc);
      setIsReady(true);
      onReady?.(result);
      return result;
    } catch (error) {
      setHasError(true);
      externalOnError?.(error);
      throw error;
    }
  }, [currentSrc, checkImage, onReady, externalOnError]);

  // Preload image without setting state
  const preload = useCallback(async () => {
    return checkImage(currentSrc);
  }, [currentSrc, checkImage]);

  // Get current status
  const status = useMemo(
    () => ({
      isReady,
      hasError,
      src: currentSrc,
      isFallback: attemptedFallback,
    }),
    [isReady, hasError, currentSrc, attemptedFallback],
  );

  return {
    // Status information
    isReady,
    hasError,
    currentSrc,
    isFallback: attemptedFallback,
    status,

    // Control methods
    triggerCheck,
    preload,

    // For rendering if needed (optional)
    render: useCallback(
      (props = {}) => {
        const { className = "", alt = "", ...rest } = props;

        if (hasError && fallbackSrc && currentSrc !== fallbackSrc) {
          return (
            <img
              ref={imgRef}
              src={fallbackSrc}
              alt={alt}
              className={className}
              {...rest}
            />
          );
        }

        return (
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            className={className}
            {...rest}
          />
        );
      },
      [currentSrc, hasError, fallbackSrc],
    ),
  };
}
