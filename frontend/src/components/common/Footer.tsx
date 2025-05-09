import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("footer");

  return (
    <footer className="bg-gray-800 dark:bg-gray-900 p-4 text-white text-center">
      <p className="text-sm">{t("footerText")}</p>
    </footer>
  );
};

export default Footer;
