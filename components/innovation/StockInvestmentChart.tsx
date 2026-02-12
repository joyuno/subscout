'use client';

import { useState, useMemo } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { getStockDataByYears, simulateDCA, STOCK_CONFIGS } from '@/lib/utils/stockData';
import { formatKRW, formatKRWCompact } from '@/lib/utils/formatCurrency';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

type ChartPeriod = '1Y' | '3Y' | '5Y';

const PERIOD_OPTIONS: { key: ChartPeriod; label: string; years: number }[] = [
  { key: '1Y', label: '1년', years: 1 },
  { key: '3Y', label: '3년', years: 3 },
  { key: '5Y', label: '5년', years: 5 },
];

export function StockInvestmentChart() {
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);
  const getActiveSubscriptions = useSubscriptionStore((s) => s.getActiveSubscriptions);
  const activeSubscriptions = useMemo(() => getActiveSubscriptions(), [subscriptions, getActiveSubscriptions]);

  const totalMonthly = useMemo(
    () => activeSubscriptions.reduce((sum, s) => sum + s.monthlyPrice, 0),
    [activeSubscriptions],
  );

  const [period, setPeriod] = useState<ChartPeriod>('5Y');
  const selectedPeriod = PERIOD_OPTIONS.find((p) => p.key === period)!;

  const stockData = useMemo(
    () => getStockDataByYears(selectedPeriod.years),
    [selectedPeriod.years],
  );

  const chartData = useMemo(
    () => simulateDCA(totalMonthly, stockData),
    [totalMonthly, stockData],
  );

  const displayData = useMemo(() => {
    if (chartData.length <= 18) return chartData;
    return chartData.filter((_, i) => i === 0 || i % 3 === 0 || i === chartData.length - 1);
  }, [chartData]);

  if (activeSubscriptions.length === 0 || totalMonthly === 0) return null;

  const lastPoint = chartData[chartData.length - 1];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-extrabold text-foreground mb-1 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          실제 주가 기반 투자 시뮬레이션
        </h3>
        <p className="text-sm text-muted-foreground font-medium">
          매월 {formatKRW(totalMonthly)}을 실제 ETF/주식에 적립식 투자했다면?
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-bold text-foreground">
            {selectedPeriod.label}간 적립식 투자 결과
          </h4>
          <div className="flex gap-1 bg-accent rounded-lg p-0.5">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setPeriod(opt.key)}
                className={`text-xs font-bold px-3 py-1 rounded-md transition-all duration-200 ${
                  period === opt.key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground font-medium mb-5">
          네이버 금융 실제 주가 기반 · 매월 초 {formatKRW(totalMonthly)} 투자 가정
        </p>

        <ResponsiveContainer width="100%" height={360}>
          <AreaChart data={displayData}>
            <defs>
              {STOCK_CONFIGS.map((config) => (
                <linearGradient key={config.symbol} id={`grad-${config.symbol}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.color} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={config.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="none"
              stroke="var(--color-border, hsl(var(--border)))"
              strokeOpacity={0.4}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-muted-foreground, #6b7280)', fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: 'var(--color-muted-foreground, #6b7280)', fontSize: 10, fontWeight: 500 }}
              tickFormatter={(v) => formatKRWCompact(v)}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_4px_24px_rgba(0,0,0,0.08)]" style={{ minWidth: 200 }}>
                    <div className="text-xs font-bold text-muted-foreground mb-2">{label}</div>
                    {payload.map((entry: any) => (
                      <div key={entry.dataKey} className="flex items-center justify-between gap-4 mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-xs font-medium text-foreground">{entry.name}</span>
                        </div>
                        <span className="text-xs font-bold text-foreground tabular-nums">
                          {formatKRW(Math.round(entry.value))}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="원금"
              name="원금"
              stroke="#94a3b8"
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={false}
            />
            {STOCK_CONFIGS.map((config) => (
              <Area
                key={config.symbol}
                type="monotone"
                dataKey={config.name}
                name={config.name}
                stroke={config.color}
                fill={`url(#grad-${config.symbol})`}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: config.color, fill: 'var(--color-card, white)' }}
              />
            ))}
            <Legend
              wrapperStyle={{ fontSize: '11px', fontWeight: 600 }}
              iconType="circle"
              iconSize={8}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* 최종 결과 카드 */}
        {lastPoint && (
          <div className="grid grid-cols-3 gap-3 mt-5">
            {STOCK_CONFIGS.map((config) => {
              const finalValue = lastPoint[config.name] as number;
              const principal = lastPoint['원금'] as number;
              const returnPercent = Math.round(((finalValue / principal) - 1) * 100);

              return (
                <div key={config.symbol} className="rounded-xl p-3 text-center" style={{ backgroundColor: `${config.color}0F` }}>
                  <div className="text-[10px] font-bold uppercase mb-1" style={{ color: config.color }}>
                    {config.name}
                  </div>
                  <div className="text-sm font-extrabold text-foreground tabular-nums">
                    {formatKRWCompact(finalValue)}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-medium">
                    원금 {formatKRWCompact(principal)} 대비{' '}
                    <span style={{ color: config.color }}>
                      {returnPercent > 0 ? '+' : ''}{returnPercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-3 text-[10px] text-muted-foreground font-medium text-center">
          * 네이버 금융 실제 주가 기반 (2021.01~2026.02). 미래 수익을 보장하지 않으며 수수료/세금 미반영.
        </div>
      </div>
    </div>
  );
}
