/**
 * Investment simulation for opportunity cost visualization
 */
export interface InvestmentResult {
  years: number;
  totalInvested: number;
  totalValue: number;
  totalReturn: number;
  returnRate: number;
  scenarioName: string;
}

export interface InvestmentScenario {
  name: string;
  annualReturnRate: number;
  description: string;
  emoji: string;
}

export const INVESTMENT_SCENARIOS: InvestmentScenario[] = [
  {
    name: '예금',
    annualReturnRate: 0.035,
    description: '은행 정기예금 (연 3.5%)',
    emoji: '🏦',
  },
  {
    name: '적금',
    annualReturnRate: 0.04,
    description: '은행 적금 (연 4.0%)',
    emoji: '💰',
  },
  {
    name: 'S&P 500',
    annualReturnRate: 0.1,
    description: 'S&P 500 평균 수익률 (연 10%)',
    emoji: '📈',
  },
  {
    name: '코스피',
    annualReturnRate: 0.08,
    description: '코스피 평균 수익률 (연 8%)',
    emoji: '🇰🇷',
  },
  {
    name: '비트코인',
    annualReturnRate: 0.5,
    description: '비트코인 5년 평균 (연 50%, 고위험)',
    emoji: '₿',
  },
];

/**
 * Simulate monthly investment over a given number of years
 * Uses compound interest formula for monthly contributions
 *
 * FV = P * [((1 + r)^n - 1) / r]
 * where P = monthly contribution, r = monthly rate, n = total months
 */
export function simulateInvestment(
  monthlySaving: number,
  years: number,
  annualReturnRate: number,
): { totalInvested: number; totalValue: number; totalReturn: number } {
  const monthlyRate = annualReturnRate / 12;
  const totalMonths = years * 12;
  const totalInvested = monthlySaving * totalMonths;

  if (monthlyRate === 0) {
    return { totalInvested, totalValue: totalInvested, totalReturn: 0 };
  }

  const totalValue =
    monthlySaving *
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

  const totalReturn = Math.round(totalValue - totalInvested);

  return {
    totalInvested,
    totalValue: Math.round(totalValue),
    totalReturn,
  };
}

/**
 * Calculate all investment scenarios for a given monthly saving
 */
export function calculateAllScenarios(
  monthlySaving: number,
  years: number,
): InvestmentResult[] {
  return INVESTMENT_SCENARIOS.map((scenario) => {
    const result = simulateInvestment(
      monthlySaving,
      years,
      scenario.annualReturnRate,
    );

    return {
      years,
      totalInvested: result.totalInvested,
      totalValue: result.totalValue,
      totalReturn: result.totalReturn,
      returnRate: scenario.annualReturnRate,
      scenarioName: scenario.name,
    };
  });
}

/**
 * Calculate time series data for a single scenario (for charts)
 */
export function calculateInvestmentTimeSeries(
  monthlySaving: number,
  years: number,
  annualReturnRate: number,
): { year: number; invested: number; value: number }[] {
  const series: { year: number; invested: number; value: number }[] = [];

  for (let y = 0; y <= years; y++) {
    if (y === 0) {
      series.push({ year: 0, invested: 0, value: 0 });
    } else {
      const result = simulateInvestment(monthlySaving, y, annualReturnRate);
      series.push({
        year: y,
        invested: result.totalInvested,
        value: result.totalValue,
      });
    }
  }

  return series;
}
