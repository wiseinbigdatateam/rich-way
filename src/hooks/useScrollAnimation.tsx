
import { useEffect, useRef, useState } from 'react';
import { safeAddEventListener } from '@/utils/memoryLeakPrevention';

export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // 이전 observer 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 새로운 observer 생성
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    observerRef.current = observer;

    // 요소 관찰 시작
    if (ref.current) {
      observer.observe(ref.current);
    }

    // cleanup 함수
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold]);

  return [ref, isVisible] as const;
};
