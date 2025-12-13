import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===================== REQUEST INTERCEPTOR ===================== */
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/* ===================== RESPONSE INTERCEPTOR ===================== */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No response (network error)
    if (!error.response) {
      return Promise.reject({
        message: "No response from server. Please check your connection.",
        code: "NETWORK_ERROR",
      });
    }

    const { status, data } = error.response;

    const normalizedError = {
      message: data?.message || "An error occurred",
      code: data?.code,
      status,
      ...data,
    };

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh-token");

        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(normalizedError);
  }
);

export default api;
