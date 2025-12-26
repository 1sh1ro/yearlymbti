import { Check, Loader2, Circle, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import type { AnalysisStage, ExtractedAppData, MBTIConfidence } from "@/lib/api/analyze";

interface AnalysisProgressProps {
  stages: AnalysisStage[];
  onEditData?: () => void;
  onReanalyze?: (mode: 'strict' | 'loose') => void;
}

const stageConfig = [
  { id: 1, name: "识别来源", description: "识别截图的App和年份" },
  { id: 2, name: "数据抽取", description: "提取关键数据指标" },
  { id: 3, name: "亮点洞察", description: "生成有趣的数据洞察" },
  { id: 4, name: "MBTI 推断", description: "分析数字人格" },
  { id: 5, name: "报告生成", description: "生成年度感言" },
];

const AnalysisProgress = ({ stages, onEditData, onReanalyze }: AnalysisProgressProps) => {
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set());
  const [likedInsights, setLikedInsights] = useState<Set<number>>(new Set());
  const [dislikedInsights, setDislikedInsights] = useState<Set<number>>(new Set());

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
        return <Check className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const renderStageContent = (stageId: number) => {
    const data = getStageData(stageId);
    if (!data) return null;

    switch (stageId) {
      case 1: {
        const sourceData = data as { count: number; sources: { app: string; year: string }[]; summary: string };
        return (
          <div className="text-sm space-y-2">
            <p className="text-foreground font-medium">{sourceData.summary}</p>
            <div className="flex flex-wrap gap-2">
              {sourceData.sources?.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-secondary rounded text-xs">
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
          <div className="text-sm space-y-3">
            {extractData.extractedData?.map((app, i) => (
              <div key={i} className="border-b border-border/50 pb-2 last:border-0">
                <p className="font-medium text-foreground mb-1">{app.app}</p>
                <div className="grid grid-cols-2 gap-1">
                  {app.metrics?.slice(0, 4).map((m, j) => (
                    <span key={j} className="text-xs text-muted-foreground">
                      {m.label}: <span className="text-foreground">{m.value}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {onEditData && (
              <Button variant="outline" size="sm" onClick={onEditData} className="w-full mt-2">
                <AlertCircle className="w-4 h-4 mr-2" />
                数据抽取有误？手动编辑
              </Button>
            )}
          </div>
        );
      }
      case 3: {
        const insightData = data as { highlights: { icon: string; label: string; value: string; subtext?: string }[] };
        return (
          <div className="text-sm space-y-2">
            {insightData.highlights?.map((h, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-3 bg-secondary/50 rounded">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-foreground truncate">{h.label}</span>
                    <span className="text-primary font-medium shrink-0">{h.value}</span>
                  </div>
                  {h.subtext && (
                    <p className="text-xs text-muted-foreground mt-1 leading-snug break-words">
                      {h.subtext}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => toggleLike(i)}
                    className={`p-1 rounded hover:bg-secondary ${likedInsights.has(i) ? 'text-primary' : 'text-muted-foreground'}`}
                    aria-label="点赞"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleDislike(i)}
                    className={`p-1 rounded hover:bg-secondary ${dislikedInsights.has(i) ? 'text-destructive' : 'text-muted-foreground'}`}
                    aria-label="不喜欢"
                  >
                    <ThumbsDown className="w-4 h-4" />
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
        return (
          <div className="text-sm space-y-3">
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">{mbtiData.type}</span>
              <p className="text-muted-foreground">{mbtiData.title}</p>
            </div>
            {mbtiData.confidence && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(mbtiData.confidence).map(([key, val]) => (
                  <div key={key} className="bg-secondary/50 p-2 rounded text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{val.letter}</span>
                      <span className={val.confidence > 0.7 ? 'text-green-500' : val.confidence > 0.5 ? 'text-yellow-500' : 'text-red-500'}>
                        {Math.round(val.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">{val.reason}</p>
                  </div>
                ))}
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

  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold text-lg text-foreground mb-4">分析进度</h3>
      
      {stageConfig.map((stage) => {
        const status = getStageStatus(stage.id);
        const isExpanded = expandedStages.has(stage.id);
        const hasData = getStageData(stage.id);
        
        return (
          <Collapsible key={stage.id} open={isExpanded} onOpenChange={() => hasData && toggleStage(stage.id)}>
            <div className={`rounded-lg border ${status === 'processing' ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <CollapsibleTrigger asChild disabled={!hasData}>
                <button className="w-full p-3 flex items-center justify-between text-left">
                  <div className="flex items-center gap-3">
                    {renderStatusIcon(status)}
                    <div>
                      <p className="font-medium text-foreground">{stage.name}</p>
                      <p className="text-xs text-muted-foreground">{stage.description}</p>
                    </div>
                  </div>
                  {hasData && (
                    isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-3 pb-3 pt-0">
                  {renderStageContent(stage.id)}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        );
      })}

      {hasCompletedStage2 && onReanalyze && (
        <div className="pt-3 border-t border-border space-y-2">
          <p className="text-sm text-muted-foreground text-center">分析不满意？</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onReanalyze('strict')}>
              更严格分析
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onReanalyze('loose')}>
              更宽松分析
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AnalysisProgress;
