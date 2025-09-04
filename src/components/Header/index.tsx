import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import InstallPwaButton from "../InstallPwaButton";
import { useAuth } from "../../hooks/useAuth"; 

// ... (иконки SearchIcon и ShoppingCartIcon остаются без изменений)
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-gray-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);


export default function Header() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth(); // Теперь получаем и пользователя, и функцию выхода

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-brand-light/90 backdrop-blur-sm text-brand-dark p-4 sticky top-0 z-50 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-brand-blue">
           <div className="flex items-center gap-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-blue">
                <path d="M20 10V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3m16 0-3 5H7l-3-5m16 0h-2M4 10H2m17 5h2m-2 0-3-5M5 15H3m0 0l3-5m0 0V7m4 8v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-bold text-2xl">{t("site_title")}</span>
           </div>
        </NavLink>

        <div className="flex-1 max-w-xl mx-4">
             <div className="relative">
                <input
                    type="search"
                    placeholder={t("search_placeholder")}
                    className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon />
                </div>
            </div>
        </div>

        <nav className="flex items-center gap-4">
          <InstallPwaButton />
          
          {/* --- НАЧАЛО ИЗМЕНЕНИЙ --- */}
          {user ? (
            // Если пользователь вошел в систему
            <>
              {user.role === "ROLE_ADMIN" && (
                <NavLink to="/admin" className="text-sm font-semibold text-red-600 hover:text-red-800">
                  {t("admin_panel")}
                </NavLink>
              )}
              <span className="text-sm font-semibold">
                Привет, {user.username}!
              </span>
              <button onClick={logout} className="text-sm font-semibold hover:text-brand-blue">
                {t("logout")} {/* Добавьте "logout": "Выход" в ваши json файлы локализации */}
              </button>
            </>
          ) : (
            // Если пользователь - гость
            <>
              <NavLink to="/login" className="text-sm font-semibold hover:text-brand-blue">
                {t("login")}
              </NavLink>
              <NavLink to="/register" className="text-sm font-semibold hover:text-brand-blue">
                {t("register")}
              </NavLink>
            </>
          )}
          {/* --- КОНЕЦ ИЗМЕНЕНИЙ --- */}

           <NavLink to="/cart" className="hover:text-brand-blue">
              <ShoppingCartIcon />
           </NavLink>
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="bg-gray-100 p-2 border rounded-md text-sm font-semibold hover:border-brand-blue focus:outline-none"
          >
            <option value="de">DE</option>
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="ru">RU</option>
            <option value="uk">UA</option>
          </select>
        </nav>
      </div>
    </header>
  );
}