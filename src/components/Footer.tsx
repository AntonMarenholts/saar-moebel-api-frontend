import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
    const { t } = useTranslation();
    const phone = "+49 123 4567890";
    const email = "info@saar-moebel.de";

    return (
        <footer className="bg-brand-dark text-gray-300 p-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">{t('footer_contacts')}</h3>
                    <p>
                        <a href={`tel:${phone}`} className="hover:text-white">{phone}</a>
                    </p>
                    <p>
                        <a href={`mailto:${email}`} className="hover:text-white">{email}</a>
                    </p>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Links</h3>
                    <ul>
                        <li><Link to="/rules" className="hover:text-white">{t('footer_rules')}</Link></li>
                        {/* Другие ссылки */}
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">Social Media</h3>
                    <div className="flex gap-4">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}