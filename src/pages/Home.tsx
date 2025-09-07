import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react"; // <-- Добавлен useMemo
import type { Category } from "../services/product.service";
import ProductService from "../services/product.service";

// Компонент-заглушка для пагинации (без изменений)
const DummyPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex justify-center mt-8 space-x-2">
    {Array.from({ length: totalPages }).map((_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index)}
        className={`px-4 py-2 rounded-lg ${
          currentPage === index
            ? "bg-brand-blue text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>
);

// Компонент для секции "Новинки" (без изменений)
const NewArrivals = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;
  const itemsPerPage = 3;

  const allNewItems = Array(6)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      name: t(`new_arrival_name_${i + 1}`, {
        defaultValue: `Название Новинки ${i + 1}`,
      }),
      description: t(`new_arrival_desc_${i + 1}`, {
        defaultValue: `Краткое описание нового товара ${i + 1}.`,
      }),
      imageUrl: `https://via.placeholder.com/400x200?text=New+Arrival+${i + 1}`,
    }));

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allNewItems.slice(startIndex, endIndex);

  return (
    <section className="mb-12 text-gray-800">
      <h2 className="text-3xl font-bold text-center mb-8">
        {t("new_arrivals")}
      </h2>
      <div className="grid grid-cols-1 gap-8">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="md:w-1/3 flex-shrink-0 relative overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      <DummyPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

const CategoryGrid = () => {
  const { t, i18n } = useTranslation(); // <-- Добавляем i18n для отслеживания языка
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    ProductService.getCategories()
      .then(setCategories)
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

  // ++ НАЧАЛО ИЗМЕНЕНИЙ ++
  // Создаем мемоизированный (кэшированный) отсортированный список категорий.
  // Он будет пересчитываться только когда меняются сами категории или язык.
  const sortedCategories = useMemo(() => {
    // Создаем копию массива, чтобы не изменять исходное состояние
    return [...categories].sort((a, b) => {
      // Получаем переведенные названия для сравнения
      const nameA = t(a.slug, { defaultValue: a.name });
      const nameB = t(b.slug, { defaultValue: b.name });
      
      // localeCompare обеспечивает правильную сортировку для разных алфавитов
      return nameA.localeCompare(nameB, i18n.language);
    });
  }, [categories, t, i18n.language]);
  // -- КОНЕЦ ИЗМЕНЕНИЙ --

  if (categories.length === 0) {
    return <div>{t("loading")}</div>;
  }

  return (
    <section className="text-gray-800">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Используем отсортированный массив sortedCategories для рендеринга */}
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
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center text-white p-2">
              <span className="font-bold text-lg group-hover:text-brand-blue transition-colors">
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
      <NewArrivals />
      <CategoryGrid />
    </div>
  );
}