/**
 * Format a number as Korean Won currency
 * e.g., 12500 -> "₩12,500"
 */
export function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

/**
 * Format Korean Won in compact form for large numbers
 * e.g., 12500 -> "₩1.2만"
 * e.g., 1500000 -> "₩150만"
 */
export function formatKRWCompact(amount: number): string {
  if (amount >= 100000000) {
    const billions = amount / 100000000;
    return `₩${billions.toFixed(1)}억`;
  }
  if (amount >= 10000) {
    const tenThousands = amount / 10000;
    if (tenThousands >= 100) {
      return `₩${Math.round(tenThousands)}만`;
    }
    return `₩${tenThousands.toFixed(1)}만`;
  }
  return formatKRW(amount);
}

/**
 * Format as plain number with commas (no currency symbol)
 */
export function formatNumber(amount: number): string {
  return amount.toLocaleString('ko-KR');
}
