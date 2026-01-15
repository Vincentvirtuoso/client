// Product Detail Skeleton Loader
const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4 h-[450px]">
          <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse relative">
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 w-16 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Stock Status */}
          <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4/6 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-16 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="h-14 w-40 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-14 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="mt-16 bg-white rounded-2xl shadow-sm">
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-3 p-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-100 mx-1 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-4 ${
                  i % 2 === 0 ? "w-5/6" : "w-full"
                } bg-gray-200 rounded animate-pulse`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// eslint-disable-next-line no-unused-vars
const ProductDetailError = ({ error, onRetry, onGoBack }) => (
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
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Product Not Found
      </h3>
      <p className="text-gray-600 mb-6">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onGoBack}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Back to Products
        </button>
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

export { ProductDetailSkeleton, ProductDetailError };
