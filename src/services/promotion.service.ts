import axios from "axios";
import type { Page } from "./admin.service"; // Используем существующий тип Page

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Интерфейс для акционного товара
export interface Promotion {
  id: number;
  nameDe: string;
  nameEn?: string;
  nameFr?: string;
  nameRu?: string;
  nameUk?: string;
  descriptionDe: string;
  descriptionEn?: string;
  descriptionFr?: string;
  descriptionRu?: string;
  descriptionUk?: string;
  price: number;
  size?: string;
  imageUrl: string;
  startDate: string; // Даты приходят как строки
  endDate: string;
  createdAt: string;
}

const getActivePromotions = async (page: number, size: number): Promise<Page<Promotion>> => {
  const response = await axios.get(`${API_URL}/promotions?page=${page}&size=${size}`);
  return response.data;
};

const PromotionService = {
  getActivePromotions,
};

export default PromotionService;