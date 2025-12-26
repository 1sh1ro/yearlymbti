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
      className="fixed top-4 right-4 z-50 gap-2 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{t("lang.switch")}</span>
    </Button>
  );
};

export default LanguageSwitcher;
