import axios from "axios";
import type { Page } from "./admin.service";

const API_URL = import.meta.env.VITE_API_BASE_URL;

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
  oldPrice?: number;
  size?: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

const getActivePromotions = async (page: number, size: number): Promise<Page<Promotion>> => {
  const response = await axios.get(`${API_URL}/promotions?page=${page}&size=${size}`);
  return response.data;
};

// --- НОВАЯ ФУНКЦИЯ ---
const getPromotionById = async (id: number): Promise<Promotion> => {
  const response = await axios.get(`${API_URL}/promotions/${id}`);
  return response.data;
};


const PromotionService = {
  getActivePromotions,
  getPromotionById, // --- ЭКСПОРТ НОВОЙ ФУНКЦИИ ---
};

export default PromotionService;