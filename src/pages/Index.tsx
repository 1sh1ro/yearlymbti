import { useState, useCallback } from "react";
import { Twitter, Github } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import AppMarquee from "@/components/AppMarquee";
import UploadSection from "@/components/UploadSection";
import StyleSelector, { type ReportStyle } from "@/components/StyleSelector";
import GenerateButton from "@/components/GenerateButton";
import ReportPreview from "@/components/ReportPreview";
import AnalysisProgress from "@/components/AnalysisProgress";
import DataEditDialog from "@/components/DataEditDialog";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t } = useLanguage();

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
            title: t("generate.success"),
            description: t("generate.successDesc"),
          });
        },
        onError: (error) => {
          setIsGenerating(false);
          toast({
            title: t("generate.error"),
            description: error,
            variant: "destructive",
          });
        },
      }, strictMode);
    } catch (error) {
      console.error('Error generating report:', error);
      setIsGenerating(false);
      toast({
        title: t("generate.error"),
        description: error instanceof Error ? error.message : t("generate.retry"),
        variant: "destructive",
      });
    }
  }, [images, selectedStyle, toast, t]);

  const handleGenerate = () => startAnalysis('normal');

  const handleReanalyze = (mode: 'strict' | 'loose') => {
    startAnalysis(mode);
  };

  const handleEditData = () => {
    setEditDialogOpen(true);
  };

  const handleSaveEditedData = useCallback((newData: ExtractedAppData[]) => {
    setExtractedData(newData);
    toast({
      title: t("edit.dataSaved"),
      description: t("edit.dataSavedDesc"),
    });
    startAnalysis('normal');
  }, [t, toast, startAnalysis]);

  return (
    <main className="min-h-screen bg-background">
      {/* Social Links - Top Left */}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
        <a
          href="https://x.com/xulaswa/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90 transition-colors"
        >
          <Twitter className="w-4 h-4" />
        </a>
        <a
          href="https://github.com/xulaswa"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90 transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>
      </div>
      <LanguageSwitcher />
      <HeroSection />
      <AppMarquee />
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
          {t("footer.copyright").replace("{year}", String(new Date().getFullYear()))}
        </p>
      </footer>
    </main>
  );
};

export default Index;
