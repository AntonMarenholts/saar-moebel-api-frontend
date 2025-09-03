import { useTranslation } from "react-i18next";
import CategoryCard from "../../components/CategoryCard";

export default function HomePage() {
  const { t } = useTranslation();

  const categories = [
    { key: "kitchens", img: "https://via.placeholder.com/400x400/FFC72C/000000?Text=Küche" },
    { key: "sofas", img: "https://via.placeholder.com/400x400/0057B7/FFFFFF?Text=Sofa" },
    { key: "bathrooms", img: "https://via.placeholder.com/400x400/FFC72C/000000?Text=Bad" },
    { key: "wardrobes", img: "https://via.placeholder.com/400x400/0057B7/FFFFFF?Text=Schrank" },
    { key: "dining", img: "https://via.placeholder.com/400x400/FFC72C/000000?Text=Essen" },
    { key: "office", img: "https://via.placeholder.com/400x400/0057B7/FFFFFF?Text=Büro" },
    { key: "garden", img: "https://via.placeholder.com/400x400/FFC72C/000000?Text=Garten" },
    { key: "bedroom", img: "https://via.placeholder.com/400x400/0057B7/FFFFFF?Text=Schlafzimmer" },
  ];

  return (
    <div className="space-y-16">
      {/* Секция "О нас" */}
      <section className="text-center">
        <h2 className="text-4xl font-bold text-brand-dark mb-4">{t("about_us_title")}</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Это временный текст о нашей замечательной мебельной компании "Saar Möbel". Мы предлагаем качественную и стильную мебель для вашего дома и офиса.
        </p>
      </section>

      {/* Секция "Новинки" */}
      <section>
        <h2 className="text-3xl font-bold text-brand-dark mb-6">{t("new_arrivals_title")}</h2>
        <div className="p-8 border rounded-lg text-center bg-gray-100">
          <p>Здесь будут отображаться 10 последних добавленных товаров с пагинацией.</p>
        </div>
      </section>

      {/* Секция Категорий */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map(cat => (
            <CategoryCard
              key={cat.key}
              title={t(`categories.${cat.key}`)}
              imageUrl={cat.img}
              linkTo={`/category/${cat.key}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}