import { useState, useCallback } from "react";
import { useApi } from "./useApi";

export const useCategory = () => {
  const { loading: apiLoading, error, setError, callApi } = useApi();

  const [loadingStates, setLoadingStates] = useState({
    fetchCategories: false,
    fetchCategory: false,
    fetchActiveCategories: false,
    fetchHierarchy: false,
    fetchProductCount: false,
  });

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Helper to manage loading states
  const withLoading = useCallback(
    async (loadingKey, apiCall) => {
      setLoadingStates((prev) => ({ ...prev, [loadingKey]: true }));
      setError(null);

      try {
        const result = await apiCall();
        return result;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoadingStates((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    [setError],
  );

  const getAllCategories = useCallback(
    async (params = {}) => {
      return withLoading("fetchCategories", async () => {
        const queryParams = new URLSearchParams(params).toString();
        const response = await callApi({
          endpoint: `/categories${queryParams ? `?${queryParams}` : ""}`,
          method: "GET",
        });
        setCategories(response.data);
        setPagination(response.pagination);
        return response;
      });
    },
    [callApi, withLoading],
  );

  const getCategoryById = useCallback(
    async (id) => {
      return withLoading("fetchCategory", async () => {
        const response = await callApi({
          endpoint: `/categories/${id}`,
          method: "GET",
        });
        setCategory(response.data);
        return response;
      });
    },
    [callApi, withLoading],
  );

  const getCategoryBySlug = useCallback(
    async (slug) => {
      return withLoading("fetchCategory", async () => {
        const response = await callApi({
          endpoint: `/categories/slug/${slug}`,
          method: "GET",
        });
        setCategory(response.data);
        return response;
      });
    },
    [callApi, withLoading],
  );

  const getActiveCategories = useCallback(async () => {
    return withLoading("fetchActiveCategories", async () => {
      return callApi({ endpoint: "/categories/active", method: "GET" });
    });
  }, [callApi, withLoading]);

  const getCategoryHierarchy = useCallback(async () => {
    return withLoading("fetchHierarchy", async () => {
      const res = await callApi({
        endpoint: "/categories/hierarchy",
        method: "GET",
      });

      console.log(res);

      setCategories(res.data);
      return res;
    });
  }, [callApi, withLoading]);

  const getProductCount = useCallback(
    async (id) => {
      return withLoading("fetchProductCount", async () => {
        return callApi({
          endpoint: `/categories/${id}/product-count`,
          method: "GET",
        });
      });
    },
    [callApi, withLoading],
  );

  // Clear states
  const clearCategory = useCallback(() => {
    setCategory(null);
  }, []);

  const clearCategories = useCallback(() => {
    setCategories([]);
    setPagination(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset all loading states
  const resetLoadingStates = useCallback(() => {
    setLoadingStates({
      fetchCategories: false,
      fetchCategory: false,
      fetchActiveCategories: false,
      fetchHierarchy: false,
      fetchProductCount: false,
    });
  }, []);

  return {
    // States
    loading: apiLoading,
    loadingStates,
    error,
    categories,
    category,
    pagination,

    // Actions
    getAllCategories,
    getCategoryById,
    getCategoryBySlug,
    getActiveCategories,
    getCategoryHierarchy,
    getProductCount,
    clearError,
    resetLoadingStates,

    clearCategories,
    clearCategory,
  };
};
