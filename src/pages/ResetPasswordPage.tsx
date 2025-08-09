import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // URL에서 토큰 확인 (커스텀 토큰 시스템)
  const token = searchParams.get('token');
  const urlEmail = searchParams.get('email');

  useEffect(() => {
    // 토큰이 없으면 오류 표시
    if (!token) {
      setError('유효하지 않은 비밀번호 재설정 링크입니다.');
      return;
    }

    // 토큰 유효성 검증 (24시간 이내인지 확인)
    const tokenTimestamp = parseInt(token);
    const now = Date.now();
    const tokenAge = now - tokenTimestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24시간

    if (isNaN(tokenTimestamp) || tokenAge > maxAge) {
      setError('비밀번호 재설정 링크가 만료되었습니다. 새로운 링크를 요청해주세요.');
      return;
    }

    console.log('✅ 토큰 유효성 확인 완료');
  }, [token]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 기본 검증
    const targetEmail = urlEmail || email;
    
    if (!targetEmail) {
      setError('이메일을 입력해주세요.');
      setLoading(false);
      return;
    }
    
    if (!password || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      // URL에서 이메일 가져오기 또는 사용자 입력 이메일 사용
      const targetEmail = urlEmail || email;
      
      if (!targetEmail) {
        setError('이메일을 입력해주세요.');
        return;
      }

      // members 테이블에서 해당 이메일의 사용자 확인
      const { data: userData, error: userError } = await (supabase as any)
        .from('members')
        .select('email, name')
        .eq('email', targetEmail)
        .single();

      if (userError || !userData) {
        console.error('사용자 조회 오류:', userError);
        setError('사용자 정보를 찾을 수 없습니다. 비밀번호 찾기를 다시 시도해주세요.');
        return;
      }

      // 비밀번호 업데이트
      const { data, error } = await (supabase as any)
        .from('members')
        .update({ 
          password: password,
          updated_at: new Date().toISOString()
        })
        .eq('email', targetEmail)
        .select();

      if (error) {
        console.error('비밀번호 업데이트 오류:', error);
        setError('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        return;
      }

      console.log('✅ 비밀번호 업데이트 성공:', data);
      
      // 성공 처리
      setSuccess(true);
      toast({
        title: "✅ 비밀번호 변경 완료",
        description: "비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해주세요.",
      });

      // 3초 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error('비밀번호 재설정 중 오류:', err);
      setError('비밀번호 재설정 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">
              ✅ 비밀번호 변경 완료
            </CardTitle>
            <CardDescription>
              비밀번호가 성공적으로 변경되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4">
              <AlertDescription>
                새로운 비밀번호로 로그인해주세요. 잠시 후 로그인 페이지로 이동합니다.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleBackToLogin} 
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              로그인 페이지로 이동
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            비밀번호 재설정
          </CardTitle>
          <CardDescription className="text-center">
            새로운 비밀번호를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handlePasswordReset} className="space-y-4">
            {/* URL에 이메일이 없을 때만 이메일 입력 필드 표시 */}
            {!urlEmail && (
              <div className="space-y-2">
                <Label htmlFor="email">이메일 주소</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="비밀번호를 변경할 이메일을 입력하세요"
                  required
                  disabled={loading}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">새 비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  required
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  비밀번호 변경 중...
                </>
              ) : (
                "비밀번호 변경"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              onClick={handleBackToLogin}
              variant="ghost"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              로그인 페이지로 돌아가기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage; 