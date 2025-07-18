import { newSavings } from './newSavings';
import { newSavingsPart2 } from './newSavings_part2';
import { newSavingsPart3 } from './newSavings_part3';
import { newSavingsPart4 } from './newSavings_part4';

export interface SavingsProduct {
  bank: string;           // 저축은행
  productName: string;    // 상품명
  contractRate: number;   // 약정금리
  afterTaxRate: number;   // 세후금리
  maxPreferentialRate: number; // 최고우대금리
  earlyWithdrawalRate: string; // 중도해지금리
  afterTaxInterest: number; // 세후이자(원)
  maturityAmount: number; // 만기 시 예상금액
  preferentialConditions: string; // 우대조건
  afterMaturityRate: string; // 만기후 이자율
  joinMethod: string;     // 가입방법
  targetCustomer: string; // 가입대상
  notes: string;          // 기타 유의사항
  maxLimit: number;       // 최고한도
  contactPerson: string;  // 공시담당자
  homepage: string;       // 홈페이지
  phone: string;          // 대표전화
}

// 모든 정기적금 데이터 통합
const allSavingsData = [
  ...newSavings,
  ...newSavingsPart2,
  ...newSavingsPart3,
  ...newSavingsPart4
];

// 중복 제거 함수
const removeDuplicates = (data: SavingsProduct[]): SavingsProduct[] => {
  const seen = new Set();
  return data.filter(item => {
    const key = `${item.bank}-${item.productName}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// 중복 제거된 정기적금 데이터
export const allSavings: SavingsProduct[] = removeDuplicates(allSavingsData); 