import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; 
import PromotionService, {
  type Promotion,
} from "../services/promotion.service";


const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
    const { t } = useTranslation();
    const pageNumbers = [];

    if (totalPages <= 7) {
        for (let i = 0; i < totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        pageNumbers.push(0);
        if (currentPage > 2) {
            pageNumbers.push('...');
        }
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 2); i++) {
            pageNumbers.push(i);
        }
        if (currentPage < totalPages - 3) {
            pageNumbers.push('...');
        }
        pageNumbers.push(totalPages - 1);
    }
    
    return (
         <div className="flex justify-center items-center gap-2 mt-8">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0} className="px-3 py-1 text-sm font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300">
                {t('previous_page')}
            </button>
            {pageNumbers.map((num, index) => 
                typeof num === 'number' ? (
                    <button key={index} onClick={() => onPageChange(num)} className={`px-3 py-1 text-sm rounded-md ${currentPage === num ? 'bg-brand-blue text-white' : 'bg-gray-200'}`}>
                        {num + 1}
                    </button>
                ) : (
                    <span key={index} className="px-3 py-1">...</span>
                )
            )}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage + 1 >= totalPages} className="px-3 py-1 text-sm font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600 disabled:bg-gray-300">
                {t('next_page')}
            </button>
        </div>
    );
};

const PromotionCard = ({ promotion }: { promotion: Promotion }) => {
  const { i18n, t } = useTranslation();

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
    <Link to={`/promotion/${promotion.id}`} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 block">
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
        <div className="mt-2">
            {promotion.oldPrice && (
                 <p className="text-sm text-red-500 line-through">
                    {t('promotion_old_price')}: {promotion.oldPrice} €
                 </p>
            )}
            <p className="text-xl font-bold text-brand-blue">
                 {t('promotion_current_price')}: {promotion.price} €
            </p>
        </div>

        {promotion.size && (
          <p className="text-xs text-gray-500 mt-1">Size: {promotion.size}</p>
        )}
      </div>
    </Link>
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
        {/* --- ИЗМЕНЕНИЕ ЗДЕСЬ --- */}
        <Link 
            to="/" 
            className="mb-6 inline-flex items-center gap-2 text-sm text-brand-blue hover:underline"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            {t('back_to_home')}
        </Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {t("promotions_page_title")}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {promotions.map((promo) => (
          <PromotionCard key={promo.id} promotion={promo} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}