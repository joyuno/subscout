'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePartyStore } from '@/stores/partyStore';
import { SERVICE_PRESETS } from '@/lib/constants/servicePresets';
import { formatKRW } from '@/lib/utils/formatCurrency';
import { UserPlus, Sparkles } from 'lucide-react';

interface PartyCreateFormProps {
  onSuccess?: (partyId: string) => void;
}

export function PartyCreateForm({ onSuccess }: PartyCreateFormProps) {
  const createParty = usePartyStore((state) => state.createParty);

  const [selectedService, setSelectedService] = useState<string>('');
  const [ownerNickname, setOwnerNickname] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  // Filter services that have family plans
  const servicesWithFamilyPlans = Object.values(SERVICE_PRESETS).filter(
    (preset) => preset.familyPlan !== null,
  );

  const selectedPreset = selectedService
    ? SERVICE_PRESETS[selectedService]
    : null;

  const handleCreate = () => {
    if (!selectedPreset?.familyPlan || !ownerNickname.trim()) return;

    setIsCreating(true);

    const familyPlan = selectedPreset.familyPlan;
    const monthlyPrice =
      familyPlan.cycle === 'yearly'
        ? Math.round(familyPlan.price / 12)
        : familyPlan.price;

    const party = createParty({
      subscriptionName: selectedPreset.name,
      planName: familyPlan.name,
      totalPrice: monthlyPrice,
      maxMembers: familyPlan.maxMembers,
      ownerNickname: ownerNickname.trim(),
    });

    setIsCreating(false);

    if (onSuccess) {
      onSuccess(party.id);
    }

    // Reset form
    setSelectedService('');
    setOwnerNickname('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>공유 파티 만들기</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              구독을 함께 나눌 파티를 생성하세요
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Selection */}
        <div className="space-y-2">
          <Label htmlFor="service">구독 서비스</Label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger id="service">
              <SelectValue placeholder="공유할 서비스를 선택하세요" />
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

        {/* Plan Details (shown when service is selected) */}
        {selectedPreset?.familyPlan && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">{selectedPreset.familyPlan.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">요금제 가격</p>
                <p className="font-semibold">
                  {formatKRW(
                    selectedPreset.familyPlan.cycle === 'yearly'
                      ? Math.round(selectedPreset.familyPlan.price / 12)
                      : selectedPreset.familyPlan.price,
                  )}
                  <span className="text-muted-foreground font-normal"> / 월</span>
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">최대 인원</p>
                <p className="font-semibold">
                  {selectedPreset.familyPlan.maxMembers}명
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">인당 비용</p>
                <p className="font-semibold text-primary">
                  {formatKRW(
                    Math.ceil(
                      (selectedPreset.familyPlan.cycle === 'yearly'
                        ? Math.round(selectedPreset.familyPlan.price / 12)
                        : selectedPreset.familyPlan.price) /
                        selectedPreset.familyPlan.maxMembers,
                    ),
                  )}
                </p>
              </div>
            </div>
            {selectedPreset.note && (
              <p className="text-xs text-muted-foreground pt-2 border-t">
                💡 {selectedPreset.note}
              </p>
            )}
          </div>
        )}

        {/* Owner Nickname */}
        <div className="space-y-2">
          <Label htmlFor="nickname">내 닉네임</Label>
          <Input
            id="nickname"
            placeholder="파티 내에서 사용할 닉네임"
            value={ownerNickname}
            onChange={(e) => setOwnerNickname(e.target.value)}
            maxLength={20}
          />
          <p className="text-xs text-muted-foreground">
            파티원들이 보게 될 이름이에요
          </p>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          disabled={!selectedService || !ownerNickname.trim() || isCreating}
          className="w-full"
          size="lg"
        >
          {isCreating ? '생성 중...' : '파티 만들기'}
        </Button>
      </CardContent>
    </Card>
  );
}
