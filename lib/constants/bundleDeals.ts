export interface BundleDeal {
  id: string;
  name: string;
  price: number;
  includedServices: string[];
  description: string;
  provider: string;
  note?: string;
}

export const BUNDLE_DEALS: BundleDeal[] = [
  {
    id: 'coupang-wow',
    name: '쿠팡 로켓와우',
    price: 7890,
    includedServices: ['쿠팡플레이', '쿠팡이츠 무료배달', '로켓배송 무료'],
    description: '쿠팡플레이 + 쿠팡이츠 무료배달 + 로켓배송 무료',
    provider: '쿠팡',
    note: '쿠팡플레이를 별도 구독 중이라면 와우 멤버십으로 통합 가능',
  },
  {
    id: 'naver-plus',
    name: '네이버 플러스 멤버십',
    price: 4900,
    includedServices: ['티빙 베이직', '지니뮤직', '네이버웹툰 쿠키'],
    description: '네이버페이 적립 + OTT/음악 혜택 선택',
    provider: '네이버',
    note: '티빙, 지니뮤직, 네이버웹툰 중 택 1 연동 가능',
  },
  {
    id: 'apple-one-individual',
    name: 'Apple One 개인',
    price: 16900,
    includedServices: ['Apple Music', 'Apple TV+', 'iCloud+ 50GB'],
    description: 'Apple Music + Apple TV+ + iCloud+ 50GB',
    provider: 'Apple',
    note: '개별 구독 대비 약 8,000원 절약',
  },
  {
    id: 'apple-one-family',
    name: 'Apple One 가족',
    price: 22900,
    includedServices: ['Apple Music 가족', 'Apple TV+ 가족', 'iCloud+ 200GB'],
    description: 'Apple Music + Apple TV+ + iCloud+ 200GB (가족 6인 공유)',
    provider: 'Apple',
    note: '최대 6인 공유 가능, 개별 대비 최대 30,000원+ 절약',
  },
  {
    id: 'tving-naver',
    name: '티빙 + 네이버 플러스 연동',
    price: 4900,
    includedServices: ['티빙 광고형'],
    description: '네이버 플러스 멤버십으로 티빙 광고형 무료 이용',
    provider: '네이버 + 티빙',
    note: '별도 티빙 구독 없이 네이버 플러스만으로 이용 가능',
  },
  {
    id: 'youtube-premium-family',
    name: '유튜브 프리미엄 패밀리',
    price: 23900,
    includedServices: ['유튜브 프리미엄', 'YouTube Music'],
    description: '유튜브 프리미엄 + YouTube Music (가족 6인)',
    provider: 'Google',
    note: '6인 공유 시 인당 약 3,983원',
  },
  {
    id: 'spotify-family',
    name: '스포티파이 패밀리',
    price: 16900,
    includedServices: ['스포티파이'],
    description: '스포티파이 프리미엄 (가족 6인)',
    provider: 'Spotify',
    note: '6인 공유 시 인당 약 2,817원',
  },
  {
    id: 'ms365-family',
    name: 'Microsoft 365 Family',
    price: 12900,
    includedServices: ['Microsoft 365', 'OneDrive 1TB x 6'],
    description: 'Office 앱 + OneDrive 1TB (가족 6인 각자)',
    provider: 'Microsoft',
    note: '6인 공유 시 인당 약 2,150원 + OneDrive 1TB',
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
