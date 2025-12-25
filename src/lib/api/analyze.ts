import { supabase } from "@/integrations/supabase/client";
import type { ReportStyle } from "@/components/StyleSelector";

export interface ReportHighlight {
  icon: string;
  label: string;
  value: string;
  subtext?: string;
}

export interface ReportMBTI {
  type: string;
  title: string;
  traits: string[];
  explanation: string;
}

export interface ReportData {
  totalApps: number;
  highlights: ReportHighlight[];
  summary: string;
  apps?: string[];
  mbti?: ReportMBTI;
}

export async function analyzeReports(
  images: File[],
  style: ReportStyle
): Promise<ReportData> {
  // Convert images to base64
  const base64Images = await Promise.all(
    images.map(async (file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })
  );

  const { data, error } = await supabase.functions.invoke('analyze-reports', {
    body: { images: base64Images, style },
  });

  if (error) {
    console.error('Error calling analyze-reports:', error);
    throw new Error(error.message || '分析失败');
  }

  if (!data?.success) {
    throw new Error(data?.error || '分析失败');
  }

  return data.report;
}
