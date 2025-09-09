import axios from "axios";
import AuthService from "./auth.service";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Этот тип описывает структуру объекта новости
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

// Этот тип описывает данные для создания/обновления новости
export interface NewsArticleData {
  titleDe: string;
  contentDe: string;
  imageUrl: string;
}

const getAuthHeaders = () => {
    const user = AuthService.getCurrentUser();
    return user ? { Authorization: `Bearer ${user.token}` } : {};
};

const getNews = async (): Promise<NewsArticle[]> => {
    const response = await axios.get(`${API_URL}/admin/news`, { headers: getAuthHeaders() });
    return response.data;
};

const createNews = async (data: NewsArticleData): Promise<NewsArticle> => {
    const response = await axios.post(`${API_URL}/admin/news`, data, { headers: getAuthHeaders() });
    return response.data;
};

const updateNews = async (id: number, data: NewsArticleData): Promise<NewsArticle> => {
    const response = await axios.put(`${API_URL}/admin/news/${id}`, data, { headers: getAuthHeaders() });
    return response.data;
};

const deleteNews = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/admin/news/${id}`, { headers: getAuthHeaders() });
};

const AdminService = {
    getNews,
    createNews,
    updateNews,
    deleteNews
};

export default AdminService;