import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative pt-16 pb-8 md:pt-20 md:pb-10 flex items-center justify-center overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">{t("hero.badge")}</span>
        </div>
        
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
          <span className="text-primary">{t("hero.title.1")}</span>
          <span className="text-foreground">{t("hero.title.2")}</span>
        </h1>
        
        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
          {t("hero.subtitle")}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
