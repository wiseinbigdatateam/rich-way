import { supabase } from './supabase';

// 대시보드 통계 데이터 타입 정의
export interface DashboardStats {
  totalMembers: number;
  totalExperts: number;
  totalMbtiDiagnoses: number;
  totalFinanceDiagnoses: number;
  totalCoachingApplications: number;
  totalEducationApplications: number;
  memberGrowthRate: number;
  expertGrowthRate: number;
  mbtiGrowthRate: number;
  financeGrowthRate: number;
  coachingGrowthRate: number;
  educationGrowthRate: number;
}

// 차트 데이터 타입 정의
export interface ChartDataPoint {
  name: string;
  회원수: number;
  전문가: number;
  MBTI진단: number;
  재무진단: number;
  코칭신청: number;
  교육신청: number;
}

// 대시보드 서비스 클래스
export class AdminDashboardService {
  // 전체 통계 데이터 가져오기
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // 병렬로 모든 데이터 가져오기
      const [
        membersResult,
        expertsResult,
        mbtiDiagnosesResult,
        financeDiagnosesResult,
        coachingApplicationsResult,
        educationApplicationsResult,
        lastMonthMembersResult,
        lastMonthExpertsResult,
        lastMonthMbtiResult,
        lastMonthFinanceResult,
        lastMonthCoachingResult,
        lastMonthEducationResult
      ] = await Promise.all([
        // 현재 총 데이터
        this.getTotalMembers(),
        this.getTotalExperts(),
        this.getTotalMbtiDiagnoses(),
        this.getTotalFinanceDiagnoses(),
        this.getTotalCoachingApplications(),
        this.getTotalEducationApplications(),
        
        // 지난 달 데이터 (성장률 계산용)
        this.getLastMonthMembers(),
        this.getLastMonthExperts(),
        this.getLastMonthMbtiDiagnoses(),
        this.getLastMonthFinanceDiagnoses(),
        this.getLastMonthCoachingApplications(),
        this.getLastMonthEducationApplications()
      ]);

