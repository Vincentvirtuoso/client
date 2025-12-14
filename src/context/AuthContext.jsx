import { createContext, useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import {
  setUnauthorizedLogoutHandler,
  setRefreshHandler,
} from "../api/axiosInstance";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { loading, error, callApi } = useApi();
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Connect axios interceptor handlers
  useEffect(() => {
    setUnauthorizedLogoutHandler(() => {
      console.log("Unauthorized - logging out");
      setUser(null);
    });

    setRefreshHandler(async () => {
      console.log("Attempting token refresh...");
      const data = await callApi("auth/refresh-token", "POST");
      if (data?.data?.user) {
        setUser(data.data.user);
      }
      return data;
    });
  }, [callApi]);

  // Initialize auth state on mount
  useEffect(() => {
    if (isInitialized) return;
    initializeAuth();
  }, [isInitialized]);

  const initializeAuth = async () => {
    try {
      setAuthLoading(true);
      const data = await callApi("auth/me", "GET");

      if (data?.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.log("Not authenticated or session expired");
      console.log(err);

      setUser(null);
    } finally {
      setAuthLoading(false);
      setIsInitialized(true);
    }
  };

  const login = async ({ email, password }) => {
    const data = await callApi("auth/login", "POST", { email, password });

    if (data?.data?.user) {
      setUser(data.data.user);
    }
    return data;
  };

  const register = async ({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    role,
  }) => {
    const data = await callApi("auth/register", "POST", {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      role,
    });

    if (data?.user) {
      setUser(data.user);
    }
    return data;
  };

  const logout = async () => {
    try {
      await callApi("auth/logout", "POST");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const data = await callApi("auth/refresh-token", "POST");
      if (data?.data?.user) {
        setUser(data.data.user);
      }
      return data;
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  const verifyEmail = async (token, email) => {
    const data = await callApi(
      `auth/verify-email?token=${token}&email=${email}`,
      "GET"
    );

    if (data?.user) {
      setUser(data.user);
    }

    return data;
  };

  const resendVerificationEmail = async (email) => {
    const data = await callApi("auth/resend-verification", "POST", { email });
    return data;
  };

  const refreshUser = () => {
    setIsInitialized(false);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading: loading || authLoading,
    error,
    isAuthenticated: !!user,
    isInitialized,
    login,
    register,
    logout,
    refreshToken,
    verifyEmail,
    resendVerificationEmail,
    updateUser,
    setUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
