import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";
import type { ExtractedAppData } from "@/lib/api/analyze";

interface DataEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extractedData: ExtractedAppData[];
  onSave: (data: ExtractedAppData[]) => void;
}

const DataEditDialog = ({ open, onOpenChange, extractedData, onSave }: DataEditDialogProps) => {
  const [data, setData] = useState<ExtractedAppData[]>(extractedData);

  const updateMetric = (appIndex: number, metricIndex: number, field: 'label' | 'value', value: string) => {
    const newData = [...data];
    newData[appIndex].metrics[metricIndex][field] = value;
    setData(newData);
  };

  const removeMetric = (appIndex: number, metricIndex: number) => {
    const newData = [...data];
    newData[appIndex].metrics.splice(metricIndex, 1);
    setData(newData);
  };

  const addMetric = (appIndex: number) => {
    const newData = [...data];
    newData[appIndex].metrics.push({ label: "", value: "", type: "other" });
    setData(newData);
  };

  const handleSave = () => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>编辑提取的数据</DialogTitle>
          <DialogDescription>
            修正AI识别错误的数据，这将影响后续的亮点生成和MBTI推断
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {data.map((app, appIndex) => (
            <div key={appIndex} className="space-y-3">
              <h4 className="font-medium text-foreground">{app.app}</h4>
              <div className="space-y-2">
                {app.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <Label className="sr-only">标签</Label>
                      <Input
                        placeholder="指标名称"
                        value={metric.label}
                        onChange={(e) => updateMetric(appIndex, metricIndex, 'label', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="sr-only">值</Label>
                      <Input
                        placeholder="数值"
                        value={metric.value}
                        onChange={(e) => updateMetric(appIndex, metricIndex, 'value', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMetric(appIndex, metricIndex)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addMetric(appIndex)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加指标
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>
            保存并重新分析
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DataEditDialog;
