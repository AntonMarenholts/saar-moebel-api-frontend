import type { AxiosResponse } from "axios";
import type { LoginData, RegisterData, CurrentUser } from "../types";
import { apiClient } from "../api";

const register = (data: RegisterData) => {
  return apiClient.post("/auth/signup", data);
};

const login = (data: LoginData): Promise<CurrentUser> => {
  return apiClient
    .post("/auth/signin", data)
    .then((response: AxiosResponse<CurrentUser>) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

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

// --- Добавляем новые функции для сброса пароля ---
const requestPasswordReset = (email: string) => {
  return apiClient.post("/auth/forgot-password", { email });
};

const resetPassword = (token: string, newPassword: string) => {
  return apiClient.post("/auth/reset-password", { token, newPassword });
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
};

export default AuthService;