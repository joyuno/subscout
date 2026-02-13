'use client';

import { useState } from 'react';
import { FlaskConical, LogIn, LogOut, UserX, MessageCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user, profile, signInWithKakao, signOut, deleteAccount } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    const success = await deleteAccount();
    if (success) {
      setShowDeleteConfirm(false);
      setShowProfileDialog(false);
    }
  };

  return (
    <>
      <header className="lg:hidden sticky top-0 z-10 bg-card border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-500" aria-hidden="true" />
            <span className="font-bold text-lg">해<span className="text-emerald-500">독</span></span>
            <span className="text-xs text-muted-foreground font-medium">(HaeDok)</span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-foreground text-sm">{title}</h1>
            {user && profile ? (
              <button
                onClick={() => setShowProfileDialog(true)}
                className="ml-2"
              >
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {profile.nickname[0]}
                  </div>
                )}
              </button>
            ) : (
              <button
                onClick={signInWithKakao}
                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEE500] text-[#3C1E1E] text-xs font-semibold hover:bg-[#FDD835] transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">내 프로필</DialogTitle>
          </DialogHeader>
          {user && profile && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {profile.nickname[0]}
                  </div>
                )}
                <div>
                  <p className="font-bold text-base">{profile.nickname}</p>
                  <p className="text-xs text-muted-foreground">카카오 로그인</p>
                </div>
              </div>

              <div className="space-y-2 border-t pt-4">
                <button
                  onClick={async () => {
                    await signOut();
                    setShowProfileDialog(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-foreground hover:bg-accent font-medium transition-all text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>

                {showDeleteConfirm ? (
                  <div className="bg-destructive/10 rounded-xl p-3 space-y-2">
                    <p className="text-xs text-destructive font-medium">
                      정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleDeleteAccount}
                        className="flex-1 px-3 py-2 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90"
                      >
                        탈퇴
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-3 py-2 rounded-lg bg-accent text-foreground text-xs font-semibold hover:bg-accent/80"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-destructive/60 hover:bg-destructive/5 hover:text-destructive font-medium transition-all text-sm"
                  >
                    <UserX className="w-4 h-4" />
                    <span>회원 탈퇴</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
