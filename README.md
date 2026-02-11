# 🔍 SubScout - 구독 서비스 스마트 매니저

> 구독 서비스의 이용률을 분석하고 ROI 기반으로 절약 방안을 추천하는 웹 애플리케이션

## 📋 프로젝트 소개

"내가 쓰는 구독 서비스, 정말 돈값을 하고 있을까?" — 현대인은 평균 5~12개의 구독 서비스를 이용하지만, 실제로 얼마나 활용하는지 모르는 경우가 많습니다. SubScout는 구독료 대비 실제 이용률을 분석하여 "좀비 구독"을 찾아내고, ROI 기반 최적화 방안을 제시합니다.

## ✨ 주요 기능

### 핵심 기능
- **구독 관리 (CRUD)**: 30개+ 한국 구독 서비스 프리셋 지원 (Netflix, YouTube Premium, Spotify 등)
- **대시보드**: 카테고리별 지출 파이차트, 월별 트렌드, 결제 캘린더
- **ROI 분석**: 분당비용 계산, A~F 등급 판정, 한국 평균 벤치마크 비교
- **공유 최적화**: 가족/친구 공유 시뮬레이션, 절약 금액 계산
- **번들 최적화**: 쿠팡와우, 네이버플러스 등 번들 추천
- **이용시간 가이드**: iOS/Android 스크린타임 확인 방법 단계별 안내

### 혁신 기능 (Wow Factor)
- **구독 DNA**: MBTI처럼 구독 성향을 7가지 유형으로 분석 (취향탐험가, 가성비헌터 등)
- **돈값 미터**: 구독료를 삼각김밥, 아메리카노 개수로 환산하여 직관적 비교
- **기회비용 시뮬레이터**: "넷플릭스 대신 투자했다면?" 복리 계산으로 장기 기회비용 시각화
- **구독 다이어트 챌린지**: 월별 절약 목표 설정 및 배지 시스템 (브론즈/실버/골드)

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript 5 (Strict Mode) |
| 스타일링 | Tailwind CSS v4 |
| UI 컴포넌트 | shadcn/ui + Radix UI |
| 상태관리 | Zustand (LocalStorage Persist) |
| 차트 | Recharts 3 |
| 유틸리티 | date-fns, papaparse, clsx |
| 테스트 | Vitest + Testing Library |
| 배포 | Vercel (Static Export) |

## 🚀 실행 방법

### 사전 요구사항
- Node.js 18+
- pnpm 9+ (권장)

### 설치 및 실행
```bash
# 저장소 클론
git clone <repository-url>
cd subscout

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

개발 서버: http://localhost:3000

### 프로덕션 빌드
```bash
# 빌드 (Static Export)
pnpm build

