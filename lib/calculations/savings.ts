import type { Subscription } from '@/lib/types/subscription';
import { differenceInMonths } from 'date-fns';

/**
 * Calculate total monthly amount saved from cancelled subscriptions
 */
export function calculateTotalSavings(
  cancelledSubscriptions: Subscription[],
): number {
  return cancelledSubscriptions.reduce(
    (sum, sub) => sum + sub.monthlyPrice,
    0,
  );
}

/**
 * Calculate cumulative savings since each subscription was cancelled
 */
export function calculateMonthlySavingsSince(
  cancelledSubscriptions: Subscription[],
): number {
  const now = new Date();

  return cancelledSubscriptions.reduce((total, sub) => {
    const cancelledDate = new Date(sub.updatedAt);
    const months = differenceInMonths(now, cancelledDate);
    return total + sub.monthlyPrice * Math.max(months, 1);
  }, 0);
}

/**
 * Calculate potential savings if recommendations are followed
 */
export function calculatePotentialMonthlySavings(
  potentialSavingsMap: { subscriptionId: string; savings: number }[],
): number {
  return potentialSavingsMap.reduce((sum, item) => sum + item.savings, 0);
}
