import { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "../context/AuthContext";
import type { CurrentUser, Category } from "../types";
import AuthService from "../services/auth.service";
import { fetchCategories } from "../api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const refreshUserData = useCallback(async () => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.token) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    const initAuthAndData = async () => {
      setIsLoading(true);

      try {
        const categoriesData = await fetchCategories();
        categoriesData.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load initial site data", error);
      }

      await refreshUserData();
      setIsLoading(false);
    };
    initAuthAndData();
  }, [refreshUserData]);

  const login = (userData: CurrentUser) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  
  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    refreshUserData,
    categories,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}