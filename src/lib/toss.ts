/** 토스페이먼츠 결제위젯 연동 키 (문서용 테스트 키 — 반드시 한 세트로 사용) */
// https://docs.tosspayments.com/blog/how-to-test-toss-payments
export const TOSS_CLIENT_KEY =
  import.meta.env.VITE_TOSS_CLIENT_KEY ||
  "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

export const TOSS_SECRET_KEY =
  import.meta.env.VITE_TOSS_SECRET_KEY ||
  "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

export function createOrderId(prefix = "lecture") {
  const uuid = crypto.randomUUID().replace(/-/g, "");
  return `${prefix}_${uuid}`.slice(0, 64);
}

export function getTossAuthHeader() {
  return `Basic ${btoa(`${TOSS_SECRET_KEY}:`)}`;
}

export async function confirmTossPayment(params: {
  paymentKey: string;
  orderId: string;
  amount: number;
}) {
  const res = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: getTossAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "결제 승인에 실패했습니다.");
  }
  return data;
}
