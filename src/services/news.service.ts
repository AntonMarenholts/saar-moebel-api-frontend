import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

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

export interface Page<T> {
  content: T[];
  totalPages: number;
  number: number;
}

const getLatestNews = async (page: number, size: number): Promise<Page<NewsArticle>> => {
  const response = await axios.get(`${API_URL}/news/latest?page=${page}&size=${size}`);
  return response.data;
};

const NewsService = {
  getLatestNews,
};

export default NewsService;