'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Users,
  PartyPopper,
  BookOpen,
  Sparkles,
  Search,
} from 'lucide-react';
import { useSubscriptionStore } from '@/stores';
import { formatKRW } from '@/lib/utils/formatCurrency';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/subscriptions', label: '구독 관리', icon: CreditCard },
  { href: '/analysis', label: '이용률 분석', icon: BarChart3 },
  { href: '/optimize', label: '공유 최적화', icon: Users },
  { href: '/party', label: '공유 파티', icon: PartyPopper },
  { href: '/guide', label: '입력 가이드', icon: BookOpen },
  { href: '/insights', label: '구독 인사이트', icon: Sparkles },
];

export function Sidebar() {
  const pathname = usePathname();
  const totalMonthlyCost = useSubscriptionStore((state) =>
    state.getTotalMonthlyCost(),
  );

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 h-16 px-6 border-b border-slate-800">
        <Search className="w-6 h-6 text-blue-400" />
        <span className="text-xl font-bold">SubScout</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Total Cost Display */}
      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">월 총 구독료</p>
          <p className="text-2xl font-bold text-blue-400">
            {formatKRW(totalMonthlyCost)}
          </p>
        </div>
      </div>
    </aside>
  );
}
