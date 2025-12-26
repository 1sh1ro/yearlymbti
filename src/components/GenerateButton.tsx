import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface GenerateButtonProps {
  disabled: boolean;
  isLoading: boolean;
  onClick: () => void;
}

const GenerateButton = ({ disabled, isLoading, onClick }: GenerateButtonProps) => {
  const { t } = useLanguage();

  return (
    <section className="py-8 md:py-10 px-6">
      <div className="max-w-md mx-auto">
        <Button
          size="lg"
          disabled={disabled || isLoading}
          onClick={onClick}
          className={`
            w-full h-14 text-base font-bold rounded-2xl transition-all duration-300 
            ${!disabled && !isLoading 
              ? "bg-gradient-to-r from-primary via-primary to-cyan-500 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]" 
              : ""
            }
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t("generate.loading")}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              {t("generate.button")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
        
        {disabled && !isLoading && (
          <p className="text-sm text-muted-foreground text-center mt-4 animate-pulse-subtle">
            {t("generate.hint")}
          </p>
        )}
      </div>
    </section>
  );
};

export default GenerateButton;
