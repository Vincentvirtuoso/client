import { useState, useCallback } from "react";
import { useApi } from "./useApi";

export const useProduct = () => {
  const { loading, error, callApi } = useApi();
  const [success, setSuccess] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);

  const getProducts = useCallback(
    async (params = {}) => {
      try {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/products${queryString ? `?${queryString}` : ""}`;
        const res = await callApi({ endpoint, method: "GET" });

        if (res && res.data) {
          setProducts(res.data.products || []);
          setPagination(res.data.pagination || null);
          setSuccess(true);
        }
        return res;
      } catch (err) {
        setProducts([]);
        setPagination(null);
        setSuccess(false);
        throw err;
      }
    },
    [callApi]
  );

  const getProductById = useCallback(
    async (id) => {
      return await callApi({ endpoint: `/products/${id}`, method: "GET" });
    },
    [callApi]
  );

  const getBestSellers = useCallback(async () => {
    return await callApi({ endpoint: "/products/best-sellers", method: "GET" });
  }, [callApi]);

  const getProductStats = useCallback(async () => {
    return await callApi({ endpoint: "/products/stats", method: "GET" });
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
    products,
    pagination,
  };
};
