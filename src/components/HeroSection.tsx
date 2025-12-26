import { Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[45vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-2.5 py-1 mb-4">
          <Sparkles className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-foreground">AI 年度记忆汇总</span>
        </div>
        
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
          <span className="text-primary">你的年度故事</span>
          <span className="text-foreground">，一键汇总</span>
        </h1>
        
        <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
          上传 App 年度报告截图，AI 帮你生成独一无二的年度总结
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
