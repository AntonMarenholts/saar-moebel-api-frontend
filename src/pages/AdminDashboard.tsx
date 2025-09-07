import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
    const { t } = useTranslation();

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('admin_dashboard_title')}</h1>
            
            <div className="space-y-4">
                <p>{t('admin_dashboard_welcome')}</p>
                
                {/* --- Навигация админ-панели --- */}
                <div className="flex flex-wrap gap-4">
                    <Link 
                        to="/admin/categories" 
                        className="inline-block px-6 py-3 text-white font-semibold bg-brand-blue rounded-md hover:bg-blue-600 transition-colors"
                    >
                        {t('admin_manage_categories')}
                    </Link>
                    <Link 
                        to="/admin/add-product" 
                        className="inline-block px-6 py-3 text-white font-semibold bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                    >
                        {t('admin_add_product')}
                    </Link>
                    {/* Сюда можно будет добавлять другие ссылки */}
                </div>
            </div>
            
            {/* Здесь будет остальное содержимое панели администратора */}
        </div>
    );
}