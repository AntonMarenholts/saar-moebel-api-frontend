// src/services/admin.service.ts

import axios from "axios";
import AuthService from "./auth.service";
import type { Promotion } from "./promotion.service";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// ... интерфейс NewsArticle ...
export interface NewsArticle {
  id: number;
  titleDe: string;
  contentDe: string;
  titleEn?: string;
  contentEn?: string;
  titleFr?: string;
  contentFr?: string;
  titleRu?: string;
  contentRu?: string;
  titleUk?: string;
  contentUk?: string;
  imageUrl: string;
  createdAt: string;
}
export interface PromotionData {
  nameDe: string;
  descriptionDe: string;
  price: number;
  size?: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
}
// Интерфейс для создания/обновления (отправляем все поля)
export interface NewsArticleData {
  titleDe: string;
  contentDe: string;
  imageUrl: string;
  titleEn: string;
  contentEn: string;
  titleFr: string;
  contentFr: string;
  titleRu: string;
  contentRu: string;
  titleUk: string;
  contentUk: string;
}

// --- НОВЫЙ ИНТЕРФЕЙС ДЛЯ ОТВЕТА ОТ ПЕРЕВОДЧИКА ---
export interface NewsTranslationResponse {
  titleEn: string;
  contentEn: string;
  titleFr: string;
  contentFr: string;
  titleRu: string;
  contentRu: string;
  titleUk: string;
  contentUk: string;
}
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // номер текущей страницы
  size: number;
}

const getAuthHeaders = () => {
  const user = AuthService.getCurrentUser();
  return user ? { Authorization: `Bearer ${user.token}` } : {};
};

const getNews = async (
  page: number,
  size: number
): Promise<Page<NewsArticle>> => {
  const response = await axios.get(
    `${API_URL}/admin/news/all?page=${page}&size=${size}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

const createNews = async (data: NewsArticleData): Promise<NewsArticle> => {
  const response = await axios.post(`${API_URL}/admin/news`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const updateNews = async (
  id: number,
  data: NewsArticleData
): Promise<NewsArticle> => {
  const response = await axios.put(`${API_URL}/admin/news/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const deleteNews = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/admin/news/${id}`, {
    headers: getAuthHeaders(),
  });
};

// --- НОВАЯ ФУНКЦИЯ ПЕРЕВОДА ---
const translateNewsContent = async (
  titleDe: string,
  contentDe: string
): Promise<NewsTranslationResponse> => {
  const response = await axios.post(
    `${API_URL}/admin/news/translate`,
    { titleDe, contentDe },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

const getPromotions = async (
  page: number,
  size: number
): Promise<Page<Promotion>> => {
  const response = await axios.get(
    `${API_URL}/admin/promotions?page=${page}&size=${size}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

const createPromotion = async (data: PromotionData): Promise<Promotion> => {
  const response = await axios.post(`${API_URL}/admin/promotions`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const updatePromotion = async (
  id: number,
  data: PromotionData
): Promise<Promotion> => {
  const response = await axios.put(`${API_URL}/admin/promotions/${id}`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

const deletePromotion = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/admin/promotions/${id}`, {
    headers: getAuthHeaders(),
  });
};

const AdminService = {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  translateNewsContent,
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
};

export default AdminService;
