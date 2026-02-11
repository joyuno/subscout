import type { BenchmarkResult, BenchmarkLevel } from '@/lib/types/usage';
import { getUsageBenchmark } from '@/lib/constants/averageUsage';

/**
 * Analyze user's usage compared to the Korean average for a service
 */
export function analyzeBenchmark(
  serviceName: string,
  userWeeklyMinutes: number,
): BenchmarkResult | null {
  const benchmark = getUsageBenchmark(serviceName);
  if (!benchmark) return null;

  const percentOfAverage =
    benchmark.averageWeeklyMinutes > 0
      ? Math.round(
          (userWeeklyMinutes / benchmark.averageWeeklyMinutes) * 100,
        )
      : 0;

  let level: BenchmarkLevel;
  let feedback: string;

  if (userWeeklyMinutes >= benchmark.heavyUserMinutes) {
    level = 'heavy';
    feedback = `${serviceName}을(를) 한국 평균보다 훨씬 많이 사용하고 있어요! 헤비 유저입니다.`;
  } else if (percentOfAverage >= 80) {
    level = 'average';
    feedback = `${serviceName} 사용량이 한국 평균 수준이에요.`;
  } else if (percentOfAverage >= 30) {
    level = 'below';
    feedback = `${serviceName} 사용량이 한국 평균보다 적어요. 요금제 다운그레이드를 검토해보세요.`;
  } else {
    level = 'minimal';
    feedback = `${serviceName}을(를) 거의 사용하지 않고 있어요. 해지를 고려해보세요.`;
  }

  return {
    level,
    percentOfAverage,
    averageMinutes: benchmark.averageWeeklyMinutes,
    userMinutes: userWeeklyMinutes,
    feedback,
    isVerified: true,
  };
}

/**
 * Get a textual summary of benchmark comparison
 */
export function getBenchmarkSummary(
  serviceName: string,
  userWeeklyMinutes: number,
): string {
  const result = analyzeBenchmark(serviceName, userWeeklyMinutes);
  if (!result) {
    return `${serviceName}에 대한 평균 사용량 데이터가 없습니다.`;
  }
  return result.feedback;
}
