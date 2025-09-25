import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function CartPage() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center text-center bg-white p-12 rounded-lg shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('cart_title')}</h1>
            <p className="text-gray-600 mb-8">{t('cart_empty')}</p>
            <Link to="/" className="px-6 py-3 text-white bg-brand-blue rounded-md hover:bg-blue-600 transition-colors">
                {t('back_to_shopping')}
            </Link>
        </div>
    );
}