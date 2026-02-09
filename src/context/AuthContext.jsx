import { createContext, useReducer, useEffect, useRef } from "react";
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
    case "BOOT_SUCCESS":
      return {
        ...state,
        user: action.payload,
        status: action.payload ? "authenticated" : "unauthenticated",
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
        loading: { ...state.loading, [action.key]: true },
        error: null,
      };

    case "ACTION_END":
      return {
        ...state,
        loading: { ...state.loading, [action.key]: false },
      };

    case "ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const { callApi } = useApi();
  const [state, dispatch] = useReducer(authReducer, initialState);

  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    (async () => {
      try {
        const res = await callApi({
          endpoint: "auth/me",
          method: "GET",
        });

        dispatch({
          type: "BOOT_SUCCESS",
          payload: res?.user ?? null,
        });
      } catch {
        dispatch({
          type: "BOOT_SUCCESS",
          payload: null,
        });
      }
    })();
  }, []);

  useEffect(() => {
    setUnauthorizedLogoutHandler(() => {
      dispatch({ type: "LOGOUT" });
    });

    setRefreshHandler(async () => {
      dispatch({ type: "ACTION_START", key: "refresh" });

      try {
        const res = await callApi({
          endpoint: "auth/refresh-token",
          method: "POST",
        });

        if (res?.data?.user) {
          dispatch({ type: "SET_USER", payload: res.data.user });
        }

        return res;
      } finally {
        dispatch({ type: "ACTION_END", key: "refresh" });
      }
    });
  }, []);

  const runAction = async (key, fn) => {
    dispatch({ type: "ACTION_START", key });
    try {
      return await fn();
    } finally {
      dispatch({ type: "ACTION_END", key });
    }
  };

  const login = (payload) =>
    runAction("login", async () => {
      const res = await callApi({
        endpoint: "auth/login",
        method: "POST",
        body: payload,
      });

      if (res?.data?.user) {
        dispatch({ type: "SET_USER", payload: res.data.user });
      }

      return res;
    });

  const register = (payload) =>
    runAction("register", async () => {
      const res = await callApi({
        endpoint: "auth/register",
        method: "POST",
        body: payload,
      });

      if (res?.user) {
        dispatch({ type: "SET_USER", payload: res.user });
      }

      return res;
    });

  const logout = () =>
    runAction("logout", async () => {
      await callApi({ endpoint: "auth/logout", method: "POST" });
      dispatch({ type: "LOGOUT" });
    });

  const verifyEmail = (token, email) =>
    runAction("verifyEmail", async () => {
      const res = await callApi({
        endpoint: `auth/verify-email?token=${token}&email=${email}`,
        method: "GET",
      });

      if (res?.user) {
        dispatch({ type: "SET_USER", payload: res.user });
      }

      return res;
    });

  const resendVerificationEmail = (email) =>
    runAction("resendVerification", () =>
      callApi({
        endpoint: "auth/resend-verification",
        method: "POST",
        body: { email },
      }),
    );

  const value = {
    user: state.user,
    status: state.status,
    error: state.error,

    isAuthenticated: state.status === "authenticated",
    isBooting: state.status === "booting",

    loading: state.loading,

    login,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
