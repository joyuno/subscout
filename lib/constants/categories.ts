import type { SubscriptionCategory } from '@/lib/types/subscription';

export interface CategoryInfo {
  key: SubscriptionCategory;
  label: string;
  color: string;
  icon: string;
  description: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    key: 'video',
    label: '영상 스트리밍',
    color: '#ef4444',
    icon: '🎬',
    description: 'OTT 및 동영상 서비스',
  },
  {
    key: 'music',
    label: '음악',
    color: '#8b5cf6',
    icon: '🎵',
    description: '음악 스트리밍 서비스',
  },
  {
    key: 'cloud',
    label: '클라우드',
    color: '#3b82f6',
    icon: '☁️',
    description: '클라우드 스토리지',
  },
  {
    key: 'productivity',
    label: '생산성',
    color: '#f59e0b',
    icon: '⚡',
    description: '생산성 및 업무 도구',
  },
  {
    key: 'shopping',
    label: '쇼핑/배달',
    color: '#10b981',
    icon: '🛒',
    description: '쇼핑 멤버십 및 배달 구독',
  },
  {
    key: 'gaming',
    label: '게임',
    color: '#ec4899',
    icon: '🎮',
    description: '게임 구독 서비스',
  },
  {
    key: 'reading',
    label: '독서',
    color: '#6366f1',
    icon: '📚',
    description: '전자책 및 독서 서비스',
  },
  {
    key: 'other',
    label: '기타',
    color: '#6b7280',
    icon: '📦',
    description: '기타 구독 서비스',
  },
];

export const CATEGORY_MAP: Record<SubscriptionCategory, CategoryInfo> =
  CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.key] = cat;
      return acc;
    },
    {} as Record<SubscriptionCategory, CategoryInfo>,
  );
