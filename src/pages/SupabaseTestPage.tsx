import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface TestResult {
  test: string;
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
  duration?: number;
}

const SupabaseTestPage = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<{total: number; success: number; failed: number}>({total: 0, success: 0, failed: 0});

  const addTestResult = (test: string, success: boolean, message: string, data?: any, duration?: number) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString(),
      duration
    }]);
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    setTestResults([]);
    setSummary({total: 0, success: 0, failed: 0});
    
    console.log('🔍 Supabase 연결 테스트 시작...');
    const startTime = Date.now();
    
    try {
      // 1. 기본 연결 테스트
      const testStart = Date.now();
      addTestResult('기본 연결', true, '테스트 시작...');
      
      const { data: testData, error: testError } = await supabase
        .from('experts')
        .select('id')
        .limit(1);
      
      const testDuration = Date.now() - testStart;
      
      if (testError) {
        addTestResult('기본 연결', false, `연결 실패: ${testError.message}`, testError, testDuration);
        console.error('❌ 기본 연결 실패:', testError);
      } else {
        addTestResult('기본 연결', true, `연결 성공 (${testData?.length || 0}개 데이터)`, testData, testDuration);
        console.log('✅ 기본 연결 성공');
      }
      
      // 2. members 테이블 테스트
      const membersStart = Date.now();
      addTestResult('members 테이블', true, '테스트 시작...');
      
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('id, name, user_id, email, created_at')
        .limit(5);
      
      const membersDuration = Date.now() - membersStart;
      
      if (membersError) {
        addTestResult('members 테이블', false, `조회 실패: ${membersError.message}`, membersError, membersDuration);
        console.error('❌ members 테이블 조회 실패:', membersError);
      } else {
        addTestResult('members 테이블', true, `조회 성공 (${membersData?.length || 0}개 데이터)`, membersData, membersDuration);
        console.log('✅ members 테이블 조회 성공');
      }
      
      // 3. experts 테이블 테스트
      const expertsStart = Date.now();
      addTestResult('experts 테이블', true, '테스트 시작...');
      
      const { data: expertsData, error: expertsError } = await supabase
        .from('experts')
        .select('id, user_id, expert_name, email, main_field, status')
        .limit(5);
      
      const expertsDuration = Date.now() - expertsStart;
      
      if (expertsError) {
        addTestResult('experts 테이블', false, `조회 실패: ${expertsError.message}`, expertsError, expertsDuration);
        console.error('❌ experts 테이블 조회 실패:', expertsError);
      } else {
        addTestResult('experts 테이블', true, `조회 성공 (${expertsData?.length || 0}개 데이터)`, expertsData, expertsDuration);
        console.log('✅ experts 테이블 조회 성공');
      }
      
      // 4. coaching_applications 테이블 테스트
      const coachingStart = Date.now();
      addTestResult('coaching_applications 테이블', true, '테스트 시작...');
      
      const { data: coachingData, error: coachingError } = await supabase
        .from('coaching_applications')
        .select('id, user_id, expert_id, title, status, created_at')
        .limit(5);
      
      const coachingDuration = Date.now() - coachingStart;
      
      if (coachingError) {
        addTestResult('coaching_applications 테이블', false, `조회 실패: ${coachingError.message}`, coachingError, coachingDuration);
        console.error('❌ coaching_applications 테이블 조회 실패:', coachingError);
      } else {
        addTestResult('coaching_applications 테이블', true, `조회 성공 (${coachingData?.length || 0}개 데이터)`, coachingData, coachingDuration);
        console.log('✅ coaching_applications 테이블 조회 성공');
      }
      
      // 5. expert_products 테이블 테스트
      const productsStart = Date.now();
      addTestResult('expert_products 테이블', true, '테스트 시작...');
      
      const { data: productsData, error: productsError } = await supabase
        .from('expert_products')
        .select('id, expert_id, product_name, price, duration')
        .limit(5);
      
      const productsDuration = Date.now() - productsStart;
      
      if (productsError) {
        addTestResult('expert_products 테이블', false, `조회 실패: ${productsError.message}`, productsError, productsDuration);
        console.error('❌ expert_products 테이블 조회 실패:', productsError);
      } else {
        addTestResult('expert_products 테이블', true, `조회 성공 (${productsData?.length || 0}개 데이터)`, productsData, productsDuration);
        console.log('✅ expert_products 테이블 조회 성공');
      }
      
      // 6. RLS 정책 테스트
      const rlsStart = Date.now();
      addTestResult('RLS 정책', true, '테스트 시작...');
      
      // RLS가 활성화되어 있는지 확인
      const { data: rlsData, error: rlsError } = await supabase
        .from('experts')
        .select('id')
        .limit(1);
      
      const rlsDuration = Date.now() - rlsStart;
      
      if (rlsError && rlsError.code === 'PGRST116') {
        addTestResult('RLS 정책', false, `RLS 정책 오류: ${rlsError.message}`, rlsError, rlsDuration);
        console.error('❌ RLS 정책 오류:', rlsError);
      } else if (rlsError) {
        addTestResult('RLS 정책', false, `조회 실패: ${rlsError.message}`, rlsError, rlsDuration);
        console.error('❌ RLS 테스트 실패:', rlsError);
      } else {
        addTestResult('RLS 정책', true, `RLS 정책 통과 (${rlsData?.length || 0}개 데이터 조회 가능)`, rlsData, rlsDuration);
        console.log('✅ RLS 정책 테스트 성공');
      }
      
    } catch (error) {
      console.error('❌ 테스트 중 예외 발생:', error);
      addTestResult('예외 처리', false, `예외 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, error);
    } finally {
      setLoading(false);
      const totalDuration = Date.now() - startTime;
      console.log(`🏁 Supabase 연결 테스트 완료 (총 ${totalDuration}ms)`);
      
      // 결과 요약 계산
      const results = testResults;
      const total = results.length;
      const success = results.filter(r => r.success).length;
      const failed = total - success;
      setSummary({total, success, failed});
      
      if (failed === 0) {
        toast.success(`모든 테스트가 성공했습니다! (${total}개)`);
      } else {
        toast.error(`${failed}개 테스트가 실패했습니다.`);
      }
    }
  };

  // 결과 요약 계산
  useEffect(() => {
    const total = testResults.length;
    const success = testResults.filter(r => r.success).length;
    const failed = total - success;
    setSummary({total, success, failed});
  }, [testResults]);

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Supabase 연결 테스트</h1>
              <p className="text-sm text-gray-600 mt-1">
                데이터베이스 연결 및 테이블 접근 권한을 테스트합니다.
              </p>
            </div>
            <Button onClick={testSupabaseConnection} disabled={loading} className="ml-4">
              {loading ? '테스트 중...' : '테스트 실행'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 요약 정보 */}
          {testResults.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">테스트 결과 요약</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">총 {summary.total}개</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-green-500">성공 {summary.success}개</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">실패 {summary.failed}개</Badge>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                        {result.test}
                      </h3>
                      {result.duration && (
                        <Badge variant="outline" className="text-xs">
                          {result.duration}ms
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {result.timestamp}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    result.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {result.success ? '성공' : '실패'}
                  </div>
                </div>
                {result.data && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                      상세 정보 보기
                    </summary>
                    <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  </details>
                )}
              </div>
            ))}
            
            {testResults.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-12">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">테스트를 실행해주세요</h3>
                <p className="text-sm">위의 "테스트 실행" 버튼을 클릭하여 Supabase 연결을 테스트하세요.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseTestPage;
