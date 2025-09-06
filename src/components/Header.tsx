import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import type { AuthUser } from "../services/auth.service";
import AuthService from "../services/auth.service";


// Placeholder для логотипа (без изменений)
const Logo = () => (
    <svg className="w-10 h-10 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
);

export default function Header() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        // При загрузке компонента проверяем, есть ли пользователь в системе
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };
    
    const handleLogout = () => {
        AuthService.logout();
        setCurrentUser(null);
        navigate("/");
        window.location.reload();
    };

    return (
        <header className="sticky top-0 bg-brand-dark text-white shadow-md z-50">
            <div className="container mx-auto flex justify-between items-center p-4">
                <Link to="/" className="flex items-center gap-3">
                    <Logo />
                    <span className="text-2xl font-bold">{t('site_title')}</span>
                </Link>
                <div className="flex items-center gap-4">
                    <select
                        onChange={(e) => changeLanguage(e.target.value)}
                        value={i18n.language}
                        className="bg-gray-700 text-white p-2 rounded-md text-sm"
                    >
                        <option value="de">DE</option>
                        <option value="en">EN</option>
                        <option value="fr">FR</option>
                        <option value="ru">RU</option>
                        <option value="uk">UA</option>
                    </select>

                    {currentUser ? (
                        // Если пользователь вошел в систему
                        <div className="flex items-center gap-4">
                            <span className="font-semibold">{currentUser.username}</span>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Выход
                            </button>
                        </div>
                    ) : (
                        // Если пользователь не вошел
                        <Link to="/login">
                             <button className="bg-brand-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                {t('login')}
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}