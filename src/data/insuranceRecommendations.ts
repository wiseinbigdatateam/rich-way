export interface InsuranceRecommendation {
  age: string;
  family: string;
  incomeRange: string;
  recommendations: {
    required: string[];
    recommended: string[];
    notRecommended: string[];
    details: {
      [key: string]: '필수' | '추천' | '비추천';
    };
  };
  reviewNeeded: string; // 재검토 필요시점 추가
}

export const insuranceRecommendations: InsuranceRecommendation[] = [
  // 20대 - 1인가구 - 200~300만원
  {
    age: '20대',
    family: '1인가구',
    incomeRange: '200~300',
    recommendations: {
      required: ['실손', '상해'],
      recommended: ['운전자'],
      notRecommended: ['종신', '연금', '정기', '암', '3대질병', '소득보장', '간병', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '필수',
        운전자: '추천',
        정기: '비추천',
        종신: '비추천',
        암: '비추천',
        '3대질병': '비추천',
        소득보장: '비추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '결혼, 가족 구성 변화 시 보험 포트폴리오 재검토'
  },

  // 20대 - 미혼부부 - 300~400만원
  {
    age: '20대',
    family: '미혼부부',
    incomeRange: '300~400',
    recommendations: {
      required: ['실손', '상해'],
      recommended: ['운전자', '정기'],
      notRecommended: ['종신', '연금', '암', '3대질병', '소득보장', '간병', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '필수',
        운전자: '추천',
        정기: '추천',
        종신: '비추천',
        암: '비추천',
        '3대질병': '비추천',
        소득보장: '비추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '결혼 이후 또는 자녀 계획 시, 정기/자녀보험 검토'
  },

  // 20대 - 부부+자녀1 - 300~400만원
  {
    age: '20대',
    family: '부부+자녀1',
    incomeRange: '300~400',
    recommendations: {
      required: ['실손', '정기', '암'],
      recommended: ['자녀', '학습'],
      notRecommended: ['종신', '연금', '3대질병', '소득보장', '간병', '운전자', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '필수',
        '3대질병': '비추천',
        소득보장: '비추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '추천',
        학습: '추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 교육비 증가 시, 자녀/학습보험 재검토'
  },

  // 20대 - 부부+자녀2 - 300~400만원
  {
    age: '20대',
    family: '부부+자녀2',
    incomeRange: '300~400',
    recommendations: {
      required: ['실손', '정기', '암'],
      recommended: ['자녀', '학습', '소득보장'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '필수',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '추천',
        학습: '추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 교육비 증가 시, 자녀/학습보험 재검토'
  },

  // 30대 - 1인가구 - 300~400만원
  {
    age: '30대',
    family: '1인가구',
    incomeRange: '300~400',
    recommendations: {
      required: ['실손', '상해'],
      recommended: ['운전자', '정기'],
      notRecommended: ['종신', '연금', '암', '3대질병', '소득보장', '간병', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '필수',
        운전자: '추천',
        정기: '추천',
        종신: '비추천',
        암: '비추천',
        '3대질병': '비추천',
        소득보장: '비추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '결혼, 가족 구성 변화 시 보험 포트폴리오 재검토'
  },

  // 30대 - 부부 - 300~500만원
  {
    age: '30대',
    family: '부부',
    incomeRange: '300~500',
    recommendations: {
      required: ['실손', '정기'],
      recommended: ['암', '소득보장'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '추천',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 계획 시, 자녀/학습보험 검토'
  },

  // 30대 - 부부+자녀1 - 400~600만원
  {
    age: '30대',
    family: '부부+자녀1',
    incomeRange: '400~600',
    recommendations: {
      required: ['실손', '정기', '암'],
      recommended: ['소득보장', '자녀'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '필수',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 교육비 증가 시, 자녀/학습보험 재검토'
  },

  // 30대 - 부부+자녀2 - 400~600만원
  {
    age: '30대',
    family: '부부+자녀2',
    incomeRange: '400~600',
    recommendations: {
      required: ['실손', '정기', '암'],
      recommended: ['소득보장', '자녀', '학습'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '필수',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '추천',
        학습: '추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 교육비 증가 시, 자녀/학습보험 재검토'
  },

  // 30대 - 부부+자녀3이상 - 500~700만원
  {
    age: '30대',
    family: '부부+자녀3이상',
    incomeRange: '500~700',
    recommendations: {
      required: ['실손', '정기', '암'],
      recommended: ['소득보장', '자녀', '학습'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '필수',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '추천',
        학습: '추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 교육비 증가 시, 자녀/학습보험 재검토'
  },

  // 40대 - 1인가구 - 300~500만원
  {
    age: '40대',
    family: '1인가구',
    incomeRange: '300~500',
    recommendations: {
      required: ['실손', '정기'],
      recommended: ['암', '소득보장'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '추천',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '결혼, 가족 구성 변화 시 보험 포트폴리오 재검토'
  },

  // 40대 - 부부 - 400~600만원
  {
    age: '40대',
    family: '부부',
    incomeRange: '400~600',
    recommendations: {
      required: ['실손', '정기', '암'],
      recommended: ['소득보장'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '필수',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 계획 시, 자녀/학습보험 검토'
  },

  // 40대 - 부부+자녀1 - 500~700만원
  {
    age: '40대',
    family: '부부+자녀1',
    incomeRange: '500~700',
    recommendations: {
      required: ['실손', '정기', '암'],
      recommended: ['소득보장', '자녀'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '필수',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 교육비 증가 시, 자녀/학습보험 재검토'
  },

  // 40대 - 부부+자녀2 - 500~600만원
  {
    age: '40대',
    family: '부부+자녀2',
    incomeRange: '500~600',
    recommendations: {
      required: ['실손', '정기', '암'],
      recommended: ['소득보장', '자녀', '학습'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '필수',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '추천',
        학습: '추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 교육비 증가 시, 자녀/학습보험 재검토'
  },

  // 40대 - 부부+자녀2 - 600~800만원
  {
    age: '40대',
    family: '부부+자녀2',
    incomeRange: '600~800',
    recommendations: {
      required: ['실손', '정기', '암', '3대질병'],
      recommended: ['소득보장', '자녀', '학습'],
      notRecommended: ['종신', '연금', '간병', '운전자', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '필수',
        '3대질병': '필수',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '추천',
        학습: '추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 교육비 증가 시, 자녀/학습보험 재검토'
  },

  // 40대 - 부부+자녀3이상 - 700~900만원
  {
    age: '40대',
    family: '부부+자녀3이상',
    incomeRange: '700~900',
    recommendations: {
      required: ['실손', '정기', '암', '3대질병'],
      recommended: ['소득보장', '자녀', '학습'],
      notRecommended: ['종신', '연금', '간병', '운전자', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '필수',
        '3대질병': '필수',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '추천',
        학습: '추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '자녀 교육비 증가 시, 자녀/학습보험 재검토'
  },

  // 50대 - 1인가구 - 200~300만원
  {
    age: '50대',
    family: '1인가구',
    incomeRange: '200~300',
    recommendations: {
      required: ['실손'],
      recommended: ['정기', '암'],
      notRecommended: ['종신', '연금', '3대질병', '소득보장', '간병', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '추천',
        종신: '비추천',
        암: '추천',
        '3대질병': '비추천',
        소득보장: '비추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '은퇴 계획 시, 연금/간병보험 검토'
  },

  // 50대 - 부부 - 400~600만원
  {
    age: '50대',
    family: '부부',
    incomeRange: '400~600',
    recommendations: {
      required: ['실손', '정기'],
      recommended: ['암', '소득보장'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '추천',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '은퇴 계획 시, 연금/간병보험 검토'
  },

  // 50대 - 부부+부양가족 - 400~600만원
  {
    age: '50대',
    family: '부부+부양가족',
    incomeRange: '400~600',
    recommendations: {
      required: ['실손', '정기'],
      recommended: ['암', '소득보장'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '추천',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '은퇴 계획 시, 연금/간병보험 검토'
  },

  // 50대 - 부부+자녀1 - 400~600만원
  {
    age: '50대',
    family: '부부+자녀1',
    incomeRange: '400~600',
    recommendations: {
      required: ['실손', '정기'],
      recommended: ['암', '소득보장'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '추천',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '은퇴 계획 시, 연금/간병보험 검토'
  },

  // 50대 - 부부+자녀2 - 400~600만원
  {
    age: '50대',
    family: '부부+자녀2',
    incomeRange: '400~600',
    recommendations: {
      required: ['실손', '정기'],
      recommended: ['암', '소득보장'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '추천',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '은퇴 계획 시, 연금/간병보험 검토'
  },

  // 50대 - 부부+자녀3이상 - 400~600만원
  {
    age: '50대',
    family: '부부+자녀3이상',
    incomeRange: '400~600',
    recommendations: {
      required: ['실손', '정기'],
      recommended: ['암', '소득보장'],
      notRecommended: ['종신', '연금', '3대질병', '간병', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '필수',
        종신: '비추천',
        암: '추천',
        '3대질병': '비추천',
        소득보장: '추천',
        연금: '비추천',
        간병: '비추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '은퇴 계획 시, 연금/간병보험 검토'
  },

  // 60대 이상 - 1인가구 - 100~200만원
  {
    age: '60대 이상',
    family: '1인가구',
    incomeRange: '100~200',
    recommendations: {
      required: ['실손'],
      recommended: ['정기', '간병'],
      notRecommended: ['종신', '연금', '암', '3대질병', '소득보장', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '추천',
        종신: '비추천',
        암: '비추천',
        '3대질병': '비추천',
        소득보장: '비추천',
        연금: '비추천',
        간병: '추천',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '의료비 증가 시, 간병보험 재검토'
  },

  // 60대 이상 - 부부 - 200~400만원
  {
    age: '60대 이상',
    family: '부부',
    incomeRange: '200~400',
    recommendations: {
      required: ['실손', '간병'],
      recommended: ['연금'],
      notRecommended: ['정기', '종신', '암', '3대질병', '소득보장', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '비추천',
        종신: '비추천',
        암: '비추천',
        '3대질병': '비추천',
        소득보장: '비추천',
        연금: '추천',
        간병: '필수',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '의료비 증가 시, 간병보험 재검토'
  },

  // 60대 이상 - 부부+자녀1 - 200~400만원
  {
    age: '60대 이상',
    family: '부부+자녀1',
    incomeRange: '200~400',
    recommendations: {
      required: ['실손', '간병'],
      recommended: ['연금'],
      notRecommended: ['정기', '종신', '암', '3대질병', '소득보장', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '비추천',
        종신: '비추천',
        암: '비추천',
        '3대질병': '비추천',
        소득보장: '비추천',
        연금: '추천',
        간병: '필수',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '의료비 증가 시, 간병보험 재검토'
  },

  // 60대 이상 - 부부+자녀2 - 200~400만원
  {
    age: '60대 이상',
    family: '부부+자녀2',
    incomeRange: '200~400',
    recommendations: {
      required: ['실손', '간병'],
      recommended: ['연금'],
      notRecommended: ['정기', '종신', '암', '3대질병', '소득보장', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '비추천',
        종신: '비추천',
        암: '비추천',
        '3대질병': '비추천',
        소득보장: '비추천',
        연금: '추천',
        간병: '필수',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '의료비 증가 시, 간병보험 재검토'
  },

  // 60대 이상 - 부부+자녀3이상 - 200~400만원
  {
    age: '60대 이상',
    family: '부부+자녀3이상',
    incomeRange: '200~400',
    recommendations: {
      required: ['실손', '간병'],
      recommended: ['연금'],
      notRecommended: ['정기', '종신', '암', '3대질병', '소득보장', '운전자', '자녀', '학습', '치아'],
      details: {
        실손: '필수',
        상해: '추천',
        운전자: '비추천',
        정기: '비추천',
        종신: '비추천',
        암: '비추천',
        '3대질병': '비추천',
        소득보장: '비추천',
        연금: '추천',
        간병: '필수',
        자녀: '비추천',
        학습: '비추천',
        치아: '비추천'
      }
    },
    reviewNeeded: '의료비 증가 시, 간병보험 재검토'
  }
];

// 보험 추천 조회 함수
export function getInsuranceRecommendations(age: number, familyType: string, income: number): InsuranceRecommendation | null {
  // 연령대 결정
  let ageGroup = '';
  if (age < 30) ageGroup = '20대';
  else if (age < 40) ageGroup = '30대';
  else if (age < 50) ageGroup = '40대';
  else if (age < 60) ageGroup = '50대';
  else ageGroup = '60대 이상';

  // 가족구성 정규화
  let family = familyType.replace(/명|\s/g, '');
  if (family.includes('자녀3')) family = '부부+자녀3이상';
  else if (family.includes('자녀2')) family = '부부+자녀2';
  else if (family.includes('자녀1')) family = '부부+자녀1';
  else if (family.includes('미혼')) family = '미혼부부';
  else if (family.includes('부양')) family = '부부+부양가족';
  else if (family.includes('부부')) family = '부부';
  else family = '1인가구';

  // 소득구간 결정 (만원 단위)
  const incomeInManWon = income / 10000;
  let incomeRange = '';
  if (incomeInManWon < 200) incomeRange = '100~200';
  else if (incomeInManWon < 300) incomeRange = '200~300';
  else if (incomeInManWon < 400) incomeRange = '300~400';
  else if (incomeInManWon < 500) incomeRange = '400~500';
  else if (incomeInManWon < 600) incomeRange = '500~600';
  else if (incomeInManWon < 700) incomeRange = '600~700';
  else if (incomeInManWon < 800) incomeRange = '700~800';
  else if (incomeInManWon < 900) incomeRange = '800~900';
  else incomeRange = '900~1000';

  // 1순위: 정확히 맞는 추천 데이터 찾기
  let recommendation = insuranceRecommendations.find(
    rec => rec.age === ageGroup && 
           rec.family === family && 
           rec.incomeRange === incomeRange
  );

  // 1순위가 없으면 같은 연령대의 다른 소득구간
  if (!recommendation) {
    recommendation = insuranceRecommendations.find(
      rec => rec.age === ageGroup && 
             rec.family === family
    );
  }

  // 여전히 없으면 같은 연령대의 다른 가족구성
  if (!recommendation) {
    recommendation = insuranceRecommendations.find(
      rec => rec.age === ageGroup
    );
  }

  // 여전히 없으면 다른 연령대의 비슷한 가족구성
  if (!recommendation) {
    recommendation = insuranceRecommendations.find(
      rec => rec.family === family
    );
  }

  // 마지막으로 첫 번째 추천 사용
  if (!recommendation) {
    recommendation = insuranceRecommendations[0];
  }

  return recommendation;
} 