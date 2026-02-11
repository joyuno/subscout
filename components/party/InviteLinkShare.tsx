'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SharingParty } from '@/lib/types/party';
import { Copy, MessageCircle, Check, QrCode } from 'lucide-react';

interface InviteLinkShareProps {
  party: SharingParty;
}

export function InviteLinkShare({ party }: InviteLinkShareProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `🎉 ${party.subscriptionName} 공유 파티 초대장

📺 서비스: ${party.subscriptionName}
💎 요금제: ${party.planName}
💰 인당 비용: ₩${party.pricePerMember.toLocaleString()}/월
👥 현재 인원: ${party.currentMembers}/${party.maxMembers}명

🔑 초대 코드: ${party.inviteCode}

SubScout에서 코드를 입력하고 함께 절약해요!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleKakaoShare = () => {
    // In a real app, this would use the KakaoTalk API
    // For now, just copy to clipboard
    handleCopyLink();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">파티 초대하기</CardTitle>
        <p className="text-sm text-muted-foreground">
          친구들에게 초대 코드를 공유하세요
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR-style Invite Code Display */}
        <div className="relative">
          <div className="rounded-lg border-2 border-dashed border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-lg bg-white p-4 shadow-lg">
                <QrCode className="h-24 w-24 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">초대 코드</p>
                <p className="text-3xl font-mono font-bold tracking-widest text-primary">
                  {party.inviteCode}
                </p>
              </div>
            </div>
          </div>
          <Badge className="absolute top-4 right-4 bg-green-500">
            {party.maxMembers - party.currentMembers}자리 남음
          </Badge>
        </div>

        {/* Party Info Summary */}
        <div className="rounded-lg bg-muted/30 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">서비스</span>
            <span className="font-medium">{party.subscriptionName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">요금제</span>
            <span className="font-medium">{party.planName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">인당 비용</span>
            <span className="font-medium text-primary">
              ₩{party.pricePerMember.toLocaleString()}/월
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">현재 인원</span>
            <span className="font-medium">
              {party.currentMembers}/{party.maxMembers}명
            </span>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="w-full"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                복사됨!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                링크 복사
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleKakaoShare}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-yellow-400"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            카카오톡
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p>💡 초대 받은 친구는:</p>
          <p className="pl-4">1. SubScout 파티 페이지 접속</p>
          <p className="pl-4">2. "파티 참가하기" 선택</p>
          <p className="pl-4">3. 초대 코드 입력</p>
        </div>
      </CardContent>
    </Card>
  );
}
