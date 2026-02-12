/**
 * 주가 데이터 유틸리티 - 네이버 금융 실제 데이터 기반
 * 데이터 출처: 네이버 금융 (fchart.stock.naver.com)
 * 기간: 2021.01 ~ 2026.02 (월별 종가)
 */

export interface StockDataPoint {
  date: string; // YYYYMM
  price: number; // 종가
}

export interface StockSeries {
  symbol: string;
  name: string;
  color: string;
  data: StockDataPoint[];
}

export interface DCAResult {
  date: string;
  [key: string]: number | string;
}

// ── 실제 주가 데이터 (네이버 금융 월별 종가) ───────────────────────────

const KODEX_200: StockDataPoint[] = [
  {date:'2021-01',price:36926},{date:'2021-02',price:37447},{date:'2021-03',price:37880},
  {date:'2021-04',price:38574},{date:'2021-05',price:38998},{date:'2021-06',price:40032},
  {date:'2021-07',price:38799},{date:'2021-08',price:38339},{date:'2021-09',price:36706},
  {date:'2021-10',price:35531},{date:'2021-11',price:34253},{date:'2021-12',price:36487},
  {date:'2022-01',price:33229},{date:'2022-02',price:33554},{date:'2022-03',price:33991},
  {date:'2022-04',price:33020},{date:'2022-05',price:32955},{date:'2022-06',price:28708},
  {date:'2022-07',price:30181},{date:'2022-08',price:30036},{date:'2022-09',price:26348},
  {date:'2022-10',price:28024},{date:'2022-11',price:29996},{date:'2022-12',price:27676},
  {date:'2023-01',price:30140},{date:'2023-02',price:29903},{date:'2023-03',price:30640},
  {date:'2023-04',price:31001},{date:'2023-05',price:32279},{date:'2023-06',price:32269},
  {date:'2023-07',price:32982},{date:'2023-08',price:31972},{date:'2023-09',price:31307},
  {date:'2023-10',price:29292},{date:'2023-11',price:32438},{date:'2023-12',price:34555},
  {date:'2024-01',price:32410},{date:'2024-02',price:34331},{date:'2024-03',price:36357},
  {date:'2024-04',price:35540},{date:'2024-05',price:34921},{date:'2024-06',price:37379},
  {date:'2024-07',price:37117},{date:'2024-08',price:35339},{date:'2024-09',price:33803},
  {date:'2024-10',price:33298},{date:'2024-11',price:31886},{date:'2024-12',price:31321},
  {date:'2025-01',price:32781},{date:'2025-02',price:33109},{date:'2025-03',price:33193},
  {date:'2025-04',price:33680},{date:'2025-05',price:35869},{date:'2025-06',price:41387},
  {date:'2025-07',price:43770},{date:'2025-08',price:43048},{date:'2025-09',price:47468},
  {date:'2025-10',price:58083},{date:'2025-11',price:55591},{date:'2025-12',price:60831},
  {date:'2026-01',price:77305},{date:'2026-02',price:81700},
];

const TIGER_NASDAQ_100: StockDataPoint[] = [
  {date:'2021-01',price:63467},{date:'2021-02',price:62569},{date:'2021-03',price:63786},
  {date:'2021-04',price:67645},{date:'2021-05',price:66538},{date:'2021-06',price:71809},
  {date:'2021-07',price:74713},{date:'2021-08',price:79474},{date:'2021-09',price:77015},
  {date:'2021-10',price:80023},{date:'2021-11',price:84898},{date:'2021-12',price:85775},
  {date:'2022-01',price:74780},{date:'2022-02',price:72958},{date:'2022-03',price:80336},
  {date:'2022-04',price:73641},{date:'2022-05',price:68933},{date:'2022-06',price:65572},
  {date:'2022-07',price:73397},{date:'2022-08',price:73013},{date:'2022-09',price:70349},
  {date:'2022-10',price:71825},{date:'2022-11',price:66638},{date:'2022-12',price:59625},
  {date:'2023-01',price:64289},{date:'2023-02',price:70174},{date:'2023-03',price:74090},
  {date:'2023-04',price:77251},{date:'2023-05',price:83347},{date:'2023-06',price:86804},
  {date:'2023-07',price:88122},{date:'2023-08',price:89933},{date:'2023-09',price:86699},
  {date:'2023-10',price:84731},{date:'2023-11',price:91089},{date:'2023-12',price:96252},
  {date:'2024-01',price:101984},{date:'2024-02',price:104883},{date:'2024-03',price:108875},
  {date:'2024-04',price:108246},{date:'2024-05',price:112896},{date:'2024-06',price:120681},
  {date:'2024-07',price:115721},{date:'2024-08',price:114524},{date:'2024-09',price:115144},
  {date:'2024-10',price:123333},{date:'2024-11',price:128384},{date:'2024-12',price:139795},
  {date:'2025-01',price:138819},{date:'2025-02',price:133070},{date:'2025-03',price:123946},
  {date:'2025-04',price:122280},{date:'2025-05',price:130058},{date:'2025-06',price:135432},
  {date:'2025-07',price:145188},{date:'2025-08',price:145627},{date:'2025-09',price:152913},
  {date:'2025-10',price:164250},{date:'2025-11',price:164775},{date:'2025-12',price:162802},
  {date:'2026-01',price:163585},{date:'2026-02',price:161455},
];

