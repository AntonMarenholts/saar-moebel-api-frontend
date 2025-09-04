import { useState, useEffect, useCallback, type ReactNode } from "react";
import { AuthContext, type AuthContextType } from "../context/AuthContext";
import type { CurrentUser, Category } from "../types";
import AuthService from "../services/auth.service";
import { fetchCategories } from "../api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // Этот useEffect выполняется только один раз при первом запуске приложения
  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        // Загружаем данные, которые не зависят от пользователя (категории)
        const categoriesData = await fetchCategories();
        categoriesData.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(categoriesData);

        // Проверяем, есть ли пользователь в localStorage
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Failed to initialize app data", error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []); // Пустой массив зависимостей гарантирует, что этот код выполнится только один раз

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };
  
  // Оборачиваем login в useCallback, чтобы функция не пересоздавалась при каждой перерисовке
  const login = useCallback((userData: CurrentUser) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  // Эта функция тоже обернута в useCallback для стабильности
  const refreshUserData = useCallback(async () => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.token) {
      setUser(currentUser);
    }
  }, []);

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