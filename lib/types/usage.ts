export type ROIGrade = 'A' | 'B' | 'C' | 'D' | 'F';
export type RecommendAction = 'keep' | 'review' | 'downgrade' | 'share' | 'cancel';
export type BenchmarkLevel = 'heavy' | 'average' | 'below' | 'minimal';

export interface WeeklyUsage {
  id: string;
  subscriptionId: string;
  weekStartDate: string;
  usageMinutes: number;
  inputMethod: 'manual' | 'csv' | 'feeling';
  createdAt: string;
}

export interface ROIAnalysis {
  subscriptionId: string;
  subscriptionName: string;
  icon: string;
  monthlyPrice: number;
  weeklyUsageMinutes: number;
  monthlyUsageMinutes: number;
  costPerMinute: number;
  grade: ROIGrade;
  recommendation: RecommendAction;
  recommendationReason: string;
  potentialSavings: number;
}

export interface BenchmarkResult {
  level: BenchmarkLevel;
  percentOfAverage: number;
  averageMinutes: number;
  userMinutes: number;
  feedback: string;
  isVerified: boolean;
}

export const ROI_GRADE_CONFIG: Record<
  ROIGrade,
  { label: string; color: string; bgColor: string; emoji: string }
> = {
  A: {
    label: '훌륭한 가성비',
    color: '#22c55e',
    bgColor: '#f0fdf4',
    emoji: '🟢',
  },
  B: {
    label: '괜찮음',
    color: '#eab308',
    bgColor: '#fefce8',
    emoji: '🟡',
  },
  C: {
    label: '비효율적',
    color: '#f97316',
    bgColor: '#fff7ed',
    emoji: '🟠',
  },
  D: {
    label: '해지 추천',
    color: '#ef4444',
    bgColor: '#fef2f2',
    emoji: '🔴',
  },
  F: {
    label: '미사용',
    color: '#1f2937',
    bgColor: '#f3f4f6',
    emoji: '⚫',
  },
};
