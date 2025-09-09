import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Определяем структуру объекта новости
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
  createdAt: string; // Даты обычно приходят как строки из API
}


const getLatestNews = async (): Promise<NewsArticle[]> => {
  const response = await axios.get(API_URL + "/news/latest");
  return response.data;
};

const NewsService = {
  getLatestNews,
};

export default NewsService;