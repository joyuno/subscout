'use client';

import { useMemo } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { getCostFeeling, getTotalCostFeeling } from '@/lib/calculations/costFeeling';
import { formatKRW } from '@/lib/utils/formatCurrency';
import type { Subscription } from '@/lib/types/subscription';

interface CostFeelingItemProps {
  subscription: Subscription;
}

function CostFeelingItem({ subscription }: CostFeelingItemProps) {
  const feeling = useMemo(() => getCostFeeling(subscription.monthlyPrice), [subscription.monthlyPrice]);

  return (
    <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{subscription.icon}</span>
            <h4 className="font-semibold">{subscription.name}</h4>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{formatKRW(subscription.monthlyPrice)}/월</p>
        </div>
      </div>

      {/* Daily Cost */}
      <div className="mb-3">
        <div className="text-2xl font-bold" style={{ color: feeling.levelColor }}>
          하루 {formatKRW(feeling.dailyCost)}
        </div>
        <div className="text-sm text-muted-foreground">{feeling.comparisonText}</div>
      </div>

      {/* Thermometer Gauge */}
      <div className="relative">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>저렴</span>
          <span>비쌈</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((feeling.dailyCost / 2000) * 100, 100)}%`,
              background: `linear-gradient(to right, #22c55e, #eab308, #f97316, #ef4444)`,
            }}
          />
        </div>
        <div className="text-xs text-center mt-2 font-medium" style={{ color: feeling.levelColor }}>
          {feeling.levelLabel}
        </div>
      </div>
    </div>
  );
}

export function CostFeelingMeter() {
  const getActiveSubscriptions = useSubscriptionStore((s) => s.getActiveSubscriptions);
  const getTotalMonthlyCost = useSubscriptionStore((s) => s.getTotalMonthlyCost);

  const activeSubscriptions = useMemo(() => getActiveSubscriptions(), []);
  const totalCost = useMemo(() => getTotalMonthlyCost(), []);
  const totalFeeling = useMemo(() => getTotalCostFeeling(totalCost), [totalCost]);

  if (activeSubscriptions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">돈값 미터</h3>
        <p className="text-muted-foreground">구독료를 일상적인 물건으로 비교해보세요</p>
      </div>

      {/* Individual Subscriptions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeSubscriptions.map((sub) => (
          <CostFeelingItem key={sub.id} subscription={sub} />
        ))}
      </div>

      {/* Total Summary */}
      <div className="rounded-xl border-2 bg-gradient-to-br from-primary/5 to-primary/10 p-6">
        <h4 className="text-lg font-semibold mb-4">전체 구독료</h4>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-sm text-muted-foreground">하루 평균</div>
            <div className="text-2xl font-bold">{formatKRW(totalFeeling.dailyCost)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">월 합계</div>
            <div className="text-2xl font-bold">{formatKRW(totalCost)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">연 합계</div>
            <div className="text-2xl font-bold">{formatKRW(totalFeeling.yearlyEquivalent)}</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-background/50 backdrop-blur-sm rounded-lg">
          <p className="text-center font-medium">{totalFeeling.comparisonText}</p>
        </div>
      </div>
    </div>
  );
}
