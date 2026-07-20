import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getSessionStatus, getTimeUntilExpiry } from '@/utils/sessionManager';
import { Clock, RefreshCw } from 'lucide-react';

interface SessionExpiryAlertProps {
  warningMinutes?: number; // 경고를 표시할 시간 (분)
}

const SessionExpiryAlert = ({ warningMinutes = 30 }: SessionExpiryAlertProps) => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshSession } = useAuth();

  useEffect(() => {
    const checkSessionStatus = () => {
      const status = getSessionStatus();
      const minutesLeft = getTimeUntilExpiry();
      
      if (status.isAuthenticated && minutesLeft <= warningMinutes && minutesLeft > 0) {
        setShowWarning(true);
        setTimeLeft(minutesLeft);
      } else {
        setShowWarning(false);
      }
    };

    // 초기 확인
    checkSessionStatus();

    // 1분마다 세션 상태 확인
    const interval = setInterval(checkSessionStatus, 60000);

    return () => clearInterval(interval);
  }, [warningMinutes]);

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshSession();
      if (success) {
        setShowWarning(false);
        // 성공 메시지 표시 (선택사항)
      } else {
        // 실패 시 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('세션 갱신 실패:', error);
      window.location.href = '/login';
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTimeLeft = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}시간 ${remainingMinutes}분`;
    }
    return `${minutes}분`;
  };

  if (!showWarning) return null;

  return (
    <Alert className="fixed top-4 right-4 w-80 z-50 bg-yellow-50 border-yellow-200">
      <Clock className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">세션이 곧 만료됩니다</p>
            <p className="text-sm mt-1">
              남은 시간: {formatTimeLeft(timeLeft)}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefreshSession}
            disabled={isRefreshing}
            className="ml-2"
          >
            {isRefreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            갱신
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SessionExpiryAlert; 