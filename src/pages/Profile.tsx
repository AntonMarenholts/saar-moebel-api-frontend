
import AuthService from '../services/auth.service';
import { useTranslation } from 'react-i18next'; // <-- Добавляем импорт

export default function ProfilePage() {
    const { t } = useTranslation(); // <-- Инициализируем функцию перевода
    const currentUser = AuthService.getCurrentUser();

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800">{t('profile_title')}</h1>
            {currentUser ? (
                <div className="mt-4 space-y-2">
                    <p><strong>{t('profile_id')}:</strong> {currentUser.id}</p>
                    <p><strong>{t('profile_username')}:</strong> {currentUser.username}</p>
                    <p><strong>{t('profile_email')}:</strong> {currentUser.email}</p>
                    <p><strong>{t('profile_roles')}:</strong> {currentUser.roles.join(', ')}</p>
                </div>
            ) : (
                <p>{t('user_not_found')}</p>
            )}
        </div>
    );
}