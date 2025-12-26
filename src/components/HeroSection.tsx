import { Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative pt-20 pb-6 md:pt-24 md:pb-8 flex items-center justify-center overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-subtle" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/25 rounded-full px-5 py-2 mb-5 shadow-sm backdrop-blur-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary animate-pulse-subtle" />
          <span className="text-sm font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t("hero.badge")}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-fade-in-delay">
          <span className="bg-gradient-to-r from-primary via-primary to-cyan-500 bg-clip-text text-transparent">
            {t("hero.title.1")}
          </span>
          <span className="text-foreground">{t("hero.title.2")}</span>
        </h1>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto animate-fade-in-delay-2">
          {t("hero.subtitle")}
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
