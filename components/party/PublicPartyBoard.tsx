'use client';

import { useState, useMemo, useCallback } from 'react';
import { usePartyStore } from '@/stores/partyStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BrandIcon } from '@/components/subscription/BrandIcon';
import { SERVICE_PRESETS } from '@/lib/constants/servicePresets';
import { formatKRW } from '@/lib/utils/formatCurrency';
import { Plus, Users, Clock, Megaphone } from 'lucide-react';

export interface PublicPartyPost {
  id: string;
  serviceName: string;
  serviceIcon: string;
  currentMembers: number;
  maxMembers: number;
  pricePerMember: number;
  totalPrice: number;
  status: 'recruiting' | 'closed';
  comment: string;
  createdAt: string;
}

const SAMPLE_POSTS: PublicPartyPost[] = [
  {
    id: 'sample-1',
    serviceName: '넷플릭스',
    serviceIcon: '🎬',
    currentMembers: 2,
    maxMembers: 4,
    pricePerMember: 4250,
    totalPrice: 17000,
    status: 'recruiting',
    comment: '넷플릭스 프리미엄 4인 공유합니다! 매달 1일 정산해요.',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    serviceName: '유튜브 프리미엄',
    serviceIcon: '▶️',
    currentMembers: 3,
    maxMembers: 6,
    pricePerMember: 3984,
    totalPrice: 23900,
    status: 'recruiting',
    comment: '유튜브 프리미엄 패밀리 멤버 모집 중! 광고 없는 쾌적한 유튜브 즐기세요.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    serviceName: '스포티파이',
    serviceIcon: '🎧',
    currentMembers: 5,
    maxMembers: 6,
    pricePerMember: 2817,
    totalPrice: 16900,
    status: 'recruiting',
    comment: '스포티파이 패밀리 1자리 남았어요! 음악 좋아하시는 분 환영합니다.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-4',
    serviceName: 'MS 365',
    serviceIcon: '💼',
    currentMembers: 6,
    maxMembers: 6,
    pricePerMember: 2150,
    totalPrice: 12900,
    status: 'closed',
    comment: 'MS 365 Family 모집 완료! 감사합니다.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const STORAGE_KEY = 'subscout-public-party-board';

function loadPosts(): PublicPartyPost[] {
  if (typeof window === 'undefined') return SAMPLE_POSTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PublicPartyPost[];
      return parsed.length > 0 ? parsed : SAMPLE_POSTS;
    }
  } catch {
    // ignore
  }
  return SAMPLE_POSTS;
}

