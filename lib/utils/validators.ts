/**
 * Validate usage time (max 168 hours per week = 10080 minutes)
 */
export function validateUsageTime(
  hours: number,
  minutes: number,
): { valid: boolean; error?: string } {
  const totalMinutes = hours * 60 + minutes;

  if (hours < 0 || minutes < 0) {
    return { valid: false, error: '시간은 0 이상이어야 합니다.' };
  }

  if (minutes >= 60) {
    return { valid: false, error: '분은 0~59 사이여야 합니다.' };
  }

  if (totalMinutes > 10080) {
    return {
      valid: false,
      error: '주당 최대 168시간(7일)을 초과할 수 없습니다.',
    };
  }

  return { valid: true };
}

/**
 * Validate subscription price
 */
export function validatePrice(price: number): {
  valid: boolean;
  error?: string;
} {
  if (typeof price !== 'number' || isNaN(price)) {
    return { valid: false, error: '유효한 숫자를 입력해주세요.' };
  }

  if (price < 0) {
    return { valid: false, error: '가격은 0 이상이어야 합니다.' };
  }

  if (price > 1000000) {
    return {
      valid: false,
      error: '가격이 너무 높습니다. 확인해주세요.',
    };
  }

  return { valid: true };
}

/**
 * Validate billing day (1-31)
 */
export function validateBillingDay(day: number): {
  valid: boolean;
  error?: string;
} {
  if (!Number.isInteger(day)) {
    return { valid: false, error: '정수를 입력해주세요.' };
  }

  if (day < 1 || day > 31) {
    return { valid: false, error: '결제일은 1~31 사이여야 합니다.' };
  }

  return { valid: true };
}
