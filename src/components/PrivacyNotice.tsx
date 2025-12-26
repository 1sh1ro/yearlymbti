import { Shield, Trash2, Lock, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyNotice = () => {
  const { t } = useLanguage();

  return (
    <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">{t("privacy.title")}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/70" />
          <span>{t("privacy.item1")}</span>
        </div>
        <div className="flex items-start gap-2">
          <Eye className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/70" />
          <span>{t("privacy.item2")}</span>
        </div>
        <div className="flex items-start gap-2">
          <Trash2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/70" />
          <span>{t("privacy.item3")}</span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
