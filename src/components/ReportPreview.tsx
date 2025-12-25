import { Calendar, Music, Book, Film, Coffee, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ReportStyle } from "./StyleSelector";

interface ReportData {
  totalApps: number;
  highlights: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtext?: string;
  }[];
  summary: string;
}

interface ReportPreviewProps {
  style: ReportStyle;
  data: ReportData | null;
}

const styleConfigs: Record<ReportStyle, { bg: string; accent: string; cardBg: string }> = {
  playful: {
    bg: "bg-gradient-to-br from-pink-500/20 via-orange-400/20 to-yellow-400/20",
    accent: "text-pink-600",
    cardBg: "bg-gradient-to-br from-pink-50 to-orange-50",
  },
  minimal: {
    bg: "bg-gradient-to-br from-slate-100 to-slate-200",
    accent: "text-slate-700",
    cardBg: "bg-card",
  },
  retro: {
    bg: "bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100",
    accent: "text-amber-700",
    cardBg: "bg-gradient-to-br from-amber-50 to-orange-50",
  },
  tech: {
    bg: "bg-gradient-to-br from-cyan-900/30 via-blue-900/30 to-purple-900/30",
    accent: "text-cyan-400",
    cardBg: "bg-secondary/50 backdrop-blur",
  },
  artistic: {
    bg: "bg-gradient-to-br from-rose-100 via-purple-100 to-indigo-100",
    accent: "text-purple-600",
    cardBg: "bg-gradient-to-br from-rose-50 to-purple-50",
  },
};

const mockData: ReportData = {
  totalApps: 6,
  highlights: [
    { icon: <Music className="w-5 h-5" />, label: "听歌时长", value: "2,847 小时", subtext: "超过 99% 的用户" },
    { icon: <Book className="w-5 h-5" />, label: "阅读书籍", value: "52 本", subtext: "最爱科幻类" },
    { icon: <Film className="w-5 h-5" />, label: "观看视频", value: "1,024 小时", subtext: "最爱知识区" },
    { icon: <Coffee className="w-5 h-5" />, label: "外卖订单", value: "365 单", subtext: "最爱奶茶" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "运动步数", value: "365 万步", subtext: "相当于绕地球 0.5 圈" },
    { icon: <Calendar className="w-5 h-5" />, label: "活跃天数", value: "328 天", subtext: "坚持就是胜利" },
  ],
  summary: "2024年，你在数字世界里留下了丰富的足迹。音乐陪伴了你无数个深夜，书籍带你探索了52个不同的世界。你是一个热爱生活、充满好奇心的人。新的一年，继续做那个有趣的自己吧！",
};

const ReportPreview = ({ style, data }: ReportPreviewProps) => {
  const config = styleConfigs[style];
  const reportData = data || mockData;

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            预览效果
          </h2>
          <p className="text-muted-foreground">
            {data ? "这是 AI 为你生成的年度报告" : "上传截图后，AI 将为你生成类似的报告"}
          </p>
        </div>

        {/* Report Container */}
        <Card className={`${config.bg} p-6 md:p-10 rounded-2xl overflow-hidden`}>
          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-muted-foreground mb-2">我的</p>
            <h3 className={`text-3xl md:text-4xl font-bold ${config.accent} mb-2`}>
              2024 年度总结
            </h3>
            <p className="text-sm text-muted-foreground">
              来自 {reportData.totalApps} 个 App 的数据汇总
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
            {reportData.highlights.map((item, index) => (
              <Card 
                key={index} 
                className={`${config.cardBg} p-4 border-0 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className={`${config.accent} mb-2`}>
                  {item.icon}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className={`text-xl md:text-2xl font-bold ${config.accent}`}>
                  {item.value}
                </p>
                {item.subtext && (
                  <p className="text-xs text-muted-foreground mt-1">{item.subtext}</p>
                )}
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card className={`${config.cardBg} p-6 border-0`}>
            <h4 className={`text-lg font-semibold ${config.accent} mb-3`}>
              ✨ AI 年度感言
            </h4>
            <p className="text-foreground leading-relaxed">
              {reportData.summary}
            </p>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              由年度记忆汇总生成 · {new Date().getFullYear()}
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ReportPreview;
