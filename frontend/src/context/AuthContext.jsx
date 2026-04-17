import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const verify = useCallback(async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setLoading(false); return; }
    try {
      await authApi.verify();
      setIsAdmin(true);
    } catch {
      localStorage.removeItem("admin_token");
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { verify(); }, [verify]);

  const login = async (password) => {
    const res = await authApi.login(password);
    localStorage.setItem("admin_token", res.data.token);
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
