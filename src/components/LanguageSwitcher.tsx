import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 gap-2 bg-card/90 backdrop-blur-md border border-border/50 hover:bg-card hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl"
    >
      <Globe className="w-4 h-4 text-primary" />
      <span className="text-sm font-medium">{t("lang.switch")}</span>
    </Button>
  );
};

export default LanguageSwitcher;
