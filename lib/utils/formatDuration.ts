import { WEEKS_PER_MONTH } from '@/lib/calculations/roi';

/**
 * Format minutes to hours and minutes in Korean
 * e.g., 150 -> "2시간 30분"
 */
export function formatMinutesToHM(minutes: number): string {
  if (minutes <= 0) return '0분';

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

/**
 * Convert weekly minutes to estimated monthly minutes
 */
export function formatWeeklyToMonthly(weeklyMinutes: number): number {
  return Math.round(weeklyMinutes * WEEKS_PER_MONTH);
}

/**
 * Format weekly usage as a display string
 * e.g., 420 -> "주 7시간 (월 약 30시간)"
 */
export function formatWeeklyUsage(weeklyMinutes: number): string {
  const weekly = formatMinutesToHM(weeklyMinutes);
  const monthly = formatMinutesToHM(formatWeeklyToMonthly(weeklyMinutes));
  return `주 ${weekly} (월 약 ${monthly})`;
}