      return {
        totalMembers: membersResult,
        totalExperts: expertsResult,
        totalMbtiDiagnoses: mbtiDiagnosesResult,
        totalFinanceDiagnoses: financeDiagnosesResult,
        totalCoachingApplications: coachingApplicationsResult,
        totalEducationApplications: educationApplicationsResult,
        memberGrowthRate: this.calculateGrowthRate(lastMonthMembersResult, membersResult),
        expertGrowthRate: this.calculateGrowthRate(lastMonthExpertsResult, expertsResult),
        mbtiGrowthRate: this.calculateGrowthRate(lastMonthMbtiResult, mbtiDiagnosesResult),
        financeGrowthRate: this.calculateGrowthRate(lastMonthFinanceResult, financeDiagnosesResult),
        coachingGrowthRate: this.calculateGrowthRate(lastMonthCoachingResult, coachingApplicationsResult),
        educationGrowthRate: this.calculateGrowthRate(lastMonthEducationResult, educationApplicationsResult)
      };
    } catch (error) {
      console.error('대시보드 통계 데이터 가져오기 실패:', error);
      throw error;
    }
  }

  // 월별 차트 데이터 가져오기
  static async getMonthlyChartData(startDate?: Date, endDate?: Date): Promise<ChartDataPoint[]> {
    try {
      // 날짜 범위가 제공되지 않으면 최근 6개월 사용
      const currentDate = endDate || new Date();
      const sixMonthsAgo = startDate || new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);

      const [
        monthlyMembers,
        monthlyExperts,
        monthlyMbti,
        monthlyFinance,
        monthlyCoaching,
        monthlyEducation
      ] = await Promise.all([
        this.getMonthlyMembers(sixMonthsAgo, currentDate),
        this.getMonthlyExperts(sixMonthsAgo, currentDate),
        this.getMonthlyMbtiDiagnoses(sixMonthsAgo, currentDate),
        this.getMonthlyFinanceDiagnoses(sixMonthsAgo, currentDate),
        this.getMonthlyCoachingApplications(sixMonthsAgo, currentDate),
        this.getMonthlyEducationApplications(sixMonthsAgo, currentDate)
      ]);

      // 시작일과 종료일 사이의 월 수 계산
      const monthDiff = (currentDate.getFullYear() - sixMonthsAgo.getFullYear()) * 12 
        + currentDate.getMonth() - sixMonthsAgo.getMonth() + 1;
      
      // 동적으로 월 레이블 생성
      const months = Array.from({ length: Math.min(monthDiff, 12) }, (_, i) => {
        const date = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + i, 1);
        return `${date.getMonth() + 1}월`;
      });

      return months.map((month, index) => ({
        name: month,
        회원수: monthlyMembers[index] || 0,
        전문가: monthlyExperts[index] || 0,
        MBTI진단: monthlyMbti[index] || 0,
        재무진단: monthlyFinance[index] || 0,
        코칭신청: monthlyCoaching[index] || 0,
        교육신청: monthlyEducation[index] || 0
      }));
    } catch (error) {
      console.error('월별 차트 데이터 가져오기 실패:', error);
      throw error;
    }
  }

  // 일별 차트 데이터 가져오기
  static async getDailyChartData(startDate?: Date, endDate?: Date): Promise<ChartDataPoint[]> {
    try {
      // 날짜 범위가 제공되지 않으면 최근 7일 사용
      const currentDate = endDate || new Date();
      const sevenDaysAgo = startDate || new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6);

      const [
        dailyMembers,
        dailyExperts,
        dailyMbti,
        dailyFinance,
        dailyCoaching,
        dailyEducation
      ] = await Promise.all([
        this.getDailyMembers(sevenDaysAgo, currentDate),
        this.getDailyExperts(sevenDaysAgo, currentDate),
        this.getDailyMbtiDiagnoses(sevenDaysAgo, currentDate),
        this.getDailyFinanceDiagnoses(sevenDaysAgo, currentDate),
        this.getDailyCoachingApplications(sevenDaysAgo, currentDate),
        this.getDailyEducationApplications(sevenDaysAgo, currentDate)
      ]);

      // 시작일과 종료일 사이의 일 수 계산
      const dayDiff = Math.ceil((currentDate.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      // 동적으로 일 레이블 생성
      const days = Array.from({ length: Math.min(dayDiff, 31) }, (_, i) => {
        const date = new Date(sevenDaysAgo);
        date.setDate(sevenDaysAgo.getDate() + i);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      });

      return days.map((day, index) => ({
        name: day,
        회원수: dailyMembers[index] || 0,
        전문가: dailyExperts[index] || 0,
        MBTI진단: dailyMbti[index] || 0,
        재무진단: dailyFinance[index] || 0,
        코칭신청: dailyCoaching[index] || 0,
        교육신청: dailyEducation[index] || 0
      }));
    } catch (error) {
      console.error('일별 차트 데이터 가져오기 실패:', error);
      throw error;
    }
  }

  // 개별 데이터 가져오기 메서드들
  private static async getTotalMembers(): Promise<number> {
    const { count, error } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }

  private static async getTotalExperts(): Promise<number> {
    // status 필드의 실제 값을 확인하기 위해 먼저 조회
    const { data: allExperts, error: allError } = await supabase
      .from('experts')
      .select('status')
      .limit(5);
    
    if (!allError && allExperts) {
      console.log('🔍 전문가 status 값 샘플:', allExperts.map(e => e.status));
    }
    
    // 전체 전문가 수 카운트 (status 필터 없이)
    const { count, error } = await supabase
      .from('experts')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }

  private static async getTotalMbtiDiagnoses(): Promise<number> {
    // MBTI 진단 테이블에서 가져오기
    const { count, error } = await supabase
      .from('mbti_diagnosis')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.warn('MBTI 진단 데이터 테이블이 없습니다. 기본값 0을 반환합니다.');
      return 0;
    }
    return count || 0;
  }

  private static async getTotalFinanceDiagnoses(): Promise<number> {
    // 재무 진단 테이블에서 가져오기
    const { count, error } = await supabase
      .from('finance_diagnosis')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.warn('재무 진단 데이터 테이블이 없습니다. 기본값 0을 반환합니다.');
      return 0;
    }
    return count || 0;
  }

  private static async getTotalCoachingApplications(): Promise<number> {
    const { count, error } = await supabase
      .from('coaching_applications')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  }

  private static async getTotalEducationApplications(): Promise<number> {
    // 교육 신청 데이터는 현재 테이블이 없으므로 0 반환
    console.warn('교육 신청 데이터 테이블이 없습니다. 기본값 0을 반환합니다.');
    return 0;
  }

  // 지난 달 데이터 가져오기 메서드들
  private static async getLastMonthMembers(): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0, 0);
    
    const { count, error } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', lastMonth.toISOString());
    
    if (error) throw error;
    return count || 0;
  }

  private static async getLastMonthExperts(): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0, 0);
    
    const { count, error } = await supabase
      .from('experts')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', lastMonth.toISOString());
    
    if (error) throw error;
    return count || 0;
  }

  private static async getLastMonthMbtiDiagnoses(): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0, 0);
    
    const { count, error } = await supabase
      .from('mbti_diagnosis')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', lastMonth.toISOString());
    
    if (error) return 0;
    return count || 0;
  }

  private static async getLastMonthFinanceDiagnoses(): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0, 0);
    
    const { count, error } = await supabase
      .from('finance_diagnosis')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', lastMonth.toISOString());
    
    if (error) return 0;
    return count || 0;
  }

  private static async getLastMonthCoachingApplications(): Promise<number> {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    lastMonth.setDate(1);
    lastMonth.setHours(0, 0, 0, 0);
    
    const { count, error } = await supabase
      .from('coaching_applications')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', lastMonth.toISOString());
    
    if (error) throw error;
    return count || 0;
  }

  private static async getLastMonthEducationApplications(): Promise<number> {
    // 교육 신청 테이블이 없으므로 0 반환
    return 0;
  }

  // 월별 데이터 가져오기 메서드들
  private static async getMonthlyMembers(startDate: Date, endDate: Date): Promise<number[]> {
    // 시작일과 종료일 사이의 월 수 계산
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 
      + endDate.getMonth() - startDate.getMonth() + 1;
    const monthCount = Math.min(monthDiff, 12); // 최대 12개월
    
    const months = [];
    for (let i = 0; i < monthCount; i++) {
      const monthStart = new Date(startDate);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      
      const { count, error } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());
      
      if (error) throw error;
      months.push(count || 0);
    }
    return months;
  }

  private static async getMonthlyExperts(startDate: Date, endDate: Date): Promise<number[]> {
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 
      + endDate.getMonth() - startDate.getMonth() + 1;
    const monthCount = Math.min(monthDiff, 12);
    
    const months = [];
    for (let i = 0; i < monthCount; i++) {
      const monthStart = new Date(startDate);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      
      const { count, error } = await supabase
        .from('experts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());
      
      if (error) throw error;
      months.push(count || 0);
    }
    return months;
  }

  private static async getMonthlyMbtiDiagnoses(startDate: Date, endDate: Date): Promise<number[]> {
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 
      + endDate.getMonth() - startDate.getMonth() + 1;
    const monthCount = Math.min(monthDiff, 12);
    
    const months = [];
    for (let i = 0; i < monthCount; i++) {
      const monthStart = new Date(startDate);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      
      const { count, error } = await supabase
        .from('mbti_diagnosis')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());
      
      if (error) {
        months.push(0);
        continue;
      }
      months.push(count || 0);
    }
    return months;
  }

  private static async getMonthlyFinanceDiagnoses(startDate: Date, endDate: Date): Promise<number[]> {
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 
      + endDate.getMonth() - startDate.getMonth() + 1;
    const monthCount = Math.min(monthDiff, 12);
    
    const months = [];
    for (let i = 0; i < monthCount; i++) {
      const monthStart = new Date(startDate);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      
      const { count, error } = await supabase
        .from('finance_diagnosis')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());
      
      if (error) {
        months.push(0);
        continue;
      }
      months.push(count || 0);
    }
    return months;
  }

  private static async getMonthlyCoachingApplications(startDate: Date, endDate: Date): Promise<number[]> {
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 
      + endDate.getMonth() - startDate.getMonth() + 1;
    const monthCount = Math.min(monthDiff, 12);
    
    const months = [];
    for (let i = 0; i < monthCount; i++) {
      const monthStart = new Date(startDate);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      
      const { count, error } = await supabase
        .from('coaching_applications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());
      
      if (error) throw error;
      months.push(count || 0);
    }
    return months;
  }

  private static async getMonthlyEducationApplications(startDate: Date, endDate: Date): Promise<number[]> {
    // 교육 신청 테이블이 없으므로 0 반환
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 
      + endDate.getMonth() - startDate.getMonth() + 1;
    const monthCount = Math.min(monthDiff, 12);
    return new Array(monthCount).fill(0);
  }

  // 일별 데이터 가져오기 메서드들
  private static async getDailyMembers(startDate: Date, endDate: Date): Promise<number[]> {
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dayCount = Math.min(dayDiff, 31); // 최대 31일
    
    const days = [];
    for (let i = 0; i < dayCount; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const { count, error } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayStart.toISOString())
        .lte('created_at', dayEnd.toISOString());
      
      if (error) throw error;
      days.push(count || 0);
    }
    return days;
  }

  private static async getDailyExperts(startDate: Date, endDate: Date): Promise<number[]> {
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dayCount = Math.min(dayDiff, 31);
    
    const days = [];
    for (let i = 0; i < dayCount; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const { count, error } = await supabase
        .from('experts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayStart.toISOString())
        .lte('created_at', dayEnd.toISOString());
      
      if (error) throw error;
      days.push(count || 0);
    }
    return days;
  }

  private static async getDailyMbtiDiagnoses(startDate: Date, endDate: Date): Promise<number[]> {
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dayCount = Math.min(dayDiff, 31);
    
    const days = [];
    for (let i = 0; i < dayCount; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const { count, error } = await supabase
        .from('mbti_diagnosis')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayStart.toISOString())
        .lte('created_at', dayEnd.toISOString());
      
      if (error) {
        days.push(0);
        continue;
      }
      days.push(count || 0);
    }
    return days;
  }

  private static async getDailyFinanceDiagnoses(startDate: Date, endDate: Date): Promise<number[]> {
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dayCount = Math.min(dayDiff, 31);
    
    const days = [];
    for (let i = 0; i < dayCount; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const { count, error } = await supabase
        .from('finance_diagnosis')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayStart.toISOString())
        .lte('created_at', dayEnd.toISOString());
      
      if (error) {
        days.push(0);
        continue;
      }
      days.push(count || 0);
    }
    return days;
  }

  private static async getDailyCoachingApplications(startDate: Date, endDate: Date): Promise<number[]> {
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dayCount = Math.min(dayDiff, 31);
    
    const days = [];
    for (let i = 0; i < dayCount; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const { count, error } = await supabase
        .from('coaching_applications')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', dayStart.toISOString())
        .lte('created_at', dayEnd.toISOString());
      
      if (error) throw error;
      days.push(count || 0);
    }
    return days;
  }

  private static async getDailyEducationApplications(startDate: Date, endDate: Date): Promise<number[]> {
    // 교육 신청 테이블이 없으므로 0 반환
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const dayCount = Math.min(dayDiff, 31);
    return new Array(dayCount).fill(0);
  }

  // 성장률 계산 메서드
  private static calculateGrowthRate(lastMonth: number, current: number): number {
    if (lastMonth === 0) return current > 0 ? 100 : 0;
    return Number(((current - lastMonth) / lastMonth * 100).toFixed(1));
  }
}
