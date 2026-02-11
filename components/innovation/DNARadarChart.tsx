'use client';

import { useMemo } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { getDNARadarData } from '@/lib/calculations/subscriptionDNA';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export function DNARadarChart() {
  const subscriptions = useSubscriptionStore((s) => s.subscriptions);

  const radarData = useMemo(() => getDNARadarData(subscriptions), [subscriptions]);

  const hasData = radarData.some((d) => d.spend > 0);

  if (!hasData) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-sm font-bold text-foreground mb-4">구독 분포 차트</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid
            stroke="var(--color-border, hsl(var(--border)))"
            strokeOpacity={0.6}
          />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: 'var(--color-muted-foreground, #6b7280)', fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 'auto']}
            tick={{ fill: 'var(--color-muted-foreground, #6b7280)', fontSize: 10 }}
            axisLine={false}
          />
          <Radar
            name="지출액"
            dataKey="spend"
            stroke="#3182F6"
            fill="#3182F6"
            fillOpacity={0.15}
            strokeWidth={2.5}
            dot={{ fill: '#3182F6', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#3182F6', fill: 'var(--color-card, white)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
