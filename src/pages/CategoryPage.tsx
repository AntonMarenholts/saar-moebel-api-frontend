import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductService, { type Product } from "../services/product.service";
import { useTranslation } from "react-i18next";

// Этот компонент вынесен для чистоты и ИСПОЛЬЗУЕТ `t` для кнопки
const ProductCard = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-transform duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
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
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product.name}
          </h3>
          <p className="mt-2 text-xl font-bold text-brand-blue">
            {product.price} €
          </p>
        </div>
      </Link>
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
        <button className="px-6 py-2 text-white bg-brand-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {t("add_to_cart")}
        </button>
      </div>
    </div>
  );
};

// Основной компонент страницы. Здесь 't' тоже НУЖЕН для заголовка и сообщений.
const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(); // Эта переменная 't' теперь будет использоваться

  useEffect(() => {
    if (slug) {
      setLoading(true);
      ProductService.getProductsByCategory(slug)
        .then((data) => setProducts(data))
        .catch((error) => {
          console.error("Ошибка при загрузке товаров:", error);
          setProducts([]);
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return <div className="text-center p-8">{t("loading")}</div>; // Используется здесь
  }

  return (
    <div>
      <h1 className="text-3xl font-bold capitalize mb-8">
        {/* Используется здесь */}
        {t(slug || "", { defaultValue: slug?.replace(/_/g, " ") })}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          // Используется здесь
          <p>{t("no_products_in_category")}</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
