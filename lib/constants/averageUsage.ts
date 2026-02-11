/**
 * Korean average weekly usage benchmarks (minutes per week)
 * Based on market research and industry reports for Korean users
 */
export interface UsageBenchmark {
  serviceName: string;
  averageWeeklyMinutes: number;
  heavyUserMinutes: number;
  lightUserMinutes: number;
  source: string;
}

export const AVERAGE_USAGE: Record<string, UsageBenchmark> = {
  넷플릭스: {
    serviceName: '넷플릭스',
    averageWeeklyMinutes: 420,
    heavyUserMinutes: 840,
    lightUserMinutes: 120,
    source: '한국 OTT 이용행태 조사 2024',
  },
  '디즈니+': {
    serviceName: '디즈니+',
    averageWeeklyMinutes: 240,
    heavyUserMinutes: 600,
    lightUserMinutes: 60,
    source: '한국 OTT 이용행태 조사 2024',
  },
  웨이브: {
    serviceName: '웨이브',
    averageWeeklyMinutes: 300,
    heavyUserMinutes: 600,
    lightUserMinutes: 90,
    source: '한국 OTT 이용행태 조사 2024',
  },
  티빙: {
    serviceName: '티빙',
    averageWeeklyMinutes: 360,
    heavyUserMinutes: 720,
    lightUserMinutes: 120,
    source: '한국 OTT 이용행태 조사 2024',
  },
  쿠팡플레이: {
    serviceName: '쿠팡플레이',
    averageWeeklyMinutes: 180,
    heavyUserMinutes: 420,
    lightUserMinutes: 60,
    source: '한국 OTT 이용행태 조사 2024',
  },
  왓챠: {
    serviceName: '왓챠',
    averageWeeklyMinutes: 240,
    heavyUserMinutes: 480,
    lightUserMinutes: 60,
    source: '한국 OTT 이용행태 조사 2024',
  },
  유튜브프리미엄: {
    serviceName: '유튜브 프리미엄',
    averageWeeklyMinutes: 840,
    heavyUserMinutes: 1680,
    lightUserMinutes: 300,
    source: '닐슨코리아 2024',
  },
  스포티파이: {
    serviceName: '스포티파이',
    averageWeeklyMinutes: 600,
    heavyUserMinutes: 1200,
    lightUserMinutes: 180,
    source: '음악 스트리밍 이용 조사 2024',
  },
  'Apple Music': {
    serviceName: 'Apple Music',
    averageWeeklyMinutes: 480,
    heavyUserMinutes: 960,
    lightUserMinutes: 120,
    source: '음악 스트리밍 이용 조사 2024',
  },
  '지니뮤직': {
    serviceName: '지니뮤직',
    averageWeeklyMinutes: 420,
    heavyUserMinutes: 840,
    lightUserMinutes: 120,
    source: '음악 스트리밍 이용 조사 2024',
  },
  '멜론': {
    serviceName: '멜론',
    averageWeeklyMinutes: 480,
    heavyUserMinutes: 960,
    lightUserMinutes: 150,
    source: '음악 스트리밍 이용 조사 2024',
  },
  'FLO': {
    serviceName: 'FLO',
    averageWeeklyMinutes: 360,
    heavyUserMinutes: 720,
    lightUserMinutes: 90,
    source: '음악 스트리밍 이용 조사 2024',
  },
  'YouTube Music': {
    serviceName: 'YouTube Music',
    averageWeeklyMinutes: 540,
    heavyUserMinutes: 1080,
    lightUserMinutes: 180,
    source: '음악 스트리밍 이용 조사 2024',
  },
  노션: {
    serviceName: '노션',
    averageWeeklyMinutes: 300,
    heavyUserMinutes: 900,
    lightUserMinutes: 60,
    source: '생산성 도구 이용 현황 2024',
  },
  ChatGPT: {
    serviceName: 'ChatGPT',
    averageWeeklyMinutes: 180,
    heavyUserMinutes: 600,
    lightUserMinutes: 30,
    source: 'AI 서비스 이용 현황 2024',
  },
  '밀리의 서재': {
    serviceName: '밀리의 서재',
    averageWeeklyMinutes: 180,
    heavyUserMinutes: 420,
    lightUserMinutes: 30,
    source: '전자책 이용 현황 2024',
  },
  리디셀렉트: {
    serviceName: '리디셀렉트',
    averageWeeklyMinutes: 210,
    heavyUserMinutes: 480,
    lightUserMinutes: 30,
    source: '전자책 이용 현황 2024',
  },
  'Nintendo Switch Online': {
    serviceName: 'Nintendo Switch Online',
    averageWeeklyMinutes: 360,
    heavyUserMinutes: 840,
    lightUserMinutes: 60,
    source: '게임 이용 현황 2024',
  },
  'PlayStation Plus': {
    serviceName: 'PlayStation Plus',
    averageWeeklyMinutes: 420,
    heavyUserMinutes: 900,
    lightUserMinutes: 60,
    source: '게임 이용 현황 2024',
  },
  'Xbox Game Pass': {
    serviceName: 'Xbox Game Pass',
    averageWeeklyMinutes: 360,
    heavyUserMinutes: 840,
    lightUserMinutes: 60,
    source: '게임 이용 현황 2024',
  },
};

/**
 * Get benchmark data for a service name.
 * Tries exact match first, then partial match.
 */
export function getUsageBenchmark(
  serviceName: string,
): UsageBenchmark | null {
  // Exact match
  if (AVERAGE_USAGE[serviceName]) {
    return AVERAGE_USAGE[serviceName];
  }
  // Partial match
  const key = Object.keys(AVERAGE_USAGE).find(
    (k) =>
      serviceName.includes(k) || k.includes(serviceName),
  );
  return key ? AVERAGE_USAGE[key] : null;
}
