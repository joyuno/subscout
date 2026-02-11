'use client';

import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { findSharingOpportunities } from '@/lib/calculations/sharingOptimize';
import { analyzeBundleOptimization } from '@/lib/calculations/bundleOptimize';
import {
  OptimizeSummary,
  SharingSimulator,
  PlanComparison,
  BundleOptimizer,
} from '@/components/optimize';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingDown, Users, Package, Lightbulb } from 'lucide-react';

export default function OptimizePage() {
  const subscriptions = useSubscriptionStore((state) =>
    state.getActiveSubscriptions(),
  );

  const sharingOpportunities = findSharingOpportunities(subscriptions);
  const bundleOptimizations = analyzeBundleOptimization(subscriptions);

  const totalSharingSavings = sharingOpportunities.reduce(
    (sum, opp) => sum + opp.savingsPerPerson,
    0,
  );
  const totalBundleSavings = bundleOptimizations.reduce(
    (sum, opt) => sum + opt.monthlySavings,
    0,
  );

  // Empty state
  if (subscriptions.length === 0) {
    return (
      <div className="container max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <TrendingDown className="h-8 w-8" />
            구독 최적화
          </h1>
          <p className="text-muted-foreground">
            구독료를 절약할 수 있는 최적의 방법을 찾아드려요
          </p>
        </div>

        <Card>
          <CardContent className="py-16 text-center">
            <Lightbulb className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              구독을 먼저 추가해주세요
            </h3>
            <p className="text-muted-foreground mb-6">
              구독 서비스를 등록하면 절약 기회를 자동으로 찾아드립니다
            </p>
            <a
              href="/subscriptions"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
            >
              구독 추가하러 가기
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <TrendingDown className="h-8 w-8" />
          구독 최적화
        </h1>
        <p className="text-muted-foreground">
          공유와 번들로 구독료를 절약하는 최적의 방법을 찾아드려요
        </p>
      </div>

      {/* Summary */}
      <OptimizeSummary
        sharingSavings={totalSharingSavings}
        bundleSavings={totalBundleSavings}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="sharing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sharing" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            공유 최적화
            {sharingOpportunities.length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {sharingOpportunities.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="bundle" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            번들 최적화 (묶음 찬스)
            {bundleOptimizations.length > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {bundleOptimizations.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Sharing Optimization Tab */}
        <TabsContent value="sharing" className="space-y-6">
          {sharingOpportunities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  현재 공유 가능한 구독이 없어요
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  가족 요금제가 있는 서비스를 구독하면 공유 기회를 찾아드릴게요
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  공유로 절약 가능한 구독
                </h2>
                <p className="text-sm text-muted-foreground">
                  가족/친구와 함께 사용하면 비용을 크게 줄일 수 있어요
                </p>
              </div>

              {/* Sharing Simulators */}
              <div className="grid gap-6 md:grid-cols-2">
                {sharingOpportunities.map((opp) => (
                  <SharingSimulator key={opp.subscription.id} opportunity={opp} />
                ))}
              </div>

              {/* Plan Comparisons */}
              <div>
                <h2 className="text-xl font-semibold mb-4">요금제 비교</h2>
                <div className="space-y-4">
                  {sharingOpportunities.map((opp) => (
                    <PlanComparison key={opp.subscription.id} opportunity={opp} />
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Bundle Optimization Tab */}
        <TabsContent value="bundle" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">번들 묶음 추천</h2>
            <p className="text-sm text-muted-foreground">
              여러 서비스를 하나의 멤버십으로 통합하면 더 저렴해요
            </p>
          </div>

          <BundleOptimizer optimizations={bundleOptimizations} />
        </TabsContent>
      </Tabs>

      {/* CTA Footer */}
      {(sharingOpportunities.length > 0 || bundleOptimizations.length > 0) && (
        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              지금 바로 절약을 시작하세요!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              공유 파티를 만들거나 번들 멤버십으로 전환해보세요
            </p>
            <a
              href="/party"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6"
            >
              공유 파티 시작하기
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
