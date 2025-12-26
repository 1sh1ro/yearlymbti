import { Check, Loader2, Circle, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, AlertCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import type { AnalysisStage, ExtractedAppData, MBTIConfidence } from "@/lib/api/analyze";

interface AnalysisProgressProps {
  stages: AnalysisStage[];
  onEditData?: () => void;
  onReanalyze?: (mode: 'strict' | 'loose') => void;
}

const stageConfig = [
  { id: 1, name: "识别来源", description: "识别截图的App和年份", icon: "🔍" },
  { id: 2, name: "数据抽取", description: "提取关键数据指标", icon: "📊" },
  { id: 3, name: "亮点洞察", description: "生成有趣的数据洞察", icon: "✨" },
  { id: 4, name: "MBTI 推断", description: "分析数字人格", icon: "🧠" },
  { id: 5, name: "报告生成", description: "生成年度感言", icon: "📝" },
];

const AnalysisProgress = ({ stages, onEditData, onReanalyze }: AnalysisProgressProps) => {
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set());
  const [likedInsights, setLikedInsights] = useState<Set<number>>(new Set());
  const [dislikedInsights, setDislikedInsights] = useState<Set<number>>(new Set());
  const [visibleStages, setVisibleStages] = useState<Set<number>>(new Set());

  // 动画：阶段逐个显示
  useEffect(() => {
    stageConfig.forEach((stage, index) => {
      setTimeout(() => {
        setVisibleStages(prev => new Set([...prev, stage.id]));
      }, index * 100);
    });
  }, []);

  const toggleStage = (stageId: number) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStages(newExpanded);
  };

  const toggleLike = (index: number) => {
    const newLiked = new Set(likedInsights);
    const newDisliked = new Set(dislikedInsights);
    if (newLiked.has(index)) {
      newLiked.delete(index);
    } else {
      newLiked.add(index);
      newDisliked.delete(index);
    }
    setLikedInsights(newLiked);
    setDislikedInsights(newDisliked);
  };

  const toggleDislike = (index: number) => {
    const newLiked = new Set(likedInsights);
    const newDisliked = new Set(dislikedInsights);
    if (newDisliked.has(index)) {
      newDisliked.delete(index);
    } else {
      newDisliked.add(index);
      newLiked.delete(index);
    }
    setLikedInsights(newLiked);
    setDislikedInsights(newDisliked);
  };

  const getStageStatus = (stageId: number) => {
    const stage = stages.find(s => s.stage === stageId);
    return stage?.status || 'pending';
  };

  const getStageData = (stageId: number) => {
    const stage = stages.find(s => s.stage === stageId);
    return stage?.data;
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-primary" />
            </div>
          </div>
        );
      case 'processing':
        return (
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Circle className="w-4 h-4 text-muted-foreground" />
          </div>
        );
    }
  };

  const renderStageContent = (stageId: number) => {
    const data = getStageData(stageId);
    if (!data) return null;

    switch (stageId) {
      case 1: {
        const sourceData = data as { count: number; sources: { app: string; year: string }[]; summary: string };
        return (
          <div className="text-sm space-y-3 animate-fade-in">
            <p className="text-foreground font-medium">{sourceData.summary}</p>
            <div className="flex flex-wrap gap-2">
              {sourceData.sources?.map((s, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium transition-all hover:bg-primary/20"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {s.app} ({s.year})
                </span>
              ))}
            </div>
          </div>
        );
      }
      case 2: {
        const extractData = data as { extractedData: ExtractedAppData[] };
        return (
          <div className="text-sm space-y-3 animate-fade-in">
            {extractData.extractedData?.map((app, i) => (
              <div 
                key={i} 
                className="p-3 rounded-lg bg-secondary/30 border border-border/50 transition-all hover:border-primary/30"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {app.app}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {app.metrics?.slice(0, 4).map((m, j) => (
                    <div key={j} className="text-xs bg-background/50 rounded px-2 py-1">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="text-foreground font-medium ml-1">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {onEditData && (
              <Button variant="outline" size="sm" onClick={onEditData} className="w-full mt-2 group">
                <AlertCircle className="w-4 h-4 mr-2 group-hover:text-primary transition-colors" />
                数据抽取有误？手动编辑
              </Button>
            )}
          </div>
        );
      }
      case 3: {
        const insightData = data as { highlights: { icon: string; label: string; value: string; subtext?: string }[] };
        return (
          <div className="text-sm space-y-2 animate-fade-in">
            {insightData.highlights?.map((h, i) => (
              <div 
                key={i} 
                className="flex items-start justify-between gap-3 p-3 bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-lg border border-border/30 transition-all hover:border-primary/30 hover:shadow-sm"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-foreground truncate">{h.label}</span>
                    <span className="text-primary font-bold shrink-0">{h.value}</span>
                  </div>
                  {h.subtext && (
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed break-words">
                      {h.subtext}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => toggleLike(i)}
                    className={`p-1.5 rounded-full transition-all ${likedInsights.has(i) ? 'text-primary bg-primary/20 scale-110' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
                    aria-label="点赞"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleDislike(i)}
                    className={`p-1.5 rounded-full transition-all ${dislikedInsights.has(i) ? 'text-destructive bg-destructive/20 scale-110' : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'}`}
                    aria-label="不喜欢"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      }
      case 4: {
        const mbtiData = data as { 
          type: string; 
          title: string; 
          confidence?: { 
            EI?: MBTIConfidence; 
            NS?: MBTIConfidence; 
            TF?: MBTIConfidence; 
            JP?: MBTIConfidence; 
          } 
        };
        
        const dimensionLabels: Record<string, { left: string; right: string; leftDesc: string; rightDesc: string }> = {
          EI: { left: 'E 外向', right: 'I 内向', leftDesc: '社交活跃、分享频繁', rightDesc: '独处偏好、深度阅读' },
          NS: { left: 'N 直觉', right: 'S 感知', leftDesc: '探索新事物、涉猎广泛', rightDesc: '专注实际、稳定偏好' },
          TF: { left: 'T 思考', right: 'F 情感', leftDesc: '知识/技术内容偏好', rightDesc: '娱乐/情感内容偏好' },
          JP: { left: 'J 判断', right: 'P 感知', leftDesc: '规律使用、计划型', rightDesc: '随性使用、即兴型' }
        };
        
        return (
          <div className="text-sm space-y-4 animate-fade-in">
            {/* MBTI 类型展示 */}
            <div className="text-center py-3">
              <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                <span className="text-3xl font-bold text-primary tracking-wider">{mbtiData.type}</span>
              </div>
              <p className="text-muted-foreground mt-2">{mbtiData.title}</p>
            </div>
            
            {/* 维度推断依据 */}
            {mbtiData.confidence && (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  仅基于行为数据的娱乐性推断，非专业测评
                </p>
                
                {Object.entries(mbtiData.confidence).map(([key, val], i) => {
                  const labels = dimensionLabels[key];
                  const isLeft = val.letter === key[0];
                  
                  return (
                    <div 
                      key={key} 
                      className="bg-secondary/30 p-4 rounded-xl border border-border/30 transition-all hover:border-primary/30 hover:bg-secondary/40"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {/* 维度标题和置信度 */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xl text-primary">{val.letter}</span>
                          <span className="text-xs text-muted-foreground">
                            {isLeft ? labels?.left : labels?.right}
                          </span>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          val.confidence > 0.7 ? 'bg-primary/20 text-primary' : 
                          val.confidence > 0.5 ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 
                          'bg-muted text-muted-foreground'
                        }`}>
                          {Math.round(val.confidence * 100)}% 置信
                        </div>
                      </div>
                      
                      {/* 双向进度条 */}
                      <div className="relative mb-3">
                        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                          <span className={isLeft ? 'text-primary font-medium' : ''}>{labels?.left}</span>
                          <span className={!isLeft ? 'text-primary font-medium' : ''}>{labels?.right}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                          {/* 中线 */}
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border z-10" />
                          {/* 进度条 */}
                          <div 
                            className="absolute top-0 bottom-0 bg-primary/80 rounded-full transition-all duration-500"
                            style={{ 
                              left: isLeft ? `${50 - val.confidence * 50}%` : '50%',
                              right: isLeft ? '50%' : `${50 - val.confidence * 50}%`,
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* 推断依据 */}
                      <div className="bg-background/50 rounded-lg p-2.5 border border-border/20">
                        <p className="text-xs text-muted-foreground flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{val.reason}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  const hasCompletedStage2 = getStageStatus(2) === 'completed';
  const currentProcessingStage = stages.find(s => s.status === 'processing')?.stage;
  const completedCount = stages.filter(s => s.status === 'completed').length;
  const progress = (completedCount / stageConfig.length) * 100;

  return (
    <Card className="p-5 space-y-4 overflow-hidden">
      {/* 标题和进度 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI 分析中
          </h3>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{stageConfig.length}
          </span>
        </div>
        {/* 总进度条 */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* 阶段列表 */}
      <div className="space-y-2">
        {stageConfig.map((stage, index) => {
          const status = getStageStatus(stage.id);
          const isExpanded = expandedStages.has(stage.id);
          const hasData = getStageData(stage.id);
          const isVisible = visibleStages.has(stage.id);
          const isProcessing = status === 'processing';
          
          return (
            <Collapsible 
              key={stage.id} 
              open={isExpanded} 
              onOpenChange={() => hasData && toggleStage(stage.id)}
            >
              <div 
                className={`rounded-xl border transition-all duration-300 ${
                  isProcessing 
                    ? 'border-primary/50 bg-primary/5 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)]' 
                    : status === 'completed'
                    ? 'border-primary/20 bg-primary/5'
                    : 'border-border bg-card'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <CollapsibleTrigger asChild disabled={!hasData}>
                  <button className="w-full p-3 flex items-center justify-between text-left group">
                    <div className="flex items-center gap-3">
                      {renderStatusIcon(status)}
                      <div className="flex-1">
                        <p className="font-medium text-foreground flex items-center gap-2">
                          <span className="text-lg">{stage.icon}</span>
                          {stage.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{stage.description}</p>
                      </div>
                    </div>
                    {hasData && (
                      <div className={`p-1 rounded-full transition-all ${isExpanded ? 'bg-primary/10' : 'group-hover:bg-secondary'}`}>
                        {isExpanded 
                          ? <ChevronUp className="w-4 h-4 text-primary" /> 
                          : <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                        }
                      </div>
                    )}
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-0 border-t border-border/50 mt-1">
                    <div className="pt-3">
                      {renderStageContent(stage.id)}
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      {hasCompletedStage2 && onReanalyze && (
        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-sm text-muted-foreground text-center">分析不满意？</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 group" onClick={() => onReanalyze('strict')}>
              更严格分析
            </Button>
            <Button variant="outline" size="sm" className="flex-1 group" onClick={() => onReanalyze('loose')}>
              更宽松分析
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AnalysisProgress;
