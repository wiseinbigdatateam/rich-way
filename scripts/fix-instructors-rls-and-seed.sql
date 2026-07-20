-- ============================================================
-- instructors RLS 공개 조회 허용 + 데이터 재입력
-- 원인: RLS 때문에 anon 키로 instructors SELECT 결과가 빈 배열이 됨
-- ============================================================

-- 1) RLS 정책 설정 (프론트 anon/authenticated 조회 허용)
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "instructors_select_public" ON public.instructors;
CREATE POLICY "instructors_select_public"
  ON public.instructors
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "instructors_insert_authenticated" ON public.instructors;
CREATE POLICY "instructors_insert_authenticated"
  ON public.instructors
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "instructors_update_authenticated" ON public.instructors;
CREATE POLICY "instructors_update_authenticated"
  ON public.instructors
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "instructors_delete_authenticated" ON public.instructors;
CREATE POLICY "instructors_delete_authenticated"
  ON public.instructors
  FOR DELETE
  TO authenticated
  USING (true);

-- 2) lectures instructors_user_id CR/LF 정리
UPDATE public.lectures
SET instructors_user_id = regexp_replace(trim(both E'\r\n\t ' FROM instructors_user_id), E'[\r\n]+', '', 'g')
WHERE instructors_user_id IS NOT NULL
  AND instructors_user_id <> regexp_replace(trim(both E'\r\n\t ' FROM instructors_user_id), E'[\r\n]+', '', 'g');

-- 3) instructors 데이터 upsert
INSERT INTO public.instructors (
  user_id,
  name,
  main_field,
  introduction,
  career,
  status
)
VALUES
  ('rmp1', '세력(강기태)', '가상자산',
   '<p>세력(강기태)</p>',
   '<p><strong>내용전문가</strong></p><p>세력(강기태)</p>',
   '사용'),
  ('rmp2', '오종윤', '재무설계',
   '<p>오종윤</p>',
   '<p><strong>내용전문가</strong></p><p>오종윤</p>',
   '사용'),
  ('rmp3', '차영주', '와이즈경제연구소 소장',
   '<p>차영주</p>',
   '<p><strong>소속</strong></p><p>와이즈경제연구소 소장</p>',
   '사용'),
  ('rmp4', '허명', '부동산 경매',
   '<p>허명</p>',
   '<p><strong>내용전문가</strong></p><p>허명</p>',
   '사용'),
  ('rmp5', '엄인수(CFA), 김용석', '주식투자 / 이러닝코리아대표',
   '<p>엄인수(CFA), 김용석</p>',
   '<p><strong>내용전문가</strong></p><p>엄인수(CFA), 김용석(이러닝코리아대표)</p>',
   '사용'),
  ('rmp6', '정운욱', '생활재테크',
   '<p>정운욱</p>',
   '<p><strong>내용전문가</strong></p><p>정운욱</p>',
   '사용'),
  ('rmp7', '양보석', '예능재테크',
   '<p>양보석</p>',
   '<p><strong>내용전문가</strong></p><p>양보석</p>',
   '사용')
ON CONFLICT (user_id) DO UPDATE
SET
  name = EXCLUDED.name,
  main_field = EXCLUDED.main_field,
  introduction = EXCLUDED.introduction,
  career = EXCLUDED.career,
  status = EXCLUDED.status,
  updated_at = now();

-- 4) 확인
SELECT user_id, name, main_field FROM public.instructors ORDER BY user_id;

SELECT
  l.title,
  l.instructors_user_id,
  i.name AS instructor_name,
  i.main_field,
  i.career
FROM public.lectures l
LEFT JOIN public.instructors i ON i.user_id = l.instructors_user_id
WHERE l.id = 'e73b157d-267e-4df2-97a9-4b402bbcf58f';
