-- ============================================================
-- 수강 테스트용 더미 데이터
-- member: 교육테스트 (1dfda7da-7dcd-42e3-a634-f56a9c75761c)
-- 기간: 2026-07-20 ~ 2027-07-20 / status: 입금완료
-- 대상: status = '사용' 인 모든 강의
-- ============================================================

-- (선택) 기존 테스트 수강권 삭제 후 재생성할 때 사용
-- DELETE FROM lecture_applications
-- WHERE member_user_id = '1dfda7da-7dcd-42e3-a634-f56a9c75761c';

INSERT INTO lecture_applications (
  lecture_id,
  member_user_id,
  lecture_name,
  price,
  start_date,
  end_date,
  applied_at,
  paid_at,
  status
)
SELECT
  l.id AS lecture_id,
  '1dfda7da-7dcd-42e3-a634-f56a9c75761c'::uuid AS member_user_id,
  l.title AS lecture_name,
  COALESCE(l.discount_price, l.price) AS price,
  '2026-07-20'::date AS start_date,
  '2027-07-20'::date AS end_date,
  NOW() AS applied_at,
  NOW() AS paid_at,
  '입금완료' AS status
FROM lectures l
WHERE l.status = '사용'
  AND NOT EXISTS (
    SELECT 1
    FROM lecture_applications a
    WHERE a.lecture_id = l.id
      AND a.member_user_id = '1dfda7da-7dcd-42e3-a634-f56a9c75761c'
      AND a.status = '입금완료'
  );

-- 결과 확인
SELECT
  a.id,
  a.lecture_name,
  a.price,
  a.start_date,
  a.end_date,
  a.status
FROM lecture_applications a
WHERE a.member_user_id = '1dfda7da-7dcd-42e3-a634-f56a9c75761c'
ORDER BY a.lecture_name;
