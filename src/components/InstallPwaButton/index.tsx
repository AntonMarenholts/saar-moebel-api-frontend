import { usePwaInstall } from "../../hooks/usePwaInstall";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function InstallPwaButton() {
  const { t } = useTranslation();
  const { canInstall, handleInstall } = usePwaInstall();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (canInstall) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 10000); // Исчезает через 10 секунд
      return () => clearTimeout(timer);
    }
  }, [canInstall]);

  if (!visible) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      className="bg-brand-yellow text-brand-dark font-bold py-2 px-4 rounded-lg text-sm transition-all animate-fade-in"
    >
      {t("install_app")}
    </button>
  );
}