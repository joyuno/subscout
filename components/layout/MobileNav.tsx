'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Users,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/subscriptions', label: '구독 관리', icon: CreditCard },
  { href: '/analysis', label: '분석', icon: BarChart3 },
  { href: '/optimize', label: '최적화', icon: Users },
  { href: '/insights', label: '인사이트', icon: Sparkles },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                isActive ? 'text-blue-600' : 'text-slate-500',
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
