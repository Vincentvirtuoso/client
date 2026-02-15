import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuArrowLeft,
  LuArrowUpRight,
  LuClock,
  LuSearch,
  LuTrendingUp,
  LuX,
} from "react-icons/lu";

const MobileSearchMenu = ({
  setMobileSearchOpen,
  mobileSearchOpen,
  searchQuery,
  handleSearch,
  handleSearchKeyPress,
  setSearchQuery,
  setSearchFocused,
  searchSuggestions,
  handleSuggestionClick,
  promoBannerVisible,
}) => {
  return (
    <div className={`md:hidden flex-1 `}>
      {/* Mobile Search Trigger Button */}
      <button
        onClick={() => setMobileSearchOpen(true)}
        className=" text-gray-600 hover:text-red-400 rounded-lg transition-colors font-medium p-2 hover:bg-gray-50"
        aria-label="Open search"
      >
        <LuSearch className="w-4 h-4" />
      </button>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 bg-white z-50 flex flex-col ${
              promoBannerVisible ? "mt-13" : ""
            }`}
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <button
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close search"
              >
                <LuArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden relative pr-10">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyPress}
                  onFocus={() => setSearchFocused(true)}
                  placeholder="Search products, brands, categories..."
                  className="px-3 py-3 text-sm bg-transparent focus:ring-0 placeholder-gray-500 flex-1 rounded-l-xl border-transparent"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <LuX className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleSearch}
                  className="bg-red-600 text-white p-3 h-full hover:bg-red-700 transition-colors flex items-center absolute right-0 top-0"
                  aria-label="Search"
                >
                  <LuSearch className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Content */}
            <div className="flex-1 overflow-y-auto">
              {searchQuery ? (
                /* Search Results */
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-700">
                      Results for "{searchQuery}"
                    </span>
                    <span className="text-xs text-gray-500">
                      {
                        searchSuggestions.filter((s) =>
                          s.text
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                        ).length
                      }{" "}
                      found
                    </span>
                  </div>

                  <div className="space-y-2">
                    {searchSuggestions
                      .filter((s) =>
                        s.text
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                      )
                      .slice(0, 8)
                      .map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleSuggestionClick(
                              suggestion.text,
                              suggestion.href,
                            );
                            setMobileSearchOpen(false);
                          }}
                          className="w-full text-left p-3 hover:bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3 group"
                        >
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {suggestion.text}
                            </div>
                            {suggestion.category?.name && (
                              <div className="text-xs text-gray-500 mt-1">
                                in {suggestion.category?.name}
                              </div>
                            )}
                          </div>
                          <LuArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                /* Empty State - Recent & Trending */
                <div className="p-4 space-y-6">
                  {/* Recent Searches */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <LuClock className="w-4 h-4" />
                        Recent Searches
                      </h3>
                      <button
                        onClick={() => {
                          /* Clear recent searches */
                        }}
                        className="text-xs text-red-600 hover:text-red-700 font-medium"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {searchSuggestions
                        .filter((s) => s.type === "recent")
                        .slice(0, 5)
                        .map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              handleSuggestionClick(
                                suggestion.text,
                                suggestion.href,
                              );
                              setMobileSearchOpen(false);
                            }}
                            className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center gap-3 text-sm text-gray-700"
                          >
                            <LuClock className="w-4 h-4 text-gray-400" />
                            {suggestion.text}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Trending Searches */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <LuTrendingUp className="w-4 h-4" />
                      Trending Now
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions
                        .filter((s) => s.type === "trending")
                        .slice(0, 8)
                        .map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              handleSuggestionClick(
                                suggestion.text,
                                suggestion.href,
                              );
                              setMobileSearchOpen(false);
                            }}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 rounded-full text-sm transition-colors"
                          >
                            <LuTrendingUp className="w-3 h-3" />
                            {suggestion.text}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Keyboard Shortcut Hint */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="text-xs text-gray-500 text-center">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded mx-1">
                  Enter
                </kbd>{" "}
                to search
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileSearchMenu;
