import axios from "axios";
import AuthService from "./auth.service";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Тип для категории
export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
}

// ++ НОВЫЙ ТИП ДЛЯ ТОВАРА ++
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

/**
 * ++ НОВАЯ ФУНКЦИЯ: Получение списка всех товаров ++
 */
const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(API_URL + "/products");
  return response.data;
};


/**
 * Получение списка всех категорий
 */
const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(API_URL + "/categories");
  return response.data;
};

const createCategory = async (name: string, slug: string) => {
  const user = AuthService.getCurrentUser();
  const token = user ? user.token : "";

  const response = await axios.post(
    API_URL + "/admin/categories",
    { name, slug },
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

const updateCategoryImage = async (id: number, imageUrl: string) => {
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

/**
 * Загрузка файла изображения на сервер
 */
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
  // Получаем токен текущего пользователя для авторизации
  const user = AuthService.getCurrentUser();
  const token = user ? user.token : "";

  const response = await axios.post(API_URL + "/products", productData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const ProductService = {
  getProducts, // <-- Добавили
  getCategories,
  createProduct,
  createCategory,
  deleteCategory,
  updateCategoryImage,
  uploadImage,
};

export default ProductService;