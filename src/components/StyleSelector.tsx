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
    <section className="py-16 px-4 bg-card/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            选择报告风格
          </h2>
          <p className="text-muted-foreground">
            为你的年度总结选择一个独特的视觉风格
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {styles.map((style) => (
            <Card
              key={style.id}
              className={`
                relative cursor-pointer transition-all duration-300 overflow-hidden
                ${selectedStyle === style.id 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105" 
                  : "hover:scale-102 hover:shadow-lg"
                }
              `}
              onClick={() => onStyleChange(style.id)}
            >
              {/* Gradient Preview */}
              <div className={`h-24 bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                <span className="text-4xl">{style.preview}</span>
              </div>
              
              {/* Info */}
              <div className="p-3">
                <h3 className="font-semibold text-foreground text-sm mb-1">
                  {style.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {style.description}
                </p>
              </div>

              {/* Selected Indicator */}
              {selectedStyle === style.id && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyleSelector;
