import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { WeeklyUsage, ROIAnalysis } from '@/lib/types/usage';
import type { Subscription } from '@/lib/types/subscription';
import { calculateROIAnalysis } from '@/lib/calculations/roi';
import { SERVICE_PRESETS } from '@/lib/constants/servicePresets';
import type { ParsedUsageEntry } from '@/lib/utils/csvParser';

interface UsageState {
  usageRecords: WeeklyUsage[];

  // CRUD
  addUsage: (
    subscriptionId: string,
    weekStartDate: string,
    usageMinutes: number,
    inputMethod: 'manual' | 'csv' | 'feeling',
  ) => WeeklyUsage;
  updateUsage: (id: string, usageMinutes: number) => void;
  deleteUsage: (id: string) => void;

  // Import
  importFromCSV: (
    entries: ParsedUsageEntry[],
    subscriptionMap: Record<string, string>,
  ) => number;

  // Getters
  getUsageBySubscription: (subscriptionId: string) => WeeklyUsage[];
  getLatestUsage: (subscriptionId: string) => WeeklyUsage | undefined;
  getAverageWeeklyUsage: (subscriptionId: string) => number;

  // Analysis
  generateROIAnalysis: (subscriptions: Subscription[]) => ROIAnalysis[];
}

export const useUsageStore = create<UsageState>()(
  persist(
    (set, get) => ({
      usageRecords: [],

      addUsage: (subscriptionId, weekStartDate, usageMinutes, inputMethod) => {
        const record: WeeklyUsage = {
          id: uuidv4(),
          subscriptionId,
          weekStartDate,
          usageMinutes,
          inputMethod,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          usageRecords: [...state.usageRecords, record],
        }));

        return record;
      },

      updateUsage: (id, usageMinutes) => {
        set((state) => ({
          usageRecords: state.usageRecords.map((r) =>
            r.id === id ? { ...r, usageMinutes } : r,
          ),
        }));
      },

      deleteUsage: (id) => {
        set((state) => ({
          usageRecords: state.usageRecords.filter((r) => r.id !== id),
        }));
      },

      importFromCSV: (entries, subscriptionMap) => {
        let imported = 0;
        const newRecords: WeeklyUsage[] = [];

        for (const entry of entries) {
          // subscriptionMap maps app names to subscription IDs
          const subscriptionId = subscriptionMap[entry.appName];
          if (!subscriptionId) continue;

          newRecords.push({
            id: uuidv4(),
            subscriptionId,
            weekStartDate: entry.date || new Date().toISOString().split('T')[0],
            usageMinutes: entry.usageMinutes,
            inputMethod: 'csv',
            createdAt: new Date().toISOString(),
          });
          imported++;
        }

        if (newRecords.length > 0) {
          set((state) => ({
            usageRecords: [...state.usageRecords, ...newRecords],
          }));
        }

        return imported;
      },

      getUsageBySubscription: (subscriptionId) => {
        return get()
          .usageRecords.filter((r) => r.subscriptionId === subscriptionId)
          .sort(
            (a, b) =>
              new Date(b.weekStartDate).getTime() -
              new Date(a.weekStartDate).getTime(),
          );
      },

      getLatestUsage: (subscriptionId) => {
        const records = get().getUsageBySubscription(subscriptionId);
        return records.length > 0 ? records[0] : undefined;
      },

      getAverageWeeklyUsage: (subscriptionId) => {
        const records = get().getUsageBySubscription(subscriptionId);
        if (records.length === 0) return 0;

        const total = records.reduce((sum, r) => sum + r.usageMinutes, 0);
        return Math.round(total / records.length);
      },

      generateROIAnalysis: (subscriptions) => {
        const active = subscriptions.filter(
          (s) => s.status === 'active' || s.status === 'trial',
        );

        return active.map((sub) => {
          const weeklyUsage = get().getAverageWeeklyUsage(sub.id);
          const preset = SERVICE_PRESETS[sub.name];
          const sharingAvailable = !!preset?.familyPlan && !sub.isShared;

          return calculateROIAnalysis(sub, weeklyUsage, sharingAvailable);
        });
      },
    }),
    {
      name: 'subscout-usage',
    },
  ),
);
