import { useRef, useState } from "react";
import { Download, Share2, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReportStyle } from "./StyleSelector";
import type { ReportData } from "@/lib/api/analyze";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface ShareCardProps {
  style: ReportStyle;
  data: ReportData;
}

const styleConfigs: Record<ReportStyle, { bg: string; accent: string; textColor: string }> = {
  playful: {
    bg: "bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-400",
    accent: "text-white",
    textColor: "text-white/90",
  },
  minimal: {
    bg: "bg-gradient-to-br from-slate-700 to-slate-900",
    accent: "text-white",
    textColor: "text-white/80",
  },
  retro: {
    bg: "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500",
    accent: "text-white",
    textColor: "text-white/90",
  },
  tech: {
    bg: "bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800",
    accent: "text-cyan-300",
    textColor: "text-white/80",
  },
  artistic: {
    bg: "bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700",
    accent: "text-white",
    textColor: "text-white/90",
  },
};

const ShareCard = ({ style, data }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const config = styleConfigs[style];

  // Get top 3 highlights
  const topHighlights = data.highlights.slice(0, 3);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      const fileName = language === "zh" 
        ? `年度报告-${new Date().getFullYear()}.png`
        : `annual-report-${new Date().getFullYear()}.png`;
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);

      toast({
        title: t("share.downloadSuccess"),
        description: t("share.downloadSuccessDesc"),
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: t("share.downloadError"),
        description: t("share.downloadErrorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          {t("share.title")}
        </h3>
        <Button
          onClick={handleDownload}
          disabled={isDownloading}
          size="sm"
          className="gap-2"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : downloadSuccess ? (
            <Check className="w-4 h-4" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {downloadSuccess ? t("share.saved") : t("share.download")}
        </Button>
      </div>

      {/* Card Preview */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className={`${config.bg} p-6 rounded-2xl w-full max-w-sm aspect-[9/16] flex flex-col justify-between shadow-2xl`}
        >
          {/* Header */}
          <div className="text-center">
            <p className={`text-sm ${config.textColor} mb-1`}>{t("share.myReport")}</p>
            <h2 className={`text-3xl font-bold ${config.accent}`}>{t("share.yearReport")}</h2>
            <p className={`text-sm ${config.textColor} mt-2`}>
              {t("share.fromApps").replace("{count}", String(data.totalApps))}
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-3 my-6">
            {topHighlights.map((item, index) => (
              <div
                key={index}
                className="bg-white/15 backdrop-blur-sm rounded-xl p-4"
              >
                <p className={`text-sm ${config.textColor}`}>{item.label}</p>
                <p className={`text-2xl font-bold ${config.accent}`}>{item.value}</p>
                {item.subtext && (
                  <p className={`text-xs ${config.textColor} mt-1`}>{item.subtext}</p>
                )}
              </div>
            ))}
          </div>

          {/* MBTI Badge */}
          {data.mbti && (
            <div className="text-center mb-4">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className={`text-2xl font-bold ${config.accent}`}>
                  {data.mbti.type}
                </span>
                <span className={`text-sm ${config.textColor} ml-2`}>
                  {data.mbti.title}
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center">
            <p className={`text-xs ${config.textColor} opacity-70`}>
              {t("share.scanHint")}
            </p>
            <p className={`text-sm ${config.accent} font-medium mt-1`}>
              yearlymbti.lovable.app
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        {t("share.saveHint")}
      </p>
    </div>
  );
};

export default ShareCard;
