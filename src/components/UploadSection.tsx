import { useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
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
  const { t, language } = useLanguage();

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
    <section className="py-12 md:py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground text-center mb-6">
          {t("upload.title")}
        </h2>

        {/* Upload Area */}
        <Card
          className={`
            relative border-2 border-dashed transition-all duration-300 cursor-pointer
            ${isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-border hover:border-primary/50 hover:bg-card/50"
            }
            ${isProcessing ? "pointer-events-none" : ""}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <label className="flex flex-col items-center justify-center p-8 md:p-12 cursor-pointer touch-manipulation">
            {isProcessing ? (
              <>
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                <p className="text-base font-medium text-foreground mb-3">{processingText}</p>
                <div className="w-full max-w-xs">
                  <Progress value={progress} className="h-2" />
                </div>
              </>
            ) : (
              <>
                <Upload className={`w-10 h-10 mb-3 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-base font-medium text-foreground">
                  <span className="hidden md:inline">{t("upload.dragOrClick")}</span>
                  <span className="md:hidden">{t("upload.clickToUpload")}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{t("upload.formats")}</p>
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
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                {t("upload.uploaded")} {previews.length} {t("upload.images")}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-sm px-3"
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
                  className="relative group aspect-[9/16] rounded-lg overflow-hidden bg-muted"
                >
                  <img
                    src={preview}
                    alt={`${t("upload.screenshot")} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
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
