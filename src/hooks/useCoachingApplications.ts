import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface CoachingApplication {
  id: string; // uuid
  expert_user_id: string;
  member_user_id: string;
  title: string;
  content: string;
  method: '전화' | '화상' | '방문' | '메시지';
  name: string;
  contact: string;
  email: string;
  attachment_url?: string;
  product_name: string;
  product_price: number;
  applied_at: string;
  paid_at?: string;
  status: '접수' | '진행중' | '진행완료';
  created_at: string;
  updated_at: string;
  expert_profile_image_url?: string; // 전문가 프로필 이미지 URL 추가
}

export interface CoachingHistory {
  id: string; // uuid
  application_id: string; // uuid
  title: string;
  content: string;
  status: '접수' | '진행중' | '진행완료';
  created_at: string;
}

export const useCoachingApplications = (expertId?: string) => {
  const [applications, setApplications] = useState<CoachingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('coaching_applications')
        .select(`
          *,
          experts!fk_coaching_applications_expert_user_id (
            profile_image_url
          )
        `);

      if (error) {
        console.error('코칭 신청 데이터 조회 오류:', error);
        setError('코칭 신청 데이터를 불러오는데 실패했습니다.');
        return;
      }

      // 클라이언트 사이드에서 필터링 및 데이터 처리
      let filteredData = data || [];
      
      if (expertId && filteredData.length > 0) {
        filteredData = filteredData.filter((app: any) => 
          app.expert_user_id === expertId
        );
      }

      // 조인된 데이터 처리
      const processedData = filteredData.map((app: any) => ({
        ...app,
        expert_profile_image_url: app.experts?.profile_image_url || null
      }));

      // 신청일 기준 정렬
      processedData.sort((a: any, b: any) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setApplications(processedData);
    } catch (err) {
      console.error('코칭 신청 데이터 조회 중 예외 발생:', err);
      setError('코칭 신청 데이터 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: '접수' | '진행중' | '진행완료') => {
    try {
      // 실제 DB 업데이트
      const { error } = await supabase
        .from('coaching_applications')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', applicationId);

      if (error) {
        console.error('상태 업데이트 오류:', error);
        throw new Error('상태 업데이트에 실패했습니다.');
      }

      // 로컬 상태 업데이트
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId
            ? { ...app, status, updated_at: new Date().toISOString() }
            : app
        )
      );

      return true;
    } catch (err) {
      console.error('상태 업데이트 중 예외 발생:', err);
      throw err;
    }
  };

  const addCoachingHistory = async (applicationId: string, title: string, content: string, status: '접수' | '진행중' | '진행완료') => {
    try {
      const { error } = await supabase
        .from('coaching_history')
        .insert({
          application_id: applicationId,
          title,
          content,
          status,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('히스토리 추가 오류:', error);
        throw new Error('히스토리 추가에 실패했습니다.');
      }

      return true;
    } catch (err) {
      console.error('히스토리 추가 중 예외 발생:', err);
      throw err;
    }
  };

  const getCoachingHistory = async (applicationId: string): Promise<CoachingHistory[]> => {
    try {
      const { data, error } = await supabase
        .from('coaching_history')
        .select('*');

      if (error) {
        console.error('히스토리 조회 오류:', error);
        throw new Error('히스토리 조회에 실패했습니다.');
      }

      // 클라이언트 사이드에서 필터링
      let filteredData = data || [];
      
      if (filteredData.length > 0) {
        filteredData = filteredData.filter((history: any) => 
          history.application_id === applicationId
        );
      }

      // 날짜 기준 정렬
      filteredData.sort((a: any, b: any) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );

      return filteredData;
    } catch (err) {
      console.error('히스토리 조회 중 예외 발생:', err);
      throw err;
    }
  };

  const getApplicationStats = () => {
    const 접수 = applications.filter(app => app.status === '접수').length;
    const 진행중 = applications.filter(app => app.status === '진행중').length;
    const 진행완료 = applications.filter(app => app.status === '진행완료').length;
    
    const 내수익 = applications
      .filter(app => app.status === '진행완료')
      .reduce((total, app) => {
        // product_price 필드를 직접 사용
        return total + (app.product_price || 0);
      }, 0);

    return { 접수, 진행중, 진행완료, 내수익 };
  };

  useEffect(() => {
    fetchApplications();
  }, [expertId]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    updateApplicationStatus,
    addCoachingHistory,
    getCoachingHistory,
    getApplicationStats
  };
}; 