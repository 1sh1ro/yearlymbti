import { useState, useCallback } from "react";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { compressImage, formatFileSize } from "@/lib/imageCompression";
import { useLanguage } from "@/contexts/LanguageContext";
import PrivacyNotice from "./PrivacyNotice";

interface UploadSectionProps {
  onImagesChange: (images: File[]) => void;
}

const UploadSection = ({ onImagesChange }: UploadSectionProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingText, setProcessingText] = useState("");
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setIsProcessing(true);
    setProgress(0);
    
    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    
    if (imageFiles.length === 0) {
      setIsProcessing(false);
      return;
    }

    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    let totalOriginalSize = 0;
    let totalCompressedSize = 0;
    
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      totalOriginalSize += file.size;
      
      setProcessingText(`${t("upload.compressing")} ${i + 1}/${imageFiles.length}`);
      setProgress(Math.round(((i + 0.5) / imageFiles.length) * 100));
      
      try {
        const compressedFile = await compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1920,
          quality: 0.8,
        });
        
        totalCompressedSize += compressedFile.size;
        newFiles.push(compressedFile);
        newPreviews.push(URL.createObjectURL(compressedFile));
      } catch (error) {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
        totalCompressedSize += file.size;
      }
      
      setProgress(Math.round(((i + 1) / imageFiles.length) * 100));
    }
    
    const updatedImages = [...images, ...newFiles];
    const updatedPreviews = [...previews, ...newPreviews];
    setImages(updatedImages);
    setPreviews(updatedPreviews);
    onImagesChange(updatedImages);
    
    setIsProcessing(false);
    setProgress(0);
    setProcessingText("");
    
    const savedSize = totalOriginalSize - totalCompressedSize;
    const savedPercent = totalOriginalSize > 0 ? Math.round((savedSize / totalOriginalSize) * 100) : 0;
    
    toast({
      title: t("upload.success"),
      description: savedPercent > 5 
        ? t("upload.successDesc")
            .replace("{count}", String(newFiles.length))
            .replace("{saved}", formatFileSize(savedSize))
            .replace("{percent}", String(savedPercent))
        : t("upload.successSimple").replace("{count}", String(newFiles.length)),
    });
  }, [images, previews, onImagesChange, toast, t]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    URL.revokeObjectURL(previews[index]);
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  return (
    <section className="py-8 md:py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            {t("upload.title")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("upload.formats")}
          </p>
        </div>

        {/* Upload Area */}
        <Card
          className={`
            relative border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
            ${isDragging 
              ? "border-primary bg-primary/10 scale-[1.02] shadow-lg shadow-primary/20" 
              : "border-border/60 hover:border-primary/50 hover:bg-card/80 hover:shadow-md"
            }
            ${isProcessing ? "pointer-events-none" : ""}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          
          <label className="relative flex flex-col items-center justify-center p-8 md:p-10 cursor-pointer touch-manipulation">
            {isProcessing ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <p className="text-base font-medium text-foreground mb-4">{processingText}</p>
                <div className="w-full max-w-xs">
                  <Progress value={progress} className="h-2" />
                </div>
              </>
            ) : (
              <>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  isDragging 
                    ? "bg-primary/20 scale-110" 
                    : "bg-gradient-to-br from-primary/10 to-primary/5"
                }`}>
                  <ImagePlus className={`w-8 h-8 transition-colors ${isDragging ? "text-primary" : "text-primary/70"}`} />
                </div>
                <p className="text-base font-semibold text-foreground mb-1">
                  <span className="hidden md:inline">{t("upload.dragOrClick")}</span>
                  <span className="md:hidden">{t("upload.clickToUpload")}</span>
                </p>
                <p className="text-sm text-muted-foreground">{t("upload.formats")}</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={isProcessing}
            />
          </label>
        </Card>

        {/* Preview Grid */}
        {previews.length > 0 && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">
                {t("upload.uploaded")} {previews.length} {t("upload.images")}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-sm px-3 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  previews.forEach(p => URL.revokeObjectURL(p));
                  setImages([]);
                  setPreviews([]);
                  onImagesChange([]);
                }}
              >
                {t("upload.clear")}
              </Button>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {previews.map((preview, index) => (
                <div 
                  key={index}
                  className="relative group aspect-[9/16] rounded-xl overflow-hidden bg-muted shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={preview}
                    alt={`${t("upload.screenshot")} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <PrivacyNotice />
      </div>
    </section>
  );
};

export default UploadSection;
