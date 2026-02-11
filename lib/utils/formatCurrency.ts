/**
 * Format a number as Korean Won currency
 * e.g., 12500 -> "₩12,500"
 * With decimals: 12500.5 -> "₩12,500.5"
 */
export function formatKRW(amount: number, decimals?: number): string {
  if (decimals !== undefined) {
    return `₩${amount.toLocaleString('ko-KR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  }
  // Show 1 decimal if amount has fractional part
  if (amount % 1 !== 0) {
    return `₩${amount.toLocaleString('ko-KR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
  }
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
