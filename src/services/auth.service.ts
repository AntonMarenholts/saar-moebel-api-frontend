import type { AxiosResponse } from "axios";
import type { LoginData, RegisterData, CurrentUser } from "../types";
import { apiClient } from "../api";

const register = (data: RegisterData) => {
  return apiClient.post("/auth/signup", data);
};

// --- ИЗМЕНЯЕМ ФУНКЦИЮ LOGIN ---
const login = (data: LoginData): Promise<CurrentUser> => {
  return apiClient
    .post("/auth/signin", data)
    .then((response: AxiosResponse<CurrentUser>) => {
      // Ответ от бэкенда теперь содержит поле 'role', а не 'roles'
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};
// ---------------------------------

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = (): CurrentUser | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr) as CurrentUser;
    } catch (e) {
      console.error("Could not parse user from localStorage", e);
      return null;
    }
  }
  return null;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
