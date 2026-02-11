/**
 * Daily cost comparison items for the "cost feeling" feature.
 * Helps users understand subscription costs in terms of everyday purchases.
 */
export interface DailyComparison {
  name: string;
  price: number;
  emoji: string;
  category: string;
}

export const DAILY_COMPARISONS: DailyComparison[] = [
  { name: '삼각김밥', price: 1200, emoji: '🍙', category: '편의점' },
  { name: '컵라면', price: 1500, emoji: '🍜', category: '편의점' },
  { name: '캔커피', price: 1500, emoji: '☕', category: '편의점' },
  { name: '편의점 도시락', price: 4500, emoji: '🍱', category: '편의점' },
  { name: '아메리카노', price: 4500, emoji: '☕', category: '카페' },
  { name: '카페라떼', price: 5000, emoji: '🥛', category: '카페' },
  { name: '버스비', price: 1400, emoji: '🚌', category: '교통' },
  { name: '지하철비', price: 1400, emoji: '🚇', category: '교통' },
  { name: '택시 기본요금', price: 4800, emoji: '🚕', category: '교통' },
  { name: '떡볶이 1인분', price: 4000, emoji: '🍢', category: '분식' },
  { name: '김밥 1줄', price: 3500, emoji: '🍣', category: '분식' },
  { name: '치킨 한 마리', price: 20000, emoji: '🍗', category: '배달' },
  { name: '피자 라지', price: 25000, emoji: '🍕', category: '배달' },
  { name: '영화 관람', price: 14000, emoji: '🎬', category: '문화' },
  { name: '소주 한 병', price: 5000, emoji: '🍶', category: '주류' },
  { name: '맥주 한 잔', price: 6000, emoji: '🍺', category: '주류' },
];

/**
 * Find the closest daily comparison for a given daily cost
 */
export function findClosestComparison(
  dailyCost: number,
): DailyComparison | null {
  if (dailyCost <= 0) return null;

  let closest = DAILY_COMPARISONS[0];
  let minDiff = Math.abs(DAILY_COMPARISONS[0].price - dailyCost);

  for (const item of DAILY_COMPARISONS) {
    const diff = Math.abs(item.price - dailyCost);
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  }

  return closest;
}

/**
 * Find items cheaper than the given daily cost
 */
export function findCheaperItems(
  dailyCost: number,
): DailyComparison[] {
  return DAILY_COMPARISONS.filter((item) => item.price <= dailyCost).sort(
    (a, b) => b.price - a.price,
  );
}

/**
 * Get a human-readable comparison string
 */
export function getDailyComparisonText(dailyCost: number): string {
  const closest = findClosestComparison(dailyCost);
  if (!closest) return '';

  const ratio = dailyCost / closest.price;

  if (ratio >= 0.8 && ratio <= 1.2) {
    return `하루에 ${closest.emoji} ${closest.name} 한 개 값`;
  } else if (ratio < 0.8) {
    return `하루에 ${closest.emoji} ${closest.name}보다 저렴`;
  } else {
    const count = Math.round(ratio);
    return `하루에 ${closest.emoji} ${closest.name} ${count}개 값`;
  }
}
