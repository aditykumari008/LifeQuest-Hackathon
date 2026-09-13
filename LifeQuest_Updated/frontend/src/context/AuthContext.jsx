import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("lifequest_user") || "null"));
  const [loading, setLoading] = useState(false);

  const saveSession = (data) => {
    localStorage.setItem("lifequest_token", data.access_token);
    localStorage.setItem("lifequest_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      saveSession(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      saveSession(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("lifequest_token");
    localStorage.removeItem("lifequest_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
