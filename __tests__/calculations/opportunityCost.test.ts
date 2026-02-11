import { describe, it, expect } from 'vitest';
import {
  simulateInvestment,
  calculateAllScenarios,
  calculateInvestmentTimeSeries,
  INVESTMENT_SCENARIOS,
} from '@/lib/calculations/opportunityCost';

describe('Opportunity Cost Calculations', () => {
  describe('simulateInvestment', () => {
    it('should calculate compound interest correctly for bank deposit', () => {
      const monthlySaving = 10000;
      const years = 1;
      const annualRate = 0.035; // 3.5% bank deposit

      const result = simulateInvestment(monthlySaving, years, annualRate);

      expect(result.totalInvested).toBe(120000); // 10000 * 12
      expect(result.totalValue).toBeGreaterThan(result.totalInvested);
      expect(result.totalReturn).toBeGreaterThan(0);
      expect(result.totalReturn).toBe(result.totalValue - result.totalInvested);
    });

    it('should calculate 0% return rate (no interest)', () => {
      const monthlySaving = 10000;
      const years = 1;
      const annualRate = 0;

      const result = simulateInvestment(monthlySaving, years, annualRate);

      expect(result.totalInvested).toBe(120000);
      expect(result.totalValue).toBe(120000);
      expect(result.totalReturn).toBe(0);
    });

    it('should calculate S&P 500 returns (10% annual)', () => {
      const monthlySaving = 10000;
      const years = 5;
      const annualRate = 0.1; // 10%

      const result = simulateInvestment(monthlySaving, years, annualRate);

      expect(result.totalInvested).toBe(600000); // 10000 * 60
      expect(result.totalValue).toBeGreaterThan(600000);
      // With 10% annual rate, should have significant returns
      expect(result.totalReturn).toBeGreaterThan(50000);
    });

    it('should use correct compound interest formula', () => {
      const monthlySaving = 1000;
      const years = 1;
      const annualRate = 0.12; // 12% annual (1% monthly)
      const monthlyRate = annualRate / 12;
      const totalMonths = years * 12;

      const result = simulateInvestment(monthlySaving, years, annualRate);

      // Formula: P * [((1 + r)^n - 1) / r]
      const expectedValue =
        monthlySaving *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

      expect(result.totalValue).toBe(Math.round(expectedValue));
    });

    it('should handle multi-year investment', () => {
      const monthlySaving = 10000;
      const years = 10;
      const annualRate = 0.08;

      const result = simulateInvestment(monthlySaving, years, annualRate);

      expect(result.totalInvested).toBe(1200000); // 10000 * 120
      expect(result.totalValue).toBeGreaterThan(result.totalInvested);
      // Compound interest over 10 years should show significant growth
      expect(result.totalReturn).toBeGreaterThan(200000);
    });

    it('should handle small amounts', () => {
      const monthlySaving = 100;
      const years = 1;
      const annualRate = 0.04;

      const result = simulateInvestment(monthlySaving, years, annualRate);

      expect(result.totalInvested).toBe(1200);
      expect(result.totalValue).toBeGreaterThan(1200);
      expect(result.totalReturn).toBeGreaterThan(0);
    });

    it('should handle large subscription savings', () => {
      const monthlySaving = 50000; // Heavy subscriber
      const years = 5;
      const annualRate = 0.1;

      const result = simulateInvestment(monthlySaving, years, annualRate);

      expect(result.totalInvested).toBe(3000000); // 50000 * 60
      expect(result.totalValue).toBeGreaterThan(3000000);
    });

    it('should round final values', () => {
      const monthlySaving = 10000;
      const years = 1;
      const annualRate = 0.035;

      const result = simulateInvestment(monthlySaving, years, annualRate);

      // All return values should be integers
      expect(Number.isInteger(result.totalValue)).toBe(true);
      expect(Number.isInteger(result.totalReturn)).toBe(true);
      expect(Number.isInteger(result.totalInvested)).toBe(true);
    });

    it('should handle high return rate (Bitcoin)', () => {
      const monthlySaving = 10000;
      const years = 5;
      const annualRate = 0.5; // 50% (high risk)

      const result = simulateInvestment(monthlySaving, years, annualRate);

      expect(result.totalInvested).toBe(600000);
      // With 50% annual rate, returns should be very high
      expect(result.totalValue).toBeGreaterThan(1000000);
    });
  });

  describe('calculateAllScenarios', () => {
    it('should calculate all investment scenarios', () => {
      const monthlySaving = 10000;
      const years = 5;

      const results = calculateAllScenarios(monthlySaving, years);

      expect(results).toHaveLength(INVESTMENT_SCENARIOS.length);
      expect(results.length).toBe(5); // 예금, 적금, S&P 500, 코스피, 비트코인
    });

    it('should include all scenario properties', () => {
      const monthlySaving = 10000;
      const years = 5;

      const results = calculateAllScenarios(monthlySaving, years);

      results.forEach((result) => {
        expect(result).toHaveProperty('years');
        expect(result).toHaveProperty('totalInvested');
        expect(result).toHaveProperty('totalValue');
        expect(result).toHaveProperty('totalReturn');
        expect(result).toHaveProperty('returnRate');
        expect(result).toHaveProperty('scenarioName');
      });
    });

    it('should have consistent years value', () => {
      const monthlySaving = 10000;
      const years = 5;

      const results = calculateAllScenarios(monthlySaving, years);

      results.forEach((result) => {
        expect(result.years).toBe(years);
      });
    });

    it('should have consistent totalInvested across scenarios', () => {
      const monthlySaving = 10000;
      const years = 5;

      const results = calculateAllScenarios(monthlySaving, years);

      const expectedInvested = monthlySaving * years * 12;
      results.forEach((result) => {
        expect(result.totalInvested).toBe(expectedInvested);
      });
    });

    it('should show higher returns for higher return rates', () => {
      const monthlySaving = 10000;
      const years = 5;

      const results = calculateAllScenarios(monthlySaving, years);

      // Bitcoin (highest rate) should have highest returns
      const bitcoin = results.find((r) => r.scenarioName === '비트코인');
      const deposit = results.find((r) => r.scenarioName === '예금');

      expect(bitcoin).toBeDefined();
      expect(deposit).toBeDefined();

      if (bitcoin && deposit) {
        expect(bitcoin.totalReturn).toBeGreaterThan(deposit.totalReturn);
        expect(bitcoin.totalValue).toBeGreaterThan(deposit.totalValue);
      }
    });

    it('should include 예금 scenario', () => {
      const results = calculateAllScenarios(10000, 5);
      const deposit = results.find((r) => r.scenarioName === '예금');

      expect(deposit).toBeDefined();
      expect(deposit?.returnRate).toBe(0.035);
    });

    it('should include S&P 500 scenario', () => {
      const results = calculateAllScenarios(10000, 5);
      const sp500 = results.find((r) => r.scenarioName === 'S&P 500');

      expect(sp500).toBeDefined();
      expect(sp500?.returnRate).toBe(0.1);
    });
  });

  describe('calculateInvestmentTimeSeries', () => {
    it('should generate time series starting from year 0', () => {
      const monthlySaving = 10000;
      const years = 5;
      const annualRate = 0.08;

      const series = calculateInvestmentTimeSeries(
        monthlySaving,
        years,
        annualRate
      );

      expect(series).toHaveLength(6); // 0, 1, 2, 3, 4, 5
      expect(series[0].year).toBe(0);
      expect(series[0].invested).toBe(0);
      expect(series[0].value).toBe(0);
    });

    it('should have increasing values over time', () => {
      const monthlySaving = 10000;
      const years = 5;
      const annualRate = 0.08;

      const series = calculateInvestmentTimeSeries(
        monthlySaving,
        years,
        annualRate
      );

      for (let i = 1; i < series.length; i++) {
        expect(series[i].invested).toBeGreaterThan(series[i - 1].invested);
        expect(series[i].value).toBeGreaterThan(series[i - 1].value);
      }
    });

    it('should have value >= invested for each year', () => {
      const monthlySaving = 10000;
      const years = 5;
      const annualRate = 0.08;

      const series = calculateInvestmentTimeSeries(
        monthlySaving,
        years,
        annualRate
      );

      series.forEach((point) => {
        expect(point.value).toBeGreaterThanOrEqual(point.invested);
      });
    });

    it('should match simulateInvestment for final year', () => {
      const monthlySaving = 10000;
      const years = 5;
      const annualRate = 0.08;

      const series = calculateInvestmentTimeSeries(
        monthlySaving,
        years,
        annualRate
      );
      const direct = simulateInvestment(monthlySaving, years, annualRate);

      const finalPoint = series[series.length - 1];
      expect(finalPoint.invested).toBe(direct.totalInvested);
      expect(finalPoint.value).toBe(direct.totalValue);
    });

    it('should have correct invested amount at each year', () => {
      const monthlySaving = 10000;
      const years = 3;
      const annualRate = 0.08;

      const series = calculateInvestmentTimeSeries(
        monthlySaving,
        years,
        annualRate
      );

      expect(series[1].invested).toBe(120000); // 1 year
      expect(series[2].invested).toBe(240000); // 2 years
      expect(series[3].invested).toBe(360000); // 3 years
    });

    it('should handle 1 year period', () => {
      const monthlySaving = 10000;
      const years = 1;
      const annualRate = 0.08;

      const series = calculateInvestmentTimeSeries(
        monthlySaving,
        years,
        annualRate
      );

      expect(series).toHaveLength(2); // year 0 and year 1
      expect(series[0].year).toBe(0);
      expect(series[1].year).toBe(1);
    });

    it('should show compound growth effect', () => {
      const monthlySaving = 10000;
      const years = 5;
      const annualRate = 0.1;

      const series = calculateInvestmentTimeSeries(
        monthlySaving,
        years,
        annualRate
      );

      // Growth rate should accelerate due to compounding
      const growth1 = series[1].value - series[1].invested;
      const growth5 = series[5].value - series[5].invested;

      // Year 5 growth should be significantly more than year 1 growth
      expect(growth5).toBeGreaterThan(growth1 * 5);
    });
  });

  describe('INVESTMENT_SCENARIOS', () => {
    it('should have 5 scenarios', () => {
      expect(INVESTMENT_SCENARIOS).toHaveLength(5);
    });

    it('should have all required properties', () => {
      INVESTMENT_SCENARIOS.forEach((scenario) => {
        expect(scenario).toHaveProperty('name');
        expect(scenario).toHaveProperty('annualReturnRate');
        expect(scenario).toHaveProperty('description');
        expect(scenario).toHaveProperty('emoji');
      });
    });

    it('should have realistic return rates', () => {
      INVESTMENT_SCENARIOS.forEach((scenario) => {
        expect(scenario.annualReturnRate).toBeGreaterThanOrEqual(0);
        expect(scenario.annualReturnRate).toBeLessThanOrEqual(1);
      });
    });

    it('should have unique names', () => {
      const names = INVESTMENT_SCENARIOS.map((s) => s.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });
});
