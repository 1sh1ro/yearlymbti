import { Sparkles, Loader2 } from "lucide-react";
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
          className="w-full h-14 text-base font-semibold"
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
            </>
          )}
        </Button>
        
        {disabled && !isLoading && (
          <p className="text-sm text-muted-foreground text-center mt-3">
            {t("generate.hint")}
          </p>
        )}
      </div>
    </section>
  );
};

export default GenerateButton;
