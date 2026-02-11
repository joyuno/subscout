export type SubscriptionCategory =
  | 'video'
  | 'music'
  | 'cloud'
  | 'productivity'
  | 'shopping'
  | 'gaming'
  | 'reading'
  | 'other';

export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'trial' | 'paused' | 'cancelled';

export interface Subscription {
  id: string;
  name: string;
  category: SubscriptionCategory;
  icon: string;
  billingCycle: BillingCycle;
  price: number;
  monthlyPrice: number;
  billingDay: number;
  status: SubscriptionStatus;
  isShared: boolean;
  sharedCount?: number;
  trialEndDate?: string;
  memo?: string;
  planName?: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<SubscriptionCategory, string> = {
  video: 'OTT',
  music: '음악',
  cloud: '클라우드',
  productivity: '생산성',
  shopping: '쇼핑/배달',
  gaming: '게임',
  reading: '독서',
  other: '기타',
};

export const CATEGORY_COLORS: Record<SubscriptionCategory, string> = {
  video: '#ef4444',
  music: '#8b5cf6',
  cloud: '#3b82f6',
  productivity: '#f59e0b',
  shopping: '#10b981',
  gaming: '#ec4899',
  reading: '#6366f1',
  other: '#6b7280',
};
