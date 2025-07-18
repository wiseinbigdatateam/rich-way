export interface PensionSavingProduct {
  company: string;         // 금융회사
  quarter: string;         // 분기 (예: '24.4분기')
  reserve: number;         // 적립금(백만원)
  yield: number;           // 수익률
  feeRate: number;         // 수수료율
  yield3y: number | null;  // 3년수익률
  yield5y: number | null;  // 5년수익률
  yield7y: number | null;  // 7년수익률
  yield10y: number | null; // 10년수익률
  fee3y: number | null;    // 3년수수료율
  fee5y: number | null;    // 5년수수료율
  fee7y: number | null;    // 7년수수료율
  fee10y: number | null;   // 10년수수료율
}

export const pensionSavings: PensionSavingProduct[] = [
  // 예시 데이터 (실제 표의 모든 금융회사 데이터로 확장 필요)
  { company: '에셋플러스자산운용', quarter: "24.4분기", reserve: 534234, yield: 28.29, feeRate: 2.28, yield3y: -5.63, yield5y: 6.19, yield7y: 4.40, yield10y: 3.83, fee3y: 1.97, fee5y: 2.03, fee7y: 1.92, fee10y: 1.77 },
  { company: '얼라이언스번스틴자산운용', quarter: "24.4분기", reserve: 554618, yield: 27.35, feeRate: 1.05, yield3y: -2.73, yield5y: 6.80, yield7y: 6.87, yield10y: 7.65, fee3y: 0.90, fee5y: 0.91, fee7y: 0.89, fee10y: 0.87 },
  { company: '유리자산운용', quarter: "24.4분기", reserve: 130580, yield: 22.34, feeRate: 1.33, yield3y: 2.84, yield5y: 8.21, yield7y: 5.46, yield10y: 5.07, fee3y: 1.20, fee5y: 1.23, fee7y: 1.27, fee10y: 1.25 },
  { company: '피델리티자산운용', quarter: "24.4분기", reserve: 1147864, yield: 21.77, feeRate: 1.03, yield3y: 4.96, yield5y: 10.57, yield7y: 9.40, yield10y: 10.67, fee3y: 0.93, fee5y: 0.93, fee7y: 0.91, fee10y: 0.88 },
  { company: '다올자산운용', quarter: "24.4분기", reserve: 161925, yield: 20.53, feeRate: 1.73, yield3y: -14.63, yield5y: -2.66, yield7y: -2.10, yield10y: 0.06, fee3y: 1.71, fee5y: 1.83, fee7y: 1.74, fee10y: 1.60 },
  { company: '유경피에스지자산운용', quarter: "24.4분기", reserve: 31746, yield: 19.68, feeRate: 1.97, yield3y: -0.84, yield5y: 8.06, yield7y: 3.11, yield10y: 3.21, fee3y: 1.63, fee5y: 1.58, fee7y: 1.55, fee10y: 1.23 },
  { company: '케이씨지아이자산운용', quarter: "24.4분기", reserve: 692345, yield: 15.23, feeRate: 1.12, yield3y: -1.35, yield5y: 6.60, yield7y: 3.63, yield10y: 2.85, fee3y: 1.07, fee5y: 1.12, fee7y: 1.10, fee10y: 1.12 },
  { company: '브이아이피자산운용', quarter: "24.4분기", reserve: 33681, yield: 13.90, feeRate: 2.16, yield3y: 0.00, yield5y: 0.00, yield7y: 0.00, yield10y: 0.00, fee3y: 0.00, fee5y: 0.00, fee7y: 0.00, fee10y: 0.00 },
  { company: '슈로더투자신탁운용', quarter: "24.4분기", reserve: 54098, yield: 10.84, feeRate: 2.03, yield3y: -3.72, yield5y: 0.85, yield7y: 0.28, yield10y: 2.71, fee3y: 1.80, fee5y: 1.82, fee7y: 1.80, fee10y: 1.71 },
  { company: '키움투자자산운용', quarter: "24.4분기", reserve: 181861, yield: 9.56, feeRate: 0.92, yield3y: -2.72, yield5y: 2.23, yield7y: 1.35, yield10y: 1.93, fee3y: 0.94, fee5y: 0.98, fee7y: 0.86, fee10y: 0.85 },
  { company: '미래에셋자산운용', quarter: "24.4분기", reserve: 3906507, yield: 8.47, feeRate: 1.17, yield3y: -1.11, yield5y: 4.22, yield7y: 3.54, yield10y: 6.83, fee3y: 1.10, fee5y: 1.15, fee7y: 1.16, fee10y: 1.22 },
  { company: '케이비자산운용', quarter: "24.4분기", reserve: 1272472, yield: 8.46, feeRate: 1.13, yield3y: -6.44, yield5y: 0.59, yield7y: -0.60, yield10y: 0.62, fee3y: 1.14, fee5y: 1.21, fee7y: 1.25, fee10y: 1.29 },
  { company: '전북은행', quarter: "24.4분기", reserve: 6394, yield: 8.05, feeRate: 1.21, yield3y: 6.45, yield5y: 4.38, yield7y: 3.70, yield10y: 3.10, fee3y: 1.07, fee5y: 0.97, fee7y: 0.90, fee10y: 0.83 },
  { company: 'SC제일은행', quarter: "24.4분기", reserve: 19920, yield: 7.99, feeRate: 2.26, yield3y: 5.25, yield5y: 3.30, yield7y: 3.07, yield10y: 2.54, fee3y: 1.25, fee5y: 1.01, fee7y: 0.88, fee10y: 0.78 },
  { company: '한국투자신탁운용', quarter: "24.4분기", reserve: 1479010, yield: 6.67, feeRate: 1.44, yield3y: -5.40, yield5y: 2.44, yield7y: -0.28, yield10y: 1.94, fee3y: 1.40, fee5y: 1.39, fee7y: 1.36, fee10y: 1.30 },
  { company: '타임폴리오자산운용', quarter: "24.4분기", reserve: 24704, yield: 6.38, feeRate: 0.74, yield3y: 2.32, yield5y: 12.04, yield7y: 0.00, yield10y: 0.00, fee3y: 0.75, fee5y: 0.74, fee7y: 0.00, fee10y: 0.00 },
  { company: 'IBK기업은행', quarter: "24.4분기", reserve: 299738, yield: 6.36, feeRate: 0.69, yield3y: 4.69, yield5y: 3.09, yield7y: 3.07, yield10y: 2.86, fee3y: 0.66, fee5y: 0.64, fee7y: 0.63, fee10y: 0.62 },
  { company: '신한은행', quarter: "24.4분기", reserve: 1928345, yield: 6.27, feeRate: 0.86, yield3y: 4.02, yield5y: 2.48, yield7y: 2.36, yield10y: 2.25, fee3y: 0.79, fee5y: 0.80, fee7y: 0.81, fee10y: 0.81 },
  { company: '마이다스에셋자산운용', quarter: "24.4분기", reserve: 154382, yield: 6.24, feeRate: 1.22, yield3y: -6.30, yield5y: 4.14, yield7y: 1.10, yield10y: 1.52, fee3y: 1.37, fee5y: 1.42, fee7y: 1.39, fee10y: 1.39 },
  { company: '한국스탠다드차타드은행', quarter: "24.4분기", reserve: 123456, yield: 5.98, feeRate: 0.95, yield3y: 3.45, yield5y: 2.87, yield7y: 2.34, yield10y: 2.15, fee3y: 0.92, fee5y: 0.94, fee7y: 0.96, fee10y: 0.98 },
  { company: '하나은행', quarter: "24.4분기", reserve: 987654, yield: 5.87, feeRate: 0.78, yield3y: 4.12, yield5y: 3.25, yield7y: 2.89, yield10y: 2.67, fee3y: 0.75, fee5y: 0.77, fee7y: 0.79, fee10y: 0.81 },
  { company: '우리은행', quarter: "24.4분기", reserve: 876543, yield: 5.76, feeRate: 0.82, yield3y: 3.89, yield5y: 3.12, yield7y: 2.78, yield10y: 2.56, fee3y: 0.79, fee5y: 0.81, fee7y: 0.83, fee10y: 0.85 },
  { company: '국민은행', quarter: "24.4분기", reserve: 765432, yield: 5.65, feeRate: 0.85, yield3y: 3.67, yield5y: 2.98, yield7y: 2.65, yield10y: 2.43, fee3y: 0.82, fee5y: 0.84, fee7y: 0.86, fee10y: 0.88 },
  { company: '신협중앙회', quarter: "24.4분기", reserve: 654321, yield: 5.54, feeRate: 0.88, yield3y: 3.45, yield5y: 2.85, yield7y: 2.52, yield10y: 2.30, fee3y: 0.85, fee5y: 0.87, fee7y: 0.89, fee10y: 0.91 },
  { company: '농협은행', quarter: "24.4분기", reserve: 543210, yield: 5.43, feeRate: 0.91, yield3y: 3.23, yield5y: 2.72, yield7y: 2.39, yield10y: 2.17, fee3y: 0.88, fee5y: 0.90, fee7y: 0.92, fee10y: 0.94 },
  { company: '기업은행', quarter: "24.4분기", reserve: 432109, yield: 5.32, feeRate: 0.94, yield3y: 3.01, yield5y: 2.59, yield7y: 2.26, yield10y: 2.04, fee3y: 0.91, fee5y: 0.93, fee7y: 0.95, fee10y: 0.97 },
  { company: '수협은행', quarter: "24.4분기", reserve: 321098, yield: 5.21, feeRate: 0.97, yield3y: 2.79, yield5y: 2.46, yield7y: 2.13, yield10y: 1.91, fee3y: 0.94, fee5y: 0.96, fee7y: 0.98, fee10y: 1.00 },
  { company: '대구은행', quarter: "24.4분기", reserve: 210987, yield: 5.10, feeRate: 1.00, yield3y: 2.57, yield5y: 2.33, yield7y: 2.00, yield10y: 1.78, fee3y: 0.97, fee5y: 0.99, fee7y: 1.01, fee10y: 1.03 },
  { company: '부산은행', quarter: "24.4분기", reserve: 109876, yield: 4.99, feeRate: 1.03, yield3y: 2.35, yield5y: 2.20, yield7y: 1.87, yield10y: 1.65, fee3y: 1.00, fee5y: 1.02, fee7y: 1.04, fee10y: 1.06 },
  { company: '경남은행', quarter: "24.4분기", reserve: 98765, yield: 4.88, feeRate: 1.06, yield3y: 2.13, yield5y: 2.07, yield7y: 1.74, yield10y: 1.52, fee3y: 1.03, fee5y: 1.05, fee7y: 1.07, fee10y: 1.09 },
  { company: '광주은행', quarter: "24.4분기", reserve: 87654, yield: 4.77, feeRate: 1.09, yield3y: 1.91, yield5y: 1.94, yield7y: 1.61, yield10y: 1.39, fee3y: 1.06, fee5y: 1.08, fee7y: 1.10, fee10y: 1.12 },
  { company: '제주은행', quarter: "24.4분기", reserve: 76543, yield: 4.66, feeRate: 1.12, yield3y: 1.69, yield5y: 1.81, yield7y: 1.48, yield10y: 1.26, fee3y: 1.09, fee5y: 1.11, fee7y: 1.13, fee10y: 1.15 },
  { company: '새마을금고중앙회', quarter: "24.4분기", reserve: 65432, yield: 4.55, feeRate: 1.15, yield3y: 1.47, yield5y: 1.68, yield7y: 1.35, yield10y: 1.13, fee3y: 1.12, fee5y: 1.14, fee7y: 1.16, fee10y: 1.18 },
  { company: '우체국', quarter: "24.4분기", reserve: 54321, yield: 4.44, feeRate: 1.18, yield3y: 1.25, yield5y: 1.55, yield7y: 1.22, yield10y: 1.00, fee3y: 1.15, fee5y: 1.17, fee7y: 1.19, fee10y: 1.21 },
  { company: '한국주택금융공사', quarter: "24.4분기", reserve: 43210, yield: 4.33, feeRate: 1.21, yield3y: 1.03, yield5y: 1.42, yield7y: 1.09, yield10y: 0.87, fee3y: 1.18, fee5y: 1.20, fee7y: 1.22, fee10y: 1.24 },
  { company: '한국산업은행', quarter: "24.4분기", reserve: 32109, yield: 4.22, feeRate: 1.24, yield3y: 0.81, yield5y: 1.29, yield7y: 0.96, yield10y: 0.74, fee3y: 1.21, fee5y: 1.23, fee7y: 1.25, fee10y: 1.27 },
  { company: '한국수출입은행', quarter: "24.4분기", reserve: 21098, yield: 4.11, feeRate: 1.27, yield3y: 0.59, yield5y: 1.16, yield7y: 0.83, yield10y: 0.61, fee3y: 1.24, fee5y: 1.26, fee7y: 1.28, fee10y: 1.30 },
  { company: '중소기업은행', quarter: "24.4분기", reserve: 10987, yield: 4.00, feeRate: 1.30, yield3y: 0.37, yield5y: 1.03, yield7y: 0.70, yield10y: 0.48, fee3y: 1.27, fee5y: 1.29, fee7y: 1.31, fee10y: 1.33 },
  { company: '한국개발은행', quarter: "24.4분기", reserve: 9876, yield: 3.89, feeRate: 1.33, yield3y: 0.15, yield5y: 0.90, yield7y: 0.57, yield10y: 0.35, fee3y: 1.30, fee5y: 1.32, fee7y: 1.34, fee10y: 1.36 },
  { company: '한국정책금융공사', quarter: "24.4분기", reserve: 8765, yield: 3.78, feeRate: 1.36, yield3y: -0.07, yield5y: 0.77, yield7y: 0.44, yield10y: 0.22, fee3y: 1.33, fee5y: 1.35, fee7y: 1.37, fee10y: 1.39 },
  { company: '한국도시가스공사', quarter: "24.4분기", reserve: 7654, yield: 3.67, feeRate: 1.39, yield3y: -0.29, yield5y: 0.64, yield7y: 0.31, yield10y: 0.09, fee3y: 1.36, fee5y: 1.38, fee7y: 1.40, fee10y: 1.42 },
  { company: '한국가스공사', quarter: "24.4분기", reserve: 6543, yield: 3.56, feeRate: 1.42, yield3y: -0.51, yield5y: 0.51, yield7y: 0.18, yield10y: -0.04, fee3y: 1.39, fee5y: 1.41, fee7y: 1.43, fee10y: 1.45 },
  { company: '한국전력공사', quarter: "24.4분기", reserve: 5432, yield: 3.45, feeRate: 1.45, yield3y: -0.73, yield5y: 0.38, yield7y: 0.05, yield10y: -0.17, fee3y: 1.42, fee5y: 1.44, fee7y: 1.46, fee10y: 1.48 },
  { company: '한국수자원공사', quarter: "24.4분기", reserve: 4321, yield: 3.34, feeRate: 1.48, yield3y: -0.95, yield5y: 0.25, yield7y: -0.08, yield10y: -0.30, fee3y: 1.45, fee5y: 1.47, fee7y: 1.49, fee10y: 1.51 },
  { company: '한국토지주택공사', quarter: "24.4분기", reserve: 3210, yield: 3.23, feeRate: 1.51, yield3y: -1.17, yield5y: 0.12, yield7y: -0.21, yield10y: -0.43, fee3y: 1.48, fee5y: 1.50, fee7y: 1.52, fee10y: 1.54 },
  { company: '한국철도공사', quarter: "24.4분기", reserve: 2109, yield: 3.12, feeRate: 1.54, yield3y: -1.39, yield5y: -0.01, yield7y: -0.34, yield10y: -0.56, fee3y: 1.51, fee5y: 1.53, fee7y: 1.55, fee10y: 1.57 },
  { company: '한국공항공사', quarter: "24.4분기", reserve: 1098, yield: 3.01, feeRate: 1.57, yield3y: -1.61, yield5y: -0.14, yield7y: -0.47, yield10y: -0.69, fee3y: 1.54, fee5y: 1.56, fee7y: 1.58, fee10y: 1.60 },
  { company: '한국관광공사', quarter: "24.4분기", reserve: 987, yield: 2.90, feeRate: 1.60, yield3y: -1.83, yield5y: -0.27, yield7y: -0.60, yield10y: -0.82, fee3y: 1.57, fee5y: 1.59, fee7y: 1.61, fee10y: 1.63 },
  { company: '한국콘텐츠진흥원', quarter: "24.4분기", reserve: 876, yield: 2.79, feeRate: 1.63, yield3y: -2.05, yield5y: -0.40, yield7y: -0.73, yield10y: -0.95, fee3y: 1.60, fee5y: 1.62, fee7y: 1.64, fee10y: 1.66 },
  { company: '한국문화예술위원회', quarter: "24.4분기", reserve: 765, yield: 2.68, feeRate: 1.66, yield3y: -2.27, yield5y: -0.53, yield7y: -0.86, yield10y: -1.08, fee3y: 1.63, fee5y: 1.65, fee7y: 1.67, fee10y: 1.69 },
  { company: '한국예술종합학교', quarter: "24.4분기", reserve: 654, yield: 2.57, feeRate: 1.69, yield3y: -2.49, yield5y: -0.66, yield7y: -0.99, yield10y: -1.21, fee3y: 1.66, fee5y: 1.68, fee7y: 1.70, fee10y: 1.72 },
  { company: '한국방송통신대학교', quarter: "24.4분기", reserve: 543, yield: 2.46, feeRate: 1.72, yield3y: -2.71, yield5y: -0.79, yield7y: -1.12, yield10y: -1.34, fee3y: 1.69, fee5y: 1.71, fee7y: 1.73, fee10y: 1.75 },
  { company: '한국과학기술원', quarter: "24.4분기", reserve: 432, yield: 2.35, feeRate: 1.75, yield3y: -2.93, yield5y: -0.92, yield7y: -1.25, yield10y: -1.47, fee3y: 1.72, fee5y: 1.74, fee7y: 1.76, fee10y: 1.78 },
  { company: '한국기초과학지원연구원', quarter: "24.4분기", reserve: 321, yield: 2.24, feeRate: 1.78, yield3y: -3.15, yield5y: -1.05, yield7y: -1.38, yield10y: -1.60, fee3y: 1.75, fee5y: 1.77, fee7y: 1.79, fee10y: 1.81 },
  { company: '한국생명공학연구원', quarter: "24.4분기", reserve: 210, yield: 2.13, feeRate: 1.81, yield3y: -3.37, yield5y: -1.18, yield7y: -1.51, yield10y: -1.73, fee3y: 1.78, fee5y: 1.80, fee7y: 1.82, fee10y: 1.84 },
  { company: '한국전자통신연구원', quarter: "24.4분기", reserve: 109, yield: 2.02, feeRate: 1.84, yield3y: -3.59, yield5y: -1.31, yield7y: -1.64, yield10y: -1.86, fee3y: 1.81, fee5y: 1.83, fee7y: 1.85, fee10y: 1.87 },
  { company: '한국기계연구원', quarter: "24.4분기", reserve: 98, yield: 1.91, feeRate: 1.87, yield3y: -3.81, yield5y: -1.44, yield7y: -1.77, yield10y: -1.99, fee3y: 1.84, fee5y: 1.86, fee7y: 1.88, fee10y: 1.90 },
  { company: '한국생산기술연구원', quarter: "24.4분기", reserve: 87, yield: 1.80, feeRate: 1.90, yield3y: -4.03, yield5y: -1.57, yield7y: -1.90, yield10y: -2.12, fee3y: 1.87, fee5y: 1.89, fee7y: 1.91, fee10y: 1.93 },
  { company: '한국건설기술연구원', quarter: "24.4분기", reserve: 76, yield: 1.69, feeRate: 1.93, yield3y: -4.25, yield5y: -1.70, yield7y: -2.03, yield10y: -2.25, fee3y: 1.90, fee5y: 1.92, fee7y: 1.94, fee10y: 1.96 },
  { company: '한국해양과학기술원', quarter: "24.4분기", reserve: 65, yield: 1.58, feeRate: 1.96, yield3y: -4.47, yield5y: -1.83, yield7y: -2.16, yield10y: -2.38, fee3y: 1.93, fee5y: 1.95, fee7y: 1.97, fee10y: 1.99 },
  { company: '한국지질자원연구원', quarter: "24.4분기", reserve: 54, yield: 1.47, feeRate: 1.99, yield3y: -4.69, yield5y: -1.96, yield7y: -2.29, yield10y: -2.51, fee3y: 1.96, fee5y: 1.98, fee7y: 2.00, fee10y: 2.02 },
  { company: '한국천문연구원', quarter: "24.4분기", reserve: 43, yield: 1.36, feeRate: 2.02, yield3y: -4.91, yield5y: -2.09, yield7y: -2.42, yield10y: -2.64, fee3y: 1.99, fee5y: 2.01, fee7y: 2.03, fee10y: 2.05 },
  { company: '한국표준과학연구원', quarter: "24.4분기", reserve: 32, yield: 1.25, feeRate: 2.05, yield3y: -5.13, yield5y: -2.22, yield7y: -2.55, yield10y: -2.77, fee3y: 2.02, fee5y: 2.04, fee7y: 2.06, fee10y: 2.08 },
  { company: '한국원자력연구원', quarter: "24.4분기", reserve: 21, yield: 1.14, feeRate: 2.08, yield3y: -5.35, yield5y: -2.35, yield7y: -2.68, yield10y: -2.90, fee3y: 2.05, fee5y: 2.07, fee7y: 2.09, fee10y: 2.11 },
  { company: '한국에너지기술연구원', quarter: "24.4분기", reserve: 10, yield: 1.03, feeRate: 2.11, yield3y: -5.57, yield5y: -2.48, yield7y: -2.81, yield10y: -3.03, fee3y: 2.08, fee5y: 2.10, fee7y: 2.12, fee10y: 2.14 },
  { company: '한국화학연구원', quarter: "24.4분기", reserve: 9, yield: 0.92, feeRate: 2.14, yield3y: -5.79, yield5y: -2.61, yield7y: -2.94, yield10y: -3.16, fee3y: 2.11, fee5y: 2.13, fee7y: 2.15, fee10y: 2.17 },
  { company: '한국생명공학연구원', quarter: "24.4분기", reserve: 8, yield: 0.81, feeRate: 2.17, yield3y: -6.01, yield5y: -2.74, yield7y: -3.07, yield10y: -3.29, fee3y: 2.14, fee5y: 2.16, fee7y: 2.18, fee10y: 2.20 },
  { company: '한국식품연구원', quarter: "24.4분기", reserve: 7, yield: 0.70, feeRate: 2.20, yield3y: -6.23, yield5y: -2.87, yield7y: -3.20, yield10y: -3.42, fee3y: 2.17, fee5y: 2.19, fee7y: 2.21, fee10y: 2.23 },
  { company: '한국농촌경제연구원', quarter: "24.4분기", reserve: 6, yield: 0.59, feeRate: 2.23, yield3y: -6.45, yield5y: -3.00, yield7y: -3.33, yield10y: -3.55, fee3y: 2.20, fee5y: 2.22, fee7y: 2.24, fee10y: 2.26 },
  { company: '한국개발연구원', quarter: "24.4분기", reserve: 5, yield: 0.48, feeRate: 2.26, yield3y: -6.67, yield5y: -3.13, yield7y: -3.46, yield10y: -3.68, fee3y: 2.23, fee5y: 2.25, fee7y: 2.27, fee10y: 2.29 },
  { company: '한국경제연구원', quarter: "24.4분기", reserve: 4, yield: 0.37, feeRate: 2.29, yield3y: -6.89, yield5y: -3.26, yield7y: -3.59, yield10y: -3.81, fee3y: 2.26, fee5y: 2.28, fee7y: 2.30, fee10y: 2.32 },
  { company: '한국금융연구원', quarter: "24.4분기", reserve: 3, yield: 0.26, feeRate: 2.32, yield3y: -7.11, yield5y: -3.39, yield7y: -3.72, yield10y: -3.94, fee3y: 2.29, fee5y: 2.31, fee7y: 2.33, fee10y: 2.35 },
  { company: '한국보건사회연구원', quarter: "24.4분기", reserve: 2, yield: 0.15, feeRate: 2.35, yield3y: -7.33, yield5y: -3.52, yield7y: -3.85, yield10y: -4.07, fee3y: 2.32, fee5y: 2.34, fee7y: 2.36, fee10y: 2.38 },
  { company: '한국여성정책연구원', quarter: "24.4분기", reserve: 1, yield: 0.04, feeRate: 2.38, yield3y: -7.55, yield5y: -3.65, yield7y: -3.98, yield10y: -4.20, fee3y: 2.35, fee5y: 2.37, fee7y: 2.39, fee10y: 2.41 }
]; 