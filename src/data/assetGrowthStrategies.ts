export interface AssetGrowthStrategy {
  age: string;
  family: string;
  incomeRange: string;
  strategy: string;
  successSummary: string;
  sourceType: string;
  sourceLink: string;
}

export interface AssetGrowthStrategies {
  primary: AssetGrowthStrategy;
  secondary: AssetGrowthStrategy;
  tertiary: AssetGrowthStrategy;
}

// 전략 상세 정보 인터페이스
export interface StrategyDetail {
  strategyName: string;
  targetAudience: string;
  strategyOverview: string;
  startGuide: string;
  precautions: string;
  successCaseSummary: string;
}

// 전략 상세 정보 데이터
export const strategyDetails: StrategyDetail[] = [
  {
    strategyName: '스마트스토어 무재고 판매',
    targetAudience: '20-40대 초기자본이 적지만 투자할 시간이 있는 분',
    strategyOverview: '재고 없이 상품을 등록하고 주문 시 공급업체에서 직접 배송하는 온라인 판매 방식',
    startGuide: '스마트스토어 개설 → 위탁상품 소싱 → 상세페이지 제작 및 업로드 → 고객 CS 응대',
    precautions: '리뷰와 노출 경쟁이 치열함, 상품 선택이 중요함, 마진이 낮음',
    successCaseSummary: '퇴근 후 네일아트 소품 판매로 6개월 만에 월 매출 1200만원 달성'
  },
  {
    strategyName: '화상 영어 과외 부업',
    targetAudience: '20-30대 전공이나 스킬이 있는 직장인, 사이드잡을 할 시간이 있는 분',
    strategyOverview: '줌 등을 활용한 비대면 영어 수업으로 고정 월 수입 확보',
    startGuide: '학생 모집 → 수업 커리큘럼 계획 → 고정 수업 루틴 운영 → 피드백 제공',
    precautions: '수업 피로도, 장기 지속을 위한 스케줄 조정 필요, 시간대 제약',
    successCaseSummary: '퇴근 후 주 3회 수업으로 월 200만원 수입 달성'
  },
  {
    strategyName: '크몽 프리랜서 디자인',
    targetAudience: '20-40대 프리랜서나 직장인, 디자인/IT/글쓰기 등 전문 스킬 보유자',
    strategyOverview: '크몽 등의 플랫폼을 통해 프로젝트 기반 외주 작업 수주 및 수행',
    startGuide: '포트폴리오 업로드 → 가격/서비스 설정 → 프로젝트 수주 → 기한 내 제출',
    precautions: '경쟁이 치열함, 가격 덤핑 주의, 평점 관리가 중요함',
    successCaseSummary: '퇴근 후 디자인 작업으로 연 4000만원 수익 달성'
  },
  {
    strategyName: 'ETF 적립식 투자',
    targetAudience: '고정수입자(직장인/공무원) 중 장기 자산 증대를 원하는 분',
    strategyOverview: '미국/한국 ETF에 월 고정금액 자동 투자로 복리 수익 추구',
    startGuide: '증권계좌 개설 → ETF 선택 → 자동이체 등록 → 분기별 수익률 점검',
    precautions: '단기 수익 기대 어려움, 장기 보유가 핵심, 수수료 확인 필요',
    successCaseSummary: '월 50만원 투자로 5년간 1.5억 자산 형성'
  },
  {
    strategyName: '리츠(REITs) 배당 투자',
    targetAudience: '40-60대 고정수익이나 배당을 선호하는 분, 자산 보존 투자자',
    strategyOverview: '부동산 리츠에 투자하여 정기적으로 임대료 수익 배당 수령',
    startGuide: '리츠 선택 → 증권사 매수 → 배당 캘린더 확인 → 배당 수령',
    precautions: '금리/부동산 시장 영향 받음, 배당세 존재, 종목별 수익률 차이',
    successCaseSummary: '직장인 월 25만원 정기 배당 수령'
  },
  {
    strategyName: '부부 유튜브 브이로그 수익화',
    targetAudience: '20-40대 부부, 콘텐츠 제작과 소통이 가능한 분',
    strategyOverview: '부부의 일상 콘텐츠로 유튜브 채널 운영하여 광고 및 협찬 수익 창출',
    startGuide: '콘텐츠 기획 → 촬영 및 편집 → 정기 업로드 → 구독자 관리',
    precautions: '수익화까지 시간 소요, 악플/노출 부담, 꾸준한 업로드 필요',
    successCaseSummary: '채널 운영 1년 만에 월 300만원 수익 달성'
  },
  {
    strategyName: '블로그 제휴마케팅',
    targetAudience: '직장인/주부 중 글쓰기 스킬이 있고 리뷰 활동이 가능한 분',
    strategyOverview: '블로그 포스팅에 제휴 링크 삽입 후 사용자 클릭/구매 시 수익 창출',
    startGuide: '블로그 개설 → 리뷰 글쓰기 → 제휴 플랫폼 가입 → 링크 삽입',
    precautions: '방문자 확보가 중요함, 광고로 인식되면 신뢰도 하락',
    successCaseSummary: '리뷰형 블로그 운영으로 월 150만원 제휴 수익'
  },
  {
    strategyName: '비트코인 장기 투자',
    targetAudience: '20-40대 리스크 감수 가능한 분, 자산의 일부로 고위험 투자 가능한 분',
    strategyOverview: '주요 암호화폐에 소액 분할 투자하여 장기 보유',
    startGuide: '거래소 계좌 개설 → 월 분할 매수 → 장기 보유 및 지갑 관리',
    precautions: '가격 변동성이 매우 큼, 총 자산의 10-20% 내 투자 권장',
    successCaseSummary: '2017년 투자로 현재 수억원 자산 보유'
  },
  {
    strategyName: '정부지원 창업 (교육콘텐츠)',
    targetAudience: '30-50대 초기 창업자, 전문 스킬 보유자, 정부 지원을 원하는 분',
    strategyOverview: '창업진흥원, 지자체 등 지원을 받아 교육 콘텐츠 사업화',
    startGuide: '아이템 기획 → 정부 사업 신청 지원 → 법인 설립 및 사업 운영',
    precautions: '서류 작성과 실적 관리 필요, 명확한 수익 구조 필요',
    successCaseSummary: '창업 지원으로 1인 기업 연 매출 2억 달성'
  },
  {
    strategyName: '부동산 경매 실전 투자',
    targetAudience: '30-50대 자금 여유가 있거나 부동산 공부를 한 분',
    strategyOverview: '법원 경매로 저가 매입 후 리모델링하여 전세/매각으로 차익 실현',
    startGuide: '경매 물건 조사 → 현장 답사 → 입찰 → 리모델링 후 전세/매각',
    precautions: '권리 분석 실패 시 손실, 잔금 준비 필요',
    successCaseSummary: '서울 빌라 경매 매입 후 리모델링으로 7000만원 차익 실현'
  }
];

