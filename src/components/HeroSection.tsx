import { Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] md:min-h-[65vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 mb-5 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs md:text-sm font-medium text-foreground">AI 驱动的年度记忆汇总</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight animate-slide-up">
          <span className="text-primary">你的年度故事</span>
          <br />
          <span className="text-foreground">一键汇总</span>
        </h1>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6 animate-fade-in-delay">
          上传 App 年度报告截图，AI 帮你生成独一无二的年度总结
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center animate-fade-in-delay-2">
          {["网易云音乐", "微信读书", "B站", "抖音", "支付宝"].map((app) => (
            <span
              key={app}
              className="px-2.5 py-1 bg-card/80 backdrop-blur border border-border rounded-full text-xs text-foreground/80"
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
