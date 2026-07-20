-- ============================================================
-- instructors INSERT (내용전문가 이름/소속 + 아이디)
-- 조인 키: instructors.user_id = lectures.instructors_user_id
-- 크리에이터 UI: name, main_field, introduction, career
-- ============================================================

-- 0) RLS: anon/authenticated SELECT 허용 (없으면 프론트에서 빈 결과)
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "instructors_select_public" ON public.instructors;
CREATE POLICY "instructors_select_public"
  ON public.instructors
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- lectures 쪽 CR/LF 정리 (조인 실패 방지)
UPDATE public.lectures
SET instructors_user_id = trim(both E'\r\n\t ' FROM instructors_user_id)
WHERE instructors_user_id IS NOT NULL
  AND instructors_user_id <> trim(both E'\r\n\t ' FROM instructors_user_id);

INSERT INTO public.instructors (
  user_id,
  name,
  main_field,
  introduction,
  career,
  status
)
VALUES
  (
    'rmp1',
    '세력(강기태)',
    '가상자산',
    '<p>세력(강기태)</p>',
    '<p><strong>내용전문가</strong></p><p>세력(강기태)</p>',
    '사용'
  ),
  (
    'rmp2',
    '오종윤',
    '재무설계',
    '<p>오종윤</p>',
    '<p><strong>내용전문가</strong></p><p>오종윤</p>',
    '사용'
  ),
  (
    'rmp3',
    '차영주',
    '와이즈경제연구소 소장',
    '<p>차영주</p>',
    '<p><strong>소속</strong></p><p>와이즈경제연구소 소장</p>',
    '사용'
  ),
  (
    'rmp4',
    '허명',
    '부동산 경매',
    '<p>허명</p>',
    '<p><strong>내용전문가</strong></p><p>허명</p>',
    '사용'
  ),
  (
    'rmp5',
    '엄인수(CFA), 김용석',
    '주식투자 / 이러닝코리아대표',
    '<p>엄인수(CFA), 김용석</p>',
    '<p><strong>내용전문가</strong></p><p>엄인수(CFA), 김용석(이러닝코리아대표)</p>',
    '사용'
  ),
  (
    'rmp6',
    '정운욱',
    '생활재테크',
    '<p>정운욱</p>',
    '<p><strong>내용전문가</strong></p><p>정운욱</p>',
    '사용'
  ),
  (
    'rmp7',
    '양보석',
    '예능재테크',
    '<p>양보석</p>',
    '<p><strong>내용전문가</strong></p><p>양보석</p>',
    '사용'
  )
ON CONFLICT (user_id) DO UPDATE
SET
  name = EXCLUDED.name,
  main_field = EXCLUDED.main_field,
  introduction = EXCLUDED.introduction,
  career = EXCLUDED.career,
  status = EXCLUDED.status,
  updated_at = now();

-- 확인
SELECT user_id, name, main_field, status
FROM public.instructors
ORDER BY user_id;

-- 강의 ↔ 크리에이터 조인 확인 (instructor_name 이 NULL 이면 매칭 실패)
SELECT
  l.title,
  l.instructors_user_id,
  i.name AS instructor_name,
  i.main_field
FROM public.lectures l
LEFT JOIN public.instructors i
  ON i.user_id = trim(both E'\r\n\t ' FROM coalesce(l.instructors_user_id, ''))
ORDER BY i.user_id NULLS LAST, l.title;

-- 참고: 유대열(청울림) 은 아이디가 없어 INSERT에서 제외됨
