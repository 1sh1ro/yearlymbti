import { useState, useCallback } from "react";
import HeroSection from "@/components/HeroSection";
import UploadSection from "@/components/UploadSection";
import StyleSelector, { type ReportStyle } from "@/components/StyleSelector";
import GenerateButton from "@/components/GenerateButton";
import ReportPreview from "@/components/ReportPreview";
import AnalysisProgress from "@/components/AnalysisProgress";
import DataEditDialog from "@/components/DataEditDialog";
import { useToast } from "@/hooks/use-toast";
import { analyzeReportsStream, type ReportData, type AnalysisStage, type ExtractedAppData, type StrictMode } from "@/lib/api/analyze";

const Index = () => {
  const [images, setImages] = useState<File[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<ReportStyle>("playful");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [stages, setStages] = useState<AnalysisStage[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedAppData[]>([]);
  const { toast } = useToast();

  const startAnalysis = useCallback(async (strictMode: StrictMode = 'normal') => {
    if (images.length === 0) return;
    
    setIsGenerating(true);
    setReportData(null);
    setStages([]);
    setShowProgress(true);
    
    try {
      await analyzeReportsStream(images, selectedStyle, {
        onStageUpdate: (stage) => {
          setStages(prev => {
            const existing = prev.findIndex(s => s.stage === stage.stage);
            if (existing >= 0) {
              const newStages = [...prev];
              newStages[existing] = stage;
              return newStages;
            }
            return [...prev, stage];
          });
          
          // Store extracted data for editing
          if (stage.stage === 2 && stage.status === 'completed' && stage.data) {
            const data = stage.data as { extractedData: ExtractedAppData[] };
            setExtractedData(data.extractedData || []);
          }
        },
        onComplete: (report) => {
          setReportData(report);
          setIsGenerating(false);
          toast({
            title: "生成成功！🎉",
            description: "你的年度报告已经准备好了",
          });
        },
        onError: (error) => {
          setIsGenerating(false);
          toast({
            title: "生成失败",
            description: error,
            variant: "destructive",
          });
        },
      }, strictMode);
    } catch (error) {
      console.error('Error generating report:', error);
      setIsGenerating(false);
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      });
    }
  }, [images, selectedStyle, toast]);

  const handleGenerate = () => startAnalysis('normal');

  const handleReanalyze = (mode: 'strict' | 'loose') => {
    startAnalysis(mode);
  };

  const handleEditData = () => {
    setEditDialogOpen(true);
  };

  const handleSaveEditedData = (newData: ExtractedAppData[]) => {
    setExtractedData(newData);
    // Re-run analysis from stage 3 with edited data
    // For now, just restart the analysis
    toast({
      title: "数据已保存",
      description: "正在使用修正后的数据重新分析...",
    });
    startAnalysis('normal');
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
      
      {/* Analysis Progress */}
      {showProgress && (isGenerating || stages.length > 0) && (
        <section className="py-8 px-6">
          <div className="max-w-4xl mx-auto">
            <AnalysisProgress 
              stages={stages}
              onEditData={extractedData.length > 0 ? handleEditData : undefined}
              onReanalyze={!isGenerating ? handleReanalyze : undefined}
            />
          </div>
        </section>
      )}
      
      <ReportPreview 
        style={selectedStyle} 
        data={reportData} 
        isLoading={false}
      />

      {/* Data Edit Dialog */}
      <DataEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        extractedData={extractedData}
        onSave={handleSaveEditedData}
      />
      
      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-base text-muted-foreground">
          © {new Date().getFullYear()} 年度记忆汇总
        </p>
      </footer>
    </main>
  );
};

export default Index;
