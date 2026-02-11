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
    <div className="rounded-xl border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">구독 분포 차트</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={{ fill: '#6b7280', fontSize: 10 }} />
          <Radar
            name="지출액"
            dataKey="spend"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
