import axios from "axios";
import { jwtDecode } from "jwt-decode";

// URL вашего API из переменных окружения
const API_URL = import.meta.env.VITE_API_BASE_URL + "/auth/";

// Интерфейс для данных пользователя, которые мы будем хранить
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  token: string;
}

/**
 * Отправляет запрос на регистрацию нового пользователя.
 */
const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

/**
 * Отправляет запрос на вход в систему.
 */
const login = async (username: string, password: string): Promise<AuthUser> => {
  const response = await axios.post(API_URL + "signin", {
    username,
    password,
  });

  if (response.data.token) {
    // Сохраняем токен и информацию о пользователе в localStorage
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};


const logout = () => {
  localStorage.removeItem("user");
};


const getCurrentUser = (): AuthUser | null => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr) as AuthUser;
    const decodedJwt: { exp: number } = jwtDecode(user.token);
    if (decodedJwt.exp * 1000 < Date.now()) {
      
      logout();
      return null;
    }
    
    return user;
  }
  return null;
};

const forgotPassword = (email: string) => {
  return axios.post(API_URL + "forgot-password", { email });
};

/**
 * Отправляет новый пароль и токен для его смены.
 */
const resetPassword = (token: string, password: string) => {
  return axios.post(API_URL + `reset-password?token=${token}`, { password });
};

const AuthService = {
  register, // <-- Добавили новую функцию
  login,
  logout,
  getCurrentUser,
  forgotPassword, // <-- Добавили
  resetPassword,
};

export default AuthService;