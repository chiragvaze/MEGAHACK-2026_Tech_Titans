import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchCurrentUser,
  getStoredToken,
  loginUser,
  registerUser,
  setStoredToken
} from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function restoreSession() {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const { user: currentUser } = await fetchCurrentUser();
        setUser(currentUser || null);
      } catch (_error) {
        setStoredToken("");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async ({ email, password }) => {
    setAuthError("");
    try {
      const { token, user: loggedInUser } = await loginUser({ email, password });
      setStoredToken(token);
      setUser(loggedInUser);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to login. Please check your credentials.";
      setAuthError(message);
      return { success: false, message };
    }
  };

  const register = async ({ name, email, password, role }) => {
    setAuthError("");
    try {
      const { token, user: registeredUser } = await registerUser({ name, email, password, role });
      setStoredToken(token);
      setUser(registeredUser);
      return { success: true };
    } catch (error) {
      const message = error?.response?.data?.message || "Unable to create account right now.";
      setAuthError(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setStoredToken("");
    setUser(null);
    setAuthError("");
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      authError,
      login,
      register,
      logout
    }),
    [user, isLoading, authError]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
