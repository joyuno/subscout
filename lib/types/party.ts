export interface SharingParty {
  id: string;
  subscriptionName: string;
  planName: string;
  totalPrice: number;
  maxMembers: number;
  currentMembers: number;
  pricePerMember: number;
  inviteCode: string;
  members: PartyMember[];
  status: 'recruiting' | 'full' | 'closed';
  createdAt: string;
}

export interface PartyMember {
  id: string;
  nickname: string;
  joinedAt: string;
  isOwner: boolean;
}
