'use client';

import { useState, useMemo } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { calculateInvestmentTimeSeries, INVESTMENT_SCENARIOS } from '@/lib/calculations/opportunityCost';
import { formatKRW, formatKRWCompact } from '@/lib/utils/formatCurrency';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

export function OpportunityCostSimulator() {
  const getActiveSubscriptions = useSubscriptionStore((s) => s.getActiveSubscriptions);
  const activeSubscriptions = useMemo(() => getActiveSubscriptions(), []);

  const [selectedSubIds, setSelectedSubIds] = useState<Set<string>>(new Set());
  const [years, setYears] = useState(10);

  const monthlySavings = useMemo(() => {
    return activeSubscriptions
      .filter((sub) => selectedSubIds.has(sub.id))
      .reduce((sum, sub) => sum + sub.monthlyPrice, 0);
  }, [activeSubscriptions, selectedSubIds]);

  // Use top 3 scenarios for clarity
  const scenarios = useMemo(() => {
    return [
      INVESTMENT_SCENARIOS.find((s) => s.name === '적금')!,
      INVESTMENT_SCENARIOS.find((s) => s.name === 'S&P 500')!,
      INVESTMENT_SCENARIOS.find((s) => s.name === '코스피')!,
    ];
  }, []);

  const chartData = useMemo(() => {
    if (monthlySavings === 0) return [];

    const seriesMap: Record<number, any> = {};

    for (const scenario of scenarios) {
      const series = calculateInvestmentTimeSeries(monthlySavings, years, scenario.annualReturnRate);
      series.forEach((point) => {
        if (!seriesMap[point.year]) {
          seriesMap[point.year] = { year: point.year };
        }
        seriesMap[point.year][scenario.name] = point.value;
      });
    }

    return Object.values(seriesMap);
  }, [monthlySavings, years, scenarios]);

  const handleToggle = (subId: string) => {
    const newSet = new Set(selectedSubIds);
    if (newSet.has(subId)) {
      newSet.delete(subId);
    } else {
      newSet.add(subId);
    }
    setSelectedSubIds(newSet);
  };

  if (activeSubscriptions.length === 0) {
    return null;
  }

  const finalValues = scenarios.map((scenario) => {
    const series = calculateInvestmentTimeSeries(monthlySavings, years, scenario.annualReturnRate);
    return {
      name: scenario.name,
      value: series[series.length - 1]?.value || 0,
      emoji: scenario.emoji,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">만약에 계산기</h3>
        <p className="text-muted-foreground">구독 대신 투자했다면 얼마나 모을 수 있었을까요?</p>
      </div>

      {/* Subscription Selection */}
      <div className="rounded-xl border bg-card p-6">
        <h4 className="font-semibold mb-4">절약할 구독 선택</h4>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {activeSubscriptions.map((sub) => (
            <div key={sub.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id={`sub-${sub.id}`}
                checked={selectedSubIds.has(sub.id)}
                onCheckedChange={() => handleToggle(sub.id)}
              />
              <label htmlFor={`sub-${sub.id}`} className="flex-1 cursor-pointer flex items-center gap-2">
                <span className="text-xl">{sub.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{sub.name}</div>
                  <div className="text-xs text-muted-foreground">{formatKRW(sub.monthlyPrice)}/월</div>
                </div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-primary/5 rounded-lg">
          <div className="text-sm text-muted-foreground">월 절약액</div>
          <div className="text-3xl font-bold text-primary">{formatKRW(monthlySavings)}</div>
        </div>
      </div>

      {/* Year Slider */}
      <div className="rounded-xl border bg-card p-6">
        <Label className="mb-4 block">
          <span className="text-base font-semibold">투자 기간: {years}년</span>
        </Label>
        <Slider
          value={[years]}
          onValueChange={(v) => setYears(v[0])}
          min={1}
          max={30}
          step={1}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1년</span>
          <span>30년</span>
        </div>
      </div>

      {/* Results */}
      {monthlySavings > 0 && (
        <>
          {/* Chart */}
          <div className="rounded-xl border bg-card p-6">
            <h4 className="font-semibold mb-4">투자 시뮬레이션</h4>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSP500" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorKospi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  label={{ value: '연도', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(v) => formatKRWCompact(v)}
                  label={{ value: '총액', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => (value != null ? formatKRW(value as number) : '')}
                  labelFormatter={(label) => `${label}년 후`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="적금"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="S&P 500"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorSP500)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="코스피"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorKospi)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Final Values */}
          <div className="grid gap-4 md:grid-cols-3">
            {finalValues.map((item) => (
              <div key={item.name} className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                <div className="text-3xl mb-2">{item.emoji}</div>
                <div className="text-sm text-muted-foreground mb-1">{item.name}</div>
                <div className="text-2xl font-bold">{formatKRWCompact(item.value)}</div>
                <div className="text-xs text-muted-foreground mt-1">{years}년 후</div>
              </div>
            ))}
          </div>

          {/* Emotional Hook */}
          {selectedSubIds.size > 0 && (
            <div className="rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border-2 border-orange-500/20 p-6 text-center">
              <p className="text-lg font-semibold mb-2">
                {Array.from(selectedSubIds)
                  .slice(0, 2)
                  .map((id) => activeSubscriptions.find((s) => s.id === id)?.name)
                  .filter(Boolean)
                  .join('과 ')}{' '}
                대신 투자했다면...
              </p>
              <p className="text-3xl font-bold text-primary">
                {formatKRWCompact(finalValues[1].value)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">를 모을 수 있었어요 (S&P 500 기준)</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
