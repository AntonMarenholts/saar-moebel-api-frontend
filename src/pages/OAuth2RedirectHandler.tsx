import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import type { AuthUser } from '../services/auth.service';


const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            try {
                // Декодируем токен, чтобы получить данные пользователя
                const decodedToken: { sub: string, roles: string[], email: string, id: number } = jwtDecode(token);
                
                // Формируем объект пользователя
                const user: AuthUser = {
                    token: token,
                    username: decodedToken.sub, // 'sub' (subject) обычно является именем пользователя
                    roles: decodedToken.roles || ['ROLE_USER'], // на всякий случай, если роли не пришли
                    email: decodedToken.email,
                    id: decodedToken.id,
                };

                // Сохраняем пользователя в localStorage
                localStorage.setItem('user', JSON.stringify(user));
                
                // Перенаправляем в зависимости от роли
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
            <p>Обработка входа...</p>
        </div>
    );
};

export default OAuth2RedirectHandler;