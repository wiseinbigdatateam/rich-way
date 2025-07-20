import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Expert {
  id: string;
  user_id: string;
  expert_name: string;
  main_field: string; // expert_type 대신 main_field 사용
  company_name?: string;
  email: string;
  profile_image_url?: string;
  company_phone?: string;
  personal_phone?: string;
  tags?: string[];
  core_intro?: string;
  youtube_channel_url?: string;
  intro_video_url?: string;
  press_url?: string;
  education_and_certifications?: string;
  career?: string;
  achievements?: string;
  expertise_detail?: string;
  experience_years?: number;
  status: string;
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

      // 활성 상태인 전문가만 조회
      let query = supabase
        .from('experts')
        .select('*');

      // 상태 필터링
      query = query.eq('status', '활성');

      const { data, error } = await query;

      if (error) {
        console.error('전문가 데이터 조회 오류:', error);
        setError('전문가 데이터를 불러오는데 실패했습니다.');
        return;
      }

      // 필터링을 클라이언트 사이드에서 처리
      let filteredData = data || [];
      
      if (filteredData.length > 0) {
        // 전문 분야별 필터링 (expertType이 main_field와 일치하는 경우)
        if (expertType) {
          filteredData = filteredData.filter((expert: any) => 
            expert.main_field === expertType
          );
        }
        
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