function savePosts(posts: PublicPartyPost[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function formatRelativeDate(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHour = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 30) return `${diffDay}일 전`;
  return new Date(dateStr).toLocaleDateString('ko-KR');
}

export function PublicPartyBoard() {
  const [posts, setPosts] = useState<PublicPartyPost[]>(loadPosts);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [maxMembers, setMaxMembers] = useState('');
  const [comment, setComment] = useState('');

  const servicesWithFamilyPlans = useMemo(
    () => Object.values(SERVICE_PRESETS).filter((preset) => preset.familyPlan !== null),
    [],
  );

  const selectedPreset = selectedService ? SERVICE_PRESETS[selectedService] : null;

  const handleCreate = useCallback(() => {
    if (!selectedPreset?.familyPlan || !maxMembers) return;

    const max = parseInt(maxMembers, 10);
    if (isNaN(max) || max < 2) return;

    const monthlyPrice =
      selectedPreset.familyPlan.cycle === 'yearly'
        ? Math.round(selectedPreset.familyPlan.price / 12)
        : selectedPreset.familyPlan.price;

    const newPost: PublicPartyPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      serviceName: selectedPreset.name,
      serviceIcon: selectedPreset.icon,
      currentMembers: 1,
      maxMembers: max,
      pricePerMember: Math.ceil(monthlyPrice / max),
      totalPrice: monthlyPrice,
      status: 'recruiting',
      comment: comment.trim() || `${selectedPreset.name} ${max}인 공유 모집합니다!`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    savePosts(updated);
    setShowCreateDialog(false);
    setSelectedService('');
    setMaxMembers('');
    setComment('');
  }, [selectedPreset, maxMembers, comment, posts]);

  const recruitingPosts = posts.filter((p) => p.status === 'recruiting');
  const closedPosts = posts.filter((p) => p.status === 'closed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">공개 모집 게시판</h3>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          size="sm"
          className="rounded-xl font-semibold"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          모집글 작성
        </Button>
      </div>

      {/* Recruiting posts */}
      {recruitingPosts.length === 0 && closedPosts.length === 0 && (
        <Card className="rounded-2xl">
          <CardContent className="py-16 text-center">
            <Megaphone className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h4 className="text-lg font-bold mb-2 text-foreground">아직 모집글이 없어요</h4>
            <p className="text-sm text-muted-foreground mb-6">
              첫 번째 공유 파티 모집글을 작성해보세요!
            </p>
            <Button onClick={() => setShowCreateDialog(true)} className="rounded-xl font-semibold">
              <Plus className="mr-1.5 h-4 w-4" />
              모집글 작성하기
            </Button>
          </CardContent>
        </Card>
      )}

      {recruitingPosts.length > 0 && (
        <div className="space-y-3">
          {recruitingPosts.map((post) => (
            <Card key={post.id} className="rounded-2xl hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <BrandIcon name={post.serviceName} icon={post.serviceIcon} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="font-bold text-foreground truncate">{post.serviceName}</h4>
                      <Badge variant="default" className="bg-[#1FC08E] text-white text-[11px] shrink-0">
                        모집중
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.comment}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                          {post.currentMembers}/{post.maxMembers}명
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">1인</span>
                        <span className="font-bold text-primary">
                          {formatKRW(post.pricePerMember)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs">{formatRelativeDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Closed posts */}
      {closedPosts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-muted-foreground">마감된 모집</h4>
          {closedPosts.map((post) => (
            <Card key={post.id} className="rounded-2xl opacity-60">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <BrandIcon name={post.serviceName} icon={post.serviceIcon} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="font-bold text-foreground truncate">{post.serviceName}</h4>
                      <Badge variant="secondary" className="text-[11px] shrink-0">
                        마감
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.comment}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-semibold text-foreground">
                          {post.currentMembers}/{post.maxMembers}명
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">1인</span>
                        <span className="font-bold text-foreground">
                          {formatKRW(post.pricePerMember)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-xs">{formatRelativeDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Post Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">공개 모집글 작성</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="pub-service" className="font-semibold">
                구독 서비스
              </Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger id="pub-service" className="rounded-xl">
                  <SelectValue placeholder="공유할 서비스 선택" />
                </SelectTrigger>
                <SelectContent>
                  {servicesWithFamilyPlans.map((preset) => (
                    <SelectItem key={preset.name} value={preset.name}>
                      <div className="flex items-center gap-2">
                        <span>{preset.icon}</span>
                        <span>{preset.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPreset?.familyPlan && (
              <div className="rounded-xl border border-border bg-accent/40 p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">요금제</p>
                    <p className="font-semibold text-foreground">{selectedPreset.familyPlan.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">월 요금</p>
                    <p className="font-semibold text-foreground">
                      {formatKRW(
                        selectedPreset.familyPlan.cycle === 'yearly'
                          ? Math.round(selectedPreset.familyPlan.price / 12)
                          : selectedPreset.familyPlan.price,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="pub-max" className="font-semibold">
                최대 인원
              </Label>
              <Input
                id="pub-max"
                type="number"
                min={2}
                max={selectedPreset?.familyPlan?.maxMembers || 10}
                placeholder={
                  selectedPreset?.familyPlan
                    ? `최대 ${selectedPreset.familyPlan.maxMembers}명`
                    : '최대 인원 입력'
                }
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pub-comment" className="font-semibold">
                코멘트 <span className="text-muted-foreground font-normal">(선택)</span>
              </Label>
              <Textarea
                id="pub-comment"
                placeholder="공유 파티에 대해 한 마디 남겨주세요"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={200}
                className="rounded-xl resize-none"
                rows={3}
              />
            </div>

            {selectedPreset?.familyPlan && maxMembers && parseInt(maxMembers, 10) >= 2 && (
              <div className="rounded-xl bg-primary/[0.06] p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">1인당 예상 비용</p>
                <p className="text-2xl font-extrabold text-primary">
                  {formatKRW(
                    Math.ceil(
                      (selectedPreset.familyPlan.cycle === 'yearly'
                        ? Math.round(selectedPreset.familyPlan.price / 12)
                        : selectedPreset.familyPlan.price) / parseInt(maxMembers, 10),
                    ),
                  )}
                  <span className="text-sm font-semibold text-muted-foreground"> / 월</span>
                </p>
              </div>
            )}

            <Button
              onClick={handleCreate}
              disabled={!selectedService || !maxMembers || parseInt(maxMembers, 10) < 2}
              className="w-full rounded-xl font-semibold"
              size="lg"
            >
              모집글 게시하기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
