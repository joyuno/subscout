'use client';

import { Calendar, CreditCard } from 'lucide-react';
import type { Subscription } from '@/lib/types';
import { formatKRW } from '@/lib/utils/formatCurrency';
import { CATEGORY_COLORS } from '@/lib/types';

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
      <div className="text-center py-8 text-slate-500">
        <Calendar className="w-12 h-12 mx-auto mb-2 text-slate-300" />
        <p>예정된 결제가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upcomingPayments.slice(0, 5).map((sub) => {
        const isToday = sub.billingDay === currentDay;
        const isPast = sub.billingDay < currentDay;

        return (
          <div
            key={sub.id}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              isToday
                ? 'bg-blue-50 border-blue-200 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: CATEGORY_COLORS[sub.category] }}
              >
                {sub.icon || sub.name.slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-slate-900">{sub.name}</p>
                <p className="text-sm text-slate-500">
                  매월 {sub.billingDay}일
                  {isToday && (
                    <span className="ml-2 text-blue-600 font-medium">
                      오늘 결제
                    </span>
                  )}
                  {isPast && !isToday && (
                    <span className="ml-2 text-slate-400">결제 완료</span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-900">
                {formatKRW(sub.monthlyPrice)}
              </p>
              {sub.billingCycle === 'yearly' && (
                <p className="text-xs text-slate-500">연간 구독</p>
              )}
            </div>
          </div>
        );
      })}
      {upcomingPayments.length > 5 && (
        <p className="text-center text-sm text-slate-500 pt-2">
          외 {upcomingPayments.length - 5}개 구독
        </p>
      )}
    </div>
  );
}
