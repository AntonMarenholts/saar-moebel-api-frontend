import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import type { AuthUser } from "../services/auth.service";
import AuthService from "../services/auth.service";

const Logo = () => (
  <svg
    className="w-10 h-10 text-brand-blue"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    ></path>
  </svg>
);

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
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
  };

  const isAdmin = currentUser?.roles.includes("ROLE_ADMIN");

  return (
    <header className="sticky top-0 bg-brand-dark text-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="text-2xl font-bold">{t("site_title")}</span>
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
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className="relative p-2 hover:bg-gray-700 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>

              <span className="font-semibold">{currentUser.username}</span>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-brand-blue hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                {t("login")}
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* --- НОВАЯ ПАНЕЛЬ УПРАВЛЕНИЯ ДЛЯ АДМИНА --- */}
      {isAdmin && (
        <div className="bg-gray-700">
          <div className="container mx-auto flex items-center justify-center p-2 gap-4">
            <Link to="/admin/categories" className="...">
              {t("admin_manage_categories")}
            </Link>
            <Link to="/admin/add-product" className="...">
              {t("admin_add_product")}
            </Link>
            <Link to="/admin/news" className="...">
              {t("admin_manage_news")}
            </Link>
            
            <Link
              to="/admin/promotions"
              className="px-3 py-1 text-sm text-white rounded-md hover:bg-gray-600"
            >
              {t("admin_manage_promotions")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
