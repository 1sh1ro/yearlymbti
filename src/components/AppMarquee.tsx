import { useLanguage } from "@/contexts/LanguageContext";

const supportedApps = [
  { name: "小红书", nameEn: "Xiaohongshu", emoji: "📕" },
  { name: "哔哩哔哩", nameEn: "Bilibili", emoji: "📺" },
  { name: "淘宝", nameEn: "Taobao", emoji: "🛒" },
  { name: "微信读书", nameEn: "WeRead", emoji: "📚" },
  { name: "美团", nameEn: "Meituan", emoji: "🍜" },
  { name: "网易云音乐", nameEn: "NetEase Music", emoji: "🎵" },
  { name: "QQ音乐", nameEn: "QQ Music", emoji: "🎧" },
  { name: "支付宝", nameEn: "Alipay", emoji: "💰" },
  { name: "抖音", nameEn: "Douyin", emoji: "🎬" },
  { name: "微博", nameEn: "Weibo", emoji: "📱" },
  { name: "京东", nameEn: "JD.com", emoji: "📦" },
  { name: "饿了么", nameEn: "Ele.me", emoji: "🍔" },
  { name: "Keep", nameEn: "Keep", emoji: "🏃" },
  { name: "知乎", nameEn: "Zhihu", emoji: "💡" },
  { name: "豆瓣", nameEn: "Douban", emoji: "🎬" },
];

const AppMarquee = () => {
  const { language } = useLanguage();

  // Duplicate the list for seamless infinite scroll
  const duplicatedApps = [...supportedApps, ...supportedApps];

  return (
    <div className="py-5 overflow-hidden">
      <div className="relative">
        {/* Gradient masks for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling container */}
        <div className="flex animate-marquee">
          {duplicatedApps.map((app, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 mx-2 bg-card/80 rounded-full border border-border/40 whitespace-nowrap shrink-0"
            >
              <span className="text-base">{app.emoji}</span>
              <span className="text-sm font-medium text-foreground/80">
                {language === "zh" ? app.name : app.nameEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppMarquee;
