
import { useTranslation } from 'react-i18next'; // <-- Добавляем импорт

export default function AdminDashboardPage() {
    const { t } = useTranslation(); // <-- Инициализируем функцию перевода

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">{t('admin_dashboard_title')}</h1>
            <p className="mt-4">{t('admin_dashboard_welcome')}</p>
            {/* Здесь будет содержимое панели администратора */}
        </div>
    );
}