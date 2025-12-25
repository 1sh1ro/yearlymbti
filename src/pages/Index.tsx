import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import UploadSection from "@/components/UploadSection";
import StyleSelector, { type ReportStyle } from "@/components/StyleSelector";
import GenerateButton from "@/components/GenerateButton";
import ReportPreview from "@/components/ReportPreview";
import { useToast } from "@/hooks/use-toast";
import { analyzeReports, type ReportData } from "@/lib/api/analyze";

const Index = () => {
  const [images, setImages] = useState<File[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<ReportStyle>("playful");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (images.length === 0) return;
    
    setIsGenerating(true);
    setReportData(null);
    
    try {
      const result = await analyzeReports(images, selectedStyle);
      setReportData(result);
      
      toast({
        title: "生成成功！🎉",
        description: "你的年度报告已经准备好了",
      });
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
      <ReportPreview 
        style={selectedStyle} 
        data={reportData} 
        isLoading={isGenerating}
      />
      
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
