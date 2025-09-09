import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import type { Category } from "../services/product.service";
import ProductService from "../services/product.service";
import NewsService from "../services/news.service";
import type { NewsArticle } from "../services/news.service";

const LatestNews = () => {
  const { t } = useTranslation();
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    NewsService.getLatestNews()
      .then((data) => {
        setLatestNews(data);
      })
      .catch(() => setError("Failed to fetch latest news"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>{t("loading")}</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <section className="mb-12 text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-8">
        {t("latest_news")}
      </h2>
      <div className="space-y-8">
        {latestNews.map((article) => (
          <div
            key={article.id}
            className="group flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden w-full transition-shadow duration-300 hover:shadow-xl"
          >
            
            <div className="md:w-1/3 lg:w-1/4 flex-shrink-0 relative overflow-hidden h-64 md:h-auto">
              <img
                src={article.imageUrl}
                alt={article.titleDe}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.titleDe}</h3>
              <p className="text-gray-700 mb-4 flex-grow line-clamp-4">{article.contentDe}</p> 
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


const CategoryGrid = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    ProductService.getCategories()
      .then(setCategories)
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      const nameA = t(a.slug, { defaultValue: a.name });
      const nameB = t(b.slug, { defaultValue: b.name });
      return nameA.localeCompare(nameB, i18n.language);
    });
  }, [categories, t, i18n.language]);

  if (categories.length === 0) {
    return <div>{t("loading")}</div>;
  }

  return (
    <section className="text-gray-800">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {sortedCategories.map((cat) => (
          <Link
            to={`/category/${cat.slug}`}
            key={cat.id}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden aspect-square hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            {cat.imageUrl ? (
              <img
                src={cat.imageUrl}
                alt={cat.name}
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

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center text-center text-white p-2">
              <span className="font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {t(cat.slug, { defaultValue: cat.name })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};


export default function HomePage() {
  return (
    <div className="space-y-12">
      <LatestNews />
      <CategoryGrid />
    </div>
  );
}