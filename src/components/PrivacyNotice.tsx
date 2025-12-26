import { Shield, Trash2, Lock, Eye } from "lucide-react";

const PrivacyNotice = () => {
  return (
    <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">隐私承诺</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <Lock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/70" />
          <span>图片仅在浏览器端压缩后上传分析，分析完成后立即删除</span>
        </div>
        <div className="flex items-start gap-2">
          <Eye className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/70" />
          <span>不存储任何原始截图，不用于 AI 模型训练</span>
        </div>
        <div className="flex items-start gap-2">
          <Trash2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary/70" />
          <span>生成结果仅保留在你的浏览器中，刷新页面即清除</span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
