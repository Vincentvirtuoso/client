import { useState } from "react";
import { useApi } from "./useApi";

export const useAuth = () => {
  const { loading, error, callApi } = useApi();
  const [user, setUser] = useState(null); // separate state for user data

  const login = async ({ email, password }) => {
    const data = await callApi("auth/login", "POST", { email, password });
    if (data?.user) setUser(data.user);
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
    if (data?.user) setUser(data.user);
    return data;
  };

  const logout = async () => {
    const data = await callApi("auth/logout", "POST");
    setUser(null); // clear user data on logout
    return data;
  };

  const refreshToken = async () => {
    const data = await callApi("auth/refresh-token", "POST");
    if (data?.user) setUser(data.user);
    return data;
  };

  const verifyEmail = async (token, email) => {
    const data = await callApi(
      `auth/verify-email?token=${token}&email=${email}`,
      "GET"
    );
    return data;
  };

  const resendVerificationEmail = async (email) => {
    const data = await callApi("auth/resend-verification", "POST", { email });
    return data;
  };

  return {
    loading,
    error,
    user,
    login,
    register,
    logout,
    refreshToken,
    verifyEmail,
    resendVerificationEmail,
    setUser,
  };
};
