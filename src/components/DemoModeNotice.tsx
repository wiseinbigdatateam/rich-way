import { useState } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { X, Info } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function DemoModeNotice() {
  const [isVisible, setIsVisible] = useState(!isSupabaseConfigured);

  if (!isVisible || isSupabaseConfigured) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <Alert className="bg-yellow-50 border-yellow-200">
        <Info className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="flex items-center justify-between">
          <div className="text-yellow-800">
            <strong>Demo 모드 활성화</strong><br />
            테스트 계정: kerow@hanmail.net / 1q2w3e$R
            <br />
            <span className="text-sm text-yellow-600">
              ✅ 모든 네트워크 오류가 자동 차단됩니다
            </span>
            <br />
            <span className="text-xs text-yellow-500">
              브라우저 콘솔 필터: -chrome-extension -ERR_FILE
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-yellow-600 hover:text-yellow-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
} 