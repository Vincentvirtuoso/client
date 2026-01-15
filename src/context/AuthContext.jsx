import { createContext, useReducer, useEffect, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import {
  setUnauthorizedLogoutHandler,
  setRefreshHandler,
} from "../api/axiosInstance";

export const AuthContext = createContext(null);

const initialState = {
  user: null,

  status: "booting",
  loading: {
    init: true,
    login: false,
    register: false,
    logout: false,
    refresh: false,
    verifyEmail: false,
    resendVerification: false,
  },

  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "INIT_START":
      return {
        ...state,
        loading: { ...state.loading, init: true },
      };

    case "INIT_SUCCESS":
      return {
        ...state,
        user: action.payload ?? null,
        status: action.payload ? "authenticated" : "unauthenticated",
        loading: { ...state.loading, init: false },
      };

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        status: action.payload ? "authenticated" : "unauthenticated",
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        status: "unauthenticated",
      };

    case "ACTION_START":
      return {
        ...state,
        loading: { ...state.loading, [action.action]: true },
        error: null,
      };

    case "ACTION_END":
      return {
        ...state,
        loading: { ...state.loading, [action.action]: false },
      };

    case "ERROR":
      return {
        ...state,
        error: action.payload,
        status: "error",
      };

    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const { callApi } = useApi();
  const [state, dispatch] = useReducer(authReducer, initialState);

  const start = (action) => dispatch({ type: "ACTION_START", action });

  const end = (action) => dispatch({ type: "ACTION_END", action });

  const initializeAuth = useCallback(async () => {
    dispatch({ type: "INIT_START" });

    try {
      const data = await callApi("auth/me", "GET");
      dispatch({ type: "INIT_SUCCESS", payload: data?.user ?? null });
    } catch {
      dispatch({ type: "INIT_SUCCESS", payload: null });
    }
  }, [callApi]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    setUnauthorizedLogoutHandler(() => {
      dispatch({ type: "LOGOUT" });
    });

    setRefreshHandler(async () => {
      start("refresh");

      try {
        const data = await callApi("auth/refresh-token", "POST");
        if (data?.data?.user) {
          dispatch({ type: "SET_USER", payload: data.data.user });
        }
        return data;
      } finally {
        end("refresh");
      }
    });
  }, [callApi]);

  const login = async (payload) => {
    start("login");
    try {
      const data = await callApi("auth/login", "POST", payload);
      if (data?.data?.user) {
        dispatch({ type: "SET_USER", payload: data.data.user });
      }
      return data;
    } finally {
      end("login");
    }
  };

  const register = async (payload) => {
    start("register");
    try {
      const data = await callApi("auth/register", "POST", payload);
      if (data?.user) {
        dispatch({ type: "SET_USER", payload: data.user });
      }
      return data;
    } finally {
      end("register");
    }
  };

  const logout = async () => {
    start("logout");
    try {
      await callApi("auth/logout", "POST");
    } finally {
      dispatch({ type: "LOGOUT" });
      end("logout");
    }
  };

  const verifyEmail = async (token, email) => {
    start("verifyEmail");
    try {
      const data = await callApi(
        `auth/verify-email?token=${token}&email=${email}`,
        "GET"
      );
      if (data?.user) {
        dispatch({ type: "SET_USER", payload: data.user });
      }
      return data;
    } finally {
      end("verifyEmail");
    }
  };

  const resendVerificationEmail = async (email) => {
    start("resendVerification");
    try {
      return await callApi("auth/resend-verification", "POST", { email });
    } finally {
      end("resendVerification");
    }
  };

  const value = {
    user: state.user,
    status: state.status,
    error: state.error,

    isAuthenticated: state.status === "authenticated",
    isBooting: state.loading.init,

    loading: state.loading,

    login,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
