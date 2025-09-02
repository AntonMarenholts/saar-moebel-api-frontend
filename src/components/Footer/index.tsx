import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-white text-gray-500 p-4 mt-auto border-t">
      <div className="container mx-auto text-center text-sm">
        <p>© {new Date().getFullYear()} {t("site_title")}. {t("all_rights_reserved")}</p>
        <div className="flex justify-center gap-6 mt-2">
          <a href="#" className="hover:text-brand-blue">Facebook</a>
          <a href="#" className="hover:text-brand-blue">Instagram</a>
          <NavLink to="/rules" className="hover:text-brand-blue">{t("rules")}</NavLink>
        </div>
      </div>
    </footer>
  );
}