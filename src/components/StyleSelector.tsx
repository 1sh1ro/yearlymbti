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
    <section className="py-6 md:py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">
          {t("style.title")}
        </h2>

        <div className="flex flex-wrap justify-center gap-3">
          {styles.map((style) => (
            <button
              key={style.id}
              className={`
                relative flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all duration-300 text-base overflow-hidden group
                ${selectedStyle === style.id 
                  ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30 scale-105" 
                  : "bg-card hover:bg-card/80 text-foreground border border-border/60 hover:border-primary/40 hover:shadow-md"
                }
              `}
              onClick={() => onStyleChange(style.id)}
            >
              <span className="text-xl relative z-10">{style.preview}</span>
              <span className="font-semibold relative z-10">{t(style.nameKey)}</span>
              {selectedStyle === style.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleSelector;
