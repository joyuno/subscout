'use client';

import { useSupabaseSync } from '@/lib/hooks/useSupabaseSync';

export function SupabaseSyncProvider() {
  useSupabaseSync();
  return null;
}
