import { useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next'; // <-- Импортируем для локализации
import type { Product } from '../services/product.service';
import ProductService from '../services/product.service';

// Компонент карточки товара остаётся почти таким же, но теперь использует тип Product
const ProductCard = ({ product }: { product: Product }) => {
  const { t } = useTranslation(); // <-- Для кнопки "В корзину"

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-transform duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            {/* Иконка-заглушка */}
            <svg
              className="w-12 h-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm16.5-1.5-3-3"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="mt-2 text-xl font-bold text-brand-blue">
          {product.price} €
        </p>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
        <button className="px-6 py-2 text-white bg-brand-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {t('add_to_cart')} {/* Используем перевод */}
        </button>
      </div>
    </div>
  );
};

export default function CatalogPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ProductService.getProducts()
      .then(setProducts)
      .catch(() => setError(t('product_load_error')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('catalog_title')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}