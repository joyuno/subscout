'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Wallet,
  Calendar,
  TrendingUp,
  PlusCircle,
  Package,
} from 'lucide-react';
import { useSubscriptionStore } from '@/stores';
import { calculateCostByCategory, calculateTotalSavings } from '@/lib/calculations';
import { CostSummaryCard, PaymentCalendar } from '@/components/dashboard';

// Dynamically import chart components with ssr disabled (Recharts needs client-side)
const CategoryPieChart = dynamic(
  () =>
    import('@/components/dashboard/CategoryPieChart').then(
      (mod) => mod.CategoryPieChart,
    ),
  { ssr: false },
);

const SavingsTracker = dynamic(
  () =>
    import('@/components/dashboard/SavingsTracker').then(
      (mod) => mod.SavingsTracker,
    ),
  { ssr: false },
);

export default function DashboardPage() {
  const subscriptions = useSubscriptionStore((state) => state.subscriptions);
  const cancelledSubscriptions = useSubscriptionStore(
    (state) => state.cancelledSubscriptions,
  );
  const totalMonthlyCost = useSubscriptionStore((state) =>
    state.getTotalMonthlyCost(),
  );
  const totalYearlyCost = useSubscriptionStore((state) =>
    state.getTotalYearlyCost(),
  );
  const activeCount = useSubscriptionStore((state) =>
    state.getSubscriptionCount(),
  );

  // Calculate category distribution
  const categoryData = useMemo(
    () => calculateCostByCategory(subscriptions),
    [subscriptions],
  );

  // Calculate savings
  const totalSavings = useMemo(
    () => calculateTotalSavings(cancelledSubscriptions),
    [cancelledSubscriptions],
  );

  // Empty state
  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-center max-w-md">
          <Package className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            구독을 추가해보세요
          </h2>
          <p className="text-slate-600 mb-6">
            구독 서비스를 추가하고 한눈에 관리하세요. 지출을 추적하고
            최적화할 수 있습니다.
          </p>
          <Link
            href="/subscriptions"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            구독 추가하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
            대시보드
          </h1>
          <p className="text-slate-600 mt-1">구독 현황을 한눈에 확인하세요</p>
        </div>
        <Link
          href="/subscriptions"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm lg:text-base"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">구독 추가</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <CostSummaryCard
          title="월 총 구독료"
          amount={totalMonthlyCost}
          subtitle={`연간 약 ${(totalYearlyCost / 10000).toFixed(0)}만원`}
          icon={<Wallet className="w-5 h-5" />}
        />
        <CostSummaryCard
          title="활성 구독 수"
          amount={activeCount}
          subtitle={`${subscriptions.length}개 중 ${activeCount}개 활성`}
          icon={<Calendar className="w-5 h-5" />}
        />
        <CostSummaryCard
          title="누적 절약액"
          amount={totalSavings}
          subtitle={`${cancelledSubscriptions.length}개 구독 취소`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            카테고리별 지출 비율
          </h2>
          <CategoryPieChart data={categoryData} />
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            이번 달 결제 일정
          </h2>
          <PaymentCalendar subscriptions={subscriptions} />
        </div>
      </div>

      {/* Savings Tracker */}
      {cancelledSubscriptions.length > 0 && (
        <div className="max-w-md">
          <SavingsTracker
            totalSavings={totalSavings}
            monthlySavings={totalSavings}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/subscriptions"
          className="bg-white rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <h3 className="font-semibold text-slate-900 mb-1">구독 관리</h3>
          <p className="text-sm text-slate-600">
            구독을 추가하고 관리하세요
          </p>
        </Link>
        <Link
          href="/analysis"
          className="bg-white rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <h3 className="font-semibold text-slate-900 mb-1">이용률 분석</h3>
          <p className="text-sm text-slate-600">사용 패턴을 분석하세요</p>
        </Link>
        <Link
          href="/optimize"
          className="bg-white rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <h3 className="font-semibold text-slate-900 mb-1">공유 최적화</h3>
          <p className="text-sm text-slate-600">비용을 절감하세요</p>
        </Link>
        <Link
          href="/guide"
          className="bg-white rounded-lg border border-slate-200 p-4 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <h3 className="font-semibold text-slate-900 mb-1">입력 가이드</h3>
          <p className="text-sm text-slate-600">CSV로 빠르게 추가하세요</p>
        </Link>
      </div>
    </div>
  );
}
