export interface Savings {
  type: string;
  order: number;
  name: string;
  company: string;
  interestRate: number; // 연 이율 (%)
  maxAmount: number; // 최대 가입 금액 (만원)
  period: number; // 가입 기간 (개월)
  minAmount: number; // 최소 가입 금액 (만원)
  features: string[]; // 특징
  target: string[]; // 대상 고객
}

export const savings: Savings[] = [
  { 
    type: '정기적금', 
    order: 1, 
    name: 'KB스타정기적금', 
    company: 'KB국민은행', 
    interestRate: 3.85, 
    maxAmount: 5000, 
    period: 12, 
    minAmount: 10,
    features: ['온라인 가입 가능', '자동이체 지원', '중도해지 가능'],
    target: ['직장인', '학생', '주부']
  },
  { 
    type: '정기적금', 
    order: 2, 
    name: '신한플러스정기적금', 
    company: '신한은행', 
    interestRate: 3.92, 
    maxAmount: 3000, 
    period: 12, 
    minAmount: 10,
    features: ['모바일뱅킹 가입', '복리 계산', '세제혜택'],
    target: ['직장인', '자영업자']
  },
  { 
    type: '정기적금', 
    order: 3, 
    name: '삼성스마트정기적금', 
    company: '삼성증권', 
    interestRate: 4.05, 
    maxAmount: 10000, 
    period: 24, 
    minAmount: 50,
    features: ['증권계좌 연동', '투자상품 연계', '고금리'],
    target: ['투자자', '고액자산가']
  },
  { 
    type: '정기적금', 
    order: 4, 
    name: '미래에셋목표적금', 
    company: '미래에셋증권', 
    interestRate: 3.78, 
    maxAmount: 2000, 
    period: 12, 
    minAmount: 10,
    features: ['목표 설정 기능', '진행률 표시', '성취 알림'],
    target: ['목표저축자', '학생']
  },
  { 
    type: '정기적금', 
    order: 5, 
    name: '한국투자스마일적금', 
    company: '한국투자증권', 
    interestRate: 3.95, 
    maxAmount: 5000, 
    period: 12, 
    minAmount: 10,
    features: ['앱 전용 상품', '간편 가입', '실시간 조회'],
    target: ['MZ세대', '모바일 사용자']
  },
  { 
    type: '정기적금', 
    order: 6, 
    name: '교보악사행복적금', 
    company: '교보증권', 
    interestRate: 3.88, 
    maxAmount: 3000, 
    period: 12, 
    minAmount: 10,
    features: ['생명보험 연계', '보장 기능', '안정성'],
    target: ['보험 고객', '안정 추구자']
  },
  { 
    type: '정기적금', 
    order: 7, 
    name: '키움스타트적금', 
    company: '키움증권', 
    interestRate: 4.12, 
    maxAmount: 1000, 
    period: 6, 
    minAmount: 5,
    features: ['단기 상품', '고금리', '유연한 납입'],
    target: ['단기 저축자', '학생']
  },
  { 
    type: '정기적금', 
    order: 8, 
    name: '하나글로벌적금', 
    company: '하나증권', 
    interestRate: 3.75, 
    maxAmount: 5000, 
    period: 12, 
    minAmount: 10,
    features: ['해외투자 연계', '달러 적금', '환율 헤지'],
    target: ['해외투자자', '달러 자산 보유자']
  },
  { 
    type: '정기적금', 
    order: 9, 
    name: '신영플러스적금', 
    company: '신영증권', 
    interestRate: 3.82, 
    maxAmount: 2000, 
    period: 12, 
    minAmount: 10,
    features: ['온라인 전용', '수수료 면제', '간편 관리'],
    target: ['온라인 사용자', '수수료 절약자']
  },
  { 
    type: '정기적금', 
    order: 10, 
    name: 'IBK스마트적금', 
    company: 'IBK기업은행', 
    interestRate: 3.90, 
    maxAmount: 3000, 
    period: 12, 
    minAmount: 10,
    features: ['기업은행 연동', '급여이체 연계', '기업 고객 특화'],
    target: ['기업 직원', '급여이체 고객']
  },
  { 
    type: '정기적금', 
    order: 11, 
    name: '한화에너지적금', 
    company: '한화증권', 
    interestRate: 3.68, 
    maxAmount: 5000, 
    period: 12, 
    minAmount: 10,
    features: ['에너지 투자 연계', '친환경 테마', 'ESG 투자'],
    target: ['ESG 투자자', '친환경 관심자']
  },
  { 
    type: '정기적금', 
    order: 12, 
    name: 'DB골드적금', 
    company: 'DB금융투자', 
    interestRate: 4.15, 
    maxAmount: 10000, 
    period: 24, 
    minAmount: 100,
    features: ['골드 투자 연계', '고금리', '장기 상품'],
    target: ['골드 투자자', '고액자산가']
  },
  { 
    type: '정기적금', 
    order: 13, 
    name: '마이다스스타적금', 
    company: '마이다스에셋', 
    interestRate: 3.95, 
    maxAmount: 2000, 
    period: 12, 
    minAmount: 10,
    features: ['펀드 연계', '투자 상품 연동', '자산 배분'],
    target: ['펀드 투자자', '자산 배분 관심자']
  },
  { 
    type: '정기적금', 
    order: 14, 
    name: '코레이트플러스적금', 
    company: '코레이트자산운용', 
    interestRate: 3.78, 
    maxAmount: 3000, 
    period: 12, 
    minAmount: 10,
    features: ['온라인 전용', '간편 가입', '실시간 조회'],
    target: ['온라인 사용자', '간편 서비스 선호자']
  },
  { 
    type: '정기적금', 
    order: 15, 
    name: '웰컴스마일적금', 
    company: '웰컴저축은행', 
    interestRate: 4.25, 
    maxAmount: 1000, 
    period: 12, 
    minAmount: 10,
    features: ['저축은행 최고금리', '온라인 가입', '빠른 승인'],
    target: ['고금리 추구자', '온라인 사용자']
  },
  { 
    type: '정기적금', 
    order: 16, 
    name: '흥국스타적금', 
    company: '흥국저축은행', 
    interestRate: 4.18, 
    maxAmount: 1000, 
    period: 12, 
    minAmount: 10,
    features: ['저축은행 특화', '고금리', '안정성'],
    target: ['고금리 추구자', '안정성 중시자']
  },
  { 
    type: '정기적금', 
    order: 17, 
    name: '다올플러스적금', 
    company: '다올저축은행', 
    interestRate: 4.22, 
    maxAmount: 1000, 
    period: 12, 
    minAmount: 10,
    features: ['저축은행 최고금리', '온라인 서비스', '빠른 처리'],
    target: ['고금리 추구자', '빠른 서비스 선호자']
  },
  { 
    type: '정기적금', 
    order: 18, 
    name: '에셋플러스스마트적금', 
    company: '에셋플러스자산운용', 
    interestRate: 3.85, 
    maxAmount: 5000, 
    period: 12, 
    minAmount: 10,
    features: ['자산운용사 연계', '투자 상품 연동', '전문적 관리'],
    target: ['투자 상품 고객', '전문 서비스 선호자']
  },
  { 
    type: '정기적금', 
    order: 19, 
    name: 'KCGI스타적금', 
    company: 'KCGI자산운용', 
    interestRate: 3.92, 
    maxAmount: 3000, 
    period: 12, 
    minAmount: 10,
    features: ['자산운용사 특화', '투자 연계', '전문 상담'],
    target: ['투자 상담 고객', '전문 서비스 이용자']
  },
  { 
    type: '정기적금', 
    order: 20, 
    name: '이스트스프링플러스적금', 
    company: '이스트스프링자산운용', 
    interestRate: 3.88, 
    maxAmount: 2000, 
    period: 12, 
    minAmount: 10,
    features: ['글로벌 자산운용사', '해외 투자 연계', '다국적 서비스'],
    target: ['해외 투자 관심자', '글로벌 서비스 이용자']
  },
  { 
    type: '정기적금', 
    order: 21, 
    name: '브이아이스마트적금', 
    company: '브이아이자산운용', 
    interestRate: 3.95, 
    maxAmount: 3000, 
    period: 12, 
    minAmount: 10,
    features: ['AI 기반 서비스', '스마트 자산관리', '개인화 상품'],
    target: ['AI 서비스 이용자', '개인화 서비스 선호자']
  },
  { 
    type: '정기적금', 
    order: 22, 
    name: 'HDC플러스적금', 
    company: 'HDC자산운용', 
    interestRate: 3.82, 
    maxAmount: 2000, 
    period: 12, 
    minAmount: 10,
    features: ['건설사 계열', '부동산 투자 연계', '안정성 중시'],
    target: ['부동산 투자자', '안정성 추구자']
  },
  { 
    type: '정기적금', 
    order: 23, 
    name: 'BNK스타적금', 
    company: 'BNK금융그룹', 
    interestRate: 3.78, 
    maxAmount: 3000, 
    period: 12, 
    minAmount: 10,
    features: ['지방은행 특화', '지역 연계', '친근한 서비스'],
    target: ['지방 거주자', '지역 은행 선호자']
  },
  { 
    type: '정기적금', 
    order: 24, 
    name: '트러스톤플러스적금', 
    company: '트러스톤자산운용', 
    interestRate: 3.85, 
    maxAmount: 2000, 
    period: 12, 
    minAmount: 10,
    features: ['전문 자산운용', '투자 상담', '맞춤형 서비스'],
    target: ['투자 상담 고객', '맞춤형 서비스 이용자']
  },
  { 
    type: '정기적금', 
    order: 25, 
    name: '유리스마트적금', 
    company: '유리자산운용', 
    interestRate: 3.90, 
    maxAmount: 3000, 
    period: 12, 
    minAmount: 10,
    features: ['온라인 특화', '모바일 서비스', '24시간 이용'],
    target: ['온라인 사용자', '모바일 뱅킹 이용자']
  },
  { 
    type: '정기적금', 
    order: 26, 
    name: '교보악사스타적금', 
    company: '교보악사자산운용', 
    interestRate: 3.88, 
    maxAmount: 2000, 
    period: 12, 
    minAmount: 10,
    features: ['생명보험 연계', '보장 기능', '안정성'],
    target: ['보험 고객', '보장 중시자']
  },
  { 
    type: '정기적금', 
    order: 27, 
    name: '한화스마일적금', 
    company: '한화자산운용', 
    interestRate: 3.82, 
    maxAmount: 3000, 
    period: 12, 
    minAmount: 10,
    features: ['대기업 계열', '안정성', '신뢰성'],
    target: ['대기업 선호자', '안정성 중시자']
  },
  { 
    type: '정기적금', 
    order: 28, 
    name: '우리플러스적금', 
    company: '우리자산운용', 
    interestRate: 3.85, 
    maxAmount: 2000, 
    period: 12, 
    minAmount: 10,
    features: ['은행 계열', '안정성', '접근성'],
    target: ['은행 고객', '안정성 추구자']
  },
  { 
    type: '정기적금', 
    order: 29, 
    name: 'NH스마트적금', 
    company: 'NH투자증권', 
    interestRate: 3.92, 
    maxAmount: 3000, 
    period: 12, 
    minAmount: 10,
    features: ['농협 계열', '농업인 특화', '지역 연계'],
    target: ['농업인', '농협 고객']
  },
  { 
    type: '정기적금', 
    order: 30, 
    name: '케이비스타적금', 
    company: 'KB증권', 
    interestRate: 3.88, 
    maxAmount: 2000, 
    period: 12, 
    minAmount: 10,
    features: ['KB금융그룹', '통합 서비스', '편의성'],
    target: ['KB금융그룹 고객', '통합 서비스 이용자']
  }
]; 