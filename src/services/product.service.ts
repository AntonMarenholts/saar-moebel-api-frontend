import axios from "axios";
import AuthService from "./auth.service";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Тип для категории
export interface Category {
  id: number;
  nameDe: string;
  slug: string;
  imageUrl?: string;
  nameEn?: string;
  nameFr?: string;
  nameRu?: string;
  nameUk?: string;
}

// Тип для товара
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
}

// Тип для данных нового товара
export interface NewProductData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
}

// Получение списка всех товаров
const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL + "/products");
  return response.data;
};

const getProductsByCategory = async (slug: string): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/products/category/${slug}`);
  return response.data;
};

// Получение списка всех категорий
const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(API_URL + "/categories");
  return response.data;
};

const createCategory = async (
  nameDe: string, // <-- Изменено для ясности
  slug: string
): Promise<Category> => {
  const user = AuthService.getCurrentUser();
  const token = user ? user.token : "";

  // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
  // Отправляем объект с полем nameDe вместо name
  const response = await axios.post(
    API_URL + "/admin/categories",
    { nameDe, slug }, 
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
const deleteCategory = async (id: number) => {
  const user = AuthService.getCurrentUser();
  const token = user ? user.token : "";

  await axios.delete(`${API_URL}/admin/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const updateCategoryImage = async (
  id: number,
  imageUrl: string
): Promise<Category> => {
  const user = AuthService.getCurrentUser();
  const token = user ? user.token : "";

  const response = await axios.put(
    `${API_URL}/admin/categories/${id}/image`,
    { imageUrl },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const uploadImage = async (file: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const user = AuthService.getCurrentUser();
  const token = user ? user.token : "";

  const response = await axios.post(API_URL + "/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const createProduct = async (productData: NewProductData) => {
  const user = AuthService.getCurrentUser();
  const token = user ? user.token : "";

  const response = await axios.post(API_URL + "/products", productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

const getLatestProducts = async (
  page: number,
  size: number
): Promise<PaginatedResponse<Product>> => {
  const response = await axios.get(
    `${API_URL}/products/latest?page=${page}&size=${size}`
  );
  return response.data;
};

const ProductService = {
  getProducts,
  getProductsByCategory,
  getCategories,
  getLatestProducts,
  createProduct,
  createCategory,
  deleteCategory,
  updateCategoryImage,
  uploadImage,
};

export default ProductService;