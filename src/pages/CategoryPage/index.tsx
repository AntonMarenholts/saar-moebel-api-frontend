import { useParams, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CategoryPage() {
  const { categoryKey } = useParams<{ categoryKey: string }>();
  const { t } = useTranslation();

  // Получаем название категории из переводов, используя ключ из URL
  const categoryTitle = t(`categories.${categoryKey}`);

  return (
    <div>
      <NavLink to="/" className="text-brand-blue hover:underline mb-8 block">
        &larr; На главную
      </NavLink>
      <h1 className="text-4xl font-bold mb-4">
        Категория: {categoryTitle}
      </h1>
      <p className="text-gray-600">
        Товары для этой категории скоро появятся здесь.
      </p>
    </div>
  );
}