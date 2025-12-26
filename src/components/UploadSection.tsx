import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { compressImage, formatFileSize } from "@/lib/imageCompression";

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
      
      setProcessingText(`正在压缩 ${i + 1}/${imageFiles.length}`);
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
        // If compression fails, use original file
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
      title: "上传成功",
      description: savedPercent > 5 
        ? `已添加 ${newFiles.length} 张，压缩节省 ${formatFileSize(savedSize)} (${savedPercent}%)`
        : `已添加 ${newFiles.length} 张截图`,
    });
  }, [images, previews, onImagesChange, toast]);

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
    <section className="py-8 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg md:text-xl font-semibold text-foreground text-center mb-4">
          上传截图
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
          <label className="flex flex-col items-center justify-center p-5 md:p-8 cursor-pointer touch-manipulation">
            {isProcessing ? (
              <>
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                <p className="text-sm font-medium text-foreground mb-2">{processingText}</p>
                <div className="w-full max-w-[200px]">
                  <Progress value={progress} className="h-1.5" />
                </div>
              </>
            ) : (
              <>
                <Upload className={`w-8 h-8 mb-2 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                <p className="text-sm font-medium text-foreground">
                  <span className="hidden md:inline">拖拽或</span>点击上传
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG、JPG、WEBP</p>
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
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">已上传 {previews.length} 张</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => {
                  previews.forEach(p => URL.revokeObjectURL(p));
                  setImages([]);
                  setPreviews([]);
                  onImagesChange([]);
                }}
              >
                清空
              </Button>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {previews.map((preview, index) => (
                <div 
                  key={index}
                  className="relative group aspect-[9/16] rounded-md overflow-hidden bg-muted"
                >
                  <img
                    src={preview}
                    alt={`截图 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
