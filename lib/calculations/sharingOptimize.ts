import type { Subscription } from '@/lib/types/subscription';
import { SERVICE_PRESETS } from '@/lib/constants/servicePresets';

export interface SharingOpportunity {
  subscription: Subscription;
  familyPlanName: string;
  familyPlanPrice: number;
  maxMembers: number;
  individualPrice: number;
  pricePerMember: number;
  savingsPerPerson: number;
  breakEvenMembers: number;
}

/**
 * Calculate savings from sharing a family plan
 */
export function calculateSharingSavings(
  currentPrice: number,
  familyPlanPrice: number,
  maxMembers: number,
  actualMembers: number,
): number {
  const effectiveMembers = Math.min(actualMembers, maxMembers);
  if (effectiveMembers <= 0) return 0;

  const pricePerMember = Math.ceil(familyPlanPrice / effectiveMembers);
  return currentPrice - pricePerMember;
}

/**
 * Calculate minimum members needed for family plan to be cheaper
 */
export function calculateBreakEvenMembers(
  individualPrice: number,
  familyPlanPrice: number,
): number {
  if (individualPrice <= 0) return Infinity;
  return Math.ceil(familyPlanPrice / individualPrice);
}

/**
 * Find all sharing opportunities from user's subscriptions
 */
export function findSharingOpportunities(
  subscriptions: Subscription[],
): SharingOpportunity[] {
  const opportunities: SharingOpportunity[] = [];

  for (const sub of subscriptions) {
    if (sub.status !== 'active' && sub.status !== 'trial') continue;
    if (sub.isShared) continue;

    const preset = SERVICE_PRESETS[sub.name];
    if (!preset?.familyPlan) continue;

    const { familyPlan } = preset;
    const familyMonthlyPrice =
      familyPlan.cycle === 'yearly'
        ? Math.round(familyPlan.price / 12)
        : familyPlan.price;

    const pricePerMember = Math.ceil(
      familyMonthlyPrice / familyPlan.maxMembers,
    );
    const savingsPerPerson = sub.monthlyPrice - pricePerMember;
    const breakEvenMembers = calculateBreakEvenMembers(
      sub.monthlyPrice,
      familyMonthlyPrice,
    );

    if (savingsPerPerson > 0) {
      opportunities.push({
        subscription: sub,
        familyPlanName: familyPlan.name,
        familyPlanPrice: familyMonthlyPrice,
        maxMembers: familyPlan.maxMembers,
        individualPrice: sub.monthlyPrice,
        pricePerMember,
        savingsPerPerson,
        breakEvenMembers,
      });
    }
  }

  return opportunities.sort((a, b) => b.savingsPerPerson - a.savingsPerPerson);
}

/**
 * Calculate total potential savings from all sharing opportunities
 */
export function calculateTotalSharingPotential(
  subscriptions: Subscription[],
): number {
  const opportunities = findSharingOpportunities(subscriptions);
  return opportunities.reduce((sum, opp) => sum + opp.savingsPerPerson, 0);
}
