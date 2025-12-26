import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export type ReportStyle = "playful" | "minimal" | "retro" | "tech" | "artistic";

interface StyleOption {
  id: ReportStyle;
  nameKey: string;
  descKey: string;
  preview: string;
  gradient: string;
}

const styles: StyleOption[] = [
  {
    id: "playful",
    nameKey: "style.playful",
    descKey: "style.playful.desc",
    preview: "🎉",
    gradient: "from-pink-500 via-orange-400 to-yellow-400",
  },
  {
    id: "minimal",
    nameKey: "style.minimal",
    descKey: "style.minimal.desc",
    preview: "✨",
    gradient: "from-slate-400 via-slate-300 to-slate-200",
  },
  {
    id: "retro",
    nameKey: "style.retro",
    descKey: "style.retro.desc",
    preview: "📼",
    gradient: "from-amber-600 via-orange-500 to-rose-400",
  },
  {
    id: "tech",
    nameKey: "style.tech",
    descKey: "style.tech.desc",
    preview: "🚀",
    gradient: "from-cyan-400 via-blue-500 to-purple-600",
  },
  {
    id: "artistic",
    nameKey: "style.artistic",
    descKey: "style.artistic.desc",
    preview: "🎨",
    gradient: "from-rose-300 via-purple-300 to-indigo-300",
  },
];

interface StyleSelectorProps {
  selectedStyle: ReportStyle;
  onStyleChange: (style: ReportStyle) => void;
}

const StyleSelector = ({ selectedStyle, onStyleChange }: StyleSelectorProps) => {
  const { t } = useLanguage();

  return (
    <section className="py-10 md:py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground text-center mb-6">
          {t("style.title")}
        </h2>

        <div className="flex flex-wrap justify-center gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-base
                ${selectedStyle === style.id 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "bg-muted hover:bg-muted/80 text-foreground"
                }
              `}
              onClick={() => onStyleChange(style.id)}
            >
              <span>{style.preview}</span>
              <span className="font-medium">{t(style.nameKey)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleSelector;
