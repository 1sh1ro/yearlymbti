import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GenerateButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

const GenerateButton = ({ disabled, isLoading, onClick }: GenerateButtonProps) => {
  return (
    <section className="py-6 px-4">
      <div className="max-w-xs mx-auto">
        <Button
          size="lg"
          disabled={disabled || isLoading}
          onClick={onClick}
          className="w-full h-11 text-sm font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              生成年度报告
            </>
          )}
        </Button>
        
        {disabled && !isLoading && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            请先上传截图
          </p>
        )}
      </div>
    </section>
  );
};

export default GenerateButton;
