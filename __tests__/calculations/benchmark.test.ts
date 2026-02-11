import { describe, it, expect } from 'vitest';
import { analyzeBenchmark, getBenchmarkSummary } from '@/lib/calculations/benchmark';

describe('Benchmark Calculations', () => {
  describe('analyzeBenchmark', () => {
    it('should return null for services without benchmark data', () => {
      const result = analyzeBenchmark('Unknown Service', 100);
      expect(result).toBeNull();
    });

    it('should identify heavy user (>= heavyUserMinutes)', () => {
      // Netflix: average 420, heavy 840
      const result = analyzeBenchmark('넷플릭스', 850);

      expect(result).not.toBeNull();
      expect(result?.level).toBe('heavy');
      expect(result?.feedback).toContain('훨씬 많이');
      expect(result?.feedback).toContain('헤비 유저');
      expect(result?.isVerified).toBe(true);
    });

    it('should identify average user (>= 80% of average)', () => {
      // Netflix: average 420, 80% = 336
      const result = analyzeBenchmark('넷플릭스', 400);

      expect(result).not.toBeNull();
      expect(result?.level).toBe('average');
      expect(result?.percentOfAverage).toBeGreaterThanOrEqual(80);
      expect(result?.feedback).toContain('평균 수준');
    });

    it('should identify below average user (30-80% of average)', () => {
      // Netflix: average 420, 30% = 126, 80% = 336
      const result = analyzeBenchmark('넷플릭스', 200);

      expect(result).not.toBeNull();
      expect(result?.level).toBe('below');
      expect(result?.percentOfAverage).toBeGreaterThanOrEqual(30);
      expect(result?.percentOfAverage).toBeLessThan(80);
      expect(result?.feedback).toContain('평균보다 적어요');
      expect(result?.feedback).toContain('다운그레이드');
    });

    it('should identify minimal user (< 30% of average)', () => {
      // Netflix: average 420, 30% = 126
      const result = analyzeBenchmark('넷플릭스', 60);

      expect(result).not.toBeNull();
      expect(result?.level).toBe('minimal');
      expect(result?.percentOfAverage).toBeLessThan(30);
      expect(result?.feedback).toContain('거의 사용하지');
      expect(result?.feedback).toContain('해지');
    });

    it('should calculate correct percentOfAverage', () => {
      // Netflix: average 420
      const result = analyzeBenchmark('넷플릭스', 210);

      expect(result).not.toBeNull();
      expect(result?.percentOfAverage).toBe(50); // 210/420 * 100 = 50
    });

    it('should handle zero usage', () => {
      const result = analyzeBenchmark('넷플릭스', 0);

      expect(result).not.toBeNull();
      expect(result?.percentOfAverage).toBe(0);
      expect(result?.level).toBe('minimal');
    });

    it('should work with different services', () => {
      // YouTube Premium: average 840, heavy 1680
      const heavyResult = analyzeBenchmark('유튜브프리미엄', 1700);
      expect(heavyResult?.level).toBe('heavy');

      // Spotify: average 600, heavy 1200
      const averageResult = analyzeBenchmark('스포티파이', 550);
      expect(averageResult?.level).toBe('average');
    });

    it('should handle service name variations', () => {
      // Test partial match capability
      const result = analyzeBenchmark('넷플릭스', 420);
      expect(result).not.toBeNull();
      expect(result?.averageMinutes).toBe(420);
    });

    it('should return user minutes in result', () => {
      const userMinutes = 300;
      const result = analyzeBenchmark('넷플릭스', userMinutes);

      expect(result).not.toBeNull();
      expect(result?.userMinutes).toBe(userMinutes);
    });

    it('should return average minutes in result', () => {
      const result = analyzeBenchmark('넷플릭스', 300);

      expect(result).not.toBeNull();
      expect(result?.averageMinutes).toBe(420); // Netflix average
    });

    it('should handle edge case at exact heavy threshold', () => {
      // Netflix heavy threshold is 840
      const result = analyzeBenchmark('넷플릭스', 840);

      expect(result).not.toBeNull();
      expect(result?.level).toBe('heavy');
    });

    it('should handle edge case at exact 80% threshold', () => {
      // Netflix average 420, 80% = 336
      const result = analyzeBenchmark('넷플릭스', 336);

      expect(result).not.toBeNull();
      expect(result?.level).toBe('average');
    });

    it('should handle edge case at exact 30% threshold', () => {
      // Netflix average 420, 30% = 126
      const result = analyzeBenchmark('넷플릭스', 126);

      expect(result).not.toBeNull();
      expect(result?.level).toBe('below');
    });
  });

  describe('getBenchmarkSummary', () => {
    it('should return feedback text for known service', () => {
      const summary = getBenchmarkSummary('넷플릭스', 420);

      expect(summary).toContain('넷플릭스');
      expect(summary.length).toBeGreaterThan(0);
    });

    it('should return "no data" message for unknown service', () => {
      const summary = getBenchmarkSummary('Unknown Service', 100);

      expect(summary).toContain('평균 사용량 데이터가 없습니다');
    });

    it('should return different messages for different usage levels', () => {
      const heavySummary = getBenchmarkSummary('넷플릭스', 1000);
      const minimalSummary = getBenchmarkSummary('넷플릭스', 50);

      expect(heavySummary).not.toBe(minimalSummary);
      expect(heavySummary).toContain('헤비 유저');
      expect(minimalSummary).toContain('해지');
    });
  });
});
