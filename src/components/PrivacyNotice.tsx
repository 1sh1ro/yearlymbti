import { Shield, Trash2, Lock, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyNotice = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-muted/60 to-muted/30 border border-border/40 backdrop-blur-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm font-semibold text-foreground">{t("privacy.title")}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-muted-foreground">
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-background/50">
          <Lock className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
          <span className="leading-relaxed">{t("privacy.item1")}</span>
        </div>
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-background/50">
          <Eye className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
          <span className="leading-relaxed">{t("privacy.item2")}</span>
        </div>
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-background/50">
          <Trash2 className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
          <span className="leading-relaxed">{t("privacy.item3")}</span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
