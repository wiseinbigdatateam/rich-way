import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Notification {
  id: string;
  expert_user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  related_application_id?: string;
  created_at: string;
  updated_at: string;
}

export const useNotifications = (expertUserId?: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    if (!expertUserId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('expert_notifications')
        .select('*')
        .eq('expert_user_id', expertUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('알림 데이터 조회 오류:', error);
        setError('알림 데이터를 불러오는데 실패했습니다.');
        return;
      }

      setNotifications(data || []);
    } catch (err) {
      console.error('알림 데이터 조회 중 예외 발생:', err);
      setError('알림 데이터 조회 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('expert_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('알림 읽음 처리 오류:', error);
        throw new Error('알림 읽음 처리에 실패했습니다.');
      }

      // 로컬 상태 업데이트
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('알림 읽음 처리 중 예외 발생:', err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    if (!expertUserId) return;

    try {
      const { error } = await supabase
        .from('expert_notifications')
        .update({ is_read: true })
        .eq('expert_user_id', expertUserId)
        .eq('is_read', false);

      if (error) {
        console.error('모든 알림 읽음 처리 오류:', error);
        throw new Error('모든 알림 읽음 처리에 실패했습니다.');
      }

      // 로컬 상태 업데이트
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (err) {
      console.error('모든 알림 읽음 처리 중 예외 발생:', err);
      throw err;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('expert_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('알림 삭제 오류:', error);
        throw new Error('알림 삭제에 실패했습니다.');
      }

      // 로컬 상태 업데이트
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (err) {
      console.error('알림 삭제 중 예외 발생:', err);
      throw err;
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('expert_notifications')
        .insert([notification])
        .select()
        .single();

      if (error) {
        console.error('알림 생성 오류:', error);
        throw new Error('알림 생성에 실패했습니다.');
      }

      // 로컬 상태 업데이트
      setNotifications(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('알림 생성 중 예외 발생:', err);
      throw err;
    }
  };

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // 알림 타입별 개수
  const getNotificationStats = () => {
    const stats = {
      total: notifications.length,
      unread: unreadCount,
      info: notifications.filter(n => n.type === 'info').length,
      warning: notifications.filter(n => n.type === 'warning').length,
      success: notifications.filter(n => n.type === 'success').length,
      error: notifications.filter(n => n.type === 'error').length,
    };
    return stats;
  };

  useEffect(() => {
    fetchNotifications();
  }, [expertUserId]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    getNotificationStats,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  };
}; 