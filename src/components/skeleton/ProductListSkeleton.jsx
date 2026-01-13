// Loading Skeleton Component
const ProductListSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 w-80 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
      </div>
    </div>

    {/* Filters Skeleton */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex gap-4 mb-8">
        <div className="flex-1">
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="h-12 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-12 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Active Filters Skeleton */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Image Skeleton */}
            <div className="aspect-square bg-gray-200 animate-pulse relative">
              <div className="absolute top-2 left-2">
                <div className="h-6 w-16 bg-gray-300 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>

              <div className="flex items-center justify-between pt-2">
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Error Component
const ProductListError = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto px-4">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-12 h-12 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-4">
        {error?.message || "Unable to load products at this time"}
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Refresh Page
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-6">
        If the problem persists, please contact support
      </p>
    </div>
  </div>
);

export { ProductListSkeleton, ProductListError };