# 빌드 결과물 확인
cd out
python3 -m http.server 8000
```

## 📁 디렉토리 구조

```
subscout/
├── app/                      # Next.js 16 App Router
│   ├── page.tsx              # 대시보드 (홈)
│   ├── subscriptions/        # 구독 관리
│   ├── analysis/             # 이용률 분석
│   ├── optimize/             # 최적화 추천
│   ├── party/                # 공유 파티
│   ├── guide/                # 이용시간 가이드
│   ├── insights/             # 구독 인사이트 (혁신 기능)
│   ├── layout.tsx            # 루트 레이아웃
│   └── globals.css           # 전역 스타일
├── components/               # 재사용 가능한 컴포넌트
│   ├── dashboard/            # 대시보드 컴포넌트
│   ├── subscription/         # 구독 관리 컴포넌트
│   ├── analysis/             # 분석 컴포넌트
│   ├── optimize/             # 최적화 컴포넌트
│   ├── party/                # 공유 파티 컴포넌트
│   ├── guide/                # 가이드 컴포넌트
│   ├── innovation/           # 혁신 기능 컴포넌트
│   ├── layout/               # 레이아웃 컴포넌트
│   └── ui/                   # shadcn/ui 기본 컴포넌트
├── lib/                      # 유틸리티 및 로직
│   ├── types/                # TypeScript 타입 정의
│   ├── constants/            # 상수 및 프리셋 데이터
│   ├── calculations/         # ROI 계산 로직
│   └── utils/                # 유틸리티 함수
├── stores/                   # Zustand 전역 상태
│   ├── subscriptionStore.ts  # 구독 데이터
│   ├── usageStore.ts         # 이용률 데이터
│   └── partyStore.ts         # 공유 파티 데이터
├── hooks/                    # 커스텀 React Hooks
├── public/                   # 정적 파일
└── __tests__/                # 테스트 파일
```

## 📱 페이지 구성

| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | 대시보드 | 월간/연간 총 구독료, 카테고리별 차트, 결제 캘린더 |
| `/subscriptions` | 구독 관리 | 구독 서비스 등록/수정/삭제, 30+ 프리셋 선택 |
| `/analysis` | 이용률 분석 | 스크린타임 입력, 분당비용 계산, ROI 등급, 벤치마크 비교 |
| `/optimize` | 최적화 추천 | 공유 시뮬레이션, 번들 최적화, 해지 추천 |
| `/party` | 공유 파티 | 파티 생성/참여, 초대 링크 관리 |
| `/guide` | 이용시간 가이드 | iOS/Android 스크린타임 확인 방법 |
| `/insights` | 구독 인사이트 | 구독 DNA, 돈값 미터, 기회비용 시뮬레이터, 다이어트 챌린지 |

## 🎯 핵심 기능 상세

### 1. ROI 분석 시스템
- **분당 비용 계산**: `월 구독료 ÷ (주간 이용시간 × 4.33주)`
- **등급 시스템**: A등급(~₩15/분) ~ F등급(미사용)
- **벤치마크 비교**: 한국 유저 평균 이용시간 대비 분석
- **피드백**: "상위 20% 헤비 유저" / "평균 대비 11% 수준, 해지 검토"

### 2. 공유 최적화
개인 요금제를 가족 요금제로 전환 시 절약 시뮬레이션:
```
Netflix 개인 ₩13,500 → 프리미엄 가족(4인) ÷4 = ₩4,250
→ 월 ₩9,250 절약 = 연간 ₩111,000 절약
```

### 3. 구독 DNA (성향 분석)
- **취향탐험가**: OTT 3개 이상
- **가성비헌터**: 평균 분당 비용 ₩20 미만
- **충동구독러**: 3개월 미만 신규 구독 5개+
- **미니멀리스트**: 총 구독 3개 이하
- **얼리어답터**: 신규 서비스 3개+
- **소셜버터플라이**: 공유 파티 3개+
- **번들마스터**: 번들 구독 2개+

## 🧪 테스트

```bash
# 테스트 실행
pnpm test

# 커버리지 확인
pnpm test -- --coverage
```

## 🌐 배포

프로젝트는 Vercel을 통해 Static Export 방식으로 배포됩니다.

```bash
# 정적 빌드 생성
pnpm build

# out/ 디렉토리가 생성되며, Vercel에 자동 배포됩니다
```

## 📊 프로젝트 특징

- **로컬 우선**: LocalStorage 기반으로 서버 없이 작동 (개인정보 보호)
- **모바일 최적화**: 반응형 디자인, 스크린타임 확인 시 폰 사용 전제
- **한국 시장 특화**: 한국 구독 서비스 30+ 프리셋, 원화 기준 분석
- **실시간 계산**: Zustand를 통한 즉각적인 상태 업데이트 및 재계산
- **접근성**: 키보드 내비게이션, 색맹 대응 컬러 팔레트

## 📝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

MIT License

---

**노아에이티에스(주) 사전과제 #6** - 구독 서비스 관리 애플리케이션

개발 기간: 2026-02-11 (1.5일 스프린트)