// 전략명으로 상세 정보 조회 함수
export function getStrategyDetail(strategyName: string): StrategyDetail | null {
  return strategyDetails.find(detail => detail.strategyName === strategyName) || null;
}

export const assetGrowthStrategies: AssetGrowthStrategy[] = [
  // 20대 - 1인가구
  {
    age: '20대',
    family: '1인가구',
    incomeRange: '200~300',
    strategy: '정부지원 창업 (교육콘텐츠)',
    successSummary: '초기 창업자금으로 매출 2억 달성',
    sourceType: '뉴스',
    sourceLink: 'https://www.mk.co.kr/news/business/view/2023/02/178812/'
  },
  {
    age: '20대',
    family: '1인가구',
    incomeRange: '300~400',
    strategy: '화상 영어 과외 부업',
    successSummary: '영어 전공자, 줌 수업으로 월 200만원 부수입',
    sourceType: '유튜브',
    sourceLink: 'https://m.khan.co.kr/national/education/article/202304271016001'
  },
  {
    age: '20대',
    family: '1인가구',
    incomeRange: '400~600',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },
  {
    age: '20대',
    family: '1인가구',
    incomeRange: '500~700',
    strategy: 'ETF 적립식 투자',
    successSummary: 'S&P500 ETF로 5년간 1.5억 자산 축적',
    sourceType: '언론',
    sourceLink: 'https://shindonga.donga.com/Library/3/01/13/4192075/1'
  },
  {
    age: '20대',
    family: '1인가구',
    incomeRange: '600~800',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },
  {
    age: '20대',
    family: '1인가구',
    incomeRange: '700~900',
    strategy: '정부지원 창업 (교육콘텐츠)',
    successSummary: '초기 창업자금으로 매출 2억 달성',
    sourceType: '뉴스',
    sourceLink: 'https://www.mk.co.kr/news/business/view/2023/02/178812/'
  },
  {
    age: '20대',
    family: '1인가구',
    incomeRange: '800 이상',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },

  // 20대 - 미혼부부
  {
    age: '20대',
    family: '미혼부부',
    incomeRange: '200~300',
    strategy: '비트코인 장기 투자',
    successSummary: '2017년 투자로 현재 수억원 자산 형성',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/smartinsight/222992227074'
  },
  {
    age: '20대',
    family: '미혼부부',
    incomeRange: '300~400',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },
  {
    age: '20대',
    family: '미혼부부',
    incomeRange: '400~600',
    strategy: '스마트스토어 무재고 판매',
    successSummary: '퇴근 후 네일아트 소품 판매로 월 매출 1200만원 달성',
    sourceType: '블로그',
    sourceLink: 'https://devhjun.tistory.com/entry/스마트스토어-무재고-월1200만원'
  },
  {
    age: '20대',
    family: '미혼부부',
    incomeRange: '500~700',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },
  {
    age: '20대',
    family: '미혼부부',
    incomeRange: '600~800',
    strategy: '크몽 프리랜서 디자인',
    successSummary: '퇴근 후 크몽에서 연 4000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=9oETrjFZd0E'
  },
  {
    age: '20대',
    family: '미혼부부',
    incomeRange: '700~900',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '20대',
    family: '미혼부부',
    incomeRange: '800 이상',
    strategy: '화상 영어 과외 부업',
    successSummary: '영어 전공자, 줌 수업으로 월 200만원 부수입',
    sourceType: '뉴스',
    sourceLink: 'https://m.khan.co.kr/national/education/article/202304271016001'
  },

  // 20대 - 부부
  {
    age: '20대',
    family: '부부',
    incomeRange: '200~300',
    strategy: '부동산 경매 실전 투자',
    successSummary: '67세 여성, 경매로 7000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=GzUo_tQLqgl'
  },
  {
    age: '20대',
    family: '부부',
    incomeRange: '300~400',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },
  {
    age: '20대',
    family: '부부',
    incomeRange: '400~600',
    strategy: '리츠(REITs) 배당 투자',
    successSummary: '월 25만원 배당 수익, 세제혜택 포함',
    sourceType: '블로그',
    sourceLink: 'https://tistorystock.tistory.com/168'
  },
  {
    age: '20대',
    family: '부부',
    incomeRange: '500~700',
    strategy: '크몽 프리랜서 디자인',
    successSummary: '퇴근 후 크몽에서 연 4000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=9oETrjFZd0E'
  },
  {
    age: '20대',
    family: '부부',
    incomeRange: '600~800',
    strategy: '비트코인 장기 투자',
    successSummary: '2017년 투자로 현재 수억원 자산 형성',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/smartinsight/222992227074'
  },
  {
    age: '20대',
    family: '부부',
    incomeRange: '700~900',
    strategy: '화상 영어 과외 부업',
    successSummary: '영어 전공자, 줌 수업으로 월 200만원 부수입',
    sourceType: '뉴스',
    sourceLink: 'https://m.khan.co.kr/national/education/article/202304271016001'
  },
  {
    age: '20대',
    family: '부부',
    incomeRange: '800 이상',
    strategy: '비트코인 장기 투자',
    successSummary: '2017년 투자로 현재 수억원 자산 형성',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/smartinsight/222992227074'
  },

  // 20대 - 부부+자녀1
  {
    age: '20대',
    family: '부부+자녀1',
    incomeRange: '200~300',
    strategy: '부동산 경매 실전 투자',
    successSummary: '67세 여성, 경매로 7000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=GzUo_tQLqgl'
  },
  {
    age: '20대',
    family: '부부+자녀1',
    incomeRange: '300~400',
    strategy: '스마트스토어 무재고 판매',
    successSummary: '퇴근 후 네일아트 소품 판매로 월 매출 1200만원 달성',
    sourceType: '블로그',
    sourceLink: 'https://devhjun.tistory.com/entry/스마트스토어-무재고-월1200만원'
  },
  {
    age: '20대',
    family: '부부+자녀1',
    incomeRange: '400~600',
    strategy: '화상 영어 과외 부업',
    successSummary: '영어 전공자, 줌 수업으로 월 200만원 부수입',
    sourceType: '뉴스',
    sourceLink: 'https://m.khan.co.kr/national/education/article/202304271016001'
  },
  {
    age: '20대',
    family: '부부+자녀1',
    incomeRange: '500~700',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '20대',
    family: '부부+자녀1',
    incomeRange: '600~800',
    strategy: '크몽 프리랜서 디자인',
    successSummary: '퇴근 후 크몽에서 연 4000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=9oETrjFZd0E'
  },
  {
    age: '20대',
    family: '부부+자녀1',
    incomeRange: '700~900',
    strategy: 'ETF 적립식 투자',
    successSummary: 'S&P500 ETF로 5년간 1.5억 자산 축적',
    sourceType: '언론',
    sourceLink: 'https://shindonga.donga.com/Library/3/01/13/4192075/1'
  },
  {
    age: '20대',
    family: '부부+자녀1',
    incomeRange: '800 이상',
    strategy: '크몽 프리랜서 디자인',
    successSummary: '퇴근 후 크몽에서 연 4000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=9oETrjFZd0E'
  },

  // 20대 - 부부+자녀2
  {
    age: '20대',
    family: '부부+자녀2',
    incomeRange: '200~300',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },
  {
    age: '20대',
    family: '부부+자녀2',
    incomeRange: '300~400',
    strategy: '정부지원 창업 (교육콘텐츠)',
    successSummary: '초기 창업자금으로 매출 2억 달성',
    sourceType: '뉴스',
    sourceLink: 'https://www.mk.co.kr/news/business/view/2023/02/178812/'
  },
  {
    age: '20대',
    family: '부부+자녀2',
    incomeRange: '400~600',
    strategy: '부동산 경매 실전 투자',
    successSummary: '67세 여성, 경매로 7000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=GzUo_tQLqgl'
  },
  {
    age: '20대',
    family: '부부+자녀2',
    incomeRange: '500~700',
    strategy: '스마트스토어 무재고 판매',
    successSummary: '퇴근 후 네일아트 소품 판매로 월 매출 1200만원 달성',
    sourceType: '블로그',
    sourceLink: 'https://devhjun.tistory.com/entry/스마트스토어-무재고-월1200만원'
  },
  {
    age: '20대',
    family: '부부+자녀2',
    incomeRange: '600~800',
    strategy: '스마트스토어 무재고 판매',
    successSummary: '퇴근 후 네일아트 소품 판매로 월 매출 1200만원 달성',
    sourceType: '블로그',
    sourceLink: 'https://devhjun.tistory.com/entry/스마트스토어-무재고-월1200만원'
  },
  {
    age: '20대',
    family: '부부+자녀2',
    incomeRange: '700~900',
    strategy: '화상 영어 과외 부업',
    successSummary: '영어 전공자, 줌 수업으로 월 200만원 부수입',
    sourceType: '뉴스',
    sourceLink: 'https://m.khan.co.kr/national/education/article/202304271016001'
  },
  {
    age: '20대',
    family: '부부+자녀2',
    incomeRange: '800 이상',
    strategy: '리츠(REITs) 배당 투자',
    successSummary: '월 25만원 배당 수익, 세제혜택 포함',
    sourceType: '블로그',
    sourceLink: 'https://tistorystock.tistory.com/168'
  },

  // 20대 - 부부+자녀3 이상
  {
    age: '20대',
    family: '부부+자녀3 이상',
    incomeRange: '200~300',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '20대',
    family: '부부+자녀3 이상',
    incomeRange: '300~400',
    strategy: '리츠(REITs) 배당 투자',
    successSummary: '월 25만원 배당 수익, 세제혜택 포함',
    sourceType: '블로그',
    sourceLink: 'https://tistorystock.tistory.com/168'
  },
  {
    age: '20대',
    family: '부부+자녀3 이상',
    incomeRange: '400~600',
    strategy: '크몽 프리랜서 디자인',
    successSummary: '퇴근 후 크몽에서 연 4000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=9oETrjFZd0E'
  },
  {
    age: '20대',
    family: '부부+자녀3 이상',
    incomeRange: '500~700',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '20대',
    family: '부부+자녀3 이상',
    incomeRange: '600~800',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '20대',
    family: '부부+자녀3 이상',
    incomeRange: '700~900',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },
  {
    age: '20대',
    family: '부부+자녀3 이상',
    incomeRange: '800 이상',
    strategy: '정부지원 창업 (교육콘텐츠)',
    successSummary: '초기 창업자금으로 매출 2억 달성',
    sourceType: '뉴스',
    sourceLink: 'https://www.mk.co.kr/news/business/view/2023/02/178812/'
  },

  // 20대 - 부부+부양가족
  {
    age: '20대',
    family: '부부+부양가족',
    incomeRange: '200~300',
    strategy: '리츠(REITs) 배당 투자',
    successSummary: '월 25만원 배당 수익, 세제혜택 포함',
    sourceType: '블로그',
    sourceLink: 'https://tistorystock.tistory.com/168'
  },
  {
    age: '20대',
    family: '부부+부양가족',
    incomeRange: '300~400',
    strategy: 'ETF 적립식 투자',
    successSummary: 'S&P500 ETF로 5년간 1.5억 자산 축적',
    sourceType: '언론',
    sourceLink: 'https://shindonga.donga.com/Library/3/01/13/4192075/1'
  },
  {
    age: '20대',
    family: '부부+부양가족',
    incomeRange: '400~600',
    strategy: '크몽 프리랜서 디자인',
    successSummary: '퇴근 후 크몽에서 연 4000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=9oETrjFZd0E'
  },
  {
    age: '20대',
    family: '부부+부양가족',
    incomeRange: '500~700',
    strategy: '정부지원 창업 (교육콘텐츠)',
    successSummary: '초기 창업자금으로 매출 2억 달성',
    sourceType: '뉴스',
    sourceLink: 'https://www.mk.co.kr/news/business/view/2023/02/178812/'
  },
  {
    age: '20대',
    family: '부부+부양가족',
    incomeRange: '600~800',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '20대',
    family: '부부+부양가족',
    incomeRange: '700~900',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '20대',
    family: '부부+부양가족',
    incomeRange: '800 이상',
    strategy: '화상 영어 과외 부업',
    successSummary: '영어 전공자, 줌 수업으로 월 200만원 부수입',
    sourceType: '뉴스',
    sourceLink: 'https://m.khan.co.kr/national/education/article/202304271016001'
  },

  // 30대 - 1인가구
  {
    age: '30대',
    family: '1인가구',
    incomeRange: '200~300',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '30대',
    family: '1인가구',
    incomeRange: '300~400',
    strategy: '스마트스토어 무재고 판매',
    successSummary: '퇴근 후 네일아트 소품 판매로 월 매출 1200만원 달성',
    sourceType: '블로그',
    sourceLink: 'https://devhjun.tistory.com/entry/스마트스토어-무재고-월1200만원'
  },
  {
    age: '30대',
    family: '1인가구',
    incomeRange: '400~600',
    strategy: '스마트스토어 무재고 판매',
    successSummary: '퇴근 후 네일아트 소품 판매로 월 매출 1200만원 달성',
    sourceType: '블로그',
    sourceLink: 'https://devhjun.tistory.com/entry/스마트스토어-무재고-월1200만원'
  },
  {
    age: '30대',
    family: '1인가구',
    incomeRange: '500~700',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '30대',
    family: '1인가구',
    incomeRange: '600~800',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },
  {
    age: '30대',
    family: '1인가구',
    incomeRange: '700~900',
    strategy: 'ETF 적립식 투자',
    successSummary: 'S&P500 ETF로 5년간 1.5억 자산 축적',
    sourceType: '언론',
    sourceLink: 'https://shindonga.donga.com/Library/3/01/13/4192075/1'
  },
  {
    age: '30대',
    family: '1인가구',
    incomeRange: '800 이상',
    strategy: '화상 영어 과외 부업',
    successSummary: '영어 전공자, 줌 수업으로 월 200만원 부수입',
    sourceType: '뉴스',
    sourceLink: 'https://m.khan.co.kr/national/education/article/202304271016001'
  },

  // 30대 - 미혼부부
  {
    age: '30대',
    family: '미혼부부',
    incomeRange: '200~300',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },
  {
    age: '30대',
    family: '미혼부부',
    incomeRange: '300~400',
    strategy: '비트코인 장기 투자',
    successSummary: '2017년 투자로 현재 수억원 자산 형성',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/smartinsight/222992227074'
  },
  {
    age: '30대',
    family: '미혼부부',
    incomeRange: '400~600',
    strategy: '리츠(REITs) 배당 투자',
    successSummary: '월 25만원 배당 수익, 세제혜택 포함',
    sourceType: '블로그',
    sourceLink: 'https://tistorystock.tistory.com/168'
  },
  {
    age: '30대',
    family: '미혼부부',
    incomeRange: '500~700',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },
  {
    age: '30대',
    family: '미혼부부',
    incomeRange: '600~800',
    strategy: '정부지원 창업 (교육콘텐츠)',
    successSummary: '초기 창업자금으로 매출 2억 달성',
    sourceType: '뉴스',
    sourceLink: 'https://www.mk.co.kr/news/business/view/2023/02/178812/'
  },
  {
    age: '30대',
    family: '미혼부부',
    incomeRange: '700~900',
    strategy: '비트코인 장기 투자',
    successSummary: '2017년 투자로 현재 수억원 자산 형성',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/smartinsight/222992227074'
  },
  {
    age: '30대',
    family: '미혼부부',
    incomeRange: '800 이상',
    strategy: '스마트스토어 무재고 판매',
    successSummary: '퇴근 후 네일아트 소품 판매로 월 매출 1200만원 달성',
    sourceType: '블로그',
    sourceLink: 'https://devhjun.tistory.com/entry/스마트스토어-무재고-월1200만원'
  },

  // 30대 - 부부
  {
    age: '30대',
    family: '부부',
    incomeRange: '200~300',
    strategy: '리츠(REITs) 배당 투자',
    successSummary: '월 25만원 배당 수익, 세제혜택 포함',
    sourceType: '블로그',
    sourceLink: 'https://tistorystock.tistory.com/168'
  },
  {
    age: '30대',
    family: '부부',
    incomeRange: '300~400',
    strategy: '크몽 프리랜서 디자인',
    successSummary: '퇴근 후 크몽에서 연 4000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=9oETrjFZd0E'
  },
  {
    age: '30대',
    family: '부부',
    incomeRange: '400~600',
    strategy: '스마트스토어 무재고 판매',
    successSummary: '퇴근 후 네일아트 소품 판매로 월 매출 1200만원 달성',
    sourceType: '블로그',
    sourceLink: 'https://devhjun.tistory.com/entry/스마트스토어-무재고-월1200만원'
  },
  {
    age: '30대',
    family: '부부',
    incomeRange: '500~700',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '30대',
    family: '부부',
    incomeRange: '600~800',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '30대',
    family: '부부',
    incomeRange: '700~900',
    strategy: '화상 영어 과외 부업',
    successSummary: '영어 전공자, 줌 수업으로 월 200만원 부수입',
    sourceType: '뉴스',
    sourceLink: 'https://m.khan.co.kr/national/education/article/202304271016001'
  },
  {
    age: '30대',
    family: '부부',
    incomeRange: '800 이상',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },

  // 30대 - 부부+자녀1
  {
    age: '30대',
    family: '부부+자녀1',
    incomeRange: '200~300',
    strategy: 'ETF 적립식 투자',
    successSummary: 'S&P500 ETF로 5년간 1.5억 자산 축적',
    sourceType: '언론',
    sourceLink: 'https://shindonga.donga.com/Library/3/01/13/4192075/1'
  },
  {
    age: '30대',
    family: '부부+자녀1',
    incomeRange: '300~400',
    strategy: '블로그 제휴마케팅',
    successSummary: '생활 리뷰로 월 150만원 수익',
    sourceType: '블로그',
    sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
  },
  {
    age: '30대',
    family: '부부+자녀1',
    incomeRange: '400~600',
    strategy: '크몽 프리랜서 디자인',
    successSummary: '퇴근 후 크몽에서 연 4000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=9oETrjFZd0E'
  },
  {
    age: '30대',
    family: '부부+자녀1',
    incomeRange: '500~700',
    strategy: '부동산 경매 실전 투자',
    successSummary: '67세 여성, 경매로 7000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=GzUo_tQLqgl'
  },
  {
    age: '30대',
    family: '부부+자녀1',
    incomeRange: '600~800',
    strategy: '스마트스토어 무재고 판매',
    successSummary: '퇴근 후 네일아트 소품 판매로 월 매출 1200만원 달성',
    sourceType: '블로그',
    sourceLink: 'https://devhjun.tistory.com/entry/스마트스토어-무재고-월1200만원'
  },
  {
    age: '30대',
    family: '부부+자녀1',
    incomeRange: '700~900',
    strategy: '부동산 경매 실전 투자',
    successSummary: '67세 여성, 경매로 7000만원 수익',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=GzUo_tQLqgl'
  },
  {
    age: '30대',
    family: '부부+자녀1',
    incomeRange: '800 이상',
    strategy: '부부 유튜브 브이로그 수익화',
    successSummary: '브이로그로 월 300만원 광고수익 달성',
    sourceType: '유튜브',
    sourceLink: 'https://www.youtube.com/watch?v=LR0g6rOg3dE'
  },

  // 30대 - 부부+자녀2
  {
    age: '30대',
    family: '부부+자녀2',
    incomeRange: '200~300',
    strategy: 'ETF 적립식 투자',
    successSummary: 'S&P500 ETF로 5년간 1.5억 자산 축적',
    sourceType: '언론',
    sourceLink: 'https://shindonga.donga.com/Library/3/01/13/4192075/1'
  },
  {
    age: '30대',
    family: '부부+자녀2',
    incomeRange: '300~400',
    strategy: '스마트스토어 무재고 판매',
    successSummary: '퇴근 후 네일아트 소품 판매로 월 매출 1200만원 달성',
    sourceType: '블로그',
    sourceLink: 'https://devhjun.tistory.com/entry/스마트스토어-무재고-월1200만원'
  }
];

