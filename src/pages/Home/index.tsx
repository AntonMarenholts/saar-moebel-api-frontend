import { useTranslation } from "react-i18next";
import CategoryCard from "../../components/CategoryCard";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import { useEffect, useState } from "react";
import { fetchCategories, fetchProducts } from "../../api";
import type { Category, Product } from "../../types";

export default function HomePage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Используем Promise.all для параллельной загрузки данных
    Promise.all([
        fetchCategories(),
        fetchProducts(currentPage)
    ]).then(([categoriesData, productsPage]) => {
        setCategories(categoriesData);
        setProducts(productsPage.content);
        setTotalPages(productsPage.totalPages);
    }).catch(error => {
        console.error("Failed to load page data", error);
    }).finally(() => {
        setIsLoading(false);
    });
  }, [currentPage]);

  return (
    <div className="space-y-16">
      
      <section className="text-center py-10 bg-white rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-8 px-4">
         <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop" alt="Modern sofa in a living room" className="w-full md:w-1/2 rounded-lg object-cover h-64 md:h-80"/>
         <div className="md:w-1/2">
             <h2 className="text-4xl font-bold text-brand-dark mb-4">{t("about_us_title")}</h2>
             <p className="max-w-2xl mx-auto text-gray-600">
                {t("about_us_text")}
             </p>
        </div>
      </section>

      
      <section>
        <h2 className="text-3xl font-bold text-brand-dark mb-6 text-center">{t("new_arrivals_title")}</h2>
        {isLoading ? (
            <p className="text-center">Loading...</p>
        ) : (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                )}
            </>
        )}
      </section>

      
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {isLoading ? <p className="text-center col-span-full">Loading...</p> : categories.map(cat => (
            <CategoryCard
              key={cat.id}
              title={t(`categories.${cat.name.toLowerCase()}`)}
              imageUrl={cat.imageUrl}
              linkTo={`/category/${cat.name}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

