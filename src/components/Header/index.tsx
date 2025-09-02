import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export default function Header() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-brand-light/80 backdrop-blur-sm text-brand-dark p-4 sticky top-0 z-50 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold text-brand-blue">
          {t("site_title")}
        </NavLink>
        <nav className="flex items-center gap-6">
          <NavLink to="/login" className="text-sm font-semibold hover:text-brand-blue">{t("login")}</NavLink>
          <NavLink to="/register" className="text-sm font-semibold hover:text-brand-blue">{t("register")}</NavLink>
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="bg-gray-200 p-2 rounded-md text-sm font-semibold"
          >
            <option value="uk">UA</option>
            <option value="de">DE</option>
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="ru">RU</option>
          </select>
        </nav>
      </div>
    </header>
  );
}