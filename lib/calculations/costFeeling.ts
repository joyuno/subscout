import {
  findClosestComparison,
  getDailyComparisonText,
  type DailyComparison,
} from '@/lib/constants/dailyComparisons';

export type CostFeelingLevel = 'free' | 'cheap' | 'moderate' | 'expensive' | 'premium';

export interface CostFeeling {
  dailyCost: number;
  comparison: DailyComparison | null;
  comparisonText: string;
  level: CostFeelingLevel;
  levelLabel: string;
  levelColor: string;
}

/**
 * Get the "feeling" of a monthly subscription cost
 * Converts to daily cost and compares with everyday items
 */
export function getCostFeeling(monthlyPrice: number): CostFeeling {
  const dailyCost = Math.round(monthlyPrice / 30);

  const comparison = findClosestComparison(dailyCost);
  const comparisonText = getDailyComparisonText(dailyCost);

  let level: CostFeelingLevel;
  let levelLabel: string;
  let levelColor: string;

  if (dailyCost === 0) {
    level = 'free';
    levelLabel = '무료';
    levelColor = '#22c55e';
  } else if (dailyCost < 200) {
    level = 'cheap';
    levelLabel = '거의 안 느껴지는 수준';
    levelColor = '#22c55e';
  } else if (dailyCost < 500) {
    level = 'moderate';
    levelLabel = '부담 없는 수준';
    levelColor = '#eab308';
  } else if (dailyCost < 1000) {
    level = 'expensive';
    levelLabel = '조금 부담되는 수준';
    levelColor = '#f97316';
  } else {
    level = 'premium';
    levelLabel = '프리미엄 지출';
    levelColor = '#ef4444';
  }

  return {
    dailyCost,
    comparison,
    comparisonText,
    level,
    levelLabel,
    levelColor,
  };
}

/**
 * Get feeling for total monthly subscription cost
 */
export function getTotalCostFeeling(totalMonthlyPrice: number): {
  dailyCost: number;
  yearlyEquivalent: number;
  comparisonText: string;
  chickenEquivalent: number;
  coffeeEquivalent: number;
} {
  const dailyCost = Math.round(totalMonthlyPrice / 30);
  const yearlyEquivalent = totalMonthlyPrice * 12;
  const chickenEquivalent = Math.floor(totalMonthlyPrice / 20000);
  const coffeeEquivalent = Math.floor(totalMonthlyPrice / 4500);

  const comparisonText =
    totalMonthlyPrice > 0
      ? `매달 치킨 ${chickenEquivalent}마리, 아메리카노 ${coffeeEquivalent}잔 값`
      : '구독료가 없어요!';

  return {
    dailyCost,
    yearlyEquivalent,
    comparisonText,
    chickenEquivalent,
    coffeeEquivalent,
  };
}
