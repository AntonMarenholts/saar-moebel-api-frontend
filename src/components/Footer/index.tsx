import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const SocialIcon = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-brand-blue transition-colors">
        {children}
    </a>
);

const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;


export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-white text-gray-600 p-8 mt-auto border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
            <h3 className="font-bold text-lg mb-2 text-brand-dark">{t("site_title")}</h3>
            <p className="text-sm">© {new Date().getFullYear()} {t("site_title")}. {t("all_rights_reserved")}</p>
        </div>
        <div>
            <h3 className="font-bold text-lg mb-2 text-brand-dark">{t("contacts")}</h3>
            <ul className="text-sm space-y-1">
                <li>{t("phone")}: +49 123 4567890</li>
                <li>{t("email")}: info@saar-moebel.de</li>
            </ul>
        </div>
         <div>
            <h3 className="font-bold text-lg mb-2 text-brand-dark">Info</h3>
            <ul className="text-sm space-y-1">
                <li><NavLink to="/rules" className="hover:text-brand-blue">{t("rules")}</NavLink></li>
            </ul>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
                <SocialIcon href="https://facebook.com">
                    <FacebookIcon />
                </SocialIcon>
                 <SocialIcon href="https://instagram.com">
                    <InstagramIcon />
                </SocialIcon>
            </div>
        </div>
      </div>
    </footer>
  );
}
