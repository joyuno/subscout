'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatKRW } from '@/lib/utils/formatCurrency';
import type { BundleOptimization } from '@/lib/calculations/bundleOptimize';
import { Package, TrendingDown, ArrowRight } from 'lucide-react';

interface BundleOptimizerProps {
  optimizations: BundleOptimization[];
}

export function BundleOptimizer({ optimizations }: BundleOptimizerProps) {
  if (optimizations.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            현재 번들 절약 기회가 없어요
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            구독 서비스를 더 추가하면 번들 할인 기회를 찾아드릴게요
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {optimizations.map((opt) => (
        <Card key={opt.bundle.id} className="overflow-hidden">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-500/10 p-2">
                    <Package className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {opt.bundle.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {opt.bundle.provider}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600 whitespace-nowrap">
                  월 {formatKRW(opt.monthlySavings)} 절약
                </Badge>
              </div>
            </CardHeader>
          </div>
          <CardContent className="pt-4 space-y-4">
            {/* Explanation */}
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-foreground leading-relaxed">
                {opt.explanation}
              </p>
            </div>

            {/* Price Comparison */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">현재 비용</p>
                <p className="text-lg font-bold line-through text-muted-foreground">
                  {formatKRW(opt.currentTotalCost)}
                </p>
              </div>
              <div className="flex justify-center">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">번들 가입 시</p>
                <p className="text-lg font-bold text-green-600">
                  {formatKRW(opt.bundleCost)}
                </p>
              </div>
            </div>

            {/* Included Services */}
            <div>
              <p className="text-sm font-medium mb-2">포함된 서비스</p>
              <div className="flex flex-wrap gap-2">
                {opt.bundle.includedServices.map((service, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-background"
                  >
                    {service}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Matched Subscriptions */}
            <div>
              <p className="text-sm font-medium mb-2">
                통합 가능한 구독 ({opt.matchedSubscriptions.length}개)
              </p>
              <div className="space-y-2">
                {opt.matchedSubscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between text-sm bg-muted/30 rounded p-2"
                  >
                    <div className="flex items-center gap-2">
                      <span>{sub.icon}</span>
                      <span>{sub.name}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatKRW(sub.monthlyPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings Summary */}
            <div className="flex items-center gap-2 pt-2 border-t">
              <TrendingDown className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-600">
                  연간 {formatKRW(opt.monthlySavings * 12)} 절약 가능
                </p>
                <p className="text-xs text-muted-foreground">
                  {opt.bundle.note}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
