'use client';

import { useState, useMemo } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { calculateInvestmentTimeSeries, INVESTMENT_SCENARIOS } from '@/lib/calculations/opportunityCost';
import { formatKRW, formatKRWCompact } from '@/lib/utils/formatCurrency';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { BrandIcon } from '@/components/subscription/BrandIcon';

// Toss-aligned chart colors
const TOSS_SAVINGS_COLOR = '#1FC08E';
const TOSS_SP500_COLOR = '#3182F6';
const TOSS_KOSPI_COLOR = '#FFA826';

export function OpportunityCostSimulator() {
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const getActiveSubscriptions = useSubscriptionStore((s) => s.getActiveSubscriptions);
  const activeSubscriptions = useMemo(() => getActiveSubscriptions(), [subscriptions, getActiveSubscriptions]);

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

  const scenarioColors = [TOSS_SAVINGS_COLOR, TOSS_SP500_COLOR, TOSS_KOSPI_COLOR];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-extrabold text-foreground mb-1">만약에 계산기</h3>
        <p className="text-sm text-muted-foreground font-medium">구독 대신 투자했다면 얼마나 모을 수 있었을까요?</p>
      </div>

      {/* Subscription Selection */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h4 className="text-sm font-bold text-foreground mb-4">절약할 구독 선택</h4>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {activeSubscriptions.map((sub) => {
            const isSelected = selectedSubIds.has(sub.id);
            return (
              <div
                key={sub.id}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-primary/[0.05] border-primary/20'
                    : 'border-transparent hover:bg-accent/50'
                }`}
                onClick={() => handleToggle(sub.id)}
              >
                <Checkbox
                  id={`sub-${sub.id}`}
                  checked={isSelected}
                  onCheckedChange={() => handleToggle(sub.id)}
                />
                <label htmlFor={`sub-${sub.id}`} className="flex-1 cursor-pointer flex items-center gap-2">
                  <BrandIcon name={sub.name} icon={sub.icon} size="sm" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">{sub.name}</div>
                    <div className="text-xs text-muted-foreground font-medium">{formatKRW(sub.monthlyPrice)}/월</div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>

        {/* Monthly savings badge */}
        <div className="mt-4 p-4 bg-primary/[0.04] rounded-xl border border-primary/10">
          <div className="text-xs text-muted-foreground font-semibold mb-1">월 절약액</div>
          <div className="text-3xl font-extrabold text-primary tracking-tight">{formatKRW(monthlySavings)}</div>
        </div>
      </div>

      {/* Year Slider */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <Label className="mb-4 block">
          <span className="text-sm font-bold text-foreground">투자 기간</span>
          <span className="ml-2 text-2xl font-extrabold text-primary">{years}년</span>
        </Label>
        <Slider
          value={[years]}
          onValueChange={(v) => setYears(v[0])}
          min={1}
          max={30}
          step={1}
          className="mb-3"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>1년</span>
          <span>15년</span>
          <span>30년</span>
        </div>
      </div>

      {/* Results */}
      {monthlySavings > 0 && (
        <>
          {/* Chart */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h4 className="text-sm font-bold text-foreground mb-5">투자 시뮬레이션</h4>
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="tossGradSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TOSS_SAVINGS_COLOR} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={TOSS_SAVINGS_COLOR} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tossGradSP500" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TOSS_SP500_COLOR} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={TOSS_SP500_COLOR} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="tossGradKospi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={TOSS_KOSPI_COLOR} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={TOSS_KOSPI_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="none"
                  stroke="var(--color-border, hsl(var(--border)))"
                  strokeOpacity={0.5}
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: 'var(--color-muted-foreground, #6b7280)', fontSize: 11, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}년`}
                />
                <YAxis
                  tick={{ fill: 'var(--color-muted-foreground, #6b7280)', fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(v) => formatKRWCompact(v)}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card, hsl(var(--card)))',
                    color: 'var(--color-foreground, hsl(var(--foreground)))',
                    border: '1px solid var(--color-border, hsl(var(--border)))',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                  itemStyle={{
                    color: 'var(--color-foreground, hsl(var(--foreground)))',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                  labelStyle={{
                    color: 'var(--color-muted-foreground, #6b7280)',
                    fontWeight: 700,
                    fontSize: '13px',
                    marginBottom: '4px',
                  }}
                  formatter={(value) => (value != null ? formatKRW(value as number) : '')}
                  labelFormatter={(label) => `${label}년 후`}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Area
                  type="monotone"
                  dataKey="적금"
                  stroke={TOSS_SAVINGS_COLOR}
                  fillOpacity={1}
                  fill="url(#tossGradSavings)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: TOSS_SAVINGS_COLOR, fill: 'var(--color-card, white)' }}
                />
                <Area
                  type="monotone"
                  dataKey="S&P 500"
                  stroke={TOSS_SP500_COLOR}
                  fillOpacity={1}
                  fill="url(#tossGradSP500)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: TOSS_SP500_COLOR, fill: 'var(--color-card, white)' }}
                />
                <Area
                  type="monotone"
                  dataKey="코스피"
                  stroke={TOSS_KOSPI_COLOR}
                  fillOpacity={1}
                  fill="url(#tossGradKospi)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: TOSS_KOSPI_COLOR, fill: 'var(--color-card, white)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Final Values -- Toss-style metric cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {finalValues.map((item, index) => (
              <div
                key={item.name}
                className="rounded-2xl border border-border bg-card p-5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: scenarioColors[index] }}
                  />
                  <span className="text-xs font-bold text-muted-foreground">{item.name}</span>
                </div>
                <div className="text-3xl font-extrabold text-foreground tracking-tight mb-1">
                  {formatKRWCompact(item.value)}
                </div>
                <div className="text-xs text-muted-foreground font-medium">{years}년 후 예상 금액</div>
              </div>
            ))}
          </div>

          {/* Emotional Hook */}
          {selectedSubIds.size > 0 && (
            <div className="rounded-2xl bg-primary/[0.04] border border-primary/15 p-6 text-center">
              <p className="text-sm font-semibold text-foreground mb-2">
                {Array.from(selectedSubIds)
                  .slice(0, 2)
                  .map((id) => activeSubscriptions.find((s) => s.id === id)?.name)
                  .filter(Boolean)
                  .join('과 ')}{' '}
                대신 투자했다면...
              </p>
              <p className="text-4xl font-extrabold text-primary tracking-tight">
                {formatKRWCompact(finalValues[1].value)}
              </p>
              <p className="text-sm text-muted-foreground mt-1.5 font-medium">를 모을 수 있었어요 (S&P 500 기준)</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
