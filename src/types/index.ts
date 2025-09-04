// Описывает, как выглядит объект Категории
export interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

// Описывает, как выглядит объект Товара
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
}

// Это универсальный тип для постраничных ответов от API
// <T> означает, что это может быть страница чего угодно: Товаров, Категорий и т.д.
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // номер текущей страницы
  size: number;
}

// Описывает, как выглядит объект Пользователя, который мы получаем после логина
export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  role: string; // Заменили roles на role
  token: string;
}

// Типы для форм входа и регистрации
export interface LoginData {
  username?: string;
  password?: string;
}

export interface RegisterData extends LoginData {
  email?: string;
}