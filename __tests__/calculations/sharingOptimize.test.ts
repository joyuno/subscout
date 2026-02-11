import { describe, it, expect } from 'vitest';
import {
  calculateSharingSavings,
  calculateBreakEvenMembers,
  findSharingOpportunities,
  calculateTotalSharingPotential,
} from '@/lib/calculations/sharingOptimize';
import type { Subscription } from '@/lib/types/subscription';

describe('Sharing Optimize Calculations', () => {
  describe('calculateSharingSavings', () => {
    it('should calculate savings for Netflix 4-person sharing', () => {
      const currentPrice = 17000;
      const familyPlanPrice = 17000;
      const maxMembers = 4;
      const actualMembers = 4;

      const result = calculateSharingSavings(
        currentPrice,
        familyPlanPrice,
        maxMembers,
        actualMembers
      );

      const pricePerMember = Math.ceil(familyPlanPrice / maxMembers);
      expect(pricePerMember).toBe(4250);
      expect(result).toBe(12750); // 17000 - 4250
    });

    it('should calculate savings with partial members', () => {
      const currentPrice = 16900; // Spotify individual
      const familyPlanPrice = 16900; // Spotify family
      const maxMembers = 6;
      const actualMembers = 3;

      const result = calculateSharingSavings(
        currentPrice,
        familyPlanPrice,
        maxMembers,
        actualMembers
      );

      const pricePerMember = Math.ceil(familyPlanPrice / actualMembers);
      expect(pricePerMember).toBe(5634);
      expect(result).toBe(11266); // 16900 - 5634
    });

    it('should cap members at maxMembers', () => {
      const currentPrice = 10000;
      const familyPlanPrice = 20000;
      const maxMembers = 4;
      const actualMembers = 10; // More than max

      const result = calculateSharingSavings(
        currentPrice,
        familyPlanPrice,
        maxMembers,
        actualMembers
      );

      const pricePerMember = Math.ceil(familyPlanPrice / maxMembers);
      expect(result).toBe(currentPrice - pricePerMember);
    });

    it('should return 0 when no members', () => {
      const result = calculateSharingSavings(10000, 20000, 4, 0);
      expect(result).toBe(0);
    });

    it('should return 0 when negative members', () => {
      const result = calculateSharingSavings(10000, 20000, 4, -1);
      expect(result).toBe(0);
    });

    it('should handle single member (no sharing)', () => {
      const currentPrice = 10000;
      const familyPlanPrice = 20000;
      const maxMembers = 4;
      const actualMembers = 1;

      const result = calculateSharingSavings(
        currentPrice,
        familyPlanPrice,
        maxMembers,
        actualMembers
      );

      // With 1 member, price per member equals family plan price
      expect(result).toBe(currentPrice - familyPlanPrice);
      expect(result).toBeLessThan(0); // Not worth it
    });
  });

  describe('calculateBreakEvenMembers', () => {
    it('should calculate break-even for Netflix', () => {
      const individualPrice = 17000;
      const familyPlanPrice = 17000;

      const result = calculateBreakEvenMembers(individualPrice, familyPlanPrice);
      expect(result).toBe(1); // Already worth it with 1 person
    });

    it('should calculate break-even for typical family plan', () => {
      const individualPrice = 10000;
      const familyPlanPrice = 25000;

      const result = calculateBreakEvenMembers(individualPrice, familyPlanPrice);
      expect(result).toBe(3); // Need 3 people: 25000/10000 = 2.5 -> 3
    });

    it('should return Infinity when individual price is 0', () => {
      const result = calculateBreakEvenMembers(0, 20000);
      expect(result).toBe(Infinity);
    });

    it('should return Infinity when individual price is negative', () => {
      const result = calculateBreakEvenMembers(-100, 20000);
      expect(result).toBe(Infinity);
    });

    it('should handle Apple TV+ example', () => {
      const individualPrice = 9900;
      const familyPlanPrice = 14900;

      const result = calculateBreakEvenMembers(individualPrice, familyPlanPrice);
      expect(result).toBe(2); // 14900/9900 = 1.5 -> 2
    });
  });

  describe('findSharingOpportunities', () => {
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
        name: '유튜브 프리미엄',
        category: 'video',
        icon: '▶️',
        billingCycle: 'monthly',
        price: 14900,
        monthlyPrice: 14900,
        billingDay: 1,
        status: 'active',
        isShared: true, // Already shared
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
      {
        id: '4',
        name: 'ChatGPT',
        category: 'productivity',
        icon: '🤖',
        billingCycle: 'monthly',
        price: 30000,
        monthlyPrice: 30000,
        billingDay: 1,
        status: 'cancelled',
        isShared: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ];

    it('should find sharing opportunities for eligible services', () => {
      const opportunities = findSharingOpportunities(mockSubscriptions);

      expect(opportunities.length).toBeGreaterThan(0);

      const netflixOpp = opportunities.find(
        (o) => o.subscription.name === '넷플릭스'
      );
      expect(netflixOpp).toBeDefined();

      if (netflixOpp) {
        expect(netflixOpp.maxMembers).toBe(4);
        expect(netflixOpp.savingsPerPerson).toBeGreaterThan(0);
      }
    });

    it('should exclude already shared subscriptions', () => {
      const opportunities = findSharingOpportunities(mockSubscriptions);

      const youtubeOpp = opportunities.find(
        (o) => o.subscription.name === '유튜브 프리미엄'
      );
      expect(youtubeOpp).toBeUndefined();
    });

    it('should exclude cancelled subscriptions', () => {
      const opportunities = findSharingOpportunities(mockSubscriptions);

      const chatgptOpp = opportunities.find(
        (o) => o.subscription.name === 'ChatGPT'
      );
      expect(chatgptOpp).toBeUndefined();
    });

    it('should sort by savings descending', () => {
      const opportunities = findSharingOpportunities(mockSubscriptions);

      for (let i = 0; i < opportunities.length - 1; i++) {
        expect(opportunities[i].savingsPerPerson).toBeGreaterThanOrEqual(
          opportunities[i + 1].savingsPerPerson
        );
      }
    });

    it('should return empty array for subscriptions without family plans', () => {
      const noFamilyPlanSubs: Subscription[] = [
        {
          id: '1',
          name: '멜론',
          category: 'music',
          icon: '🍈',
          billingCycle: 'monthly',
          price: 10900,
          monthlyPrice: 10900,
          billingDay: 1,
          status: 'active',
          isShared: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      const opportunities = findSharingOpportunities(noFamilyPlanSubs);
      expect(opportunities).toHaveLength(0);
    });

    it('should calculate Netflix sharing correctly', () => {
      const netflixOnly: Subscription[] = [
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
      ];

      const opportunities = findSharingOpportunities(netflixOnly);
      expect(opportunities).toHaveLength(1);

      const opp = opportunities[0];
      expect(opp.familyPlanPrice).toBe(17000);
      expect(opp.maxMembers).toBe(4);
      expect(opp.pricePerMember).toBe(4250); // ceil(17000/4)
      expect(opp.savingsPerPerson).toBe(12750); // 17000 - 4250
      expect(opp.breakEvenMembers).toBe(1);
    });
  });

  describe('calculateTotalSharingPotential', () => {
    it('should sum all potential savings', () => {
      const mockSubs: Subscription[] = [
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
      ];

      const total = calculateTotalSharingPotential(mockSubs);
      expect(total).toBeGreaterThan(0);

      // Should be sum of Netflix + Spotify savings
      const opportunities = findSharingOpportunities(mockSubs);
      const expectedTotal = opportunities.reduce(
        (sum, opp) => sum + opp.savingsPerPerson,
        0
      );
      expect(total).toBe(expectedTotal);
    });

    it('should return 0 for subscriptions without sharing options', () => {
      const noSharingSubs: Subscription[] = [
        {
          id: '1',
          name: '멜론',
          category: 'music',
          icon: '🍈',
          billingCycle: 'monthly',
          price: 10900,
          monthlyPrice: 10900,
          billingDay: 1,
          status: 'active',
          isShared: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      const total = calculateTotalSharingPotential(noSharingSubs);
      expect(total).toBe(0);
    });
  });
});
