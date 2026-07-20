import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { confirmTossPayment } from "@/lib/toss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("결제를 확인하고 있습니다...");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amountParam = searchParams.get("amount");
    const lectureId = localStorage.getItem("lastLectureId");
    const memberUserId = localStorage.getItem("userId");
    const lectureName = localStorage.getItem("lastLectureName");
    const storedPrice = Number(localStorage.getItem("lastLecturePrice") || 0);
    const amount = Number(amountParam || storedPrice);

    if (!paymentKey || !orderId || !amount || !lectureId || !memberUserId || !lectureName) {
      setStatus("error");
      setMessage("필수 결제 정보가 누락되었습니다. 다시 시도해 주세요.");
      return;
    }

    if (storedPrice && amount !== storedPrice) {
      setStatus("error");
      setMessage("결제 금액이 일치하지 않습니다. 고객센터로 문의해 주세요.");
      return;
    }

    (async () => {
      try {
        // 1. 토스페이먼츠 결제 승인
        const payment = await confirmTossPayment({
          paymentKey,
          orderId,
          amount,
        });

        // 2. access_period 조회
        const { data: lectureData } = await supabase
          .from("lectures")
          .select("access_period")
          .eq("id", lectureId)
          .single();
        const accessPeriod = lectureData?.access_period ?? 30;

        // 3. 기존 수강권 연장 기준일
        const { data: prevApps } = await supabase
          .from("lecture_applications")
          .select("end_date")
          .eq("lecture_id", lectureId)
          .eq("member_user_id", memberUserId)
          .eq("status", "입금완료")
          .order("end_date", { ascending: false })
          .limit(1);

        let startDate: Date;
        if (prevApps && prevApps.length > 0 && prevApps[0].end_date) {
          const prevEnd = new Date(prevApps[0].end_date);
          prevEnd.setDate(prevEnd.getDate() + 1);
          startDate = prevEnd;
        } else {
          startDate = new Date();
        }
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + accessPeriod - 1);

        // 4. 수강 신청 저장
        const { error: insertError } = await supabase.from("lecture_applications").insert({
          lecture_id: lectureId,
          member_user_id: memberUserId,
          lecture_name: lectureName,
          price: amount,
          start_date: startDate.toISOString().slice(0, 10),
          end_date: endDate.toISOString().slice(0, 10),
          status: "입금완료",
          paid_at: new Date().toISOString(),
          payment_key: paymentKey,
          order_id: orderId,
          payment_method: payment?.method || null,
          receipt_url: payment?.receipt?.url || null,
          card_company: payment?.card?.company || payment?.card?.issuerCode || null,
          card_number: payment?.card?.number || null,
          easy_pay_provider: payment?.easyPay?.provider || null,
          virtual_account_info: payment?.virtualAccount
            ? JSON.stringify(payment.virtualAccount)
            : null,
          vat: payment?.vat || null,
        });

        if (insertError) {
          throw new Error(insertError.message);
        }

        localStorage.removeItem("lastLectureId");
        localStorage.removeItem("lastLectureName");
        localStorage.removeItem("lastLecturePrice");

        setStatus("success");
        setMessage("결제가 성공적으로 완료되었습니다!");
        setTimeout(() => {
          window.location.href = "/mypage?tab=education";
        }, 2000);
      } catch (e) {
        console.error(e);
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "결제 처리 중 오류가 발생했습니다.");
      }
    })();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-lg border p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-3">
            {status === "loading" && "결제 확인 중"}
            {status === "success" && "결제 완료"}
            {status === "error" && "결제 처리 실패"}
          </h1>
          <p className="text-gray-600 mb-6">{message}</p>
          {status === "success" && (
            <p className="text-sm text-gray-500 mb-4">잠시 후 내 강의실로 이동합니다.</p>
          )}
          {status === "error" && (
            <div className="flex flex-col gap-2">
              <Button asChild>
                <Link to="/education">강의 목록으로</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/mypage?tab=education">마이페이지</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
