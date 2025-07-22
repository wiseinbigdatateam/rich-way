
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, UserCheck } from "lucide-react";

const ExpertLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 실제 데이터베이스에서 전문가 계정 확인
      const { data, error } = await supabase
        .from('experts')
        .select('*');

      if (error) {
        setError("데이터베이스 연결 오류가 발생했습니다.");
        setIsLoading(false);
        return;
      }

      // 클라이언트 사이드에서 로그인 검증
      const expert = data?.find((expert: any) => 
        expert.user_id === formData.username && 
        expert.password === formData.password && 
        expert.status === '활성'
      );

      if (!expert) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        setIsLoading(false);
        return;
      }

      // 전문가 로그인 성공
      localStorage.setItem("expertAuth", "true");
      localStorage.setItem("expertInfo", JSON.stringify({
        user_id: expert.user_id,
        name: expert.expert_name,
        specialty: expert.main_field,
        company: expert.company_name,
        avatar: expert.profile_image_url || null
      }));
      
      navigate("/expert");
    } catch (err) {
      console.error('로그인 중 오류:', err);
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">전문가 로그인</CardTitle>
          <CardDescription>
            전문가 계정으로 로그인하여 상담 관리를 시작하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="전문가 아이디를 입력하세요"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto"
                onClick={() => navigate("/expert/register")}
              >
                전문가 등록 신청
              </Button>
            </p>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">테스트 계정:</p>
              <p className="text-xs text-gray-600">아이디: expert14 / 비밀번호: expert14</p>
              <p className="text-xs text-gray-600">아이디: expert13 / 비밀번호: expert13</p>
              <p className="text-xs text-gray-600">아이디: expert12 / 비밀번호: expert12</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertLoginPage;
