import useBodyScrollLock from "../../hooks/useBodyScrollLock";

export default function FullScreenLoader({
  message = "Loading...",
  showSpinner = true,
  spinnerColor = "red",
  overlayOpacity = "bg-white dark:bg-gray-900 bg-opacity-75",
  size = "md",
  textClassName = "",
  spinnerClassName = "",
  containerClassName = "",
  showProgress = false,
  progress = 0,
  isLoading = true,
}) {
  const sizeClasses = {
    sm: {
      spinner: "w-10 h-10",
      text: "text-base",
    },
    md: {
      spinner: "w-16 h-16",
      text: "text-lg",
    },
    lg: {
      spinner: "w-24 h-24",
      text: "text-xl",
    },
  };

  const colorClasses = {
    blue: "border-blue-500 border-t-transparent",
    green: "border-green-500 border-t-transparent",
    red: "border-red-500 border-t-transparent",
    purple: "border-purple-500 border-t-transparent",
    gray: "border-gray-400 border-t-transparent",
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;
  const currentColor = colorClasses[spinnerColor] || colorClasses.blue;

  useBodyScrollLock(isLoading);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${overlayOpacity} backdrop-blur-sm transition-opacity duration-300 ${containerClassName}`}
    >
      <div className="flex flex-col items-center max-w-md px-6 text-center">
        {showSpinner && (
          <div className="relative flex items-center justify-center mb-6">
            <div
              className={`${currentSize.spinner} border-4 ${currentColor} rounded-full animate-spin ${spinnerClassName}`}
            ></div>
            {/* Optional pulsing background effect */}
            <div
              className={`absolute inset-0 ${currentSize.spinner} border-4 ${currentColor.replace("border-t-transparent", "")} rounded-full animate-ping opacity-20`}
            ></div>
          </div>
        )}

        {/* Progress bar (optional) */}
        {showProgress && (
          <div className="w-full max-w-xs mb-6">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            {progress > 0 && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progress)}%
              </p>
            )}
          </div>
        )}

        {/* Loading message */}
        <p
          className={`${currentSize.text} font-medium text-gray-800 dark:text-gray-200 ${textClassName}`}
        >
          {message}
        </p>

        {/* Optional subtitle */}
        {showProgress && progress > 0 && progress < 100 && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please wait while we process your request...
          </p>
        )}
      </div>
    </div>
  );
}
