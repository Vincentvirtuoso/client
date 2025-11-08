import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import StarRating from "../../components/ui/StarRating";
import { LuCheck, LuChevronDown } from "react-icons/lu";

function AdvancedFilters({
  categories,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setInStockOnly,
  setMinRating,
  minRating,
  inStockOnly,
  setPriceRange,
}) {
  const FilterDropdown = ({
    label,
    options,
    selected,
    onSelect,
    multiple = false,
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
        >
          <span>{label}</span>
          <LuChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
            >
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onSelect(option);
                    if (!multiple) setIsOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  <span>{option}</span>
                  {selected.includes(option) && (
                    <LuCheck className="w-4 h-4 text-red-600" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8 "
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <FilterDropdown
            label="Select Categories"
            options={categories}
            selected={selectedCategories}
            onSelect={(category) => {
              setSelectedCategories((prev) =>
                prev.includes(category)
                  ? prev.filter((c) => c !== category)
                  : [...prev, category]
              );
            }}
            multiple={true}
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: ₦{priceRange[0].toLocaleString()} - ₦
            {priceRange[1].toLocaleString()}
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="300000"
              step="1000"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange([parseInt(e.target.value), priceRange[1]])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="300000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([priceRange[0], parseInt(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating
          </label>
          <div className="flex gap-2 flex-wrap">
            {[0, 1, 2, 3, 4, 4.5].map((rating) => (
              <button
                key={rating}
                onClick={() => setMinRating(rating)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
                  minRating === rating
                    ? "bg-red-100 border-red-500 text-red-700"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <StarRating rating={rating} />
                {rating > 0 && <span className="text-xs">+</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Stock Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Availability
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>
    </motion.div>
  );
}

export default AdvancedFilters;
