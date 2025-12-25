import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import UploadSection from "@/components/UploadSection";
import StyleSelector, { type ReportStyle } from "@/components/StyleSelector";
import GenerateButton from "@/components/GenerateButton";
import ReportPreview from "@/components/ReportPreview";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [images, setImages] = useState<File[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<ReportStyle>("playful");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (images.length === 0) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    setIsGenerating(false);
    setReportGenerated(true);
    
    toast({
      title: "生成成功！",
      description: "你的年度报告已经准备好了",
    });
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <UploadSection onImagesChange={setImages} />
      <StyleSelector selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
      <GenerateButton
        disabled={images.length === 0}
        isLoading={isGenerating}
        onClick={handleGenerate}
      />
      <ReportPreview style={selectedStyle} data={reportGenerated ? null : null} />
      
      {/* Footer */}
      <footer className="py-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} 年度记忆汇总 · 让回忆更有意义
        </p>
      </footer>
    </main>
  );
};

export default Index;
