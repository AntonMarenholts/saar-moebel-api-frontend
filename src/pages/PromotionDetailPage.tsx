import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PromotionService, { type Promotion } from '../services/promotion.service';


const CountdownTimer = ({ endDate }: { endDate: string }) => {
    const { t } = useTranslation();
    const calculateTimeLeft = () => {
        const difference = +new Date(endDate) - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    return (
        <div className="flex items-center space-x-4">
            {Object.entries(timeLeft).map(([interval, value]) => (
                <div key={interval} className="text-center">
                    <div className="text-2xl font-bold">{String(value).padStart(2, '0')}</div>
                    <div className="text-xs uppercase text-gray-500">{t(interval)}</div>
                </div>
            ))}
        </div>
    );
};


export default function PromotionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [promotion, setPromotion] = useState<Promotion | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            PromotionService.getPromotionById(Number(id))
                .then(setPromotion)
                .catch(() => setError(t('promotion_load_error')))
                .finally(() => setLoading(false));
        }
    }, [id, t]);
    
    
    const getTranslated = (item: Promotion, field: "name" | "description"): string => {
        const lang = i18n.language;
        if (field === "name") {
            switch (lang) {
                case "en": return item.nameEn || item.nameDe;
                case "fr": return item.nameFr || item.nameDe;
                case "ru": return item.nameRu || item.nameDe;
                case "uk": return item.nameUk || item.nameDe;
                default: return item.nameDe;
            }
        } else { // field === "description"
            switch (lang) {
                case "en": return item.descriptionEn || item.descriptionDe;
                case "fr": return item.descriptionFr || item.descriptionDe;
                case "ru": return item.descriptionRu || item.descriptionDe;
                case "uk": return item.descriptionUk || item.descriptionDe;
                default: return item.descriptionDe;
            }
        }
    };

    if (loading) return <div>{t('loading')}</div>;
    if (error || !promotion) return <div className="text-red-500 text-center p-8">{error || t('promotion_load_error')}</div>;

    const savings = promotion.oldPrice ? (promotion.oldPrice - promotion.price).toFixed(2) : '0';
    const savingsPercent = promotion.oldPrice ? Math.round(((promotion.oldPrice - promotion.price) / promotion.oldPrice) * 100) : 0;

    return (
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg">
            <button 
                onClick={() => navigate(-1)} 
                className="mb-6 inline-flex items-center gap-2 text-sm text-brand-blue hover:underline"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                {t('back_to_promotions')}
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Левая колонка: Изображение */}
                <div>
                    <img src={promotion.imageUrl} alt={getTranslated(promotion, "name")} className="w-full h-auto object-cover rounded-lg shadow-md" />
                </div>

                {/* Правая колонка: Детали */}
                <div className="flex flex-col space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{getTranslated(promotion, "name")}</h1>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                        {promotion.oldPrice && (
                            <p className="text-xl text-red-500 line-through">{promotion.oldPrice.toFixed(2)} €</p>
                        )}
                        <p className="text-4xl font-extrabold text-brand-blue">{promotion.price.toFixed(2)} €</p>
                        {promotion.oldPrice && savingsPercent > 0 && (
                            <p className="text-green-600 font-semibold mt-2">{t('you_save')} {savings} € ({savingsPercent}%)!</p>
                        )}
                    </div>

                    <div className="border-t border-b py-4">
                        <h3 className="text-sm uppercase font-semibold text-gray-500 mb-2">{t('offer_ends_in')}</h3>
                        <CountdownTimer endDate={promotion.endDate} />
                    </div>

                    <p className="text-gray-600 whitespace-pre-wrap">{getTranslated(promotion, "description")}</p>
                    
                    {promotion.size && <p className="text-sm text-gray-500"><strong>{t('promotion_size')}:</strong> {promotion.size}</p>}
                    
                    <button className="w-full py-3 px-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300 text-lg">
                        {t('add_to_cart')}
                    </button>

                     {/* TODO: Add Social Share buttons here */}
                </div>
            </div>
            
            {/* TODO: Add Related Promotions section here */}
        </div>
    );
}