import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import PromotionService, {
  type Promotion,
} from "../services/promotion.service";

const PromotionCard = ({ promotion }: { promotion: Promotion }) => {
  const { i18n } = useTranslation();

  const getTranslated = (item: Promotion, field: "name" | "description") => {
    const lang = i18n.language;

    if (field === "name") {
      switch (lang) {
        case "en":
          return item.nameEn || item.nameDe;
        case "fr":
          return item.nameFr || item.nameDe;
        case "ru":
          return item.nameRu || item.nameDe;
        case "uk":
          return item.nameUk || item.nameDe;
        default:
          return item.nameDe;
      }
    } else {
      // field === 'description'
      switch (lang) {
        case "en":
          return item.descriptionEn || item.descriptionDe;
        case "fr":
          return item.descriptionFr || item.descriptionDe;
        case "ru":
          return item.descriptionRu || item.descriptionDe;
        case "uk":
          return item.descriptionUk || item.descriptionDe;
        default:
          return item.descriptionDe;
      }
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-transform duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden">
        <img
          src={promotion.imageUrl}
          alt={getTranslated(promotion, "name")}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {getTranslated(promotion, "name")}
        </h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {getTranslated(promotion, "description")}
        </p>
        <p className="mt-2 text-xl font-bold text-brand-blue">
          {promotion.price} €
        </p>
        {promotion.size && (
          <p className="text-xs text-gray-500 mt-1">Size: {promotion.size}</p>
        )}
      </div>
    </div>
  );
};

export default function PromotionsPage() {
  const { t } = useTranslation();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPromotions = useCallback(() => {
    setLoading(true);
    PromotionService.getActivePromotions(currentPage, 12)
      .then((data) => {
        setPromotions(data.content);
        setTotalPages(data.totalPages);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {t("promotions_page_title")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {promotions.map((promo) => (
          <PromotionCard key={promo.id} promotion={promo} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
          >
            {t("previous_page")}
          </button>
          <span className="text-sm font-medium text-gray-700">
            {t("page")} {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage + 1 >= totalPages}
            className="px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300"
          >
            {t("next_page")}
          </button>
        </div>
      )}
    </div>
  );
}
