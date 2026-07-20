import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface CoachingApplication {
  id: string;
  title: string;
  expert_user_id: string;
  member_user: string;
  expert_name?: string;
  start_date: string;
  end_date: string;
  total_sessions: number;
  completed_sessions: number;
  status: string;
  hourly_rate: number;
  total_amount: number;
  created_at: string;
}

export interface CoachingSession {
  id: string;
  title: string;
  description: string;
  session_date: string;
  session_time: string;
  session_type: string;
  status: string;
  duration_minutes: number;
}

export interface CoachingReview {
  id: string;
  rating: number;
  review_text: string;
  created_at: string;
  expert_name?: string;
}

export interface CurrentCoaching {
  application: CoachingApplication;
  nextSession?: CoachingSession;
  progress: number;
}

export const useMyCoaching = (userId?: string) => {
  const [currentCoaching, setCurrentCoaching] = useState<CurrentCoaching | null>(null);
  const [coachingHistory, setCoachingHistory] = useState<CoachingApplication[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<CoachingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 임시로 test_user_001 사용 (DB에 저장된 데이터와 매칭)
    const actualUserId = 'test_user_001';
    
    if (!actualUserId) {
      setLoading(false);
      return;
    }

    const fetchCoachingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 코칭 데이터 조회 시작:', { actualUserId });

        // 1. 현재 진행 중인 코칭 가져오기
        const { data: currentData, error: currentError } = await supabase
          .from('coaching_applications')
          .select('*')
          .eq('member_user', actualUserId)
          .eq('status', '진행중')
          .single();

        console.log('📊 현재 코칭 데이터:', currentData);
        if (currentError && currentError.code !== 'PGRST116') {
          console.error('현재 코칭 조회 오류:', currentError);
        }

        // 2. 코칭 이력 가져오기 (완료된 코칭들)
        const { data: historyData, error: historyError } = await supabase
          .from('coaching_applications')
          .select('*')
          .eq('member_user', actualUserId)
          .eq('status', '진행완료')
          .order('created_at', { ascending: false });

        console.log('📊 코칭 이력 데이터:', historyData);
        if (historyError) {
          console.error('코칭 이력 조회 오류:', historyError);
        }

        // 2-1. 전문가 정보 가져오기 (별도 쿼리)
        const expertNames: { [key: string]: string } = {};
        if (currentData || (historyData && historyData.length > 0)) {
          const expertIds = [];
          if (currentData) expertIds.push(currentData.expert_user_id);
          if (historyData) {
            historyData.forEach(item => {
              if (!expertIds.includes(item.expert_user_id)) {
                expertIds.push(item.expert_user_id);
              }
            });
          }
          
          const { data: expertsData, error: expertsError } = await supabase
            .from('experts')
            .select('user_id, expert_name')
            .in('user_id', expertIds);
            
          if (expertsError) {
            console.error('전문가 정보 조회 오류:', expertsError);
          } else {
            expertsData?.forEach(expert => {
              expertNames[expert.user_id] = expert.expert_name;
            });
          }
        }

        // 3. 예정된 세션 가져오기
        let upcomingSessionsData: CoachingSession[] = [];
        if (currentData) {
          const { data: sessionsData, error: sessionsError } = await supabase
            .from('coaching_sessions')
            .select('*')
            .eq('application_id', currentData.id)
            .eq('status', 'scheduled')
            .gte('session_date', new Date().toISOString().split('T')[0])
            .order('session_date', { ascending: true })
            .order('session_time', { ascending: true });

          if (sessionsError) {
            console.error('세션 조회 오류:', sessionsError);
          } else {
            upcomingSessionsData = sessionsData || [];
          }
        }

        // 4. 데이터 처리
        if (currentData) {
          const progress = Math.round((currentData.completed_sessions / currentData.total_sessions) * 100);
          const nextSession = upcomingSessionsData.length > 0 ? upcomingSessionsData[0] : undefined;
          
          setCurrentCoaching({
            application: {
              ...currentData,
              expert_name: expertNames[currentData.expert_user_id] || '알 수 없음'
            },
            nextSession,
            progress
          });
        }

        setCoachingHistory(historyData?.map(item => ({
          ...item,
          expert_name: expertNames[item.expert_user_id] || '알 수 없음'
        })) || []);

        setUpcomingSessions(upcomingSessionsData);

      } catch (err) {
        console.error('코칭 데이터 조회 오류:', err);
        setError('코칭 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoachingData();
  }, [userId]);

  return {
    currentCoaching,
    coachingHistory,
    upcomingSessions,
    loading,
    error
  };
}; 