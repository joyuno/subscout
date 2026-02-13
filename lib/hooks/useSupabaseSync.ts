'use client';

import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/AuthContext';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useUsageStore } from '@/stores/usageStore';
import { calculateMonthlyPrice } from '@/lib/calculations/costAnalysis';
import type { Subscription, SubscriptionCategory, BillingCycle, SubscriptionStatus, UsageMetricType } from '@/lib/types/subscription';
import type { WeeklyUsage } from '@/lib/types/usage';

/**
 * Syncs Zustand stores with Supabase when user is logged in.
 * - On login: loads data from Supabase into Zustand stores
 * - On data change: saves to Supabase
 * - Non-logged-in users continue using localStorage only
 */
export function useSupabaseSync() {
  const { user } = useAuth();
  const synced = useRef(false);

  useEffect(() => {
    if (!user) {
      synced.current = false;
      return;
    }
    if (synced.current) return;
    synced.current = true;

    // Load subscriptions from Supabase
    (async () => {
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (subs && subs.length > 0) {
        const mapped: Subscription[] = subs.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.category as SubscriptionCategory,
          icon: s.icon,
          billingCycle: s.billing_cycle as BillingCycle,
          price: Number(s.price),
          monthlyPrice: Number(s.monthly_price),
          billingDay: s.billing_day,
          status: s.status as SubscriptionStatus,
          isShared: s.is_shared,
          sharedCount: s.shared_count,
          trialEndDate: s.trial_end_date,
          memo: s.memo,
          planName: s.plan_name,
          createdAt: s.created_at,
          updatedAt: s.updated_at,
        }));
        useSubscriptionStore.setState({ subscriptions: mapped });
      }

      // Load usage records from Supabase
      const { data: usage } = await supabase
        .from('usage_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (usage && usage.length > 0) {
        const mapped: WeeklyUsage[] = usage.map((u) => ({
          id: u.id,
          subscriptionId: u.subscription_id,
          weekStartDate: u.week_start_date,
          usageMinutes: Number(u.usage_minutes),
          metricType: u.metric_type as UsageMetricType | undefined,
          inputMethod: u.input_method as 'manual' | 'csv' | 'feeling',
          createdAt: u.created_at,
        }));
        useUsageStore.setState({ usageRecords: mapped });
      }
    })();
  }, [user]);
}

/**
 * Save a subscription to Supabase (upsert)
 */
export async function saveSubscriptionToSupabase(userId: string, sub: Subscription) {
  await supabase.from('subscriptions').upsert({
    id: sub.id,
    user_id: userId,
    name: sub.name,
    category: sub.category,
    icon: sub.icon,
    billing_cycle: sub.billingCycle,
    price: sub.price,
    monthly_price: sub.monthlyPrice,
    billing_day: sub.billingDay,
    status: sub.status,
    is_shared: sub.isShared,
    shared_count: sub.sharedCount,
    trial_end_date: sub.trialEndDate,
    memo: sub.memo,
    plan_name: sub.planName,
    created_at: sub.createdAt,
    updated_at: sub.updatedAt,
  });
}

/**
 * Delete a subscription from Supabase
 */
export async function deleteSubscriptionFromSupabase(subId: string) {
  await supabase.from('subscriptions').delete().eq('id', subId);
}

/**
 * Save a usage record to Supabase
 */
export async function saveUsageToSupabase(userId: string, record: WeeklyUsage) {
  await supabase.from('usage_records').upsert({
    id: record.id,
    user_id: userId,
    subscription_id: record.subscriptionId,
    week_start_date: record.weekStartDate,
    usage_minutes: record.usageMinutes,
    metric_type: record.metricType,
    input_method: record.inputMethod,
    created_at: record.createdAt,
  });
}

/**
 * Delete a usage record from Supabase
 */
export async function deleteUsageFromSupabase(recordId: string) {
  await supabase.from('usage_records').delete().eq('id', recordId);
}
