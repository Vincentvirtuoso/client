import React, { useState, useEffect, useCallback } from "react";
import {
  LuChevronRight,
  LuChevronDown,
  LuFolder,
  LuStar,
} from "react-icons/lu";
import { useCategory } from "../../hooks/useCategory";
import Spinner from "../../components/common/Spinner";
import { motion, AnimatePresence } from "framer-motion";

const CategoryTreeNode = ({ category, level = 0, onCategoryClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  console.log(category);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="category-node" style={{ marginLeft: `${level * 25}px` }}>
      <div
        className={[
          "flex items-center p-2 cursor-pointer hover:bg-gray-50 transition-colors",
          !category.isActive ? "opacity-60" : "",
          level === 0 ? "border-b border-gray-100" : "bg-transparent",
          level > 0 ? "border-l-2 border-gray-200" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => onCategoryClick?.(category)}
      >
        {/* Expand / collapse toggle */}
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className="bg-transparent border-none cursor-pointer flex items-center p-0 shrink-0 w-6 h-6"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <LuChevronDown /> : <LuChevronRight />}
          </button>
        ) : (
          <span className="w-6 shrink-0" />
        )}

        {/* Icon / image */}
        {category.icon || category.image ? (
          <img
            src={category.icon || category.image}
            alt={category.name}
            className="w-8 h-8 object-contain mr-2 rounded shrink-0"
          />
        ) : (
          <LuFolder
            className={`mr-2 text-xl shrink-0 ${
              level === 0 ? "text-red-600" : "text-gray-400"
            }`}
          />
        )}

        <span className="flex-1 text-xs line-clamp-1">{category.name}</span>

        {category.isFeatured && (
          <span
            className="ml-2 px-1.5 py-0.5 bg-yellow-400 rounded-full text-xs font-bold shrink-0"
            title="Featured"
          >
            <LuStar />
          </span>
        )}
      </div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <div className="category-children" initial={{ y: 10, opacity: 0 }}>
            {category.children.map((child) => (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
              >
                <CategoryTreeNode
                  key={child._id || child.id}
                  category={child}
                  level={level + 1}
                  onCategoryClick={onCategoryClick}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const filterCategories = (cats, showInactive) =>
  cats.filter((cat) => !cat.isArchived && (showInactive || cat.isActive));

const buildCategoryTree = (cats) => {
  const categoryMap = new Map();

  cats.forEach((cat) => {
    categoryMap.set(cat._id || cat.id, { ...cat, children: [] });
  });

  const roots = [];

  cats.forEach((cat) => {
    const id = cat._id || cat.id;
    const node = categoryMap.get(id);
    const parentId = cat.parent?._id ?? cat.parent ?? null;
    const isRoot = !parentId || cat.level === 0;

    if (!isRoot && categoryMap.has(parentId)) {
      categoryMap.get(parentId).children.push(node);
    } else {
      roots.push(node);
    }
  });

  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      const orderDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      return orderDiff !== 0 ? orderDiff : a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => n.children.length && sortNodes(n.children));
  };

  sortNodes(roots);
  return roots;
};

const CategoriesSection = ({
  onCategorySelect,
  showMetaFields = false,
  showInactive = false,
  initialParams = {},
}) => {
  const {
    loadingStates,
    error,
    categories = [],
    pagination,
    getAllCategories,
    getCategoryHierarchy,
    clearError,
  } = useCategory();

  const [fetchMethod, setFetchMethod] = useState("flat");

  const fetchCategories = useCallback(
    async (method = "flat", params = initialParams) => {
      setFetchMethod(method);
      try {
        if (method === "hierarchy") {
          await getCategoryHierarchy();
        } else {
          await getAllCategories({ ...params, includeInactive: showInactive });
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    },
    [getAllCategories, getCategoryHierarchy, initialParams, showInactive],
  );

  useEffect(() => {
    fetchCategories("flat");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRetry = () => {
    clearError();
    fetchCategories(fetchMethod);
  };

  const handleLoadMore = async () => {
    if (!pagination?.nextPage || loadingStates.fetchCategories) return;
    await getAllCategories({
      ...initialParams,
      page: pagination.nextPage,
      includeInactive: showInactive,
    });
  };

  const categoryTree =
    fetchMethod === "hierarchy"
      ? categories
      : buildCategoryTree(filterCategories(categories, showInactive));

  const flatFiltered =
    fetchMethod === "hierarchy"
      ? categories
      : filterCategories(categories, showInactive);

  const isLoading =
    loadingStates.fetchCategories || loadingStates.fetchHierarchy;

  if (isLoading && categories.length === 0) {
    return (
      <div className="p-10 text-center flex flex-col items-center gap-4">
        <Spinner size="lg" color="primary" label="Loading categories..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        <div className="mb-4">Failed to load categories: {error.message}</div>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-red-600 text-white border-none rounded cursor-pointer hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isLoading && categoryTree.length === 0) {
    return (
      <div className="p-5 text-center text-gray-600 text-xs">
        <LuFolder size={30} className="mb-4 opacity-50 mx-auto" />
        <div>No categories found</div>
        <button
          onClick={() => fetchCategories(fetchMethod)}
          className="mt-4 px-4 py-2 bg-red-600 text-white border-none rounded cursor-pointer hover:bg-red-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------
  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="categories-header px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold flex justify-between items-center">
        <span className="text-sm">
          Categories {pagination ? `(${pagination.total})` : ""}
        </span>
        <div className="flex gap-2">
          {["flat", "hierarchy"].map((method) => (
            <button
              key={method}
              onClick={() => fetchCategories(method)}
              disabled={isLoading}
              className={`px-2 py-1 text-xs border-none rounded-full cursor-pointer transition-colors capitalize disabled:opacity-50 ${
                fetchMethod === method
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Tree list */}
      <div
        className={`max-h-40 flex flex-col gap-1 relative ${isLoading ? "overflow-y-hidden" : "overflow-y-auto"}`}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <Spinner size="sm" color="primary" />
          </div>
        )}
        {categoryTree.map((category) => (
          <CategoryTreeNode
            key={category._id || category.id}
            category={category}
            level={0}
            onCategoryClick={onCategorySelect}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination?.nextPage && (
        <div className="p-4 text-center border-t border-gray-200">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className={`px-4 py-2 bg-gray-100 border border-gray-200 rounded cursor-pointer flex items-center justify-center gap-2 mx-auto transition-colors ${
              isLoading ? "opacity-60 cursor-wait" : "hover:bg-gray-200"
            }`}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" color="secondary" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      {/* Meta-fields panel */}
      {showMetaFields && (
        <div className="meta-fields-summary mt-5 p-4 bg-gray-50 border-t border-gray-200">
          <h4 className="m-0 mb-3 text-sm text-gray-700 font-semibold">
            Meta Fields Overview
          </h4>
          {flatFiltered.map(
            (cat) =>
              cat.metaFields?.length > 0 && (
                <div key={cat._id || cat.id} className="mb-3">
                  <strong className="text-sm">{cat.name}:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {cat.metaFields.map((field, index) => (
                      <span
                        key={field.key || index}
                        className="px-2 py-0.5 bg-red-100 rounded-full text-xs flex items-center gap-1"
                        title={`Type: ${field.type}${field.isRequired ? " (Required)" : ""}`}
                      >
                        {field.label}
                        {field.isRequired && (
                          <span className="text-red-600">*</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesSection;
