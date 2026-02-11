'use client';

import { useMemo } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { formatKRW } from '@/lib/utils/formatCurrency';

interface Badge {
  id: string;
  name: string;
  emoji: string;
  threshold: number;
  color: string;
}

const BADGES: Badge[] = [
  { id: 'bronze', name: '브론즈', emoji: '🥉', threshold: 10000, color: '#cd7f32' },
  { id: 'silver', name: '실버', emoji: '🥈', threshold: 30000, color: '#c0c0c0' },
  { id: 'gold', name: '골드', emoji: '🥇', threshold: 50000, color: '#ffd700' },
  { id: 'diamond', name: '다이아', emoji: '💎', threshold: 100000, color: '#b9f2ff' },
];

export function ChallengeTracker() {
  const cancelledSubscriptions = useSubscriptionStore((s) => s.cancelledSubscriptions);

  const totalSavings = useMemo(() => {
    return cancelledSubscriptions.reduce((sum, sub) => sum + sub.monthlyPrice, 0);
  }, [cancelledSubscriptions]);

  const currentBadge = useMemo(() => {
    for (let i = BADGES.length - 1; i >= 0; i--) {
      if (totalSavings >= BADGES[i].threshold) {
        return BADGES[i];
      }
    }
    return null;
  }, [totalSavings]);

  const nextBadge = useMemo(() => {
    for (const badge of BADGES) {
      if (totalSavings < badge.threshold) {
        return badge;
      }
    }
    return null;
  }, [totalSavings]);

  const progress = useMemo(() => {
    if (!nextBadge) return 100;
    const previousThreshold = currentBadge?.threshold || 0;
    const range = nextBadge.threshold - previousThreshold;
    const current = totalSavings - previousThreshold;
    return Math.min((current / range) * 100, 100);
  }, [totalSavings, currentBadge, nextBadge]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">구독 다이어트 챌린지</h3>
        <p className="text-muted-foreground">구독을 줄이고 배지를 모아보세요!</p>
      </div>

      {/* Current Status */}
      <div className="rounded-xl border-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 p-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{currentBadge?.emoji || '🎯'}</div>
          <h4 className="text-2xl font-bold mb-1">
            {currentBadge ? `${currentBadge.name} 달성!` : '시작하세요!'}
          </h4>
          <div className="text-3xl font-bold text-primary">{formatKRW(totalSavings)}</div>
          <div className="text-sm text-muted-foreground">월 절약액</div>
        </div>

        {/* Progress to Next Badge */}
        {nextBadge && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">다음 배지까지</span>
              <span className="text-muted-foreground">
                {formatKRW(nextBadge.threshold - totalSavings)} 남음
              </span>
            </div>
            <div className="h-3 bg-background/50 rounded-full overflow-hidden mb-1">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(to right, #a855f7, #ec4899)',
                }}
              />
            </div>
            <div className="text-xs text-center text-muted-foreground">
              {nextBadge.emoji} {nextBadge.name} ({formatKRW(nextBadge.threshold)})
            </div>
          </div>
        )}

        {!nextBadge && (
          <div className="text-center text-sm text-muted-foreground">
            🎉 모든 배지를 획득했습니다! 최고예요!
          </div>
        )}
      </div>

      {/* All Badges */}
      <div className="rounded-xl border bg-card p-6">
        <h4 className="font-semibold mb-4">배지 목록</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {BADGES.map((badge) => {
            const earned = totalSavings >= badge.threshold;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  earned
                    ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30'
                    : 'bg-muted/20 border-muted opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{badge.emoji}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{badge.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatKRW(badge.threshold)} 절약
                    </div>
                  </div>
                  {earned && (
                    <div className="text-primary font-bold text-sm">✓</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancelled Subscriptions List */}
      {cancelledSubscriptions.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h4 className="font-semibold mb-4">
            절약한 구독 ({cancelledSubscriptions.length}개)
          </h4>
          <div className="space-y-2">
            {cancelledSubscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="text-xl opacity-50">{sub.icon}</span>
                  <span className="text-sm font-medium opacity-75">{sub.name}</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  +{formatKRW(sub.monthlyPrice)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {cancelledSubscriptions.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-muted p-8 text-center">
          <p className="text-muted-foreground">
            아직 절약한 구독이 없어요.<br />
            사용하지 않는 구독을 해지해보세요!
          </p>
        </div>
      )}
    </div>
  );
}
