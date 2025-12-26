import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "zh" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  zh: {
    // Hero Section
    "hero.badge": "AI 年度记忆汇总",
    "hero.title.1": "你的年度故事",
    "hero.title.2": "，一键汇总",
    "hero.subtitle": "上传 App 年度报告截图，AI 帮你生成独一无二的年度总结",
    
    // Upload Section
    "upload.title": "上传截图",
    "upload.dragOrClick": "拖拽或点击上传",
    "upload.clickToUpload": "点击上传",
    "upload.formats": "PNG、JPG、WEBP",
    "upload.compressing": "正在压缩",
    "upload.uploaded": "已上传",
    "upload.images": "张",
    "upload.clear": "清空",
    "upload.success": "上传成功",
    "upload.successDesc": "已添加 {count} 张，压缩节省 {saved} ({percent}%)",
    "upload.successSimple": "已添加 {count} 张截图",
    "upload.screenshot": "截图",
    
    // Privacy Notice
    "privacy.title": "隐私承诺",
    "privacy.item1": "图片仅在浏览器端压缩后上传分析，分析完成后立即删除",
    "privacy.item2": "不存储任何原始截图，不用于 AI 模型训练",
    "privacy.item3": "生成结果仅保留在你的浏览器中，刷新页面即清除",
    
    // Style Selector
    "style.title": "选择风格",
    "style.playful": "活力趣味",
    "style.playful.desc": "色彩缤纷，充满活力的风格",
    "style.minimal": "简约清新",
    "style.minimal.desc": "干净利落，极简主义",
    "style.retro": "复古怀旧",
    "style.retro.desc": "温暖怀旧的复古风格",
    "style.tech": "科技未来",
    "style.tech.desc": "赛博朋克，未来感十足",
    "style.artistic": "艺术水彩",
    "style.artistic.desc": "柔和的水彩艺术风格",
    
    // Generate Button
    "generate.button": "生成我的年度报告",
    "generate.loading": "AI 分析中...",
    "generate.hint": "请先上传截图",
    "generate.success": "生成成功！🎉",
    "generate.successDesc": "你的年度报告已经准备好了",
    "generate.error": "生成失败",
    "generate.retry": "请稍后重试",
    
    // Analysis Progress
    "analysis.title": "AI 分析中",
    "analysis.stage1.name": "识别来源",
    "analysis.stage1.desc": "识别截图的App和年份",
    "analysis.stage2.name": "数据抽取",
    "analysis.stage2.desc": "提取关键数据指标",
    "analysis.stage3.name": "亮点洞察",
    "analysis.stage3.desc": "生成有趣的数据洞察",
    "analysis.stage4.name": "MBTI 推断",
    "analysis.stage4.desc": "分析数字人格",
    "analysis.stage5.name": "报告生成",
    "analysis.stage5.desc": "生成年度感言",
    "analysis.editData": "数据抽取有误？手动编辑",
    "analysis.reanalyze": "不满意？",
    "analysis.strictMode": "严格模式（更精确）",
    "analysis.looseMode": "宽松模式（更创意）",
    "analysis.mbtiDisclaimer": "仅基于行为数据的娱乐性推断，非专业测评",
    "analysis.confidence": "置信",
    "analysis.EI.left": "E 外向",
    "analysis.EI.right": "I 内向",
    "analysis.NS.left": "N 直觉",
    "analysis.NS.right": "S 感知",
    "analysis.TF.left": "T 思考",
    "analysis.TF.right": "F 情感",
    "analysis.JP.left": "J 判断",
    "analysis.JP.right": "P 感知",
    
    // Report Preview
    "report.title": "🎉 你的年度报告",
    "report.preview": "预览效果",
    "report.yearSummary": "2025 年度总结",
    "report.fromApps": "来自 {count} 个 App",
    "report.aiComment": "✨ AI 年度感言",
    "report.mbtiTitle": "🧠 年度 MBTI",
    "report.analyzing": "AI 正在分析...",
    "report.wait": "请稍候 30-60 秒",
    
    // Share Card
    "share.title": "分享卡片",
    "share.download": "下载图片",
    "share.saved": "已保存",
    "share.downloadSuccess": "下载成功",
    "share.downloadSuccessDesc": "分享卡片已保存到本地",
    "share.downloadError": "下载失败",
    "share.downloadErrorDesc": "请稍后重试",
    "share.myReport": "我的",
    "share.yearReport": "2025 年度报告",
    "share.fromApps": "来自 {count} 个 App 的记忆",
    "share.scanHint": "扫码生成你的专属报告",
    "share.saveHint": "长按保存或点击下载，分享到朋友圈、小红书",
    
    // Data Edit Dialog
    "edit.title": "编辑提取的数据",
    "edit.desc": "修正AI识别错误的数据，这将影响后续的亮点生成和MBTI推断",
    "edit.metricName": "指标名称",
    "edit.metricValue": "数值",
    "edit.addMetric": "添加指标",
    "edit.cancel": "取消",
    "edit.saveAndReanalyze": "保存并重新分析",
    "edit.dataSaved": "数据已保存",
    "edit.dataSavedDesc": "正在使用修正后的数据重新分析...",
    
    // Footer
    "footer.copyright": "© {year} 年度记忆汇总",
    
    // Language
    "lang.switch": "English",
  },
  en: {
    // Hero Section
    "hero.badge": "AI Annual Memory Summary",
    "hero.title.1": "Your Year in Review",
    "hero.title.2": ", One Click",
    "hero.subtitle": "Upload your app annual report screenshots, let AI generate your unique year-end summary",
    
    // Upload Section
    "upload.title": "Upload Screenshots",
    "upload.dragOrClick": "Drag or click to upload",
    "upload.clickToUpload": "Click to upload",
    "upload.formats": "PNG, JPG, WEBP",
    "upload.compressing": "Compressing",
    "upload.uploaded": "Uploaded",
    "upload.images": "images",
    "upload.clear": "Clear",
    "upload.success": "Upload Success",
    "upload.successDesc": "Added {count}, saved {saved} ({percent}%)",
    "upload.successSimple": "Added {count} screenshots",
    "upload.screenshot": "Screenshot",
    
    // Privacy Notice
    "privacy.title": "Privacy Promise",
    "privacy.item1": "Images are compressed in browser before upload, deleted immediately after analysis",
    "privacy.item2": "No original screenshots stored, not used for AI training",
    "privacy.item3": "Results only saved in your browser, cleared on refresh",
    
    // Style Selector
    "style.title": "Choose Style",
    "style.playful": "Playful",
    "style.playful.desc": "Colorful and vibrant style",
    "style.minimal": "Minimal",
    "style.minimal.desc": "Clean and minimalist",
    "style.retro": "Retro",
    "style.retro.desc": "Warm and nostalgic vintage style",
    "style.tech": "Tech",
    "style.tech.desc": "Cyberpunk, futuristic vibes",
    "style.artistic": "Artistic",
    "style.artistic.desc": "Soft watercolor art style",
    
    // Generate Button
    "generate.button": "Generate My Annual Report",
    "generate.loading": "AI Analyzing...",
    "generate.hint": "Please upload screenshots first",
    "generate.success": "Success! 🎉",
    "generate.successDesc": "Your annual report is ready",
    "generate.error": "Generation Failed",
    "generate.retry": "Please try again later",
    
    // Analysis Progress
    "analysis.title": "AI Analyzing",
    "analysis.stage1.name": "Source Detection",
    "analysis.stage1.desc": "Identifying apps and years from screenshots",
    "analysis.stage2.name": "Data Extraction",
    "analysis.stage2.desc": "Extracting key metrics",
    "analysis.stage3.name": "Insight Generation",
    "analysis.stage3.desc": "Creating interesting insights",
    "analysis.stage4.name": "MBTI Inference",
    "analysis.stage4.desc": "Analyzing digital personality",
    "analysis.stage5.name": "Report Generation",
    "analysis.stage5.desc": "Generating year-end summary",
    "analysis.editData": "Data incorrect? Edit manually",
    "analysis.reanalyze": "Not satisfied?",
    "analysis.strictMode": "Strict Mode (More Precise)",
    "analysis.looseMode": "Loose Mode (More Creative)",
    "analysis.mbtiDisclaimer": "Entertainment-only inference based on behavior data, not professional assessment",
    "analysis.confidence": "confidence",
    "analysis.EI.left": "E Extrovert",
    "analysis.EI.right": "I Introvert",
    "analysis.NS.left": "N Intuitive",
    "analysis.NS.right": "S Sensing",
    "analysis.TF.left": "T Thinking",
    "analysis.TF.right": "F Feeling",
    "analysis.JP.left": "J Judging",
    "analysis.JP.right": "P Perceiving",
    
    // Report Preview
    "report.title": "🎉 Your Annual Report",
    "report.preview": "Preview",
    "report.yearSummary": "2025 Year in Review",
    "report.fromApps": "From {count} Apps",
    "report.aiComment": "✨ AI Year-End Message",
    "report.mbtiTitle": "🧠 Annual MBTI",
    "report.analyzing": "AI Analyzing...",
    "report.wait": "Please wait 30-60 seconds",
    
    // Share Card
    "share.title": "Share Card",
    "share.download": "Download",
    "share.saved": "Saved",
    "share.downloadSuccess": "Download Success",
    "share.downloadSuccessDesc": "Share card saved locally",
    "share.downloadError": "Download Failed",
    "share.downloadErrorDesc": "Please try again later",
    "share.myReport": "My",
    "share.yearReport": "2025 Annual Report",
    "share.fromApps": "Memories from {count} Apps",
    "share.scanHint": "Scan to generate your own report",
    "share.saveHint": "Long press to save or click download to share",
    
    // Data Edit Dialog
    "edit.title": "Edit Extracted Data",
    "edit.desc": "Correct AI recognition errors, this will affect highlights and MBTI inference",
    "edit.metricName": "Metric Name",
    "edit.metricValue": "Value",
    "edit.addMetric": "Add Metric",
    "edit.cancel": "Cancel",
    "edit.saveAndReanalyze": "Save & Re-analyze",
    "edit.dataSaved": "Data Saved",
    "edit.dataSavedDesc": "Re-analyzing with corrected data...",
    
    // Footer
    "footer.copyright": "© {year} Annual Memory Summary",
    
    // Language
    "lang.switch": "中文",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved === "en" || saved === "zh") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
