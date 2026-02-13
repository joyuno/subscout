'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { MessageCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const;
const THROTTLE_MS = 60 * 1000; // 1분마다 활동 시간 갱신

export function SessionTimeoutDialog() {
  const { user, signOut, signInWithKakao } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleTimeout = useCallback(async () => {
    clearTimer();
    sessionStorage.removeItem('haedok_last_activity');
    await signOut();
    setShowDialog(true);
  }, [signOut, clearTimer]);

  const resetTimer = useCallback(() => {
    clearTimer();
    lastActivityRef.current = Date.now();
    sessionStorage.setItem('haedok_last_activity', Date.now().toString());
    timerRef.current = setTimeout(handleTimeout, SESSION_TIMEOUT_MS);
  }, [handleTimeout, clearTimer]);

  // 사용자 활동 감지 (쓰로틀링)
  useEffect(() => {
    if (!user) return;

    let lastThrottled = 0;
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastThrottled < THROTTLE_MS) return;
      lastThrottled = now;
      resetTimer();
    };

    ACTIVITY_EVENTS.forEach(event =>
      window.addEventListener(event, handleActivity, { passive: true })
    );

    return () => {
      ACTIVITY_EVENTS.forEach(event =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [user, resetTimer]);

  // 로그인 상태 변화 감지
  useEffect(() => {
    if (user) {
      const storedActivity = sessionStorage.getItem('haedok_last_activity');
      if (storedActivity) {
        const elapsed = Date.now() - parseInt(storedActivity, 10);
        const remaining = SESSION_TIMEOUT_MS - elapsed;
        if (remaining <= 0) {
          handleTimeout();
          return;
        }
        lastActivityRef.current = parseInt(storedActivity, 10);
        timerRef.current = setTimeout(handleTimeout, remaining);
      } else {
        resetTimer();
      }
    } else {
      clearTimer();
      sessionStorage.removeItem('haedok_last_activity');
    }

    return clearTimer;
  }, [user, handleTimeout, resetTimer, clearTimer]);

  const handleRelogin = () => {
    setShowDialog(false);
    signInWithKakao();
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-sm rounded-2xl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <Clock className="w-5 h-5 text-amber-500" />
            세션 만료
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            보안을 위해 2시간 동안 활동이 없어 자동으로 로그아웃되었습니다.
            <br />
            계속 사용하시려면 다시 로그인해 주세요.
          </p>
          <button
            onClick={handleRelogin}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#FEE500] text-[#3C1E1E] font-semibold hover:bg-[#FDD835] transition-all shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>카카오 로그인</span>
          </button>
          <button
            onClick={() => setShowDialog(false)}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent transition-all font-medium"
          >
            나중에 하기
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
