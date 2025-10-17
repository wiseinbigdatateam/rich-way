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
  static async getMonthlyChartData(): Promise<ChartDataPoint[]> {
    try {
      const currentDate = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

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

      // 월별 데이터를 합쳐서 차트 데이터 생성
      const months = ['1월', '2월', '3월', '4월', '5월', '6월'];
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
  static async getDailyChartData(): Promise<ChartDataPoint[]> {
    try {
      const currentDate = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(currentDate.getDate() - 6);

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

      // 일별 데이터를 합쳐서 차트 데이터 생성
      const days = ['1일', '2일', '3일', '4일', '5일', '6일', '7일'];
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
    const { count, error } = await supabase
      .from('experts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
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
      .eq('status', 'active')
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
    // 6개월간의 월별 회원 수 데이터 생성
    const months = [];
    for (let i = 0; i < 6; i++) {
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
    const months = [];
    for (let i = 0; i < 6; i++) {
      const monthStart = new Date(startDate);
      monthStart.setMonth(monthStart.getMonth() + i);
      monthStart.setDate(1);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0);
      
      const { count, error } = await supabase
        .from('experts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .gte('created_at', monthStart.toISOString())
        .lte('created_at', monthEnd.toISOString());
      
      if (error) throw error;
      months.push(count || 0);
    }
    return months;
  }

  private static async getMonthlyMbtiDiagnoses(startDate: Date, endDate: Date): Promise<number[]> {
    const months = [];
    for (let i = 0; i < 6; i++) {
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
    const months = [];
    for (let i = 0; i < 6; i++) {
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
    const months = [];
    for (let i = 0; i < 6; i++) {
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
    return new Array(6).fill(0);
  }

  // 일별 데이터 가져오기 메서드들
  private static async getDailyMembers(startDate: Date, endDate: Date): Promise<number[]> {
    const days = [];
    for (let i = 0; i < 7; i++) {
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
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(dayStart.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const { count, error } = await supabase
        .from('experts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')
        .gte('created_at', dayStart.toISOString())
        .lte('created_at', dayEnd.toISOString());
      
      if (error) throw error;
      days.push(count || 0);
    }
    return days;
  }

  private static async getDailyMbtiDiagnoses(startDate: Date, endDate: Date): Promise<number[]> {
    const days = [];
    for (let i = 0; i < 7; i++) {
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
    const days = [];
    for (let i = 0; i < 7; i++) {
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
    const days = [];
    for (let i = 0; i < 7; i++) {
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
    return new Array(7).fill(0);
  }

  // 성장률 계산 메서드
  private static calculateGrowthRate(lastMonth: number, current: number): number {
    if (lastMonth === 0) return current > 0 ? 100 : 0;
    return Number(((current - lastMonth) / lastMonth * 100).toFixed(1));
  }
}
