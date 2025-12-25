import { Calendar, Music, Book, Film, Coffee, TrendingUp, Heart, Star, Zap, Award, Clock, Map, ShoppingCart, Headphones, Gamepad2, Camera, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ReportStyle } from "./StyleSelector";
import type { ReportData } from "@/lib/api/analyze";

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
  clock: <Clock className="w-5 h-5" />,
  map: <Map className="w-5 h-5" />,
  "shopping-cart": <ShoppingCart className="w-5 h-5" />,
  headphones: <Headphones className="w-5 h-5" />,
  gamepad: <Gamepad2 className="w-5 h-5" />,
  camera: <Camera className="w-5 h-5" />,
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
  summary: "2024年，你在数字世界里留下了丰富的足迹。音乐陪伴了你无数个深夜，书籍带你探索了52个不同的世界。你是一个热爱生活、充满好奇心的人。新的一年，继续做那个有趣的自己吧！",
  mbti: {
    type: "INFP",
    title: "深夜书虫",
    traits: [
      "深夜活跃，是音乐与文字的忠实伴侣",
      "偏爱独处时光，享受精神世界的探索",
      "对知识充满好奇，阅读涉猎广泛",
      "生活节奏随性，不被时间束缚"
    ],
    explanation: "你的听歌时长高达2847小时，且多在深夜活跃，显示出内向的独处偏好(I)。52本书的阅读量说明你喜欢探索新领域(N)。知识区视频是你的最爱，体现了思考者特质(T)。而你随性的活跃时间则展示了灵活的生活态度(P)。"
  }
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
              : "上传截图后，AI 将为你生成类似的报告"
            }
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
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {isRealData ? "专属于你的" : "我的"}
            </p>
            <h3 className={`text-3xl md:text-4xl font-bold ${config.accent} mb-2`}>
              2024 年度总结
            </h3>
            <p className="text-sm text-muted-foreground">
              来自 {reportData.totalApps} 个 App 的数据汇总
            </p>
            {reportData.apps && reportData.apps.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {reportData.apps.map((app, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 bg-background/50 rounded-full text-xs text-foreground/70"
                  >
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
                  className={`${config.cardBg} p-4 border-0 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className={`${config.accent} mb-2`}>
                    {getIcon(item.icon)}
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
          )}

          {/* MBTI Section */}
          {reportData.mbti && (
            <Card className={`${config.cardBg} p-6 border-0 mb-6`}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className={`w-5 h-5 ${config.accent}`} />
                <h4 className={`text-lg font-semibold ${config.accent}`}>
                  你的年度 MBTI
                </h4>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* MBTI Type Display */}
                <div className="flex-shrink-0 text-center md:text-left">
                  <div className={`text-4xl md:text-5xl font-bold ${config.accent} tracking-wider mb-2`}>
                    {reportData.mbti.type}
                  </div>
                  <div className="text-lg font-medium text-foreground">
                    "{reportData.mbti.title}"
                  </div>
                </div>
                
                {/* Traits */}
                <div className="flex-1 space-y-2">
                  {reportData.mbti.traits.map((trait, idx) => (
                    <div 
                      key={idx}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <span className={`${config.accent} mt-1`}>•</span>
                      <span>{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Explanation */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {reportData.mbti.explanation}
                </p>
              </div>
            </Card>
          )}

          {/* Summary */}
          <Card className={`${config.cardBg} p-6 border-0`}>
            <h4 className={`text-lg font-semibold ${config.accent} mb-3`}>
              ✨ AI 年度感言
            </h4>
            <p className="text-foreground leading-relaxed whitespace-pre-line">
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
