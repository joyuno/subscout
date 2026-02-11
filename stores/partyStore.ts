import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { SharingParty, PartyMember } from '@/lib/types/party';

interface PartyState {
  parties: SharingParty[];

  // CRUD
  createParty: (input: {
    subscriptionName: string;
    planName: string;
    totalPrice: number;
    maxMembers: number;
    ownerNickname: string;
  }) => SharingParty;
  joinParty: (inviteCode: string, nickname: string) => boolean;
  leaveParty: (partyId: string, memberId: string) => void;
  closeParty: (partyId: string) => void;

  // Getters
  getParty: (id: string) => SharingParty | undefined;
  getPartyByInviteCode: (code: string) => SharingParty | undefined;
  getMyParties: (nickname: string) => SharingParty[];
  getRecruitingParties: () => SharingParty[];
}

/**
 * Generate a random 6-character invite code (uppercase alphanumeric)
 */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export const usePartyStore = create<PartyState>()(
  persist(
    (set, get) => ({
      parties: [],

      createParty: (input) => {
        const now = new Date().toISOString();
        const ownerId = uuidv4();

        const owner: PartyMember = {
          id: ownerId,
          nickname: input.ownerNickname,
          joinedAt: now,
          isOwner: true,
        };

        // Ensure unique invite code
        let inviteCode = generateInviteCode();
        while (get().parties.some((p) => p.inviteCode === inviteCode)) {
          inviteCode = generateInviteCode();
        }

        const party: SharingParty = {
          id: uuidv4(),
          subscriptionName: input.subscriptionName,
          planName: input.planName,
          totalPrice: input.totalPrice,
          maxMembers: input.maxMembers,
          currentMembers: 1,
          pricePerMember: Math.ceil(input.totalPrice / input.maxMembers),
          inviteCode,
          members: [owner],
          status: input.maxMembers > 1 ? 'recruiting' : 'full',
          createdAt: now,
        };

        set((state) => ({
          parties: [...state.parties, party],
        }));

        return party;
      },

      joinParty: (inviteCode, nickname) => {
        const party = get().getPartyByInviteCode(inviteCode);
        if (!party) return false;
        if (party.status !== 'recruiting') return false;
        if (party.currentMembers >= party.maxMembers) return false;

        // Check if nickname already in party
        if (party.members.some((m) => m.nickname === nickname)) return false;

        const newMember: PartyMember = {
          id: uuidv4(),
          nickname,
          joinedAt: new Date().toISOString(),
          isOwner: false,
        };

        const newCurrentMembers = party.currentMembers + 1;
        const newStatus: SharingParty['status'] =
          newCurrentMembers >= party.maxMembers ? 'full' : 'recruiting';

        set((state) => ({
          parties: state.parties.map((p) =>
            p.id === party.id
              ? {
                  ...p,
                  members: [...p.members, newMember],
                  currentMembers: newCurrentMembers,
                  pricePerMember: Math.ceil(p.totalPrice / newCurrentMembers),
                  status: newStatus,
                }
              : p,
          ),
        }));

        return true;
      },

      leaveParty: (partyId, memberId) => {
        set((state) => ({
          parties: state.parties.map((p) => {
            if (p.id !== partyId) return p;

            const member = p.members.find((m) => m.id === memberId);
            if (!member) return p;

            // If owner leaves, close the party
            if (member.isOwner) {
              return { ...p, status: 'closed' as const };
            }

            const newMembers = p.members.filter((m) => m.id !== memberId);
            const newCurrentMembers = newMembers.length;

            return {
              ...p,
              members: newMembers,
              currentMembers: newCurrentMembers,
              pricePerMember: Math.ceil(p.totalPrice / Math.max(newCurrentMembers, 1)),
              status: 'recruiting' as const,
            };
          }),
        }));
      },

      closeParty: (partyId) => {
        set((state) => ({
          parties: state.parties.map((p) =>
            p.id === partyId ? { ...p, status: 'closed' as const } : p,
          ),
        }));
      },

      getParty: (id) => {
        return get().parties.find((p) => p.id === id);
      },

      getPartyByInviteCode: (code) => {
        return get().parties.find(
          (p) => p.inviteCode === code.toUpperCase(),
        );
      },

      getMyParties: (nickname) => {
        return get().parties.filter((p) =>
          p.members.some((m) => m.nickname === nickname),
        );
      },

      getRecruitingParties: () => {
        return get().parties.filter((p) => p.status === 'recruiting');
      },
    }),
    {
      name: 'subscout-parties',
    },
  ),
);
