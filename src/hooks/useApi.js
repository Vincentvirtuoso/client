import { useState, useCallback, useRef, useEffect } from "react";
import api from "../api/axiosInstance";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Store AbortControllers by request key
  const controllersRef = useRef(new Map());
  const activeRequestsRef = useRef(0);

  const callApi = useCallback(
    async ({
      key,
      endpoint,
      method = "GET",
      body = null,
      config = {},
      cancelPrevious = false,
    }) => {
      setError(null);

      // Handle keyed cancellation
      if (key && cancelPrevious) {
        controllersRef.current.get(key)?.abort();
      }

      const controller = new AbortController();

      if (key) {
        controllersRef.current.set(key, controller);
      }

      activeRequestsRef.current += 1;
      setLoading(true);

      try {
        const response = await api({
          url: endpoint,
          method,
          data: body,
          signal: controller.signal,
          ...config,
        });

        return response.data;
      } catch (err) {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") {
          return null;
        }

        const errorData = err.response?.data || err;
        setError(errorData);
        throw errorData;
      } finally {
        activeRequestsRef.current -= 1;

        if (key) {
          controllersRef.current.delete(key);
        }

        if (activeRequestsRef.current === 0) {
          setLoading(false);
        }
      }
    },
    [],
  );

  const abort = useCallback((key) => {
    if (key) {
      controllersRef.current.get(key)?.abort();
      controllersRef.current.delete(key);
    } else {
      controllersRef.current.forEach((controller) => controller.abort());
      controllersRef.current.clear();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      controllersRef.current.forEach((controller) => controller.abort());
      controllersRef.current.clear();
    };
  }, []);

  return { loading, error, callApi, abort, setError };
};
