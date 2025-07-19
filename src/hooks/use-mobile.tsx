import * as React from "react"
import { safeAddEventListener } from '@/utils/memoryLeakPrevention';

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const mqlRef = React.useRef<MediaQueryList | null>(null);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mqlRef.current = mql;
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // 안전한 이벤트 리스너 추가
    const removeListener = safeAddEventListener(mql, "change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    return () => {
      removeListener();
      mqlRef.current = null;
    }
  }, [])

  return !!isMobile
}
