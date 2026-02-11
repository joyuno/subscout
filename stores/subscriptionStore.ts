import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Subscription,
  SubscriptionCategory,
  BillingCycle,
  SubscriptionStatus,
} from '@/lib/types/subscription';
import { calculateMonthlyPrice } from '@/lib/calculations/costAnalysis';

export interface AddSubscriptionInput {
  name: string;
  category: SubscriptionCategory;
  icon: string;
  billingCycle: BillingCycle;
  price: number;
  billingDay: number;
  status?: SubscriptionStatus;
  isShared?: boolean;
  sharedCount?: number;
  trialEndDate?: string;
  memo?: string;
  planName?: string;
}

export interface UpdateSubscriptionInput {
  name?: string;
  category?: SubscriptionCategory;
  icon?: string;
  billingCycle?: BillingCycle;
  price?: number;
  billingDay?: number;
  status?: SubscriptionStatus;
  isShared?: boolean;
  sharedCount?: number;
  trialEndDate?: string;
  memo?: string;
  planName?: string;
}

interface SubscriptionState {
  subscriptions: Subscription[];
  cancelledSubscriptions: Subscription[];

  // CRUD
  addSubscription: (input: AddSubscriptionInput) => Subscription;
  updateSubscription: (id: string, input: UpdateSubscriptionInput) => void;
  deleteSubscription: (id: string) => void;
  cancelSubscription: (id: string) => void;
  reactivateSubscription: (id: string) => void;

  // Getters
  getSubscription: (id: string) => Subscription | undefined;
  getActiveSubscriptions: () => Subscription[];
  getByCategory: (category: SubscriptionCategory) => Subscription[];
  getTotalMonthlyCost: () => number;
  getTotalYearlyCost: () => number;
  getSubscriptionCount: () => number;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      cancelledSubscriptions: [],

      addSubscription: (input) => {
        const now = new Date().toISOString();
        const monthlyPrice = calculateMonthlyPrice(
          input.price,
          input.billingCycle,
        );

        const newSub: Subscription = {
          id: uuidv4(),
          name: input.name,
          category: input.category,
          icon: input.icon,
          billingCycle: input.billingCycle,
          price: input.price,
          monthlyPrice,
          billingDay: input.billingDay,
          status: input.status || 'active',
          isShared: input.isShared || false,
          sharedCount: input.sharedCount,
          trialEndDate: input.trialEndDate,
          memo: input.memo,
          planName: input.planName,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          subscriptions: [...state.subscriptions, newSub],
        }));

        return newSub;
      },

      updateSubscription: (id, input) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) => {
            if (sub.id !== id) return sub;

            const updatedPrice =
              input.price !== undefined ? input.price : sub.price;
            const updatedCycle =
              input.billingCycle !== undefined
                ? input.billingCycle
                : sub.billingCycle;
            const monthlyPrice = calculateMonthlyPrice(
              updatedPrice,
              updatedCycle,
            );

            return {
              ...sub,
              ...input,
              price: updatedPrice,
              billingCycle: updatedCycle,
              monthlyPrice,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((sub) => sub.id !== id),
        }));
      },

      cancelSubscription: (id) => {
        const sub = get().subscriptions.find((s) => s.id === id);
        if (!sub) return;

        const now = new Date().toISOString();
        const cancelledSub: Subscription = {
          ...sub,
          status: 'cancelled',
          updatedAt: now,
        };

        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, status: 'cancelled' as const, updatedAt: now } : s,
          ),
          cancelledSubscriptions: [
            ...state.cancelledSubscriptions,
            cancelledSub,
          ],
        }));
      },

      reactivateSubscription: (id) => {
        const now = new Date().toISOString();
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id
              ? { ...s, status: 'active' as const, updatedAt: now }
              : s,
          ),
          cancelledSubscriptions: state.cancelledSubscriptions.filter(
            (s) => s.id !== id,
          ),
        }));
      },

      getSubscription: (id) => {
        return get().subscriptions.find((s) => s.id === id);
      },

      getActiveSubscriptions: () => {
        return get().subscriptions.filter(
          (s) => s.status === 'active' || s.status === 'trial',
        );
      },

      getByCategory: (category) => {
        return get()
          .subscriptions.filter((s) => s.category === category)
          .filter((s) => s.status === 'active' || s.status === 'trial');
      },

      getTotalMonthlyCost: () => {
        return get()
          .subscriptions.filter(
            (s) => s.status === 'active' || s.status === 'trial',
          )
          .reduce((sum, s) => sum + s.monthlyPrice, 0);
      },

      getTotalYearlyCost: () => {
        return get().getTotalMonthlyCost() * 12;
      },

      getSubscriptionCount: () => {
        return get().subscriptions.filter(
          (s) => s.status === 'active' || s.status === 'trial',
        ).length;
      },
    }),
    {
      name: 'subscout-subscriptions',
    },
  ),
);
