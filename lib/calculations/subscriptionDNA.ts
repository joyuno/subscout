import type { Subscription, SubscriptionCategory } from '@/lib/types/subscription';
import { CATEGORY_LABELS } from '@/lib/types/subscription';

export type DNAType =
  | 'entertainment'
  | 'productivity'
  | 'balanced'
  | 'minimalist'
  | 'maximalist'
  | 'techie'
  | 'shopper';

export interface DNAProfile {
  type: DNAType;
  name: string;
  description: string;
  emoji: string;
  characteristics: string[];
  tip: string;
}

export const DNA_PROFILES: Record<DNAType, DNAProfile> = {
  entertainment: {
    type: 'entertainment',
    name: '엔터테인먼트 마니아',
    description: '영상과 음악을 사랑하는 당신! 콘텐츠 소비의 달인이에요.',
    emoji: '🎬',
    characteristics: [
      'OTT 서비스를 2개 이상 구독',
      '음악 스트리밍 필수',
      '콘텐츠 탐색을 즐김',
    ],
    tip: '겹치는 콘텐츠가 있는 OTT를 정리하면 절약할 수 있어요.',
  },
  productivity: {
    type: 'productivity',
    name: '생산성 전문가',
    description: '업무와 자기계발에 투자하는 프로페셔널!',
    emoji: '💼',
    characteristics: [
      '생산성 도구 중심 구독',
      '클라우드 스토리지 활용',
      '업무 효율 극대화',
    ],
    tip: '번들 요금제로 묶으면 절약할 수 있어요.',
  },
  balanced: {
    type: 'balanced',
    name: '밸런스 마스터',
    description: '엔터테인먼트와 생산성의 균형을 잡는 지혜로운 소비자!',
    emoji: '🎯',
    characteristics: [
      '다양한 카테고리 구독',
      '적절한 소비 패턴',
      '균형잡힌 디지털 라이프',
    ],
    tip: '이미 잘 관리하고 있어요. 가끔 사용량을 점검해보세요.',
  },
  minimalist: {
    type: 'minimalist',
    name: '미니멀리스트',
    description: '꼭 필요한 것만 구독하는 현명한 소비자!',
    emoji: '🧘‍♂️',
    characteristics: [
      '최소한의 구독만 유지',
      '높은 활용도',
      '불필요한 지출 없음',
    ],
    tip: '훌륭해요! 지금처럼만 유지하세요.',
  },
  maximalist: {
    type: 'maximalist',
    name: '구독 맥시멀리스트',
    description: '다양한 서비스를 경험하는 것을 좋아하는 탐험가!',
    emoji: '🚀',
    characteristics: [
      '5개 이상의 구독',
      '다양한 카테고리 이용',
      '신규 서비스 빠른 도입',
    ],
    tip: '겹치는 서비스와 미사용 구독을 정리하면 큰 절약이 가능해요.',
  },
  techie: {
    type: 'techie',
    name: '테크 얼리어답터',
    description: 'AI, 클라우드, 생산성 도구를 사랑하는 기술 애호가!',
    emoji: '⚙️',
    characteristics: [
      'AI/생산성 도구 다수 구독',
      '클라우드 의존도 높음',
      '최신 기술 트렌드 추종',
    ],
    tip: '무료 대안이 있는 도구는 교체를 고려해보세요.',
  },
  shopper: {
    type: 'shopper',
    name: '스마트 쇼퍼',
    description: '쇼핑 멤버십을 적극 활용하는 합리적인 소비자!',
    emoji: '🛍️',
    characteristics: [
      '쇼핑 멤버십 다수 이용',
      '무료배송/적립 혜택 활용',
      '배달 서비스 적극 이용',
    ],
    tip: '멤버십 혜택이 월 비용 이상인지 정기적으로 확인하세요.',
  },
};

/**
 * Analyze user's subscription DNA based on category distribution
 */
export function analyzeDNA(subscriptions: Subscription[]): DNAProfile {
  const active = subscriptions.filter(
    (s) => s.status === 'active' || s.status === 'trial',
  );

  if (active.length === 0) {
    return DNA_PROFILES.minimalist;
  }

  // Count by category
  const categoryCount: Record<SubscriptionCategory, number> = {
    video: 0,
    music: 0,
    cloud: 0,
    productivity: 0,
    shopping: 0,
    gaming: 0,
    reading: 0,
    other: 0,
  };

  const categorySpend: Record<SubscriptionCategory, number> = {
    video: 0,
    music: 0,
    cloud: 0,
    productivity: 0,
    shopping: 0,
    gaming: 0,
    reading: 0,
    other: 0,
  };

  for (const sub of active) {
    categoryCount[sub.category]++;
    categorySpend[sub.category] += sub.monthlyPrice;
  }

  const totalCount = active.length;
  const entertainmentCount = categoryCount.video + categoryCount.music + categoryCount.gaming;
  const productivityCount = categoryCount.productivity + categoryCount.cloud;
  const shoppingCount = categoryCount.shopping;

  // Determine DNA type
  if (totalCount <= 2) {
    return DNA_PROFILES.minimalist;
  }

  if (totalCount >= 6) {
    // Check if mostly entertainment
    if (entertainmentCount / totalCount >= 0.6) {
      return DNA_PROFILES.entertainment;
    }
    return DNA_PROFILES.maximalist;
  }

  if (entertainmentCount >= 3 && entertainmentCount / totalCount >= 0.5) {
    return DNA_PROFILES.entertainment;
  }

  if (productivityCount >= 2 && productivityCount / totalCount >= 0.4) {
    if (categoryCount.cloud >= 1 && categoryCount.productivity >= 1) {
      return DNA_PROFILES.techie;
    }
    return DNA_PROFILES.productivity;
  }

  if (shoppingCount >= 2) {
    return DNA_PROFILES.shopper;
  }

  // Check balance
  const usedCategories = Object.values(categoryCount).filter((c) => c > 0).length;
  if (usedCategories >= 3) {
    return DNA_PROFILES.balanced;
  }

  return DNA_PROFILES.balanced;
}

/**
 * Get radar chart data for subscription DNA visualization
 */
export function getDNARadarData(
  subscriptions: Subscription[],
): { category: string; count: number; spend: number }[] {
  const active = subscriptions.filter(
    (s) => s.status === 'active' || s.status === 'trial',
  );

  const categories: SubscriptionCategory[] = [
    'video',
    'music',
    'cloud',
    'productivity',
    'shopping',
    'gaming',
    'reading',
    'other',
  ];

  return categories.map((cat) => {
    const catSubs = active.filter((s) => s.category === cat);
    return {
      category: CATEGORY_LABELS[cat],
      count: catSubs.length,
      spend: catSubs.reduce((sum, s) => sum + s.monthlyPrice, 0),
    };
  });
}
