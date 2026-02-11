import type { SubscriptionCategory, BillingCycle } from '@/lib/types/subscription';

export interface ServicePlan {
  name: string;
  price: number;
  cycle: BillingCycle;
}

export interface FamilyPlan {
  name: string;
  price: number;
  cycle: BillingCycle;
  maxMembers: number;
}

export interface ServicePreset {
  name: string;
  category: SubscriptionCategory;
  icon: string;
  plans: ServicePlan[];
  familyPlan: FamilyPlan | null;
  note?: string;
}

export const SERVICE_PRESETS: Record<string, ServicePreset> = {
  /* ── 영상 스트리밍 (OTT) ────────────────────────────────────── */
  넷플릭스: {
    name: '넷플릭스',
    category: 'video',
    icon: '🎬',
    plans: [
      { name: '광고형 스탠다드', price: 5500, cycle: 'monthly' },
      { name: '스탠다드', price: 13500, cycle: 'monthly' },
      { name: '프리미엄', price: 17000, cycle: 'monthly' },
    ],
    familyPlan: {
      name: '프리미엄',
      price: 17000,
      cycle: 'monthly',
      maxMembers: 4,
    },
    note: '프리미엄 4인 공유 시 인당 4,250원',
  },
  '디즈니+': {
    name: '디즈니+',
    category: 'video',
    icon: '🏰',
    plans: [
      { name: '스탠다드', price: 9900, cycle: 'monthly' },
      { name: '프리미엄', price: 13900, cycle: 'monthly' },
      { name: '스탠다드 연간', price: 99000, cycle: 'yearly' },
    ],
    familyPlan: {
      name: '프리미엄',
      price: 13900,
      cycle: 'monthly',
      maxMembers: 4,
    },
    note: '프리미엄 4인 공유 시 인당 3,475원',
  },
  웨이브: {
    name: '웨이브',
    category: 'video',
    icon: '🌊',
    plans: [
      { name: '베이직', price: 7900, cycle: 'monthly' },
      { name: '스탠다드', price: 10900, cycle: 'monthly' },
      { name: '프리미엄', price: 13900, cycle: 'monthly' },
    ],
    familyPlan: {
      name: '프리미엄',
      price: 13900,
      cycle: 'monthly',
      maxMembers: 4,
    },
    note: '프리미엄 동시접속 4인',
  },
  티빙: {
    name: '티빙',
    category: 'video',
    icon: '📺',
    plans: [
      { name: '광고형', price: 5500, cycle: 'monthly' },
      { name: '스탠다드', price: 10900, cycle: 'monthly' },
      { name: '프리미엄', price: 13900, cycle: 'monthly' },
    ],
    familyPlan: {
      name: '프리미엄',
      price: 13900,
      cycle: 'monthly',
      maxMembers: 4,
    },
    note: '프리미엄 동시접속 4인',
  },
  쿠팡플레이: {
    name: '쿠팡플레이',
    category: 'video',
    icon: '🎥',
    plans: [{ name: '로켓와우 포함', price: 7890, cycle: 'monthly' }],
    familyPlan: null,
    note: '쿠팡 로켓와우 멤버십에 포함',
  },
  왓챠: {
    name: '왓챠',
    category: 'video',
    icon: '🍿',
    plans: [
      { name: '베이직', price: 7900, cycle: 'monthly' },
      { name: '프리미엄', price: 12900, cycle: 'monthly' },
    ],
    familyPlan: {
      name: '프리미엄',
      price: 12900,
      cycle: 'monthly',
      maxMembers: 4,
    },
    note: '프리미엄 동시접속 4인',
  },
  'Apple TV+': {
    name: 'Apple TV+',
    category: 'video',
    icon: '🍎',
    plans: [
      { name: '개인', price: 9900, cycle: 'monthly' },
      { name: '연간', price: 99000, cycle: 'yearly' },
    ],
    familyPlan: {
      name: '가족 공유',
      price: 14900,
      cycle: 'monthly',
      maxMembers: 6,
    },
    note: 'Apple One 번들 가능',
  },
  'Amazon Prime Video': {
    name: 'Amazon Prime Video',
    category: 'video',
    icon: '📦',
    plans: [
      { name: '월간', price: 5900, cycle: 'monthly' },
      { name: '연간', price: 49000, cycle: 'yearly' },
    ],
    familyPlan: null,
  },
  유튜브프리미엄: {
    name: '유튜브 프리미엄',
    category: 'video',
    icon: '▶️',
    plans: [
      { name: '개인', price: 14900, cycle: 'monthly' },
      { name: '연간', price: 149000, cycle: 'yearly' },
    ],
    familyPlan: {
      name: '패밀리',
      price: 23900,
      cycle: 'monthly',
      maxMembers: 6,
    },
    note: 'YouTube Music 포함',
  },

  /* ── 음악 ────────────────────────────────────────────────── */
  스포티파이: {
    name: '스포티파이',
    category: 'music',
    icon: '🎧',
    plans: [
      { name: '개인', price: 10900, cycle: 'monthly' },
      { name: '듀오', price: 14900, cycle: 'monthly' },
    ],
    familyPlan: {
      name: '패밀리',
      price: 16900,
      cycle: 'monthly',
      maxMembers: 6,
    },
    note: '패밀리 6인 공유 시 인당 약 2,817원',
  },
  'Apple Music': {
    name: 'Apple Music',
    category: 'music',
    icon: '🎵',
    plans: [
      { name: '음성', price: 5900, cycle: 'monthly' },
      { name: '학생', price: 5900, cycle: 'monthly' },
      { name: '개인', price: 11000, cycle: 'monthly' },
    ],
    familyPlan: {
      name: '가족',
      price: 16900,
      cycle: 'monthly',
      maxMembers: 6,
    },
    note: 'Apple One 번들 가능',
  },
  '지니뮤직': {
    name: '지니뮤직',
    category: 'music',
    icon: '🎶',
    plans: [
      { name: '스트리밍', price: 7900, cycle: 'monthly' },
      { name: '스트리밍+다운로드', price: 10900, cycle: 'monthly' },
    ],
    familyPlan: null,
    note: '통신사 제휴 할인 가능',
  },
  '멜론': {
    name: '멜론',
    category: 'music',
    icon: '🍈',
    plans: [
      { name: '스트리밍', price: 7900, cycle: 'monthly' },
      { name: '스트리밍+다운로드', price: 10900, cycle: 'monthly' },
    ],
    familyPlan: null,
    note: '카카오 계정 연동',
  },
  'FLO': {
    name: 'FLO',
    category: 'music',
    icon: '🎼',
    plans: [
      { name: '스트리밍', price: 7900, cycle: 'monthly' },
      { name: '스트리밍+다운로드', price: 10900, cycle: 'monthly' },
    ],
    familyPlan: null,
    note: 'SKT 제휴 할인 가능',
  },
  'YouTube Music': {
    name: 'YouTube Music',
    category: 'music',
    icon: '🎹',
    plans: [{ name: '개인', price: 10900, cycle: 'monthly' }],
    familyPlan: {
      name: '패밀리',
      price: 16900,
      cycle: 'monthly',
      maxMembers: 6,
    },
    note: 'YouTube 프리미엄에 포함',
  },

  /* ── 쇼핑/배달 ──────────────────────────────────────────── */
  '쿠팡 로켓와우': {
    name: '쿠팡 로켓와우',
    category: 'shopping',
    icon: '🚀',
    plans: [{ name: '월간', price: 7890, cycle: 'monthly' }],
    familyPlan: null,
    note: '쿠팡플레이, 쿠팡이츠 무료배달 포함',
  },
  '네이버 플러스 멤버십': {
    name: '네이버 플러스 멤버십',
    category: 'shopping',
    icon: '💚',
    plans: [{ name: '월간', price: 4900, cycle: 'monthly' }],
    familyPlan: null,
    note: '네이버페이 적립, 티빙/지니뮤직 혜택 선택',
  },
  '배달의민족 배민클럽': {
    name: '배달의민족 배민클럽',
    category: 'shopping',
    icon: '🍔',
    plans: [{ name: '월간', price: 4990, cycle: 'monthly' }],
    familyPlan: null,
    note: '무료배달 및 할인 혜택',
  },
  'SSG 멤버십': {
    name: 'SSG 멤버십',
    category: 'shopping',
    icon: '🛍️',
    plans: [{ name: '월간', price: 4900, cycle: 'monthly' }],
    familyPlan: null,
    note: '이마트/SSG 할인 혜택',
  },
  '마켓컬리 컬리패스': {
    name: '마켓컬리 컬리패스',
    category: 'shopping',
    icon: '🥬',
    plans: [{ name: '월간', price: 4900, cycle: 'monthly' }],
    familyPlan: null,
    note: '무료배송 및 적립 혜택',
  },

  /* ── 생산성 ──────────────────────────────────────────────── */
  'Microsoft 365': {
    name: 'Microsoft 365',
    category: 'productivity',
    icon: '💼',
    plans: [
      { name: 'Personal', price: 8900, cycle: 'monthly' },
      { name: 'Personal 연간', price: 89000, cycle: 'yearly' },
    ],
    familyPlan: {
      name: 'Family',
      price: 12900,
      cycle: 'monthly',
      maxMembers: 6,
    },
    note: 'OneDrive 1TB 포함',
  },
  노션: {
    name: '노션',
    category: 'productivity',
    icon: '📝',
    plans: [
      { name: 'Plus', price: 10000, cycle: 'monthly' },
      { name: 'Plus 연간', price: 96000, cycle: 'yearly' },
    ],
    familyPlan: null,
    note: '무료 플랜도 개인용으로 충분',
  },
  ChatGPT: {
    name: 'ChatGPT',
    category: 'productivity',
    icon: '🤖',
    plans: [
      { name: 'Plus', price: 30000, cycle: 'monthly' },
      { name: 'Pro', price: 300000, cycle: 'monthly' },
    ],
    familyPlan: null,
    note: 'GPT-4o 등 고성능 모델 사용',
  },
  Canva: {
    name: 'Canva',
    category: 'productivity',
    icon: '🎨',
    plans: [
      { name: 'Pro 월간', price: 14900, cycle: 'monthly' },
      { name: 'Pro 연간', price: 119900, cycle: 'yearly' },
    ],
    familyPlan: {
      name: 'Teams',
      price: 29900,
      cycle: 'monthly',
      maxMembers: 5,
    },
    note: '디자인 템플릿 및 AI 기능',
  },
  피그마: {
    name: '피그마',
    category: 'productivity',
    icon: '✏️',
    plans: [
      { name: 'Professional', price: 15000, cycle: 'monthly' },
      { name: 'Organization', price: 45000, cycle: 'monthly' },
    ],
    familyPlan: null,
    note: '무료 플랜 3프로젝트 제한',
  },

  /* ── 클라우드 ────────────────────────────────────────────── */
  'iCloud+': {
    name: 'iCloud+',
    category: 'cloud',
    icon: '☁️',
    plans: [
      { name: '50GB', price: 1100, cycle: 'monthly' },
      { name: '200GB', price: 3300, cycle: 'monthly' },
      { name: '2TB', price: 11000, cycle: 'monthly' },
      { name: '6TB', price: 33000, cycle: 'monthly' },
      { name: '12TB', price: 65000, cycle: 'monthly' },
    ],
    familyPlan: {
      name: '200GB 가족공유',
      price: 3300,
      cycle: 'monthly',
      maxMembers: 6,
    },
    note: 'Apple 기기 백업 필수',
  },
  'Google One': {
    name: 'Google One',
    category: 'cloud',
    icon: '🔵',
    plans: [
      { name: '100GB', price: 2400, cycle: 'monthly' },
      { name: '200GB', price: 3700, cycle: 'monthly' },
      { name: '2TB', price: 11900, cycle: 'monthly' },
    ],
    familyPlan: {
      name: '200GB 가족',
      price: 3700,
      cycle: 'monthly',
      maxMembers: 6,
    },
    note: 'Google 포토/Gmail/드라이브 통합',
  },
  Dropbox: {
    name: 'Dropbox',
    category: 'cloud',
    icon: '📦',
    plans: [
      { name: 'Plus', price: 13900, cycle: 'monthly' },
      { name: 'Plus 연간', price: 137900, cycle: 'yearly' },
    ],
    familyPlan: {
      name: 'Family',
      price: 22900,
      cycle: 'monthly',
      maxMembers: 6,
    },
  },

  /* ── 게임 ────────────────────────────────────────────────── */
  'Nintendo Switch Online': {
    name: 'Nintendo Switch Online',
    category: 'gaming',
    icon: '🎮',
    plans: [
      { name: '개인 1개월', price: 5500, cycle: 'monthly' },
      { name: '개인 연간', price: 25000, cycle: 'yearly' },
      { name: '개인+확장팩 연간', price: 50000, cycle: 'yearly' },
    ],
    familyPlan: {
      name: '패밀리 연간',
      price: 45000,
      cycle: 'yearly',
      maxMembers: 8,
    },
    note: '패밀리 8인까지 공유 가능',
  },
  'PlayStation Plus': {
    name: 'PlayStation Plus',
    category: 'gaming',
    icon: '🕹️',
    plans: [
      { name: 'Essential 월간', price: 9900, cycle: 'monthly' },
      { name: 'Essential 연간', price: 59900, cycle: 'yearly' },
      { name: 'Extra 연간', price: 109900, cycle: 'yearly' },
      { name: 'Premium 연간', price: 139900, cycle: 'yearly' },
    ],
    familyPlan: null,
  },
  'Xbox Game Pass': {
    name: 'Xbox Game Pass',
    category: 'gaming',
    icon: '🟩',
    plans: [
      { name: 'Core 월간', price: 7900, cycle: 'monthly' },
      { name: 'Standard 월간', price: 14900, cycle: 'monthly' },
      { name: 'Ultimate 월간', price: 18900, cycle: 'monthly' },
    ],
    familyPlan: null,
    note: 'PC + Console 통합',
  },

  /* ── 독서 ────────────────────────────────────────────────── */
  '밀리의 서재': {
    name: '밀리의 서재',
    category: 'reading',
    icon: '📖',
    plans: [
      { name: '기본', price: 9900, cycle: 'monthly' },
      { name: '연간', price: 99000, cycle: 'yearly' },
    ],
    familyPlan: null,
    note: '전자책 무제한 읽기',
  },
  리디셀렉트: {
    name: '리디셀렉트',
    category: 'reading',
    icon: '📕',
    plans: [{ name: '기본', price: 9900, cycle: 'monthly' }],
    familyPlan: null,
    note: '전자책/웹소설/만화 구독',
  },
  '윌라': {
    name: '윌라',
    category: 'reading',
    icon: '🎧',
    plans: [
      { name: '월간', price: 9900, cycle: 'monthly' },
      { name: '연간', price: 79000, cycle: 'yearly' },
    ],
    familyPlan: null,
    note: '오디오북 전문',
  },
  'YES24 북클럽': {
    name: 'YES24 북클럽',
    category: 'reading',
    icon: '📗',
    plans: [{ name: '기본', price: 9500, cycle: 'monthly' }],
    familyPlan: null,
    note: '전자책 무제한 구독',
  },
  'Kindle Unlimited': {
    name: 'Kindle Unlimited',
    category: 'reading',
    icon: '📱',
    plans: [{ name: '기본', price: 11900, cycle: 'monthly' }],
    familyPlan: null,
    note: 'Amazon 전자책 구독',
  },
};

/** Array version for iteration */
export const SERVICE_PRESETS_LIST: ServicePreset[] =
  Object.values(SERVICE_PRESETS);

/** Get preset by name */
export function getServicePreset(name: string): ServicePreset | undefined {
  return SERVICE_PRESETS[name];
}

/** Get presets filtered by category */
export function getPresetsByCategory(
  category: SubscriptionCategory,
): ServicePreset[] {
  return SERVICE_PRESETS_LIST.filter((s) => s.category === category);
}
