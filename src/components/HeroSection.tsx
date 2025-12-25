import { Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI 驱动的年度记忆汇总</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
          <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-1 bg-clip-text text-transparent">
            你的年度故事
          </span>
          <br />
          <span className="text-foreground">一键汇总</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-delay">
          上传各个 App 的年度报告截图，AI 帮你识别、整理、生成一份独一无二的年度总结
        </p>
        
        <div className="flex flex-wrap gap-3 justify-center animate-fade-in-delay-2">
          {["网易云音乐", "微信读书", "B站", "抖音", "支付宝", "更多..."].map((app) => (
            <span
              key={app}
              className="px-3 py-1.5 bg-card/80 backdrop-blur border border-border rounded-full text-sm text-foreground/80"
            >
              {app}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
