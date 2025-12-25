import { Calendar, Music, Book, Film, Coffee, TrendingUp, Heart, Star, Zap, Award, Github } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ReportStyle } from "./StyleSelector";
import type { ReportData } from "@/lib/api/analyze";
import AnimatedNumber from "./AnimatedNumber";

interface ReportPreviewProps {
  style: ReportStyle;
  data: ReportData | null;
  isLoading?: boolean;
}

const styleConfigs: Record<ReportStyle, { bg: string; accent: string; cardBg: string }> = {
  playful: {
    bg: "bg-gradient-to-br from-pink-500/20 via-orange-400/20 to-yellow-400/20",
    accent: "text-pink-600",
    cardBg: "bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/30",
  },
  minimal: {
    bg: "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900",
    accent: "text-slate-700 dark:text-slate-300",
    cardBg: "bg-card",
  },
  retro: {
    bg: "bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30",
    accent: "text-amber-700 dark:text-amber-400",
    cardBg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
  },
  tech: {
    bg: "bg-gradient-to-br from-cyan-900/30 via-blue-900/30 to-purple-900/30",
    accent: "text-cyan-500",
    cardBg: "bg-secondary/50 backdrop-blur",
  },
  artistic: {
    bg: "bg-gradient-to-br from-rose-100 via-purple-100 to-indigo-100 dark:from-rose-950/30 dark:via-purple-950/30 dark:to-indigo-950/30",
    accent: "text-purple-600 dark:text-purple-400",
    cardBg: "bg-gradient-to-br from-rose-50 to-purple-50 dark:from-rose-950/30 dark:to-purple-950/30",
  },
};

const iconMap: Record<string, React.ReactNode> = {
  music: <Music className="w-5 h-5" />,
  book: <Book className="w-5 h-5" />,
  film: <Film className="w-5 h-5" />,
  coffee: <Coffee className="w-5 h-5" />,
  trending: <TrendingUp className="w-5 h-5" />,
  calendar: <Calendar className="w-5 h-5" />,
  heart: <Heart className="w-5 h-5" />,
  star: <Star className="w-5 h-5" />,
  zap: <Zap className="w-5 h-5" />,
  award: <Award className="w-5 h-5" />,
};

const getIcon = (iconName: string) => {
  return iconMap[iconName.toLowerCase()] || <Star className="w-5 h-5" />;
};

const mockData: ReportData = {
  totalApps: 6,
  highlights: [
    { icon: "music", label: "听歌时长", value: "2,847 小时", subtext: "超过 99% 的用户" },
    { icon: "book", label: "阅读书籍", value: "52 本", subtext: "最爱科幻类" },
    { icon: "film", label: "观看视频", value: "1,024 小时", subtext: "最爱知识区" },
    { icon: "coffee", label: "外卖订单", value: "365 单", subtext: "最爱奶茶" },
    { icon: "trending", label: "运动步数", value: "365 万步", subtext: "相当于绕地球 0.5 圈" },
    { icon: "calendar", label: "活跃天数", value: "328 天", subtext: "坚持就是胜利" },
  ],
  summary:
    "2025年，你在数字世界里留下了丰富的足迹。音乐陪伴了你无数个深夜，书籍带你探索了52个不同的世界。你是一个热爱生活、充满好奇心的人。新的一年，继续做那个有趣的自己吧！",
};

const ReportPreview = ({ style, data, isLoading }: ReportPreviewProps) => {
  const config = styleConfigs[style];
  const reportData = data || mockData;
  const isRealData = !!data;

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {isRealData ? "🎉 你的年度报告" : "预览效果"}
          </h2>
          <p className="text-muted-foreground">
            {isRealData
              ? `AI 从 ${reportData.totalApps} 个 App 中汇总了你的年度数据`
              : "上传截图后，AI 将为你生成类似的报告"}
          </p>
        </div>

        {/* Report Container */}
        <Card className={`${config.bg} p-6 md:p-10 rounded-2xl overflow-hidden relative`}>
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">AI 正在分析你的截图...</p>
                <p className="text-sm text-muted-foreground mt-2">这可能需要 30-60 秒</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-muted-foreground mb-2">{isRealData ? "专属于你的" : "我的"}</p>
            <h3 className={`text-3xl md:text-4xl font-bold ${config.accent} mb-2`}>2025 年度总结</h3>
            <p className="text-sm text-muted-foreground">来自 {reportData.totalApps} 个 App 的数据汇总</p>
            {reportData.apps && reportData.apps.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {reportData.apps.map((app, idx) => (
                  <span key={idx} className="px-2 py-1 bg-background/50 rounded-full text-xs text-foreground/70">
                    {app}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats Grid */}
          {reportData.highlights.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {reportData.highlights.slice(0, 6).map((item, index) => (
                <Card
                  key={index}
                  className={`${config.cardBg} p-4 border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 opacity-0 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className={`${config.accent} mb-2 animate-bounce-subtle`}>{getIcon(item.icon)}</div>
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={`text-xl md:text-2xl font-bold ${config.accent}`}>
                    <AnimatedNumber value={item.value} duration={2000 + index * 200} />
                  </p>
                  {item.subtext && <p className="text-xs text-muted-foreground mt-1">{item.subtext}</p>}
                </Card>
              ))}
            </div>
          )}

          {/* Summary */}
          <Card className={`${config.cardBg} p-6 border-0 opacity-0 animate-fade-in-up`} style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            <h4 className={`text-lg font-semibold ${config.accent} mb-3`}>✨ AI 年度感言</h4>
            <p className="text-foreground leading-relaxed whitespace-pre-line">{reportData.summary}</p>
          </Card>

          {/* MBTI Section */}
          {reportData.mbti && (
            <Card className={`${config.cardBg} p-6 border-0 mt-6 opacity-0 animate-fade-in-up`} style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
              <h4 className={`text-lg font-semibold ${config.accent} mb-3`}>🧠 年度 MBTI</h4>
              <div className="text-center mb-4">
                <span className={`text-4xl font-bold ${config.accent} animate-pulse-subtle`}>{reportData.mbti.type}</span>
                <p className={`text-sm ${config.accent} mt-1`}>{reportData.mbti.title}</p>
              </div>
              {reportData.mbti.traits && reportData.mbti.traits.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {reportData.mbti.traits.map((trait, idx) => (
                    <span key={idx} className="px-3 py-1 bg-background/50 rounded-full text-sm text-foreground/80">
                      {trait}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-foreground leading-relaxed whitespace-pre-line">{reportData.mbti.explanation}</p>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-border/50 opacity-0 animate-fade-in-up" style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}>
            <p className="text-xs text-muted-foreground mb-2">由年度记忆汇总生成 · {new Date().getFullYear()}</p>
            <a 
              href="https://github.com/1sh1ro/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              Powered by 1sh1ro
            </a>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ReportPreview;
