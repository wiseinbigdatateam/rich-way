-- ============================================================
-- lectures.instructors_user_id, instructors.user_id 의 \r\n 제거
-- ============================================================

-- 0) 정리 전 상태 확인 (CR/LF 포함 여부)
SELECT 'instructors' AS src, user_id, encode(convert_to(user_id, 'UTF8'), 'hex') AS hex
FROM public.instructors
WHERE user_id ~ E'[\r\n]' OR user_id <> trim(both E'\r\n\t ' FROM user_id);

SELECT 'lectures' AS src, instructors_user_id, encode(convert_to(instructors_user_id, 'UTF8'), 'hex') AS hex
FROM public.lectures
WHERE instructors_user_id ~ E'[\r\n]'
   OR instructors_user_id <> trim(both E'\r\n\t ' FROM instructors_user_id);

-- 1) instructors.user_id 정리
--    정리 후 중복이 생기면 UNIQUE 충돌이 날 수 있으므로,
--    먼저 정리된 값이 이미 있는 행은 삭제하고 나머지를 업데이트합니다.
WITH cleaned AS (
  SELECT
    id,
    user_id AS old_user_id,
    regexp_replace(trim(both E'\r\n\t ' FROM user_id), E'[\r\n]+', '', 'g') AS new_user_id
  FROM public.instructors
  WHERE user_id IS NOT NULL
)
DELETE FROM public.instructors i
USING cleaned c
WHERE i.id = c.id
  AND c.old_user_id <> c.new_user_id
  AND EXISTS (
    SELECT 1
    FROM public.instructors x
    WHERE x.user_id = c.new_user_id
      AND x.id <> i.id
  );

UPDATE public.instructors i
SET
  user_id = regexp_replace(trim(both E'\r\n\t ' FROM i.user_id), E'[\r\n]+', '', 'g'),
  updated_at = now()
WHERE i.user_id IS NOT NULL
  AND i.user_id <> regexp_replace(trim(both E'\r\n\t ' FROM i.user_id), E'[\r\n]+', '', 'g');

-- 2) lectures.instructors_user_id 정리
UPDATE public.lectures
SET
  instructors_user_id = regexp_replace(trim(both E'\r\n\t ' FROM instructors_user_id), E'[\r\n]+', '', 'g'),
  updated_at = now()
WHERE instructors_user_id IS NOT NULL
  AND instructors_user_id <> regexp_replace(trim(both E'\r\n\t ' FROM instructors_user_id), E'[\r\n]+', '', 'g');

-- 3) 정리 후 확인
SELECT user_id, length(user_id) AS len, name
FROM public.instructors
ORDER BY user_id;

SELECT instructors_user_id, length(instructors_user_id) AS len, title
FROM public.lectures
WHERE instructors_user_id IS NOT NULL
ORDER BY instructors_user_id, title;

-- 4) 조인 확인 (instructor_name NULL = 매칭 실패)
SELECT
  l.title,
  l.instructors_user_id,
  i.user_id,
  i.name AS instructor_name
FROM public.lectures l
LEFT JOIN public.instructors i
  ON i.user_id = l.instructors_user_id
ORDER BY l.instructors_user_id, l.title;
