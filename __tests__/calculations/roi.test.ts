import { describe, it, expect } from 'vitest';
import {
  calculateCostPerMinute,
  calculateROIGrade,
  getRecommendation,
  calculateROIAnalysis,
  WEEKS_PER_MONTH,
} from '@/lib/calculations/roi';
import type { Subscription } from '@/lib/types/subscription';

describe('ROI Calculations', () => {
  describe('calculateCostPerMinute', () => {
    it('should calculate correct cost per minute for normal usage', () => {
      const monthlyPrice = 14900;
      const weeklyMinutes = 120;
      const expected = monthlyPrice / (weeklyMinutes * WEEKS_PER_MONTH);

      const result = calculateCostPerMinute(monthlyPrice, weeklyMinutes);

      expect(result).toBeCloseTo(expected, 1);
      expect(result).toBeCloseTo(28.7, 1);
    });

    it('should return Infinity when usage is 0', () => {
      const result = calculateCostPerMinute(14900, 0);
      expect(result).toBe(Infinity);
    });

    it('should return Infinity when usage is negative', () => {
      const result = calculateCostPerMinute(14900, -10);
      expect(result).toBe(Infinity);
    });

    it('should handle free subscriptions', () => {
      const result = calculateCostPerMinute(0, 120);
      expect(result).toBe(0);
    });
  });

  describe('calculateROIGrade', () => {
    it('should return A grade for excellent value (< 10원/분)', () => {
      expect(calculateROIGrade(5)).toBe('A');
      expect(calculateROIGrade(9.99)).toBe('A');
    });

    it('should return B grade for decent value (10-30원/분)', () => {
      expect(calculateROIGrade(10)).toBe('B');
      expect(calculateROIGrade(20)).toBe('B');
      expect(calculateROIGrade(29.99)).toBe('B');
    });

    it('should return C grade for inefficient (30-70원/분)', () => {
      expect(calculateROIGrade(30)).toBe('C');
      expect(calculateROIGrade(50)).toBe('C');
      expect(calculateROIGrade(69.99)).toBe('C');
    });

    it('should return D grade for recommend cancel (70-150원/분)', () => {
      expect(calculateROIGrade(70)).toBe('D');
      expect(calculateROIGrade(100)).toBe('D');
      expect(calculateROIGrade(149.99)).toBe('D');
    });

    it('should return D grade for very high cost (>150원/분)', () => {
      expect(calculateROIGrade(150)).toBe('D');
      expect(calculateROIGrade(200)).toBe('D');
    });

    it('should return F grade for no usage (Infinity)', () => {
      expect(calculateROIGrade(Infinity)).toBe('F');
    });

    it('should return F grade for NaN', () => {
      expect(calculateROIGrade(NaN)).toBe('F');
    });
  });

  describe('getRecommendation', () => {
    const mockSubscription: Subscription = {
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
    };

    it('should recommend keep for A grade', () => {
      const result = getRecommendation('A', mockSubscription, false);
      expect(result.action).toBe('keep');
      expect(result.reason).toContain('충분히 활용');
    });

    it('should recommend share for B grade when sharing available', () => {
      const result = getRecommendation('B', mockSubscription, true);
      expect(result.action).toBe('share');
      expect(result.reason).toContain('공유하면');
    });

    it('should recommend keep for B grade when already shared', () => {
      const sharedSub = { ...mockSubscription, isShared: true };
      const result = getRecommendation('B', sharedSub, true);
      expect(result.action).toBe('keep');
      expect(result.reason).toContain('적당히 활용');
    });

    it('should recommend share for C grade when sharing available', () => {
      const result = getRecommendation('C', mockSubscription, true);
      expect(result.action).toBe('share');
      expect(result.reason).toContain('공유');
    });

    it('should recommend downgrade for C grade when sharing not available', () => {
      const result = getRecommendation('C', mockSubscription, false);
      expect(result.action).toBe('downgrade');
      expect(result.reason).toContain('낮은 요금제');
    });

    it('should recommend cancel for D grade', () => {
      const result = getRecommendation('D', mockSubscription, false);
      expect(result.action).toBe('cancel');
      expect(result.reason).toContain('거의 사용하지 않고');
    });

    it('should recommend cancel for F grade', () => {
      const result = getRecommendation('F', mockSubscription, false);
      expect(result.action).toBe('cancel');
      expect(result.reason).toContain('전혀 사용하지');
      expect(result.reason).toContain('17,000');
    });
  });

  describe('calculateROIAnalysis', () => {
    const mockSubscription: Subscription = {
      id: 'test-1',
      name: '유튜브 프리미엄',
      category: 'video',
      icon: '▶️',
      billingCycle: 'monthly',
      price: 14900,
      monthlyPrice: 14900,
      billingDay: 1,
      status: 'active',
      isShared: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };

    it('should calculate complete ROI analysis for good usage', () => {
      const weeklyUsage = 120; // 주 2시간
      const result = calculateROIAnalysis(mockSubscription, weeklyUsage, false);

      expect(result.subscriptionId).toBe('test-1');
      expect(result.subscriptionName).toBe('유튜브 프리미엄');
      expect(result.monthlyPrice).toBe(14900);
      expect(result.weeklyUsageMinutes).toBe(120);
      expect(result.monthlyUsageMinutes).toBe(Math.round(120 * WEEKS_PER_MONTH));
      expect(result.costPerMinute).toBeGreaterThan(0);
      expect(result.grade).toBe('B');
      expect(result.recommendation).toBe('keep');
    });

    it('should calculate analysis for no usage with F grade', () => {
      const result = calculateROIAnalysis(mockSubscription, 0, false);

      expect(result.grade).toBe('F');
      expect(result.costPerMinute).toBe(0);
      expect(result.recommendation).toBe('cancel');
      expect(result.potentialSavings).toBe(14900);
    });

    it('should calculate potential savings for cancel action', () => {
      const result = calculateROIAnalysis(mockSubscription, 10, false);

      if (result.recommendation === 'cancel') {
        expect(result.potentialSavings).toBe(14900);
      }
    });

    it('should calculate potential savings for downgrade action', () => {
      const result = calculateROIAnalysis(mockSubscription, 40, false);

      if (result.recommendation === 'downgrade') {
        expect(result.potentialSavings).toBe(Math.round(14900 * 0.3));
      }
    });

    it('should calculate potential savings for share action', () => {
      const result = calculateROIAnalysis(mockSubscription, 120, true);

      if (result.recommendation === 'share') {
        expect(result.potentialSavings).toBe(Math.round(14900 * 0.5));
      }
    });
  });
});
