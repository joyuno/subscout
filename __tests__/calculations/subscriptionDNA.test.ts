import { describe, it, expect } from 'vitest';
import {
  analyzeDNA,
  getDNARadarData,
  DNA_PROFILES,
} from '@/lib/calculations/subscriptionDNA';
import type { Subscription } from '@/lib/types/subscription';

describe('Subscription DNA Calculations', () => {
  describe('analyzeDNA', () => {
    it('should return minimalist for 0 subscriptions', () => {
      const result = analyzeDNA([]);
      expect(result.type).toBe('minimalist');
      expect(result.name).toBe('미니멀리스트');
    });

    it('should return minimalist for 1-2 active subscriptions', () => {
      const subs: Subscription[] = [
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

      const result = analyzeDNA(subs);
      expect(result.type).toBe('minimalist');
    });

    it('should return maximalist for 6+ subscriptions with diverse categories', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Spotify', category: 'music', icon: '🎧', billingCycle: 'monthly', price: 10900, monthlyPrice: 10900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '3', name: 'Shopping', category: 'shopping', icon: '🛍️', billingCycle: 'monthly', price: 5000, monthlyPrice: 5000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '4', name: 'Reading', category: 'reading', icon: '📖', billingCycle: 'monthly', price: 9900, monthlyPrice: 9900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '5', name: 'Cloud', category: 'cloud', icon: '☁️', billingCycle: 'monthly', price: 3000, monthlyPrice: 3000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '6', name: 'Notion', category: 'productivity', icon: '📝', billingCycle: 'monthly', price: 10000, monthlyPrice: 10000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = analyzeDNA(subs);
      // 2 entertainment (video + music) out of 6 = 33%, less than 60%, so maximalist
      expect(result.type).toBe('maximalist');
    });

    it('should return entertainment for 3+ entertainment services (>50%)', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Disney+', category: 'video', icon: '🏰', billingCycle: 'monthly', price: 9900, monthlyPrice: 9900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '3', name: 'Spotify', category: 'music', icon: '🎧', billingCycle: 'monthly', price: 10900, monthlyPrice: 10900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '4', name: 'Cloud', category: 'cloud', icon: '☁️', billingCycle: 'monthly', price: 3000, monthlyPrice: 3000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = analyzeDNA(subs);
      expect(result.type).toBe('entertainment');
      expect(result.name).toBe('엔터테인먼트 마니아');
    });

    it('should return productivity for 2+ productivity services (>=40%)', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Notion', category: 'productivity', icon: '📝', billingCycle: 'monthly', price: 10000, monthlyPrice: 10000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'ChatGPT', category: 'productivity', icon: '🤖', billingCycle: 'monthly', price: 30000, monthlyPrice: 30000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '3', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = analyzeDNA(subs);
      expect(result.type).toBe('productivity');
      expect(result.name).toBe('생산성 전문가');
    });

    it('should return techie for cloud + productivity combo', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'iCloud', category: 'cloud', icon: '☁️', billingCycle: 'monthly', price: 3300, monthlyPrice: 3300, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Notion', category: 'productivity', icon: '📝', billingCycle: 'monthly', price: 10000, monthlyPrice: 10000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '3', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = analyzeDNA(subs);
      expect(result.type).toBe('techie');
      expect(result.name).toBe('테크 얼리어답터');
    });

    it('should return shopper for 2+ shopping services', () => {
      const subs: Subscription[] = [
        { id: '1', name: '쿠팡 로켓와우', category: 'shopping', icon: '🚀', billingCycle: 'monthly', price: 7890, monthlyPrice: 7890, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: '배민클럽', category: 'shopping', icon: '🍔', billingCycle: 'monthly', price: 4990, monthlyPrice: 4990, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '3', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = analyzeDNA(subs);
      expect(result.type).toBe('shopper');
      expect(result.name).toBe('스마트 쇼퍼');
    });

    it('should return balanced for diverse categories', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Spotify', category: 'music', icon: '🎧', billingCycle: 'monthly', price: 10900, monthlyPrice: 10900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '3', name: 'iCloud', category: 'cloud', icon: '☁️', billingCycle: 'monthly', price: 3300, monthlyPrice: 3300, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '4', name: '밀리의 서재', category: 'reading', icon: '📖', billingCycle: 'monthly', price: 9900, monthlyPrice: 9900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = analyzeDNA(subs);
      expect(result.type).toBe('balanced');
      expect(result.name).toBe('밸런스 마스터');
    });

    it('should exclude cancelled subscriptions', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Cancelled', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'cancelled', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = analyzeDNA(subs);
      expect(result.type).toBe('minimalist'); // Only 1 active
    });

    it('should include trial subscriptions', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Trial 1', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'trial', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Trial 2', category: 'music', icon: '🎧', billingCycle: 'monthly', price: 10900, monthlyPrice: 10900, billingDay: 1, status: 'trial', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = analyzeDNA(subs);
      expect(result.type).toBe('minimalist'); // 2 trials
    });

    it('should return entertainment for 6+ with 60% entertainment', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Disney+', category: 'video', icon: '🏰', billingCycle: 'monthly', price: 9900, monthlyPrice: 9900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '3', name: 'Spotify', category: 'music', icon: '🎧', billingCycle: 'monthly', price: 10900, monthlyPrice: 10900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '4', name: 'Apple Music', category: 'music', icon: '🎵', billingCycle: 'monthly', price: 11000, monthlyPrice: 11000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '5', name: 'Cloud', category: 'cloud', icon: '☁️', billingCycle: 'monthly', price: 3000, monthlyPrice: 3000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '6', name: 'Reading', category: 'reading', icon: '📖', billingCycle: 'monthly', price: 9900, monthlyPrice: 9900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = analyzeDNA(subs);
      // 4 entertainment (video + music) out of 6 = 66.7%
      expect(result.type).toBe('entertainment');
    });
  });

  describe('getDNARadarData', () => {
    it('should return data for all 8 categories', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = getDNARadarData(subs);

      expect(result).toHaveLength(8);
      expect(result.map(r => r.category)).toContain('영상 스트리밍');
      expect(result.map(r => r.category)).toContain('음악');
      expect(result.map(r => r.category)).toContain('클라우드');
      expect(result.map(r => r.category)).toContain('생산성');
      expect(result.map(r => r.category)).toContain('쇼핑/배달');
      expect(result.map(r => r.category)).toContain('게임');
      expect(result.map(r => r.category)).toContain('독서');
      expect(result.map(r => r.category)).toContain('기타');
    });

    it('should count subscriptions correctly', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Disney+', category: 'video', icon: '🏰', billingCycle: 'monthly', price: 9900, monthlyPrice: 9900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = getDNARadarData(subs);

      const videoData = result.find(r => r.category === '영상 스트리밍');
      expect(videoData?.count).toBe(2);
    });

    it('should sum spending correctly', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Disney+', category: 'video', icon: '🏰', billingCycle: 'monthly', price: 9900, monthlyPrice: 9900, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = getDNARadarData(subs);

      const videoData = result.find(r => r.category === '영상 스트리밍');
      expect(videoData?.spend).toBe(26900); // 17000 + 9900
    });

    it('should exclude cancelled subscriptions', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', name: 'Cancelled', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 15000, monthlyPrice: 15000, billingDay: 1, status: 'cancelled', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = getDNARadarData(subs);

      const videoData = result.find(r => r.category === '영상 스트리밍');
      expect(videoData?.count).toBe(1);
      expect(videoData?.spend).toBe(17000);
    });

    it('should return 0 for unused categories', () => {
      const subs: Subscription[] = [
        { id: '1', name: 'Netflix', category: 'video', icon: '🎬', billingCycle: 'monthly', price: 17000, monthlyPrice: 17000, billingDay: 1, status: 'active', isShared: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ];

      const result = getDNARadarData(subs);

      const gamingData = result.find(r => r.category === '게임');
      expect(gamingData?.count).toBe(0);
      expect(gamingData?.spend).toBe(0);
    });
  });

  describe('DNA_PROFILES', () => {
    it('should have all DNA types', () => {
      expect(DNA_PROFILES.entertainment).toBeDefined();
      expect(DNA_PROFILES.productivity).toBeDefined();
      expect(DNA_PROFILES.balanced).toBeDefined();
      expect(DNA_PROFILES.minimalist).toBeDefined();
      expect(DNA_PROFILES.maximalist).toBeDefined();
      expect(DNA_PROFILES.techie).toBeDefined();
      expect(DNA_PROFILES.shopper).toBeDefined();
    });

    it('should have required properties for each profile', () => {
      Object.values(DNA_PROFILES).forEach(profile => {
        expect(profile).toHaveProperty('type');
        expect(profile).toHaveProperty('name');
        expect(profile).toHaveProperty('description');
        expect(profile).toHaveProperty('emoji');
        expect(profile).toHaveProperty('characteristics');
        expect(profile).toHaveProperty('tip');
      });
    });

    it('should have characteristics array', () => {
      Object.values(DNA_PROFILES).forEach(profile => {
        expect(Array.isArray(profile.characteristics)).toBe(true);
        expect(profile.characteristics.length).toBeGreaterThan(0);
      });
    });
  });
});
