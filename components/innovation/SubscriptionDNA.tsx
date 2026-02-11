'use client';

import { useMemo } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { analyzeDNA } from '@/lib/calculations/subscriptionDNA';
import { formatKRW } from '@/lib/utils/formatCurrency';
import { CATEGORY_LABELS, CATEGORY_COLORS, type SubscriptionCategory } from '@/lib/types/subscription';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

export function SubscriptionDNA() {
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const getActiveSubscriptions = useSubscriptionStore((s) => s.getActiveSubscriptions);
  const getTotalMonthlyCost = useSubscriptionStore((s) => s.getTotalMonthlyCost);

  const dnaProfile = useMemo(() => analyzeDNA(subscriptions), [subscriptions]);
  const activeSubscriptions = useMemo(() => getActiveSubscriptions(), [subscriptions]);
  const totalCost = useMemo(() => getTotalMonthlyCost(), [subscriptions]);

  // Calculate category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<SubscriptionCategory, { count: number; spend: number }> = {
      video: { count: 0, spend: 0 },
      music: { count: 0, spend: 0 },
      cloud: { count: 0, spend: 0 },
      productivity: { count: 0, spend: 0 },
      shopping: { count: 0, spend: 0 },
      gaming: { count: 0, spend: 0 },
      reading: { count: 0, spend: 0 },
      other: { count: 0, spend: 0 },
    };

    for (const sub of activeSubscriptions) {
      breakdown[sub.category].count++;
      breakdown[sub.category].spend += sub.monthlyPrice;
    }

    return Object.entries(breakdown)
      .filter(([_, data]) => data.spend > 0)
      .map(([category, data]) => ({
        category: category as SubscriptionCategory,
        label: CATEGORY_LABELS[category as SubscriptionCategory],
        color: CATEGORY_COLORS[category as SubscriptionCategory],
        spend: data.spend,
        percentage: totalCost > 0 ? (data.spend / totalCost) * 100 : 0,
      }))
      .sort((a, b) => b.spend - a.spend);
  }, [activeSubscriptions, totalCost]);

  const handleShare = () => {
    const text = `나의 구독 DNA는 [${dnaProfile.emoji} ${dnaProfile.name}] 타입!\n월 ${formatKRW(totalCost)}를 구독에 사용 중 🔍 SubScout에서 확인`;
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다!');
  };

  if (activeSubscriptions.length === 0) {
    return null;
  }

  // Get dominant category color for gradient
  const dominantColor = categoryBreakdown[0]?.color || '#3b82f6';

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8 shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${dominantColor}15 0%, ${dominantColor}05 100%)`,
        border: `2px solid ${dominantColor}30`,
      }}
    >
      {/* DNA Type Result */}
      <div className="text-center mb-8">
        <div className="text-7xl mb-4">{dnaProfile.emoji}</div>
        <h2 className="text-3xl font-bold mb-2">{dnaProfile.name}</h2>
        <p className="text-lg text-muted-foreground mb-4">{dnaProfile.description}</p>
        <div className="inline-block bg-background/50 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
          월 {formatKRW(totalCost)} • 구독 {activeSubscriptions.length}개
        </div>
      </div>

      {/* Characteristics */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">특징</h3>
        <div className="space-y-2">
          {dnaProfile.characteristics.map((char, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dominantColor }} />
              <span className="text-sm">{char}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">카테고리별 지출</h3>
        <div className="space-y-3">
          {categoryBreakdown.map((item) => (
            <div key={item.category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">
                  {formatKRW(item.spend)} ({item.percentage.toFixed(0)}%)
                </span>
              </div>
              <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold mb-2">💡 절약 팁</h3>
        <p className="text-sm text-muted-foreground">{dnaProfile.tip}</p>
      </div>

      {/* Share Button */}
      <Button onClick={handleShare} className="w-full" variant="outline" size="lg">
        <Share2 className="mr-2 h-4 w-4" />
        공유하기
      </Button>
    </div>
  );
}
