'use client';

import { useMemo } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { getCostFeeling, getTotalCostFeeling } from '@/lib/calculations/costFeeling';
import { formatKRW } from '@/lib/utils/formatCurrency';
import type { Subscription } from '@/lib/types/subscription';
import { BrandIcon } from '@/components/subscription/BrandIcon';

interface CostFeelingItemProps {
  subscription: Subscription;
}

function CostFeelingItem({ subscription }: CostFeelingItemProps) {
  const feeling = useMemo(() => getCostFeeling(subscription.monthlyPrice), [subscription.monthlyPrice]);

  // Map feeling level to Toss-style color tokens
  const gaugePercent = Math.min((feeling.dailyCost / 2000) * 100, 100);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-border/80 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <BrandIcon name={subscription.name} icon={subscription.icon} size="sm" />
          <div>
            <h4 className="font-bold text-sm text-foreground">{subscription.name}</h4>
            <p className="text-xs text-muted-foreground font-medium">{formatKRW(subscription.monthlyPrice)}/월</p>
          </div>
        </div>
      </div>

      {/* Daily Cost -- Large prominent number */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground font-semibold mb-1">하루 비용</p>
        <div className="text-2xl font-extrabold tracking-tight" style={{ color: feeling.levelColor }}>
          {formatKRW(feeling.dailyCost)}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 font-medium">{feeling.comparisonText}</div>
      </div>

      {/* Gauge bar -- Toss-style with segments */}
      <div className="relative">
        <div className="flex gap-0.5 mb-1.5">
          {[0, 1, 2, 3, 4].map((segment) => {
            const segmentStart = segment * 20;
            const isActive = gaugePercent > segmentStart;
            const segmentColors = ['#1FC08E', '#8BC34A', '#FFA826', '#FF7043', '#F04452'];
            return (
              <div
                key={segment}
                className="h-2 flex-1 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: isActive ? segmentColors[segment] : 'var(--color-muted, hsl(var(--muted)))',
                  opacity: isActive ? 1 : 0.3,
                }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
          <span>저렴</span>
          <span>보통</span>
          <span>비쌈</span>
        </div>
      </div>

      {/* Level badge */}
      <div className="mt-3 flex justify-center">
        <span
          className="text-[11px] font-bold px-3 py-1 rounded-full"
          style={{
            color: feeling.levelColor,
            backgroundColor: `${feeling.levelColor}15`,
          }}
        >
          {feeling.levelLabel}
        </span>
      </div>
    </div>
  );
}

export function CostFeelingMeter() {
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const getActiveSubscriptions = useSubscriptionStore((s) => s.getActiveSubscriptions);
  const getTotalMonthlyCost = useSubscriptionStore((s) => s.getTotalMonthlyCost);

  const activeSubscriptions = useMemo(() => getActiveSubscriptions(), [subscriptions, getActiveSubscriptions]);
  const totalCost = useMemo(() => getTotalMonthlyCost(), [subscriptions, getTotalMonthlyCost]);
  const totalFeeling = useMemo(() => getTotalCostFeeling(totalCost), [totalCost]);

  if (activeSubscriptions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-extrabold text-foreground mb-1">돈값 미터</h3>
        <p className="text-sm text-muted-foreground font-medium">구독료를 일상적인 물건으로 비교해보세요</p>
      </div>

      {/* Individual Subscriptions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {activeSubscriptions.map((sub) => (
          <CostFeelingItem key={sub.id} subscription={sub} />
        ))}
      </div>

      {/* Total Summary -- Toss-style prominent card */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <h4 className="text-xs font-bold text-muted-foreground tracking-wide uppercase mb-5">전체 구독료 요약</h4>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-xs text-muted-foreground font-semibold mb-1">하루 평균</div>
            <div className="text-3xl font-extrabold text-foreground tracking-tight">{formatKRW(totalFeeling.dailyCost)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold mb-1">월 합계</div>
            <div className="text-3xl font-extrabold text-primary tracking-tight">{formatKRW(totalCost)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-semibold mb-1">연 합계</div>
            <div className="text-3xl font-extrabold text-foreground tracking-tight">{formatKRW(totalFeeling.yearlyEquivalent)}</div>
          </div>
        </div>
        <div className="mt-5 p-4 bg-primary/[0.04] rounded-xl border border-primary/10">
          <p className="text-center text-sm font-semibold text-foreground">{totalFeeling.comparisonText}</p>
        </div>
      </div>
    </div>
  );
}
