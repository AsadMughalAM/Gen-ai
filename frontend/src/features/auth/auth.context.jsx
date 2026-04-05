import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AuthContext } from "./auth-context.js";
import { getMe, login, register, logout, setAuthToken } from "./services/auth.services";
import { hasAuthToken } from "../../services/apiClient.js";

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const didBootstrapRef = useRef(false);

  const syncAuthenticatedUser = useCallback(async () => {
    const response = await getMe();
    const user = response?.user ?? null;
    setData(user);
    return user;
  }, []);

  const handleLogin = useCallback(
    async ({ email, password }) => {
      try {
        setLoading(true);
        await login({ email, password });
        return await syncAuthenticatedUser();
      } finally {
        setLoading(false);
      }
    },
    [syncAuthenticatedUser],
  );

  const handleRegister = useCallback(
    async ({ username, email, password }) => {
      try {
        setLoading(true);
        await register({ username, email, password });
        return await syncAuthenticatedUser();
      } finally {
        setLoading(false);
      }
    },
    [syncAuthenticatedUser],
  );

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      await logout();
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (didBootstrapRef.current) {
      return;
    }

    didBootstrapRef.current = true;

    const getAndSetUser = async () => {
      if (!hasAuthToken()) {
        setData(null);
        setLoading(false);
        return;
      }

      try {
        await syncAuthenticatedUser();
      } catch {
        setAuthToken(null);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    getAndSetUser();
  }, [syncAuthenticatedUser]);

  const contextValue = useMemo(
    () => ({
      user: data,
      loading,
      handleLogin,
      handleRegister,
      handleLogout,
    }),
    [data, loading, handleLogin, handleRegister, handleLogout],
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
