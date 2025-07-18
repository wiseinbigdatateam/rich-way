export interface RetirementPensionProduct {
  company: string;         // 사업자명
  principalType: string;   // 원리금구분
  quarter: string;         // 분기 (예: '25.1분기')
  reserve: number;         // 적립금(백만원)
  yield: number;           // 수익률
  yield3y: number | null;  // 3년수익률
  yield5y: number | null;  // 5년수익률
  yield7y: number | null;  // 7년수익률
  yield10y: number | null; // 10년수익률
  planType: 'DB' | 'DC' | '개인RP'; // 퇴직연금 유형
}

export const retirementPensions: RetirementPensionProduct[] = [
  // DB생명보험
  { company: 'DB생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 2147, yield: 3.03, yield3y: 2.33, yield5y: 2.08, yield7y: 2.03, yield10y: 2.43, planType: 'DB' },
  { company: 'DB생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 0, yield: 0.00, yield3y: 0.00, yield5y: 0.00, yield7y: 0.00, yield10y: 0.00, planType: 'DB' },
  { company: 'DB생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 678, yield: 3.06, yield3y: 2.05, yield5y: 1.26, yield7y: 3.00, yield10y: 2.66, planType: 'DC' },
  { company: 'DB생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 0, yield: 0.00, yield3y: 0.00, yield5y: 0.00, yield7y: 0.00, yield10y: 0.00, planType: 'DC' },
  { company: 'DB생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 543, yield: 3.03, yield3y: 2.21, yield5y: 1.33, yield7y: 3.04, yield10y: 2.00, planType: '개인RP' },
  { company: 'DB생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 0, yield: 0.00, yield3y: 0.00, yield5y: 0.00, yield7y: 0.00, yield10y: 0.00, planType: '개인RP' },

  // 교보생명보험
  { company: '교보생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 1373, yield: 3.44, yield3y: 2.73, yield5y: 2.91, yield7y: 2.33, yield10y: 2.44, planType: 'DB' },
  { company: '교보생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 344, yield: 3.44, yield3y: 3.68, yield5y: 2.67, yield7y: 2.49, yield10y: 2.44, planType: 'DC' },
  { company: '교보생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 1937, yield: 2.60, yield3y: 1.17, yield5y: 4.54, yield7y: 2.83, yield10y: 3.20, planType: '개인RP' },

  // 동양생명보험
  { company: '동양생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 568, yield: 3.49, yield3y: 2.77, yield5y: 2.48, yield7y: 2.33, yield10y: 2.33, planType: 'DB' },
  { company: '동양생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 0, yield: 0.00, yield3y: 0.00, yield5y: 0.00, yield7y: 0.00, yield10y: 0.00, planType: 'DB' },
  { company: '동양생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 349, yield: 3.45, yield3y: 3.81, yield5y: 2.62, yield7y: 2.64, yield10y: 2.33, planType: 'DC' },
  { company: '동양생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 0, yield: 0.00, yield3y: 0.00, yield5y: 0.00, yield7y: 0.00, yield10y: 0.00, planType: 'DC' },
  { company: '동양생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 1949, yield: 3.45, yield3y: 3.81, yield5y: 2.62, yield7y: 2.64, yield10y: 2.33, planType: '개인RP' },

  // 미래에셋생명보험
  { company: '미래에셋생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 28196, yield: 3.93, yield3y: 3.08, yield5y: 2.74, yield7y: 2.56, yield10y: 2.56, planType: 'DB' },
  { company: '미래에셋생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 7897, yield: 6.17, yield3y: 1.93, yield5y: 2.08, yield7y: 2.43, yield10y: 4.56, planType: 'DB' },
  { company: '미래에셋생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 11000, yield: 3.55, yield3y: 3.23, yield5y: 2.77, yield7y: 2.64, yield10y: 2.63, planType: 'DC' },
  { company: '미래에셋생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 4556, yield: 4.61, yield3y: 1.78, yield5y: 4.93, yield7y: 4.03, yield10y: 3.72, planType: 'DC' },
  { company: '미래에셋생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 2722, yield: 3.17, yield3y: 2.76, yield5y: 2.30, yield7y: 2.12, yield10y: 2.07, planType: '개인RP' },
  { company: '미래에셋생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 1301, yield: 4.52, yield3y: 2.02, yield5y: 4.94, yield7y: 3.96, yield10y: 3.63, planType: '개인RP' },

  // 삼성생명보험
  { company: '삼성생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 339530, yield: 3.83, yield3y: 2.48, yield5y: 2.94, yield7y: 2.15, yield10y: 2.15, planType: 'DB' },
  { company: '삼성생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 392916, yield: 4.12, yield3y: 3.82, yield5y: 3.42, yield7y: 2.24, yield10y: 2.94, planType: 'DB' },
  { company: '삼성생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 65936, yield: 3.79, yield3y: 3.10, yield5y: 2.66, yield7y: 2.52, yield10y: 2.42, planType: 'DC' },
  { company: '삼성생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 75125, yield: 2.57, yield3y: 1.37, yield5y: 4.87, yield7y: 3.61, yield10y: 3.36, planType: 'DC' },
  { company: '삼성생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 26791, yield: 3.77, yield3y: 3.00, yield5y: 2.31, yield7y: 2.09, yield10y: 1.98, planType: '개인RP' },
  { company: '삼성생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 32626, yield: 1.68, yield3y: 0.43, yield5y: 0.43, yield7y: 2.92, yield10y: 2.71, planType: '개인RP' },

  // 신한라이프생명보험
  { company: '신한라이프생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 3938, yield: 3.24, yield3y: 2.69, yield5y: 2.69, yield7y: 2.25, yield10y: 2.27, planType: 'DB' },
  { company: '신한라이프생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 0, yield: 0.00, yield3y: 0.00, yield5y: 0.00, yield7y: 0.00, yield10y: 0.00, planType: 'DB' },
  { company: '신한라이프생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 815, yield: 3.18, yield3y: 3.00, yield5y: 2.65, yield7y: 2.57, yield10y: 2.62, planType: 'DC' },
  { company: '신한라이프생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 73, yield: 3.00, yield3y: 2.80, yield5y: -2.26, yield7y: 1.96, yield10y: 1.52, planType: 'DC' },
  { company: '신한라이프생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 82, yield: 4.05, yield3y: 0.32, yield5y: 2.67, yield7y: 1.85, yield10y: 1.81, planType: '개인RP' },

  // 아이비케이연금보험
  { company: '아이비케이연금보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 6243, yield: 4.16, yield3y: 3.78, yield5y: 3.03, yield7y: 2.71, yield10y: 2.61, planType: 'DB' },
  { company: '아이비케이연금보험', principalType: '실적배당', quarter: '25.1분기', reserve: 2273, yield: -2.20, yield3y: 8.45, yield5y: 3.50, yield7y: 5.09, yield10y: 4.17, planType: 'DB' },
  { company: '아이비케이연금보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 4417, yield: 4.09, yield3y: 3.68, yield5y: 3.05, yield7y: 2.87, yield10y: 2.86, planType: 'DC' },
  { company: '아이비케이연금보험', principalType: '실적배당', quarter: '25.1분기', reserve: 157, yield: 1.40, yield3y: 0.82, yield5y: 4.11, yield7y: 3.44, yield10y: 4.25, planType: 'DC' },
  { company: '아이비케이연금보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 2639, yield: 3.76, yield3y: 3.27, yield5y: 2.72, yield7y: 2.56, yield10y: 2.54, planType: '개인RP' },
  { company: '아이비케이연금보험', principalType: '실적배당', quarter: '25.1분기', reserve: 2727, yield: 1.04, yield3y: 0.82, yield5y: 4.11, yield7y: 3.44, yield10y: 4.25, planType: '개인RP' },

  // 푸본현대생명보험
  { company: '푸본현대생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 5178, yield: 4.19, yield3y: 3.83, yield5y: 2.68, yield7y: 2.49, yield10y: 3.40, planType: 'DB' },
  { company: '푸본현대생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 14032, yield: 1.67, yield3y: 1.83, yield5y: 0.88, yield7y: 0.88, yield10y: 0.88, planType: 'DB' },
  { company: '푸본현대생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 3389, yield: 3.80, yield3y: 3.55, yield5y: 2.96, yield7y: 2.77, yield10y: 2.77, planType: 'DC' },
  { company: '푸본현대생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 388, yield: 1.75, yield3y: 1.03, yield5y: 3.40, yield7y: 2.33, yield10y: 1.64, planType: 'DC' },
  { company: '푸본현대생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 44, yield: 3.80, yield3y: 3.35, yield5y: 2.72, yield7y: 2.54, yield10y: 2.53, planType: '개인RP' },
  { company: '푸본현대생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 99, yield: 4.63, yield3y: 3.27, yield5y: 5.21, yield7y: 3.27, yield10y: 2.51, planType: '개인RP' },

  // 한화생명보험
  { company: '한화생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 2477, yield: 3.65, yield3y: 2.73, yield5y: 2.46, yield7y: 2.28, yield10y: 2.37, planType: 'DB' },
  { company: '한화생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 953, yield: 3.88, yield3y: 2.93, yield5y: 3.46, yield7y: 3.46, yield10y: 3.46, planType: 'DB' },
  { company: '한화생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 1814, yield: 3.89, yield3y: 3.27, yield5y: 2.51, yield7y: 2.41, yield10y: 2.08, planType: 'DC' },
  { company: '한화생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 99, yield: 4.63, yield3y: 3.27, yield5y: 5.21, yield7y: 3.27, yield10y: 2.51, planType: 'DC' },
  { company: '한화생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 1940, yield: 3.89, yield3y: 3.27, yield5y: 2.51, yield7y: 2.41, yield10y: 2.08, planType: '개인RP' },

  // 흥국생명보험
  { company: '흥국생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 807, yield: 2.97, yield3y: 2.64, yield5y: 2.48, yield7y: 2.60, yield10y: 2.57, planType: 'DB' },
  { company: '흥국생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 382, yield: 0.00, yield3y: 0.00, yield5y: 0.00, yield7y: 0.00, yield10y: 0.00, planType: 'DB' },
  { company: '흥국생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 329, yield: 4.06, yield3y: 0.94, yield5y: 2.12, yield7y: 1.83, yield10y: 2.24, planType: 'DC' },
  { company: '흥국생명보험', principalType: '실적배당', quarter: '25.1분기', reserve: 1481, yield: 0.00, yield3y: 0.00, yield5y: 0.00, yield7y: 0.00, yield10y: 0.00, planType: 'DC' },
  { company: '흥국생명보험', principalType: '원리금보장', quarter: '25.1분기', reserve: 113, yield: 3.51, yield3y: 0.95, yield5y: 2.90, yield7y: 2.25, yield10y: 2.12, planType: '개인RP' },
]; 