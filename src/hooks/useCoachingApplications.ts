import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface CoachingApplication {
  id: string;
  expert_user_id: string;
  member_user_id: string;
  title: string;
  content: string;
  method?: string;
  name: string;
  contact: string;
  email: string;
  attachment_url?: string;
  product_name: string;
  product_price: number;
  applied_at: string;
  paid_at?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface CoachingApplicationInput {
  expert_user_id: string;
  member_user_id: string;
  title: string;
  content: string;
  method?: string;
  name: string;
  contact: string;
  email: string;
  attachment_url?: string;
  product_name: string;
  product_price: number;
}

export const useCoachingApplications = (userId?: string) => {
  const [applications, setApplications] = useState<CoachingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('coaching_applications')
        .select('*');

      if (error) {
        console.error('코칭 신청 데이터 조회 오류:', error);
        setError('코칭 신청 데이터를 불러오는데 실패했습니다.');
        return;
      }

      // 필터링을 클라이언트 사이드에서 처리
      let filteredData = data || [];
      
      if (userId && filteredData.length > 0) {
        filteredData = filteredData.filter((app: any) => 
          app.member_user_id === userId || app.expert_user_id === userId
        );
      }
      
      // 신청일 기준 정렬
      filteredData.sort((a: any, b: any) => 
        new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
      );

      setApplications(filteredData);
    } catch (err) {
      console.error('코칭 신청 데이터 조회 중 오류:', err);
      setError('코칭 신청 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const createApplication = async (applicationData: CoachingApplicationInput) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('coaching_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        console.error('코칭 신청 생성 오류:', error);
        setError('코칭 신청에 실패했습니다.');
        return null;
      }

      // 새 신청이 생성되면 목록 새로고침
      await fetchApplications();
      
      return data;
    } catch (err) {
      console.error('코칭 신청 생성 중 오류:', err);
      setError('코칭 신청에 실패했습니다.');
      return null;
    }
  };

  const updateApplicationStatus = async (id: string, status: CoachingApplication['status']) => {
    try {
      setError(null);

      const updateData: any = { status };
      if (status === 'approved') {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('coaching_applications')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('코칭 신청 상태 업데이트 오류:', error);
        setError('상태 업데이트에 실패했습니다.');
        return false;
      }

      // 상태가 업데이트되면 목록 새로고침
      await fetchApplications();
      
      return true;
    } catch (err) {
      console.error('코칭 신청 상태 업데이트 중 오류:', err);
      setError('상태 업데이트에 실패했습니다.');
      return false;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [userId]);

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplicationStatus,
    refresh: fetchApplications
  };
}; 