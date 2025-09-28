import axios from "axios";
import AuthService from "./auth.service";

const API_URL = import.meta.env.VITE_API_BASE_URL;


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

export interface Product {
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
  imageUrl: string;
}

export interface ProductCollection {
  id: number;
  slug: string;
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
  imageUrl: string;
  category: Category;
  products: Product[]; 
}

export interface NewCollectionData {
    slug: string;
    nameDe: string;
    descriptionDe: string;
    imageUrl: string;
    categoryId: number;
}


export interface NewElementData {
    nameDe: string;
    descriptionDe: string;
    price: number;
    imageUrl: string;
    collectionId: number;
}

const getAuthHeaders = () => {
  const user = AuthService.getCurrentUser();
  return user ? { Authorization: `Bearer ${user.token}` } : {};
};


const getCategories = async (): Promise<Category[]> => {
  const response = await axios.get(API_URL + "/categories");
  return response.data;
};

const getCollectionsByCategory = async (slug: string): Promise<ProductCollection[]> => {
  const response = await axios.get(`${API_URL}/collections/category/${slug}`);
  return response.data;
};

const getCollectionById = async (id: number): Promise<ProductCollection> => {
    const response = await axios.get(`${API_URL}/collections/${id}`);
    return response.data;
};

const getCollectionBySlug = async (slug: string): Promise<ProductCollection> => {
    const response = await axios.get(`${API_URL}/collections/slug/${slug}`);
    return response.data;
};

const getProductById = async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
}



const getAllCollections = async (): Promise<ProductCollection[]> => {
    const response = await axios.get(`${API_URL}/admin/collections`, { headers: getAuthHeaders() });
    return response.data;
};

const createCollection = async (data: NewCollectionData): Promise<ProductCollection> => {
    const response = await axios.post(`${API_URL}/admin/collections`, data, { headers: getAuthHeaders() });
    return response.data;
};

const addElementToCollection = async (data: NewElementData): Promise<Product> => {
    const response = await axios.post(`${API_URL}/admin/collections/elements`, data, { headers: getAuthHeaders() });
    return response.data;
};

const deleteCollection = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/admin/collections/${id}`, { headers: getAuthHeaders() });
};

const uploadImage = async (file: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(API_URL + "/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

const ProductService = {
  
  getCategories,
  getCollectionsByCategory,
  getCollectionById,
  getProductById,
  getCollectionBySlug,
  getAllCollections,
  createCollection,
  addElementToCollection,
  deleteCollection,
  uploadImage,
};

export default ProductService;