import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const setAccessToken = (token) => localStorage.setItem("accessToken", token);
const setRefreshToken = (token) => localStorage.setItem("refreshToken", token);
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

/* =======================
   REQUEST INTERCEPTOR
======================= */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject({
        message: "No response from server. Please check your connection.",
        code: "NETWORK_ERROR",
      });
    }

    const { status, data } = error.response;
    const originalRequest = error.config;

    const normalizedError = {
      message: data?.message || "An error occurred",
      code: data?.code,
      status,
    };

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token") &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            refreshToken: getRefreshToken(),
          }
        );

        const { token } = response.data.data;
        setAccessToken(token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        if (window.location.pathname !== "/auth/login") {
          window.location.replace("/auth/login");
        }
        return Promise.reject(refreshError);
      }
    }

    if (status === 401 && !getRefreshToken()) {
      clearTokens();
      if (window.location.pathname !== "/auth/login") {
        window.location.replace("/auth/login");
      }
    }

    return Promise.reject(normalizedError);
  }
);

export { getAccessToken, setAccessToken, setRefreshToken, clearTokens };
export default api;
