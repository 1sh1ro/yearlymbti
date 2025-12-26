import { Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[50vh] md:min-h-[55vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI 年度记忆汇总</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          <span className="text-primary">你的年度故事</span>
          <span className="text-foreground">，一键汇总</span>
        </h1>
        
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
          上传 App 年度报告截图，AI 帮你生成独一无二的年度总结
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
