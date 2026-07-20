import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function FailPage() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const message = searchParams.get("message") || "결제에 실패했습니다.";
  const orderId = searchParams.get("orderId");
  const lectureId = localStorage.getItem("lastLectureId");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-lg border p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-3">결제 실패</h1>
          <p className="text-gray-600 mb-2">{message}</p>
          {code && <p className="text-sm text-gray-400 mb-1">코드: {code}</p>}
          {orderId && <p className="text-sm text-gray-400 mb-6">주문번호: {orderId}</p>}
          <div className="flex flex-col gap-2 mt-6">
            {lectureId && (
              <Button asChild>
                <Link to={`/education/${lectureId}/checkout`}>다시 결제하기</Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to={lectureId ? `/education/${lectureId}` : "/education"}>
                강의로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
