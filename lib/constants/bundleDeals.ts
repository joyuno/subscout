export interface BundleDeal {
  id: string;
  name: string;
  price: number;
  includedServices: string[];
  description: string;
  provider: string;
  note?: string;
  url?: string;
  icon?: string;
  savingsEstimate?: string;
}

export const BUNDLE_DEALS: BundleDeal[] = [
  /* ── Apple 번들 ─────────────────────────────── */
  {
    id: 'apple-one-individual',
    name: 'Apple One 개인',
    price: 16900,
    includedServices: ['Apple Music', 'Apple TV+', 'iCloud+'],
    description: 'Apple Music + Apple TV+ + iCloud+ 50GB',
    provider: 'Apple',
    icon: '🍎',
    note: '개별 구독 대비 약 8,000원 절약',
    url: 'https://www.apple.com/kr/shop/go/product/apple_one',
    savingsEstimate: '월 ~8,000원 절약',
  },
  {
    id: 'apple-one-family',
    name: 'Apple One 가족',
    price: 22900,
    includedServices: ['Apple Music 가족', 'Apple TV+ 가족', 'iCloud+ 200GB', 'Apple Music', 'Apple TV+', 'iCloud+'],
    description: 'Apple Music + Apple TV+ + iCloud+ 200GB (가족 6인 공유)',
    provider: 'Apple',
    icon: '🍎',
    note: '최대 6인 공유 가능, 개별 대비 최대 30,000원+ 절약',
    url: 'https://www.apple.com/kr/shop/go/product/apple_one',
    savingsEstimate: '6인 공유 시 인당 ~3,800원',
  },

  /* ── 쿠팡 번들 ─────────────────────────────── */
  {
    id: 'coupang-wow',
    name: '쿠팡 로켓와우',
    price: 7890,
    includedServices: ['쿠팡플레이', '쿠팡이츠 무료배달', '로켓배송 무료'],
    description: '쿠팡플레이 + 쿠팡이츠 무료배달 + 로켓배송 무료',
    provider: '쿠팡',
    icon: '🚀',
    note: '쿠팡플레이를 별도 구독 중이라면 와우 멤버십으로 통합 가능',
    url: 'https://www.coupang.com/np/coupangPlay',
    savingsEstimate: '쿠팡플레이 포함 월 7,890원',
  },

  /* ── 네이버 번들 ────────────────────────────── */
  {
    id: 'naver-plus',
    name: '네이버 플러스 멤버십',
    price: 4900,
    includedServices: ['티빙', '지니뮤직', '네이버웹툰', '티빙 베이직'],
    description: '네이버페이 적립 + OTT/음악 혜택 선택',
    provider: '네이버',
    icon: '💚',
    note: '티빙, 지니뮤직, 네이버웹툰 중 택 1 연동 가능',
    url: 'https://nid.naver.com/membership/my',
    savingsEstimate: '월 4,900원으로 OTT 추가 혜택',
  },

  /* ── 유튜브 번들 ────────────────────────────── */
  {
    id: 'youtube-premium-family',
    name: '유튜브 프리미엄 패밀리',
    price: 23900,
    includedServices: ['유튜브 프리미엄', 'YouTube Music'],
    description: '유튜브 프리미엄 + YouTube Music (가족 6인)',
    provider: 'Google',
    icon: '▶️',
    note: '6인 공유 시 인당 약 3,983원',
    url: 'https://www.youtube.com/paid_memberships',
    savingsEstimate: '6인 공유 시 인당 ~3,983원',
  },

  /* ── 스포티파이 번들 ────────────────────────── */
  {
    id: 'spotify-family',
    name: '스포티파이 패밀리',
    price: 16900,
    includedServices: ['스포티파이'],
    description: '스포티파이 프리미엄 (가족 6인)',
    provider: 'Spotify',
    icon: '🎧',
    note: '6인 공유 시 인당 약 2,817원',
    url: 'https://www.spotify.com/kr/family/',
    savingsEstimate: '6인 공유 시 인당 ~2,817원',
  },

  /* ── Microsoft 번들 ─────────────────────────── */
  {
    id: 'ms365-family',
    name: 'Microsoft 365 Family',
    price: 12900,
    includedServices: ['Microsoft 365', 'OneDrive 1TB'],
    description: 'Office 앱 + OneDrive 1TB (가족 6인 각자)',
    provider: 'Microsoft',
    icon: '💼',
    note: '6인 공유 시 인당 약 2,150원 + OneDrive 1TB',
    url: 'https://www.microsoft.com/ko-kr/microsoft-365',
    savingsEstimate: '6인 공유 시 인당 ~2,150원',
  },

  /* ── 통신사 번들 ────────────────────────────── */
  {
    id: 'skt-topia',
    name: 'T우주 토피아',
    price: 14900,
    includedServices: ['웨이브', '플로', 'Amazon Prime Video'],
    description: '웨이브 + 플로 + Amazon Prime Video',
    provider: 'SKT',
    icon: '📱',
    note: 'SKT 가입자 전용, OTT + 음악 통합',
    url: 'https://www.tworld.co.kr',
    savingsEstimate: '개별 대비 월 ~11,000원 절약',
  },
  {
    id: 'kt-super-vip',
    name: 'KT 슈퍼VIP 멤버십',
    price: 0,
    includedServices: ['밀리의 서재', '지니뮤직', '왓챠'],
    description: '요금제에 따라 OTT/음악/독서 혜택 포함',
    provider: 'KT',
    icon: '📡',
    note: 'KT 가입자 전용, 요금제별 혜택 상이',
    savingsEstimate: '요금제 포함 혜택',
  },
  {
    id: 'lgu-benefit',
    name: 'LG U+ 혜택',
    price: 0,
    includedServices: ['디즈니+', '유튜브 프리미엄', 'Apple TV+', 'Apple Music'],
    description: '요금제에 따라 다양한 OTT 무료 제공',
    provider: 'LG U+',
    icon: '📶',
    note: 'LG U+ 가입자 전용, 요금제별 혜택 상이',
    savingsEstimate: '요금제 포함 혜택',
  },

  /* ── 기타 번들 ──────────────────────────────── */
  {
    id: 'tving-naver',
    name: '티빙 + 네이버 플러스 연동',
    price: 4900,
    includedServices: ['티빙 광고형'],
    description: '네이버 플러스 멤버십으로 티빙 광고형 무료 이용',
    provider: '네이버 + 티빙',
    icon: '🤝',
    note: '별도 티빙 구독 없이 네이버 플러스만으로 이용 가능',
    savingsEstimate: '티빙 광고형 5,500원 무료',
  },
  {
    id: 'baemin-coupang-delivery',
    name: '배달 멤버십 비교',
    price: 4990,
    includedServices: ['배달의민족 배민클럽'],
    description: '배민클럽 vs 쿠팡이츠(와우 포함) 비교',
    provider: '배달앱',
    icon: '🍔',
    note: '쿠팡 와우 가입 시 쿠팡이츠 무료배달 포함',
    savingsEstimate: '월 4,990원',
  },
];

/**
 * Find bundle deals that include any of the user's current services
 */
export function findRelevantBundles(
  serviceNames: string[],
): BundleDeal[] {
  return BUNDLE_DEALS.filter((bundle) =>
    bundle.includedServices.some((included) =>
      serviceNames.some(
        (userService) =>
          userService.includes(included) ||
          included.includes(userService),
      ),
    ),
  );
}
