import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import { useTranslation } from 'react-i18next'; // <-- Добавляем импорт
import type { AuthUser } from '../services/auth.service';

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation(); // <-- Инициализируем функцию перевода

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            try {
                // ... (логика декодирования токена остается без изменений)
                const decodedToken: { sub: string, roles: string[], email: string, id: number } = jwtDecode(token);
                
                const user: AuthUser = {
                    token: token,
                    username: decodedToken.sub,
                    roles: decodedToken.roles || ['ROLE_USER'],
                    email: decodedToken.email,
                    id: decodedToken.id,
                };

                localStorage.setItem('user', JSON.stringify(user));
                
                if (user.roles.includes('ROLE_ADMIN')) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/profile');
                }
                
            } catch (error) {
                console.error("Ошибка при обработке токена", error);
                navigate('/login?error=token_invalid');
            }
        } else {
            const error = searchParams.get('error');
            console.error("Ошибка OAuth2:", error);
            navigate(`/login?error=${error || 'unknown_error'}`);
        }
    }, [navigate, searchParams]);

    return (
        <div className="flex items-center justify-center h-full">
            <p>{t('oauth_processing')}</p>
        </div>
    );
};

export default OAuth2RedirectHandler;