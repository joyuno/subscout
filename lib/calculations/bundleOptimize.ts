import type { Subscription } from '@/lib/types/subscription';
import { BUNDLE_DEALS, type BundleDeal } from '@/lib/constants/bundleDeals';

export interface BundleOptimization {
  bundle: BundleDeal;
  matchedSubscriptions: Subscription[];
  currentTotalCost: number;
  bundleCost: number;
  monthlySavings: number;
  explanation: string;
}

/**
 * Analyze which bundles could save money for the user
 */
export function analyzeBundleOptimization(
  subscriptions: Subscription[],
): BundleOptimization[] {
  const active = subscriptions.filter(
    (s) => s.status === 'active' || s.status === 'trial',
  );
  const activeNames = active.map((s) => s.name);

  const results: BundleOptimization[] = [];

  for (const bundle of BUNDLE_DEALS) {
    const matched = findMatchingSubscriptions(active, bundle);

    if (matched.length === 0) continue;

    const currentTotalCost = matched.reduce(
      (sum, sub) => sum + sub.monthlyPrice,
      0,
    );

    // Only suggest if bundle is cheaper
    if (bundle.price < currentTotalCost) {
      const monthlySavings = currentTotalCost - bundle.price;

      const matchedNames = matched.map((s) => s.name).join(', ');
      const explanation = `${matchedNames}을(를) ${bundle.name}으로 통합하면 월 ${monthlySavings.toLocaleString()}원을 절약할 수 있어요.`;

      results.push({
        bundle,
        matchedSubscriptions: matched,
        currentTotalCost,
        bundleCost: bundle.price,
        monthlySavings,
        explanation,
      });
    }
  }

  return results.sort((a, b) => b.monthlySavings - a.monthlySavings);
}

/**
 * Find subscriptions that match a bundle's included services
 */
function findMatchingSubscriptions(
  subscriptions: Subscription[],
  bundle: BundleDeal,
): Subscription[] {
  return subscriptions.filter((sub) =>
    bundle.includedServices.some(
      (included) =>
        sub.name.includes(included) ||
        included.includes(sub.name) ||
        normalizeServiceName(sub.name) === normalizeServiceName(included),
    ),
  );
}

/**
 * Calculate savings from switching to a specific bundle
 */
export function calculateBundleSavings(
  currentSubscriptions: Subscription[],
  bundle: BundleDeal,
): { savings: number; replacedCount: number } {
  const matched = findMatchingSubscriptions(currentSubscriptions, bundle);
  const currentCost = matched.reduce(
    (sum, sub) => sum + sub.monthlyPrice,
    0,
  );

  return {
    savings: Math.max(0, currentCost - bundle.price),
    replacedCount: matched.length,
  };
}

/**
 * Normalize service name for fuzzy matching
 */
function normalizeServiceName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[+]/g, '플러스');
}
