import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface UploadSectionProps {
  onImagesChange: (images: File[]) => void;
}

const UploadSection = ({ onImagesChange }: UploadSectionProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    });
    
    if (newFiles.length > 0) {
      const updatedImages = [...images, ...newFiles];
      const updatedPreviews = [...previews, ...newPreviews];
      setImages(updatedImages);
      setPreviews(updatedPreviews);
      onImagesChange(updatedImages);
      
      toast({
        title: "上传成功",
        description: `已添加 ${newFiles.length} 张截图`,
      });
    }
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
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            上传你的年度报告截图
          </h2>
          <p className="text-muted-foreground">
            支持微信读书、网易云音乐、B站、抖音、支付宝等各类 App 年度报告
          </p>
        </div>

        {/* Upload Area */}
        <Card
          className={`
            relative border-2 border-dashed transition-all duration-300 cursor-pointer
            ${isDragging 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-border hover:border-primary/50 hover:bg-card/50"
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all
              ${isDragging ? "bg-primary/20" : "bg-muted/50"}
            `}>
              <Upload className={`w-8 h-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
            </div>
            <p className="text-lg font-medium text-foreground mb-2">
              拖拽图片到这里，或点击上传
            </p>
            <p className="text-sm text-muted-foreground">
              支持 PNG、JPG、WEBP 格式
            </p>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </Card>

        {/* Preview Grid */}
        {previews.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                已上传 {previews.length} 张截图
              </h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  previews.forEach(p => URL.revokeObjectURL(p));
                  setImages([]);
                  setPreviews([]);
                  onImagesChange([]);
                }}
              >
                清空全部
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div 
                  key={index}
                  className="relative group aspect-[9/16] rounded-lg overflow-hidden bg-muted"
                >
                  <img
                    src={preview}
                    alt={`截图 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 text-xs text-primary-foreground bg-secondary/80 backdrop-blur px-2 py-1 rounded">
                      <ImageIcon className="w-3 h-3" />
                      <span className="truncate">{images[index]?.name}</span>
                    </div>
                  </div>
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