// 자산 증대 전략 조회 함수
export function getAssetGrowthStrategies(age: number, familyType: string, income: number): AssetGrowthStrategies | null {
  // 연령대 결정
  let ageGroup = '';
  if (age < 30) ageGroup = '20대';
  else if (age < 40) ageGroup = '30대';
  else if (age < 50) ageGroup = '40대';
  else ageGroup = '50대';

  // 가족구성 정규화
  let family = familyType.replace(/명|\s/g, '');
  if (family.includes('자녀3')) family = '부부+자녀3 이상';
  else if (family.includes('자녀2')) family = '부부+자녀2';
  else if (family.includes('자녀1')) family = '부부+자녀1';
  else if (family.includes('미혼')) family = '미혼부부';
  else if (family.includes('부양')) family = '부부+부양가족';
  else if (family.includes('부부')) family = '부부';
  else family = '1인가구';

  // 소득구간 결정 (만원 단위)
  const incomeInManWon = income / 10000;
  let incomeRange = '';
  if (incomeInManWon < 300) incomeRange = '200~300';
  else if (incomeInManWon < 400) incomeRange = '300~400';
  else if (incomeInManWon < 500) incomeRange = '400~500';
  else if (incomeInManWon < 600) incomeRange = '500~600';
  else if (incomeInManWon < 700) incomeRange = '600~700';
  else if (incomeInManWon < 800) incomeRange = '700~800';
  else if (incomeInManWon < 900) incomeRange = '800~900';
  else incomeRange = '800 이상';

  // 1순위: 정확히 맞는 전략 찾기
  let primaryStrategy = assetGrowthStrategies.find(
    strategy => strategy.age === ageGroup && 
                strategy.family === family && 
                strategy.incomeRange === incomeRange
  );

  // 1순위가 없으면 같은 연령대의 다른 전략
  if (!primaryStrategy) {
    primaryStrategy = assetGrowthStrategies.find(
      strategy => strategy.age === ageGroup && 
                  strategy.family === family
    );
  }

  // 여전히 없으면 같은 연령대의 다른 가족구성
  if (!primaryStrategy) {
    primaryStrategy = assetGrowthStrategies.find(
      strategy => strategy.age === ageGroup
    );
  }

  // 여전히 없으면 다른 연령대의 비슷한 가족구성
  if (!primaryStrategy) {
    primaryStrategy = assetGrowthStrategies.find(
      strategy => strategy.family === family
    );
  }

  // 마지막으로 첫 번째 전략 사용
  if (!primaryStrategy) {
    primaryStrategy = assetGrowthStrategies[0];
  }

  // 2순위: 비슷한 조건의 다른 전략 찾기
  let secondaryStrategy = assetGrowthStrategies.find(
    strategy => strategy.age === ageGroup && 
                strategy.family === family && 
                strategy.incomeRange !== incomeRange
  );

  // 2순위가 없으면 같은 연령대의 다른 전략
  if (!secondaryStrategy) {
    secondaryStrategy = assetGrowthStrategies.find(
      strategy => strategy.age === ageGroup && 
                  strategy.family !== family
    );
  }

  // 2순위도 없으면 다른 연령대의 비슷한 전략
  if (!secondaryStrategy) {
    secondaryStrategy = assetGrowthStrategies.find(
      strategy => strategy.age !== ageGroup && 
                  strategy.family === family
    );
  }

  // 2순위도 없으면 블로그 제휴마케팅으로 설정
  if (!secondaryStrategy) {
    secondaryStrategy = {
      age: ageGroup,
      family: family,
      incomeRange: incomeRange,
      strategy: '블로그 제휴마케팅',
      successSummary: '생활 리뷰로 월 150만원 수익',
      sourceType: '블로그',
      sourceLink: 'https://blog.naver.com/marshmallow0525/223121582865'
    };
  }

  // 3순위: 보편적 추천 전략 (ETF 투자)
  const tertiaryStrategy: AssetGrowthStrategy = {
    age: ageGroup,
    family: family,
    incomeRange: incomeRange,
    strategy: 'ETF 적립식 투자',
    successSummary: 'S&P500 ETF로 5년간 1.5억 자산 축적',
    sourceType: '언론',
    sourceLink: 'https://shindonga.donga.com/Library/3/01/13/4192075/1'
  };

  return {
    primary: primaryStrategy,
    secondary: secondaryStrategy,
    tertiary: tertiaryStrategy
  };
} 