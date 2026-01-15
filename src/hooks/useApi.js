import { useState, useCallback, useRef } from "react";
import api from "../api/axiosInstance";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const callApi = useCallback(
    async (endpoint, method = "GET", body = null, config = {}) => {
      // Cancel any pending request
      setLoading(true);
      setError(null);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const response = await api({
          url: endpoint,
          method,
          data: body,
          signal: abortControllerRef.current.signal,
          ...config,
        });

        setLoading(false);
        return response.data;
      } catch (err) {
        setLoading(false);

        // Don't set error if request was aborted
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          return null;
        }

        const errorData = err.response?.data || { ...err };
        setError(errorData);
        throw errorData;
      }
    },
    []
  );

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
    }
  }, []);

  return { loading, error, callApi, abort };
};
