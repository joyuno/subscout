'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { SharingParty } from '@/lib/types/party';
import { UserMinus, Crown, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PartyMemberListProps {
  party: SharingParty;
  currentUserNickname?: string;
  onRemoveMember?: (partyId: string, memberId: string) => void;
}

export function PartyMemberList({
  party,
  currentUserNickname,
  onRemoveMember,
}: PartyMemberListProps) {
  const currentMember = party.members.find(
    (m) => m.nickname === currentUserNickname,
  );
  const isOwner = currentMember?.isOwner || false;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            파티원 ({party.currentMembers}/{party.maxMembers})
          </CardTitle>
          <Badge variant="outline">
            {party.maxMembers - party.currentMembers}자리 남음
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {party.members.map((member) => {
            const joinedAgo = formatDistanceToNow(new Date(member.joinedAt), {
              addSuffix: true,
              locale: ko,
            });

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    {member.isOwner ? (
                      <Crown className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <User className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{member.nickname}</span>
                      {member.isOwner && (
                        <Badge variant="secondary" className="text-xs">
                          방장
                        </Badge>
                      )}
                      {member.nickname === currentUserNickname && (
                        <Badge variant="outline" className="text-xs">
                          나
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {joinedAgo} 참가
                    </p>
                  </div>
                </div>

                {/* Remove button (only visible to owner, and not for themselves) */}
                {isOwner && !member.isOwner && onRemoveMember && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveMember(party.id, member.id)}
                  >
                    <UserMinus className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            );
          })}

          {/* Empty Slots */}
          {Array.from({
            length: party.maxMembers - party.currentMembers,
          }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-dashed bg-muted/30"
            >
              <div className="rounded-full bg-muted p-2">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  빈 자리
                </span>
              </div>
            </div>
          ))}
        </div>

        {party.status === 'recruiting' && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              💡 친구들을 초대해서 모두 함께 절약하세요!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
