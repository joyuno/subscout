import { describe, it, expect } from 'vitest';
import { getCostFeeling, getTotalCostFeeling } from '@/lib/calculations/costFeeling';

describe('Cost Feeling Calculations', () => {
  describe('getCostFeeling', () => {
    it('should return free level for 0 cost', () => {
      const result = getCostFeeling(0);

      expect(result.dailyCost).toBe(0);
      expect(result.level).toBe('free');
      expect(result.levelLabel).toBe('무료');
      expect(result.levelColor).toBe('#22c55e');
    });

    it('should return cheap level for low cost (< 200원/일)', () => {
      const monthlyCost = 5000; // ~167원/일
      const result = getCostFeeling(monthlyCost);

      expect(result.dailyCost).toBe(Math.round(monthlyCost / 30));
      expect(result.level).toBe('cheap');
      expect(result.levelLabel).toBe('거의 안 느껴지는 수준');
      expect(result.levelColor).toBe('#22c55e');
    });

    it('should return moderate level for medium cost (200-500원/일)', () => {
      const monthlyCost = 12000; // 400원/일
      const result = getCostFeeling(monthlyCost);

      expect(result.dailyCost).toBe(400);
      expect(result.level).toBe('moderate');
      expect(result.levelLabel).toBe('부담 없는 수준');
      expect(result.levelColor).toBe('#eab308');
    });

    it('should return expensive level for high cost (500-1000원/일)', () => {
      const monthlyCost = 21000; // 700원/일
      const result = getCostFeeling(monthlyCost);

      expect(result.dailyCost).toBe(700);
      expect(result.level).toBe('expensive');
      expect(result.levelLabel).toBe('조금 부담되는 수준');
      expect(result.levelColor).toBe('#f97316');
    });

    it('should return premium level for very high cost (>= 1000원/일)', () => {
      const monthlyCost = 35000; // ~1167원/일
      const result = getCostFeeling(monthlyCost);

      expect(result.dailyCost).toBeGreaterThanOrEqual(1000);
      expect(result.level).toBe('premium');
      expect(result.levelLabel).toBe('프리미엄 지출');
      expect(result.levelColor).toBe('#ef4444');
    });

    it('should calculate daily cost correctly', () => {
      const monthlyCost = 14900; // Netflix
      const result = getCostFeeling(monthlyCost);

      expect(result.dailyCost).toBe(Math.round(14900 / 30));
      expect(result.dailyCost).toBe(497);
    });

    it('should return comparison object', () => {
      const result = getCostFeeling(15000);

      expect(result.comparison).toBeDefined();
      expect(result.comparisonText).toBeDefined();
      expect(result.comparisonText.length).toBeGreaterThan(0);
    });

    it('should return comparison text for typical subscription', () => {
      const monthlyCost = 14900; // ~497원/일
      const result = getCostFeeling(monthlyCost);

      expect(result.comparisonText).toBeTruthy();
      // Should compare to similar priced items (americano ~4500원 / 150원/일 근처)
    });

    it('should handle edge case at 200원/일 boundary', () => {
      const monthlyCost = 6000; // 200원/일
      const result = getCostFeeling(monthlyCost);

      expect(result.level).toBe('moderate');
    });

    it('should handle edge case at 500원/일 boundary', () => {
      const monthlyCost = 15000; // 500원/일
      const result = getCostFeeling(monthlyCost);

      expect(result.level).toBe('expensive');
    });

    it('should handle edge case at 1000원/일 boundary', () => {
      const monthlyCost = 30000; // 1000원/일
      const result = getCostFeeling(monthlyCost);

      expect(result.level).toBe('premium');
    });
  });

  describe('getTotalCostFeeling', () => {
    it('should calculate total cost feeling for multiple subscriptions', () => {
      const totalMonthly = 50000;
      const result = getTotalCostFeeling(totalMonthly);

      expect(result.dailyCost).toBe(Math.round(50000 / 30));
      expect(result.yearlyEquivalent).toBe(600000); // 50000 * 12
    });

    it('should calculate chicken equivalent', () => {
      const totalMonthly = 40000; // 2 chickens
      const result = getTotalCostFeeling(totalMonthly);

      expect(result.chickenEquivalent).toBe(2); // floor(40000 / 20000)
    });

    it('should calculate coffee equivalent', () => {
      const totalMonthly = 18000; // 4 coffees
      const result = getTotalCostFeeling(totalMonthly);

      expect(result.coffeeEquivalent).toBe(4); // floor(18000 / 4500)
    });

    it('should return appropriate comparison text', () => {
      const totalMonthly = 40000;
      const result = getTotalCostFeeling(totalMonthly);

      expect(result.comparisonText).toContain('치킨');
      expect(result.comparisonText).toContain('아메리카노');
      expect(result.comparisonText).toContain('2마리');
      expect(result.comparisonText).toContain('8잔'); // floor(40000/4500) = 8
    });

    it('should handle zero cost', () => {
      const result = getTotalCostFeeling(0);

      expect(result.dailyCost).toBe(0);
      expect(result.yearlyEquivalent).toBe(0);
      expect(result.chickenEquivalent).toBe(0);
      expect(result.coffeeEquivalent).toBe(0);
      expect(result.comparisonText).toBe('구독료가 없어요!');
    });

    it('should handle low cost (less than 1 chicken)', () => {
      const totalMonthly = 15000;
      const result = getTotalCostFeeling(totalMonthly);

      expect(result.chickenEquivalent).toBe(0);
      expect(result.coffeeEquivalent).toBe(3); // floor(15000/4500) = 3
    });

    it('should handle typical user with multiple subscriptions', () => {
      // Netflix (17000) + Spotify (10900) + YouTube Premium (14900) = 42800
      const totalMonthly = 42800;
      const result = getTotalCostFeeling(totalMonthly);

      expect(result.dailyCost).toBe(Math.round(42800 / 30));
      expect(result.yearlyEquivalent).toBe(513600);
      expect(result.chickenEquivalent).toBe(2);
      expect(result.coffeeEquivalent).toBe(9);
    });

    it('should floor chicken and coffee counts', () => {
      const totalMonthly = 29999; // Just under 1.5 chickens
      const result = getTotalCostFeeling(totalMonthly);

      expect(result.chickenEquivalent).toBe(1); // floor(29999/20000)
      expect(result.coffeeEquivalent).toBe(6); // floor(29999/4500)
    });

    it('should handle high spender case', () => {
      const totalMonthly = 150000; // Heavy subscription user
      const result = getTotalCostFeeling(totalMonthly);

      expect(result.dailyCost).toBe(5000);
      expect(result.yearlyEquivalent).toBe(1800000);
      expect(result.chickenEquivalent).toBe(7);
      expect(result.coffeeEquivalent).toBe(33);
    });

    it('should have consistent daily cost calculation', () => {
      const totalMonthly = 14900;

      const totalResult = getTotalCostFeeling(totalMonthly);
      const singleResult = getCostFeeling(totalMonthly);

      expect(totalResult.dailyCost).toBe(singleResult.dailyCost);
    });
  });
});
