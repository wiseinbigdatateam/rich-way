/**
 * 메모리 누수 방지 유틸리티 함수들
 * Heap 분석 결과를 바탕으로 이벤트 리스너와 타이머 정리를 위한 도구들
 */

// 이벤트 리스너 관리를 위한 클래스
export class EventListenerManager {
  private listeners: Array<{
    element: EventTarget;
    type: string;
    listener: EventListener;
    options?: boolean | AddEventListenerOptions;
  }> = [];

  // 이벤트 리스너 추가
  addEventListener(
    element: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ) {
    element.addEventListener(type, listener, options);
    this.listeners.push({ element, type, listener, options });
  }

  // 모든 이벤트 리스너 제거
  removeAllListeners() {
    this.listeners.forEach(({ element, type, listener, options }) => {
      try {
        element.removeEventListener(type, listener, options);
      } catch (error) {
        console.warn('이벤트 리스너 제거 중 오류:', error);
      }
    });
    this.listeners = [];
  }

  // 특정 타입의 이벤트 리스너만 제거
  removeListenersByType(type: string) {
    this.listeners = this.listeners.filter(({ element, type: listenerType, listener, options }) => {
      if (listenerType === type) {
        try {
          element.removeEventListener(listenerType, listener, options);
        } catch (error) {
          console.warn('이벤트 리스너 제거 중 오류:', error);
        }
        return false;
      }
      return true;
    });
  }
}

// 타이머 관리를 위한 클래스
export class TimerManager {
  private timers: Array<{
    id: number;
    type: 'timeout' | 'interval';
  }> = [];

  // setTimeout 래퍼
  setTimeout(callback: (...args: any[]) => void, delay: number, ...args: any[]) {
    const id = window.setTimeout(callback, delay, ...args);
    this.timers.push({ id, type: 'timeout' });
    return id;
  }

  // setInterval 래퍼
  setInterval(callback: (...args: any[]) => void, delay: number, ...args: any[]) {
    const id = window.setInterval(callback, delay, ...args);
    this.timers.push({ id, type: 'interval' });
    return id;
  }

  // 특정 타이머 제거
  clearTimer(id: number) {
    const timerIndex = this.timers.findIndex(timer => timer.id === id);
    if (timerIndex !== -1) {
      const timer = this.timers[timerIndex];
      if (timer.type === 'timeout') {
        window.clearTimeout(timer.id);
      } else {
        window.clearInterval(timer.id);
      }
      this.timers.splice(timerIndex, 1);
    }
  }

  // 모든 타이머 제거
  clearAllTimers() {
    this.timers.forEach(({ id, type }) => {
      try {
        if (type === 'timeout') {
          window.clearTimeout(id);
        } else {
          window.clearInterval(id);
        }
      } catch (error) {
        console.warn('타이머 제거 중 오류:', error);
      }
    });
    this.timers = [];
  }

  // 특정 타입의 타이머만 제거
  clearTimersByType(type: 'timeout' | 'interval') {
    this.timers = this.timers.filter(({ id, type: timerType }) => {
      if (timerType === type) {
        try {
          if (type === 'timeout') {
            window.clearTimeout(id);
          } else {
            window.clearInterval(id);
          }
        } catch (error) {
          console.warn('타이머 제거 중 오류:', error);
        }
        return false;
      }
      return true;
    });
  }
}

// 메모리 누수 방지를 위한 커스텀 훅
export const useMemoryLeakPrevention = () => {
  const eventManager = new EventListenerManager();
  const timerManager = new TimerManager();

  // 컴포넌트 언마운트 시 정리
  const cleanup = () => {
    eventManager.removeAllListeners();
    timerManager.clearAllTimers();
  };

  return {
    eventManager,
    timerManager,
    cleanup,
  };
};

// 안전한 이벤트 리스너 추가 함수
export const safeAddEventListener = (
  element: EventTarget,
  type: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions
) => {
  try {
    element.addEventListener(type, listener, options);
    return () => {
      try {
        element.removeEventListener(type, listener, options);
      } catch (error) {
        console.warn('이벤트 리스너 제거 중 오류:', error);
      }
    };
  } catch (error) {
    console.warn('이벤트 리스너 추가 중 오류:', error);
    return () => {};
  }
};

// 안전한 타이머 설정 함수
export const safeSetTimeout = (
  callback: (...args: any[]) => void,
  delay: number,
  ...args: any[]
) => {
  try {
    const id = window.setTimeout(callback, delay, ...args);
    return () => {
      try {
        window.clearTimeout(id);
      } catch (error) {
        console.warn('타이머 제거 중 오류:', error);
      }
    };
  } catch (error) {
    console.warn('타이머 설정 중 오류:', error);
    return () => {};
  }
};

export const safeSetInterval = (
  callback: (...args: any[]) => void,
  delay: number,
  ...args: any[]
) => {
  try {
    const id = window.setInterval(callback, delay, ...args);
    return () => {
      try {
        window.clearInterval(id);
      } catch (error) {
        console.warn('타이머 제거 중 오류:', error);
      }
    };
  } catch (error) {
    console.warn('타이머 설정 중 오류:', error);
    return () => {};
  }
};

// 메모리 사용량 모니터링 함수
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('메모리 사용량:', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
    });
  }
};

// 주기적 메모리 모니터링
export const startMemoryMonitoring = (intervalMs: number = 30000) => {
  const intervalId = setInterval(() => {
    monitorMemoryUsage();
  }, intervalMs);

  return () => {
    clearInterval(intervalId);
  };
}; 