const SK_HYNIX: StockDataPoint[] = [
  {date:'2021-01',price:122500},{date:'2021-02',price:141500},{date:'2021-03',price:132500},
  {date:'2021-04',price:128000},{date:'2021-05',price:127000},{date:'2021-06',price:127500},
  {date:'2021-07',price:112500},{date:'2021-08',price:106500},{date:'2021-09',price:103000},
  {date:'2021-10',price:103000},{date:'2021-11',price:114000},{date:'2021-12',price:131000},
  {date:'2022-01',price:120500},{date:'2022-02',price:123500},{date:'2022-03',price:118000},
  {date:'2022-04',price:112500},{date:'2022-05',price:108000},{date:'2022-06',price:91000},
  {date:'2022-07',price:97900},{date:'2022-08',price:95200},{date:'2022-09',price:83100},
  {date:'2022-10',price:82700},{date:'2022-11',price:85000},{date:'2022-12',price:75000},
  {date:'2023-01',price:88500},{date:'2023-02',price:89400},{date:'2023-03',price:88600},
  {date:'2023-04',price:89500},{date:'2023-05',price:108600},{date:'2023-06',price:115200},
  {date:'2023-07',price:123400},{date:'2023-08',price:121800},{date:'2023-09',price:114700},
  {date:'2023-10',price:116300},{date:'2023-11',price:133900},{date:'2023-12',price:141500},
  {date:'2024-01',price:134700},{date:'2024-02',price:156200},{date:'2024-03',price:183000},
  {date:'2024-04',price:174200},{date:'2024-05',price:189200},{date:'2024-06',price:236500},
  {date:'2024-07',price:194600},{date:'2024-08',price:173700},{date:'2024-09',price:174600},
  {date:'2024-10',price:186300},{date:'2024-11',price:159900},{date:'2024-12',price:173900},
  {date:'2025-01',price:199200},{date:'2025-02',price:190200},{date:'2025-03',price:190700},
  {date:'2025-04',price:177500},{date:'2025-05',price:204500},{date:'2025-06',price:292000},
  {date:'2025-07',price:273500},{date:'2025-08',price:269000},{date:'2025-09',price:347500},
  {date:'2025-10',price:559000},{date:'2025-11',price:530000},{date:'2025-12',price:651000},
  {date:'2026-01',price:909000},{date:'2026-02',price:891000},
];

// ── Stock configs ───────────────────────────────────────────────────

export const STOCK_CONFIGS = [
  { symbol: '069500', name: 'KODEX 200', color: '#3182F6', data: KODEX_200 },
  { symbol: '133690', name: 'TIGER 나스닥100', color: '#1FC08E', data: TIGER_NASDAQ_100 },
  { symbol: '000660', name: 'SK하이닉스', color: '#F04452', data: SK_HYNIX },
] as const;

/**
 * 모든 종목 데이터를 StockSeries 형태로 반환
 */
export function getAllStockData(): StockSeries[] {
  return STOCK_CONFIGS.map((config) => ({
    symbol: config.symbol,
    name: config.name,
    color: config.color,
    data: [...config.data],
  }));
}

/**
 * 최근 N년 데이터만 슬라이스
 */
export function getStockDataByYears(years: number): StockSeries[] {
  const months = years * 12;
  return STOCK_CONFIGS.map((config) => ({
    symbol: config.symbol,
    name: config.name,
    color: config.color,
    data: config.data.slice(-months),
  }));
}

/**
 * DCA (적립식 투자) 시뮬레이션
 * @param monthlyAmount 월 투자금액 (KRW)
 * @param stockData 종목 데이터 배열
 * @returns 월별 누적 평가액
 */
export function simulateDCA(
  monthlyAmount: number,
  stockData: StockSeries[],
): DCAResult[] {
  if (stockData.length === 0 || monthlyAmount <= 0) return [];

  const minLength = Math.min(...stockData.map((s) => s.data.length));
  if (minLength === 0) return [];

  const results: DCAResult[] = [];
  const holdings: Record<string, number> = {};
  stockData.forEach((s) => { holdings[s.name] = 0; });

  for (let i = 0; i < minLength; i++) {
    const baseDate = stockData[0].data[stockData[0].data.length - minLength + i].date;
    const point: DCAResult = { date: baseDate };

    for (const series of stockData) {
      const dataIndex = series.data.length - minLength + i;
      const price = series.data[dataIndex].price;
      holdings[series.name] += monthlyAmount / price;
      point[series.name] = Math.round(holdings[series.name] * price);
    }

    point['원금'] = monthlyAmount * (i + 1);
    results.push(point);
  }

  return results;
}
