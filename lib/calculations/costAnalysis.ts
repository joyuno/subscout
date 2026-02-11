import type {
  Subscription,
  SubscriptionCategory,
  BillingCycle,
} from '@/lib/types/subscription';

/**
 * Convert any billing cycle price to monthly equivalent
 */
export function calculateMonthlyPrice(
  price: number,
  cycle: BillingCycle,
): number {
  if (cycle === 'yearly') {
    return Math.round(price / 12);
  }
  return price;
}

/**
 * Calculate total cost grouped by category
 */
export function calculateCostByCategory(
  subscriptions: Subscription[],
): Record<SubscriptionCategory, number> {
  const result: Record<SubscriptionCategory, number> = {
    video: 0,
    music: 0,
    cloud: 0,
    productivity: 0,
    shopping: 0,
    gaming: 0,
    reading: 0,
    other: 0,
  };

  for (const sub of subscriptions) {
    if (sub.status === 'active' || sub.status === 'trial') {
      result[sub.category] += sub.monthlyPrice;
    }
  }

  return result;
}

/**
 * Calculate total monthly cost for all active subscriptions
 */
export function calculateTotalMonthlyCost(
  subscriptions: Subscription[],
): number {
  return subscriptions
    .filter((s) => s.status === 'active' || s.status === 'trial')
    .reduce((sum, s) => sum + s.monthlyPrice, 0);
}

/**
 * Calculate projected yearly cost
 */
export function calculateYearlyCost(
  subscriptions: Subscription[],
): number {
  return calculateTotalMonthlyCost(subscriptions) * 12;
}

/**
 * Calculate cost difference if switching billing cycle
 */
export function calculateCycleSavings(
  monthlyPrice: number,
  yearlyPrice: number,
): { monthlySavings: number; yearlySavings: number; percentSaved: number } {
  const yearlyEquivalent = monthlyPrice * 12;
  const yearlySavings = yearlyEquivalent - yearlyPrice;
  const monthlySavings = Math.round(yearlySavings / 12);
  const percentSaved =
    yearlyEquivalent > 0
      ? Math.round((yearlySavings / yearlyEquivalent) * 100)
      : 0;

  return { monthlySavings, yearlySavings, percentSaved };
}
