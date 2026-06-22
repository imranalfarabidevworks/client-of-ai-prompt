"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const axiosAuth = axios.create({ baseURL: API, withCredentials: true });
axiosAuth.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ph_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage থেকে instant load
    const saved = localStorage.getItem("ph_user");
    const token = localStorage.getItem("ph_token");
    if (saved && token) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    // Server থেকে fresh data নাও (role update পেতে)
    if (token) {
      axiosAuth.get("/api/auth/me")
        .then((res) => {
          const freshUser = res.data.user;
          setUser(freshUser);
          localStorage.setItem("ph_user", JSON.stringify(freshUser));
        })
        .catch(() => {
          localStorage.removeItem("ph_token");
          localStorage.removeItem("ph_user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axiosAuth.post("/api/auth/login", { email, password });
    localStorage.setItem("ph_token", res.data.token);
    localStorage.setItem("ph_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (name, email, photoURL, password) => {
    const res = await axiosAuth.post("/api/auth/register", { name, email, photoURL, password });
    localStorage.setItem("ph_token", res.data.token);
    localStorage.setItem("ph_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const googleLogin = async (googleUser) => {
    const res = await axiosAuth.post("/api/auth/google", {
      name: googleUser.displayName || googleUser.name,
      email: googleUser.email,
      photoURL: googleUser.photoURL || googleUser.image || "",
    });
    localStorage.setItem("ph_token", res.data.token);
    localStorage.setItem("ph_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    try { await axiosAuth.post("/api/auth/logout"); } catch {}
    localStorage.removeItem("ph_token");
    localStorage.removeItem("ph_user");
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem("ph_user", JSON.stringify(updated));
  };

  const getToken = () => localStorage.getItem("ph_token");

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateUser, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
