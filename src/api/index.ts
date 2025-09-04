import axios from "axios";
import type { Category, Product, Page } from "../types";

// Создаем "клиент" для отправки запросов на наш API
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Эта функция будет автоматически добавлять токен авторизации в каждый запрос,
// если пользователь вошел в систему.
apiClient.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        config.headers["Authorization"] = "Bearer " + user.token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Новые функции для нашего магазина ---

// Функция для получения списка всех категорий
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/categories");
  return response.data;
};

// Функция для получения списка товаров (с пагинацией)
export const fetchProducts = async (page: number, size = 10): Promise<Page<Product>> => {
  const response = await apiClient.get(`/products?page=${page}&size=${size}`);
  return response.data;
};

