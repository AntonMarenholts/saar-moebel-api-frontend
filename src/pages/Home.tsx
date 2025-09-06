import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useState } from "react"; // Для пагинации новинок
// import Pagination from "../components/Pagination"; // Если будете использовать компонент пагинации

// --- ЗАГЛУШКА ДЛЯ ПАГИНАЦИИ (можно заменить на реальный компонент) ---
const DummyPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex justify-center mt-8 space-x-2">
      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === index
              ? "bg-brand-primary text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};
// --- КОНЕЦ ЗАГЛУШКИ ПАГИНАЦИИ ---

// Компонент для секции "Новинки"
const NewArrivals = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2; // Пример: 2 страницы новинок по 3 элемента
  const itemsPerPage = 3;

  const allNewItems = Array(6)
    .fill(0)
    .map((_, i) => ({
      // Теперь каждый элемент имеет свой id
      id: i + 1,
      name: `Название Новинки ${i + 1}`,
      description: `Краткое описание нового товара ${
        i + 1
      }. Этот текст является заглушкой и будет заменен реальными данными.`,
      imageUrl: `https://via.placeholder.com/400x200?text=Новинка+${i + 1}`, // Пример заглушки
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
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" // Увеличение фото
              />
            </div>
            <div className="md:w-2/3 p-6">
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Пагинация для Новинок */}
      <DummyPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {/* Если у вас есть компонент Pagination, используйте его:
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            */}
    </section>
  );
};

// Компонент для сетки категорий (с изменениями для фото)
const CategoryGrid = () => {
  const { t } = useTranslation();
  const categories = [
    {
      key: "kitchens",
      name: t("kitchens"),
      imageUrl: "https://via.placeholder.com/300?text=Кухни",
    },
    {
      key: "bedroom_furniture",
      name: t("bedroom_furniture"),
      imageUrl: "https://via.placeholder.com/300?text=Спальни",
    },
    {
      key: "living_rooms",
      name: t("living_rooms"),
      imageUrl: "https://via.placeholder.com/300?text=Гостиные",
    },
    {
      key: "children_furniture",
      name: t("children_furniture"),
      imageUrl: "https://via.placeholder.com/300?text=Детская",
    },
    {
      key: "hallways",
      name: t("hallways"),
      imageUrl: "https://via.placeholder.com/300?text=Прихожие",
    },
    {
      key: "office_furniture",
      name: t("office_furniture"),
      imageUrl: "https://via.placeholder.com/300?text=Офис",
    },
    {
      key: "garden_furniture",
      name: t("garden_furniture"),
      imageUrl: "https://via.placeholder.com/300?text=Сад",
    },
    {
      key: "bathroom_furniture",
      name: t("bathroom_furniture"),
      imageUrl: "https://via.placeholder.com/300?text=Ванная",
    },
    {
      key: "wardrobes",
      name: t("wardrobes"),
      imageUrl: "https://via.placeholder.com/300?text=Шкафы",
    },
    {
      key: "chairs",
      name: t("chairs"),
      imageUrl: "https://via.placeholder.com/300?text=Стулья",
    },
    {
      key: "dining_furniture",
      name: t("dining_furniture"),
      imageUrl: "https://via.placeholder.com/300?text=Обеденная",
    },
    {
      key: "cabinets",
      name: t("cabinets"),
      imageUrl: "https://via.placeholder.com/300?text=Кабинеты",
    },
  ];

  return (
    <section className="text-gray-800">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            to={`/category/${cat.key}`}
            key={cat.key}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden aspect-square hover:shadow-xl transition-transform duration-300 hover:scale-105"
          >
            <img
              src={cat.imageUrl} // Использование заглушки
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" // Увеличение фото
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-center text-white p-2">
              <span className="font-bold text-lg group-hover:text-brand-primary transition-colors">
                {cat.name}
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
