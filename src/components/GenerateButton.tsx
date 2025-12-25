import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

const GenerateButton = ({ disabled, isLoading, onClick }: GenerateButtonProps) => {
  return (
    <section className="py-12 px-4">
      <div className="max-w-md mx-auto text-center">
        <Button
          size="lg"
          disabled={disabled || isLoading}
          onClick={onClick}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-chart-2 to-chart-1 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              AI 正在分析中...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              生成我的年度报告
            </>
          )}
        </Button>
        
        {disabled && !isLoading && (
          <p className="text-sm text-muted-foreground mt-3">
            请先上传至少一张年度报告截图
          </p>
        )}
      </div>
    </section>
  );
};

export default GenerateButton;
