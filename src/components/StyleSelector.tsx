import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";

export type ReportStyle = "playful" | "minimal" | "retro" | "tech" | "artistic";

interface StyleOption {
  id: ReportStyle;
  name: string;
  description: string;
  preview: string;
  gradient: string;
}

const styles: StyleOption[] = [
  {
    id: "playful",
    name: "活力趣味",
    description: "色彩缤纷，充满活力的风格",
    preview: "🎉",
    gradient: "from-pink-500 via-orange-400 to-yellow-400",
  },
  {
    id: "minimal",
    name: "简约清新",
    description: "干净利落，极简主义",
    preview: "✨",
    gradient: "from-slate-400 via-slate-300 to-slate-200",
  },
  {
    id: "retro",
    name: "复古怀旧",
    description: "温暖怀旧的复古风格",
    preview: "📼",
    gradient: "from-amber-600 via-orange-500 to-rose-400",
  },
  {
    id: "tech",
    name: "科技未来",
    description: "赛博朋克，未来感十足",
    preview: "🚀",
    gradient: "from-cyan-400 via-blue-500 to-purple-600",
  },
  {
    id: "artistic",
    name: "艺术水彩",
    description: "柔和的水彩艺术风格",
    preview: "🎨",
    gradient: "from-rose-300 via-purple-300 to-indigo-300",
  },
];

interface StyleSelectorProps {
  selectedStyle: ReportStyle;
  onStyleChange: (style: ReportStyle) => void;
}

const StyleSelector = ({ selectedStyle, onStyleChange }: StyleSelectorProps) => {
  return (
    <section className="py-10 md:py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground text-center mb-6">
          选择风格
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
              <span className="font-medium">{style.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleSelector;
