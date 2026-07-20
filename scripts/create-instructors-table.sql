-- ============================================================
-- instructors 테이블 재생성
-- 조인: lectures.instructors_user_id = instructors.user_id
-- 크리에이터 UI 사용 필드: name, main_field, introduction, career
-- ============================================================

-- 기존 테이블이 있으면 삭제 (주의: 데이터 삭제됨)
DROP TABLE IF EXISTS public.instructors CASCADE;

CREATE TABLE public.instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- lectures.instructors_user_id 와 매칭되는 키 (예: rmp1, rmp2 ...)
  user_id text NOT NULL,

  -- 크리에이터/강사 표시 정보
  name text NOT NULL,
  main_field text NULL,          -- 전문 분야
  introduction text NULL,        -- 소개 (HTML 가능)
  career text NULL,              -- 이력/경력 (HTML 가능)

  -- 부가 정보 (관리·확장용)
  email text NULL,
  phone text NULL,
  profile_image_url text NULL,
  status text NOT NULL DEFAULT '사용',  -- 사용 | 중지 등

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT instructors_user_id_unique UNIQUE (user_id)
);

COMMENT ON TABLE public.instructors IS '강의 크리에이터/강사 정보';
COMMENT ON COLUMN public.instructors.user_id IS 'lectures.instructors_user_id 와 조인되는 강사 식별자';
COMMENT ON COLUMN public.instructors.name IS '강사 이름 (크리에이터 표시명)';
COMMENT ON COLUMN public.instructors.main_field IS '전문 분야';
COMMENT ON COLUMN public.instructors.introduction IS '소개 문구 (HTML 허용)';
COMMENT ON COLUMN public.instructors.career IS '이력/경력 (HTML 허용)';

CREATE INDEX IF NOT EXISTS idx_instructors_user_id
  ON public.instructors (user_id);

CREATE INDEX IF NOT EXISTS idx_instructors_status
  ON public.instructors (status);

-- updated_at 자동 갱신
CREATE OR REPLACE FUNCTION public.set_instructors_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_instructors_updated_at ON public.instructors;
CREATE TRIGGER trg_instructors_updated_at
BEFORE UPDATE ON public.instructors
FOR EACH ROW
EXECUTE FUNCTION public.set_instructors_updated_at();

-- RLS (프론트 anon 조회 허용 — 필요 시 정책 조정)
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "instructors_select_public" ON public.instructors;
CREATE POLICY "instructors_select_public"
  ON public.instructors
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "instructors_all_authenticated" ON public.instructors;
CREATE POLICY "instructors_all_authenticated"
  ON public.instructors
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- (권장) lectures.instructors_user_id 의 CR/LF 정리
-- 현재 DB에 'rmp1\r\n' 형태로 저장된 값이 있음
-- ============================================================
UPDATE public.lectures
SET instructors_user_id = trim(both E'\r\n\t ' FROM instructors_user_id)
WHERE instructors_user_id IS NOT NULL
  AND instructors_user_id <> trim(both E'\r\n\t ' FROM instructors_user_id);

-- ============================================================
-- 샘플 데이터 (lectures에 존재하는 instructors_user_id 기준)
-- ============================================================
INSERT INTO public.instructors (user_id, name, main_field, introduction, career, status)
VALUES
  (
    'rmp1',
    '강사1',
    '금융',
    '<p>금융·투자 분야 크리에이터입니다.</p>',
    '<p><strong>경력</strong></p><p>금융권 근무</p>',
    '사용'
  ),
  (
    'rmp2',
    '강사2',
    '재무설계',
    '<p>재무설계 전문가입니다.</p>',
    '<p><strong>경력</strong></p><p>재무설계 컨설팅</p>',
    '사용'
  ),
  (
    'rmp3',
    '강사3',
    '주식',
    '<p>주식 투자 전문가입니다.</p>',
    '<p><strong>경력</strong></p><p>증권사 근무</p>',
    '사용'
  ),
  (
    'rmp4',
    '강사4',
    '부동산',
    '<p>부동산 경매 전문가입니다.</p>',
    '<p><strong>경력</strong></p><p>부동산 투자</p>',
    '사용'
  ),
  (
    'rmp5',
    '강사5',
    '재테크',
    '<p>생활 재테크 크리에이터입니다.</p>',
    '<p><strong>경력</strong></p><p>재테크 강의</p>',
    '사용'
  ),
  (
    'rmp6',
    '강사6',
    '경제',
    '<p>경제 지식 크리에이터입니다.</p>',
    '<p><strong>경력</strong></p><p>경제 교육</p>',
    '사용'
  ),
  (
    'rmp7',
    '강사7',
    '금융꿀팁',
    '<p>금융 실전 팁 크리에이터입니다.</p>',
    '<p><strong>경력</strong></p><p>금융 콘텐츠 제작</p>',
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

-- 조인 확인
SELECT
  l.id AS lecture_id,
  l.title,
  l.instructors_user_id,
  i.name AS instructor_name,
  i.main_field
FROM public.lectures l
LEFT JOIN public.instructors i
  ON i.user_id = l.instructors_user_id
ORDER BY l.title;
