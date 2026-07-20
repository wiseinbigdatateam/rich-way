import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { TOSS_CLIENT_KEY, createOrderId } from "@/lib/toss";
import MembersLoginDialog from "@/components/MembersLoginDialog";

const CheckoutPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [lecture, setLecture] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const widgetsRef = useRef<any>(null);
  const paymentMethodWidgetRef = useRef<any>(null);
  const agreementWidgetRef = useRef<any>(null);
  const initLockRef = useRef(false);

  const amount = Number(lecture?.discount_price || lecture?.price || 0);
  const memberId = user?.id || "";

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setShowLogin(true);
      setLoading(false);
      return;
    }

    const fetchLecture = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("lectures")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError || !data) {
        setError("강의 정보를 찾을 수 없습니다.");
        setLoading(false);
        return;
      }

      setLecture(data);
      setLoading(false);
    };

    fetchLecture();
  }, [id, isAuthenticated, authLoading]);

  useEffect(() => {
    if (!lecture || !memberId || amount <= 0) return;
    if (initLockRef.current) return;

    let cancelled = false;
    initLockRef.current = true;

    const destroyWidgets = async () => {
      try {
        await agreementWidgetRef.current?.destroy?.();
      } catch {
        // ignore
      }
      try {
        await paymentMethodWidgetRef.current?.destroy?.();
      } catch {
        // ignore
      }
      agreementWidgetRef.current = null;
      paymentMethodWidgetRef.current = null;
      widgetsRef.current = null;
    };

    const initWidgets = async () => {
      try {
        setReady(false);
        await destroyWidgets();

        // 약관/결제 UI DOM 초기화 (중복 마운트 방지)
        const paymentEl = document.querySelector("#payment-method");
        const agreementEl = document.querySelector("#agreement");
        if (paymentEl) paymentEl.innerHTML = "";
        if (agreementEl) agreementEl.innerHTML = "";

        const customerKey = memberId.replace(/[^a-zA-Z0-9\-_=.]/g, "").slice(0, 50);
        if (!customerKey || customerKey.length < 2) {
          setError("로그인 정보가 올바르지 않습니다. 다시 로그인해 주세요.");
          initLockRef.current = false;
          return;
        }

        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        if (cancelled) return;

        const widgets = tossPayments.widgets({ customerKey });
        widgetsRef.current = widgets;

        await widgets.setAmount({ currency: "KRW", value: amount });
        if (cancelled) return;

        // 결제수단 → 약관 순서로 한 번씩만 렌더 (병렬 중복 호출 금지)
        paymentMethodWidgetRef.current = await widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        });
        if (cancelled) {
          await destroyWidgets();
          return;
        }

        agreementWidgetRef.current = await widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        });
        if (cancelled) {
          await destroyWidgets();
          return;
        }

        setReady(true);
        setError(null);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "결제 위젯을 불러오지 못했습니다.");
          initLockRef.current = false;
        }
      }
    };

    initWidgets();

    return () => {
      cancelled = true;
      initLockRef.current = false;
      destroyWidgets();
    };
  }, [lecture?.id, memberId, amount]);

  const handlePayment = async () => {
    if (!widgetsRef.current || !lecture || !user) return;

    setPaying(true);
    setError(null);

    try {
      const orderId = createOrderId("lecture");

      localStorage.setItem("lastLectureId", lecture.id);
      localStorage.setItem("lastLectureName", lecture.title);
      localStorage.setItem("lastLecturePrice", String(amount));
      localStorage.setItem("userId", memberId);

      await widgetsRef.current.requestPayment({
        orderId,
        orderName: lecture.title,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: user.email,
        customerName: user.name,
      });
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "결제 요청에 실패했습니다.");
      setPaying(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        결제 준비 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <button
          type="button"
          onClick={() => navigate(`/education/${id}`)}
          className="text-sm text-gray-500 hover:text-gray-800 mb-6"
        >
          ← 강의로 돌아가기
        </button>

        <h1 className="text-2xl font-bold mb-2">강의 결제</h1>
        <p className="text-gray-600 mb-8">결제 수단을 선택한 뒤 결제를 진행해 주세요.</p>

        {lecture && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">구매 강의</p>
                <h2 className="text-lg font-semibold">{lecture.title}</h2>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-gray-500 mb-1">결제 금액</p>
                <p className="text-2xl font-bold text-blue-600">
                  {amount.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div id="payment-method" />
          <div id="agreement" />
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            size="lg"
            disabled={!ready || paying || amount <= 0 || !isAuthenticated}
            onClick={handlePayment}
          >
            {paying ? "결제창 여는 중..." : `${amount.toLocaleString()}원 결제하기`}
          </Button>
        </div>
      </main>
      <Footer />

      <MembersLoginDialog
        open={showLogin}
        onOpenChange={(open) => {
          setShowLogin(open);
          if (!open && !isAuthenticated) {
            navigate(`/education/${id}`);
          }
        }}
        onLoginSuccess={() => {
          setShowLogin(false);
        }}
      />
    </div>
  );
};

export default CheckoutPage;
