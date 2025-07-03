import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Expert {
  id: string;
  user_id: string;
  expert_name: string;
  expert_type: string;
  license_number?: string;
  experience_years?: number;
  education?: string;
  certifications?: string[];
  introduction?: string;
  profile_image_url?: string;
  contact_email?: string;
  contact_phone?: string;
  hourly_rate?: number;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useExperts = (expertType?: string) => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      setError(null);

      // 타입 이슈 해결을 위해 기본 쿼리만 사용
      const { data, error } = await supabase
        .from('experts')
        .select('*');

      if (error) {
        console.error('전문가 데이터 조회 오류:', error);
        setError('전문가 데이터를 불러오는데 실패했습니다.');
        return;
      }

      // 필터링을 클라이언트 사이드에서 처리
      let filteredData = data || [];
      
      if (filteredData.length > 0) {
        filteredData = filteredData.filter((expert: any) => 
          expert.is_active === true && 
          expert.is_verified === true &&
          (!expertType || expert.expert_type === expertType)
        );
        
        // 생성일 기준 정렬
        filteredData.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      setExperts(filteredData);
    } catch (err) {
      console.error('전문가 데이터 조회 중 오류:', err);
      setError('전문가 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, [expertType]);

  return {
    experts,
    loading,
    error,
    refresh: fetchExperts
  };
}; 