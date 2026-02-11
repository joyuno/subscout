'use client';

import { TrendingDown, Sparkles } from 'lucide-react';
import { formatKRW } from '@/lib/utils/formatCurrency';

interface SavingsTrackerProps {
  totalSavings: number;
  monthlySavings: number;
}

export function SavingsTracker({
  totalSavings,
  monthlySavings,
}: SavingsTrackerProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-slate-900">누적 절약액</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 mb-1">총 절약 금액</p>
          <p className="text-4xl font-bold text-green-600">
            {formatKRW(totalSavings)}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-green-200">
          <TrendingDown className="w-4 h-4 text-green-600" />
          <div>
            <p className="text-sm text-slate-600">월 절감액</p>
            <p className="text-lg font-semibold text-green-700">
              {formatKRW(monthlySavings)}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 pt-2">
          구독 취소 및 최적화를 통해 절약한 금액입니다
        </p>
      </div>
    </div>
  );
}
