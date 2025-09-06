
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // <-- Добавляем импорт

export default function NotFoundPage() {
    const { t } = useTranslation(); // <-- Инициализируем функцию перевода

    return (
        <div className="flex flex-col items-center justify-center text-center h-full">
            <h1 className="text-6xl font-bold text-brand-dark">404</h1>
            <p className="text-xl mt-4 text-gray-600">{t('not_found_title')}</p>
            <p className="mt-2 text-gray-500">{t('not_found_subtitle')}</p>
            <Link to="/" className="mt-8 px-6 py-3 text-white bg-brand-blue rounded-md hover:bg-blue-600">
                {t('back_to_home')}
            </Link>
        </div>
    );
}