import { useState, useCallback } from "react";
import { useApi } from "./useApi";

export const useProduct = () => {
  const { loading, error, callApi } = useApi();
  const [success, setSuccess] = useState(false);

  const getProducts = useCallback(
    async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/api/products${queryString ? `?${queryString}` : ""}`;
      return await callApi(endpoint, "GET");
    },
    [callApi]
  );

  const getProductById = useCallback(
    async (id) => {
      return await callApi(`/api/products/${id}`, "GET");
    },
    [callApi]
  );

  const getBestSellers = useCallback(async () => {
    return await callApi("/api/products/best-sellers", "GET");
  }, [callApi]);

  const getProductStats = useCallback(async () => {
    return await callApi("/api/products/stats", "GET");
  }, [callApi]);

  return {
    loading,
    error,
    success,
    getProducts,
    getProductById,
    getBestSellers,
    getProductStats,
    setSuccess,
  };
};
