'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatKRW } from '@/lib/utils/formatCurrency';
import type { SharingParty } from '@/lib/types/party';
import { Users, Share2, UserMinus, Lock } from 'lucide-react';
import { SERVICE_PRESETS } from '@/lib/constants/servicePresets';
import { BrandIcon } from '@/components/subscription/BrandIcon';

interface PartyCardProps {
  party: SharingParty;
  currentUserNickname?: string;
  onShare?: (party: SharingParty) => void;
  onLeave?: (partyId: string, memberId: string) => void;
  onClose?: (partyId: string) => void;
}

export function PartyCard({
  party,
  currentUserNickname,
  onShare,
  onLeave,
  onClose,
}: PartyCardProps) {
  const preset = SERVICE_PRESETS[party.subscriptionName];
  const currentMember = party.members.find(
    (m) => m.nickname === currentUserNickname,
  );
  const isOwner = currentMember?.isOwner || false;

  const statusColors = {
    recruiting: 'bg-blue-500',
    full: 'bg-green-500',
    closed: 'bg-gray-500',
  };

  const statusLabels = {
    recruiting: '모집중',
    full: '모집완료',
    closed: '종료됨',
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandIcon name={party.subscriptionName} icon={preset?.icon || '📦'} size="md" />
            <div>
              <CardTitle className="text-lg">
                {party.subscriptionName}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {party.planName}
              </p>
            </div>
          </div>
          <Badge className={statusColors[party.status]}>
            {statusLabels[party.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Price Info */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground mb-1">총 요금</p>
            <p className="font-semibold">{formatKRW(party.totalPrice)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">인당 비용</p>
            <p className="font-semibold text-primary">
              {formatKRW(party.pricePerMember)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">현재/최대</p>
            <p className="font-semibold">
              {party.currentMembers}/{party.maxMembers}명
            </p>
          </div>
        </div>

        {/* Member Slots Visualization */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            {Array.from({ length: party.maxMembers }).map((_, index) => (
              <div
                key={index}
                className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                  index < party.currentMembers
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                }`}
              >
                {index < party.currentMembers ? (
                  party.members[index].isOwner ? (
                    '👑'
                  ) : (
                    '👤'
                  )
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Members List Preview */}
        <div className="rounded-lg bg-muted/30 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            파티원 ({party.currentMembers}명)
          </p>
          <div className="space-y-1">
            {party.members.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 text-sm"
              >
                <span>{member.isOwner ? '👑' : '👤'}</span>
                <span className={member.isOwner ? 'font-medium' : ''}>
                  {member.nickname}
                </span>
                {member.isOwner && (
                  <Badge variant="outline" className="text-xs">
                    방장
                  </Badge>
                )}
              </div>
            ))}
            {party.members.length > 3 && (
              <p className="text-xs text-muted-foreground">
                외 {party.members.length - 3}명
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {party.status === 'recruiting' && onShare && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onShare(party)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              초대하기
            </Button>
          )}
          {party.status === 'closed' ? (
            <Button variant="outline" className="flex-1" disabled>
              <Lock className="mr-2 h-4 w-4" />
              종료된 파티
            </Button>
          ) : isOwner && onClose ? (
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onClose(party.id)}
            >
              파티 종료
            </Button>
          ) : currentMember && onLeave ? (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onLeave(party.id, currentMember.id)}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              파티 나가기
            </Button>
          ) : null}
        </div>

        {/* Invite Code */}
        {party.status !== 'closed' && (
          <div className="text-center pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-1">초대 코드</p>
            <p className="text-lg font-mono font-bold tracking-wider">
              {party.inviteCode}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
