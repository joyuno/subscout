import { describe, it, expect } from 'vitest';
import {
  calculateMonthlyPrice,
  calculateCostByCategory,
  calculateTotalMonthlyCost,
  calculateYearlyCost,
  calculateCycleSavings,
} from '@/lib/calculations/costAnalysis';
import type { Subscription } from '@/lib/types/subscription';

describe('Cost Analysis Calculations', () => {
  describe('calculateMonthlyPrice', () => {
    it('should return same price for monthly cycle', () => {
      const result = calculateMonthlyPrice(14900, 'monthly');
      expect(result).toBe(14900);
    });

    it('should convert yearly to monthly (divide by 12)', () => {
      const yearlyPrice = 178800; // 14900 * 12
      const result = calculateMonthlyPrice(yearlyPrice, 'yearly');
      expect(result).toBe(Math.round(yearlyPrice / 12));
      expect(result).toBe(14900);
    });

    it('should handle yearly subscription with rounding', () => {
      const result = calculateMonthlyPrice(99000, 'yearly');
      expect(result).toBe(8250);
    });
  });

  describe('calculateCostByCategory', () => {
    const mockSubscriptions: Subscription[] = [
      {
        id: '1',
        name: '넷플릭스',
        category: 'video',
        icon: '🎬',
        billingCycle: 'monthly',
        price: 17000,
        monthlyPrice: 17000,
        billingDay: 1,
        status: 'active',
        isShared: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '2',
        name: '스포티파이',
        category: 'music',
        icon: '🎧',
        billingCycle: 'monthly',
        price: 10900,
        monthlyPrice: 10900,
        billingDay: 1,
        status: 'active',
        isShared: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '3',
        name: '디즈니+',
        category: 'video',
        icon: '🏰',
        billingCycle: 'monthly',
        price: 9900,
        monthlyPrice: 9900,
        billingDay: 1,
        status: 'active',
        isShared: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '4',
        name: 'Netflix Cancelled',
        category: 'video',
        icon: '🎬',
        billingCycle: 'monthly',
        price: 15000,
        monthlyPrice: 15000,
        billingDay: 1,
        status: 'cancelled',
        isShared: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    it('should sum costs by category for active subscriptions', () => {
      const result = calculateCostByCategory(mockSubscriptions);

      expect(result.video).toBe(26900); // 17000 + 9900
      expect(result.music).toBe(10900);
      expect(result.cloud).toBe(0);
      expect(result.productivity).toBe(0);
      expect(result.shopping).toBe(0);
      expect(result.gaming).toBe(0);
      expect(result.reading).toBe(0);
      expect(result.other).toBe(0);
    });

    it('should exclude cancelled subscriptions', () => {
      const result = calculateCostByCategory(mockSubscriptions);
      // Cancelled Netflix (15000) should not be included
      expect(result.video).toBe(26900);
    });

    it('should include trial subscriptions', () => {
      const subsWithTrial: Subscription[] = [
        {
          id: '1',
          name: 'Trial Service',
          category: 'productivity',
          icon: '📝',
          billingCycle: 'monthly',
          price: 10000,
          monthlyPrice: 10000,
          billingDay: 1,
          status: 'trial',
          isShared: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      const result = calculateCostByCategory(subsWithTrial);
      expect(result.productivity).toBe(10000);
    });

    it('should return all zeros for empty subscriptions', () => {
      const result = calculateCostByCategory([]);

      expect(result.video).toBe(0);
      expect(result.music).toBe(0);
      expect(result.cloud).toBe(0);
      expect(result.productivity).toBe(0);
      expect(result.shopping).toBe(0);
      expect(result.gaming).toBe(0);
      expect(result.reading).toBe(0);
      expect(result.other).toBe(0);
    });
  });

  describe('calculateTotalMonthlyCost', () => {
    it('should sum all active subscription costs', () => {
      const mockSubs: Subscription[] = [
        {
          id: '1',
          name: 'Service 1',
          category: 'video',
          icon: '🎬',
          billingCycle: 'monthly',
          price: 10000,
          monthlyPrice: 10000,
          billingDay: 1,
          status: 'active',
          isShared: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          name: 'Service 2',
          category: 'music',
          icon: '🎧',
          billingCycle: 'monthly',
          price: 5000,
          monthlyPrice: 5000,
          billingDay: 1,
          status: 'active',
          isShared: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '3',
          name: 'Service 3',
          category: 'productivity',
          icon: '📝',
          billingCycle: 'monthly',
          price: 8000,
          monthlyPrice: 8000,
          billingDay: 1,
          status: 'cancelled',
          isShared: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      const result = calculateTotalMonthlyCost(mockSubs);
      expect(result).toBe(15000); // 10000 + 5000
    });

    it('should return 0 for empty subscriptions', () => {
      const result = calculateTotalMonthlyCost([]);
      expect(result).toBe(0);
    });

    it('should include trial subscriptions', () => {
      const mockSubs: Subscription[] = [
        {
          id: '1',
          name: 'Trial',
          category: 'video',
          icon: '🎬',
          billingCycle: 'monthly',
          price: 10000,
          monthlyPrice: 10000,
          billingDay: 1,
          status: 'trial',
          isShared: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      const result = calculateTotalMonthlyCost(mockSubs);
      expect(result).toBe(10000);
    });
  });

  describe('calculateYearlyCost', () => {
    it('should multiply monthly cost by 12', () => {
      const mockSubs: Subscription[] = [
        {
          id: '1',
          name: 'Service',
          category: 'video',
          icon: '🎬',
          billingCycle: 'monthly',
          price: 10000,
          monthlyPrice: 10000,
          billingDay: 1,
          status: 'active',
          isShared: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      const result = calculateYearlyCost(mockSubs);
      expect(result).toBe(120000); // 10000 * 12
    });
  });

  describe('calculateCycleSavings', () => {
    it('should calculate savings when yearly is cheaper', () => {
      const monthlyPrice = 10000;
      const yearlyPrice = 100000; // 100000 vs 120000

      const result = calculateCycleSavings(monthlyPrice, yearlyPrice);

      expect(result.yearlySavings).toBe(20000);
      expect(result.monthlySavings).toBe(Math.round(20000 / 12));
      expect(result.percentSaved).toBe(Math.round((20000 / 120000) * 100));
    });

    it('should handle no savings case', () => {
      const monthlyPrice = 10000;
      const yearlyPrice = 120000; // same

      const result = calculateCycleSavings(monthlyPrice, yearlyPrice);

      expect(result.yearlySavings).toBe(0);
      expect(result.monthlySavings).toBe(0);
      expect(result.percentSaved).toBe(0);
    });

    it('should handle typical Netflix example', () => {
      const monthlyPrice = 13500;
      const yearlyPrice = 13500 * 12; // no discount

      const result = calculateCycleSavings(monthlyPrice, yearlyPrice);

      expect(result.yearlySavings).toBe(0);
      expect(result.percentSaved).toBe(0);
    });

    it('should calculate Disney+ yearly discount', () => {
      const monthlyPrice = 9900;
      const yearlyPrice = 99000; // 9900*12 = 118800, saving 19800

      const result = calculateCycleSavings(monthlyPrice, yearlyPrice);

      expect(result.yearlySavings).toBe(19800);
      expect(result.monthlySavings).toBe(1650);
      expect(result.percentSaved).toBeGreaterThan(15);
    });

    it('should return 0 percent when monthly price is 0', () => {
      const result = calculateCycleSavings(0, 0);

      expect(result.percentSaved).toBe(0);
    });
  });
});
