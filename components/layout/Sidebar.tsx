'use client';

import { useState, useEffect } from 'react';
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
  FlaskConical,
  Moon,
  Sun,
  LogIn,
  LogOut,
  UserX,
  MessageCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/auth/AuthContext';
import { useSubscriptionStore } from '@/stores';
import { formatKRW } from '@/lib/utils/formatCurrency';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/subscriptions', label: '구독 관리', icon: CreditCard },
  { href: '/analysis', label: '이용률 분석', icon: BarChart3 },
  { href: '/insights', label: '구독 인사이트', icon: Sparkles },
  { href: '/optimize', label: '공유 최적화', icon: Users },
  { href: '/party', label: '공유 파티', icon: PartyPopper },
  { href: '/guide', label: '입력 가이드', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, profile, signInWithKakao, signOut, deleteAccount } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const totalMonthlyCost = useSubscriptionStore((state) =>
    state.getTotalMonthlyCost(),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-sidebar border-r border-border" aria-label="주 사이드바 메뉴">
      {/* Logo */}
      <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
        <FlaskConical className="w-6 h-6 text-emerald-500" aria-hidden="true" />
        <span className="text-xl font-bold text-foreground">해<span className="text-emerald-500">독</span></span>
        <span className="text-xs text-muted-foreground font-medium">(HaeDok)</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto" aria-label="메인 내비게이션">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground font-medium',
                  )}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Dark Mode Toggle */}
      <div className="px-4 pb-2">
        <button
          onClick={toggleTheme}
          aria-label={mounted && theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {mounted && theme === 'dark' ? (
            <Sun className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Moon className="w-5 h-5" aria-hidden="true" />
          )}
          <span>{mounted && theme === 'dark' ? '라이트 모드' : '다크 모드'}</span>
        </button>
      </div>

      {/* Total Cost Display */}
      <div className="p-4 border-t border-border">
        <section className="bg-accent rounded-2xl p-5" aria-label="월 구독료 요약">
          <p className="text-xs text-muted-foreground font-medium mb-2">
            월 총 구독료
          </p>
          <p className="text-3xl font-bold text-foreground" aria-live="polite">
            {formatKRW(totalMonthlyCost)}
          </p>
        </section>
      </div>

      {/* Auth Section */}
      <div className="px-4 pb-4 border-t border-border pt-3 space-y-2">
        {user && profile ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {profile.nickname[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{profile.nickname}</p>
                <p className="text-xs text-muted-foreground">카카오 로그인</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-muted-foreground hover:bg-accent hover:text-foreground font-medium transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>로그아웃</span>
            </button>
            {showDeleteConfirm ? (
              <div className="bg-destructive/10 rounded-xl p-3 space-y-2">
                <p className="text-xs text-destructive font-medium">정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90"
                  >
                    탈퇴
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-accent text-foreground text-xs font-semibold hover:bg-accent/80"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-destructive/60 hover:bg-destructive/5 hover:text-destructive font-medium transition-all text-sm"
              >
                <UserX className="w-4 h-4" />
                <span>회원 탈퇴</span>
              </button>
            )}
          </>
        ) : (
          <button
            onClick={signInWithKakao}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FDD835] font-semibold transition-all text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            <span>카카오 로그인</span>
          </button>
        )}
      </div>
    </aside>
  );
}
