'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatKRW } from '@/lib/utils/formatCurrency';

interface CostSummaryCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export function CostSummaryCard({
  title,
  amount,
  subtitle,
  change,
  icon,
}: CostSummaryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-bold text-slate-900">{formatKRW(amount)}</p>

        {subtitle && (
          <p className="text-sm text-slate-500">{subtitle}</p>
        )}

        {change && (
          <div className="flex items-center gap-1 text-sm">
            {change.isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={
                change.isPositive ? 'text-green-600' : 'text-red-600'
              }
            >
              {change.isPositive ? '+' : ''}
              {formatKRW(change.value)}
            </span>
            <span className="text-slate-500">지난달 대비</span>
          </div>
        )}
      </div>
    </div>
  );
}
