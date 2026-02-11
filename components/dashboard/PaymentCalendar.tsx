'use client';

import { Calendar } from 'lucide-react';
import type { Subscription } from '@/lib/types';
import { formatKRW } from '@/lib/utils/formatCurrency';
import { BrandIcon } from '@/components/subscription/BrandIcon';

interface PaymentCalendarProps {
  subscriptions: Subscription[];
}

export function PaymentCalendar({ subscriptions }: PaymentCalendarProps) {
  // Get current month and filter active subscriptions
  const today = new Date();
  const currentDay = today.getDate();

  // Sort by billing day
  const upcomingPayments = subscriptions
    .filter((sub) => sub.status === 'active' || sub.status === 'trial')
    .sort((a, b) => a.billingDay - b.billingDay);

  if (upcomingPayments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
          <Calendar className="w-7 h-7 text-muted-foreground/40" />
        </div>
        <p className="font-semibold text-sm">예정된 결제가 없습니다</p>
        <p className="text-xs mt-1 text-muted-foreground/60">구독을 추가하면 일정이 표시됩니다</p>
      </div>
    );
  }

  const renderItem = (sub: Subscription) => {
    const isToday = sub.billingDay === currentDay;
    const isPast = sub.billingDay < currentDay;

    return (
      <div
        key={sub.id}
        className={`flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-200 ${
          isToday
            ? 'bg-primary/[0.06] ring-1 ring-primary/20'
            : isPast
              ? 'opacity-60'
              : 'hover:bg-accent/50'
        }`}
      >
        {/* Date column */}
        <div className={`flex flex-col items-center justify-center w-11 h-11 rounded-xl shrink-0 ${
          isToday
            ? 'bg-primary text-primary-foreground'
            : isPast
              ? 'bg-muted text-muted-foreground'
              : 'bg-accent text-foreground'
        }`}>
          <span className="text-[10px] font-semibold leading-none opacity-70">
            {isToday ? '오늘' : `${today.getMonth() + 1}월`}
          </span>
          <span className="text-base font-extrabold leading-tight">
            {sub.billingDay}
          </span>
        </div>

        {/* Brand icon + name */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <BrandIcon name={sub.name} icon={sub.icon || sub.name.slice(0, 2)} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm text-foreground truncate">{sub.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {isToday && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                  오늘 결제
                </span>
              )}
              {isPast && !isToday && (
                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">
                  결제 완료
                </span>
              )}
              {sub.billingCycle === 'yearly' && (
                <span className="text-[10px] font-semibold text-primary/60 bg-primary/[0.06] px-1.5 py-0.5 rounded-md">
                  연간
                </span>
              )}
              {!isToday && !isPast && (
                <span className="text-[10px] text-muted-foreground font-medium">
                  {sub.billingDay - currentDay}일 후
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Price */}
        <p className={`text-base font-bold shrink-0 tabular-nums ${
          isToday ? 'text-primary' : 'text-foreground'
        }`}>
          {formatKRW(sub.monthlyPrice)}
        </p>
      </div>
    );
  };

  const displayItems = upcomingPayments.slice(0, 6);

  return (
    <div className="space-y-1">
      {/* Upcoming section */}
      {displayItems.map(renderItem)}

      {/* Overflow indicator */}
      {upcomingPayments.length > 6 && (
        <div className="pt-2 pb-1">
          <p className="text-center text-xs text-muted-foreground font-semibold bg-accent/50 rounded-xl py-2">
            외 {upcomingPayments.length - 6}개 구독
          </p>
        </div>
      )}
    </div>
  );
}
