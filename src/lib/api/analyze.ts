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

export interface ExtractedMetric {
  label: string;
  value: string;
  type: string;
}

export interface ExtractedAppData {
  app: string;
  metrics: ExtractedMetric[];
}

export interface MBTIConfidence {
  letter: string;
  confidence: number;
  reason: string;
}

export interface ReportData {
  totalApps: number;
  highlights: ReportHighlight[];
  summary: string;
  apps?: string[];
  mbti?: ReportMBTI;
  extractedData?: ExtractedAppData[];
  confidence?: {
    EI?: MBTIConfidence;
    NS?: MBTIConfidence;
    TF?: MBTIConfidence;
    JP?: MBTIConfidence;
  };
}

export interface AnalysisStage {
  stage: number;
  name: string;
  status: 'pending' | 'processing' | 'completed';
  data?: unknown;
}

export interface AnalysisCallbacks {
  onStageUpdate: (stage: AnalysisStage) => void;
  onComplete: (report: ReportData) => void;
  onError: (error: string) => void;
}

export type StrictMode = 'normal' | 'strict' | 'loose';

export async function analyzeReportsStream(
  images: File[],
  style: ReportStyle,
  callbacks: AnalysisCallbacks,
  strictMode: StrictMode = 'normal'
): Promise<void> {
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

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-reports`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ images: base64Images, style, strictMode }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(errorData.error || '分析失败');
  }

  if (!response.body) {
    throw new Error('流式响应不可用');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    // Process complete SSE messages
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    let currentEvent = '';
    for (const line of lines) {
      if (line.startsWith('event: ')) {
        currentEvent = line.slice(7).trim();
      } else if (line.startsWith('data: ')) {
        const dataStr = line.slice(6);
        try {
          const data = JSON.parse(dataStr);
          
          if (currentEvent === 'stage') {
            callbacks.onStageUpdate(data as AnalysisStage);
          } else if (currentEvent === 'complete') {
            callbacks.onComplete(data.report as ReportData);
          } else if (currentEvent === 'error') {
            callbacks.onError(data.error);
          }
        } catch (e) {
          console.error('Failed to parse SSE data:', e);
        }
      }
    }
  }
}

// Keep backward compatible function
export async function analyzeReports(
  images: File[],
  style: ReportStyle
): Promise<ReportData> {
  return new Promise((resolve, reject) => {
    analyzeReportsStream(images, style, {
      onStageUpdate: () => {},
      onComplete: resolve,
      onError: (error) => reject(new Error(error)),
    });
  });
}
