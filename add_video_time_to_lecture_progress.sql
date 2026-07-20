-- lecture_progress 테이블에 동영상 재생 시간 필드 추가
ALTER TABLE public.lecture_progress 
ADD COLUMN video_current_time numeric(10, 2) DEFAULT 0,
ADD COLUMN video_duration numeric(10, 2) DEFAULT 0;

-- 재생 시간 관련 체크 제약조건 추가
ALTER TABLE public.lecture_progress 
ADD CONSTRAINT lecture_progress_video_time_check 
CHECK (video_current_time >= 0 AND video_current_time <= video_duration);

-- 재생 시간 관련 체크 제약조건 추가 (duration이 0보다 커야 함)
ALTER TABLE public.lecture_progress 
ADD CONSTRAINT lecture_progress_video_duration_check 
CHECK (video_duration > 0);

-- 인덱스 생성 (재생 시간 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_lecture_progress_video_time 
ON public.lecture_progress(video_current_time, video_duration);

-- 기존 데이터가 있다면 기본값 설정 (선택사항)
-- UPDATE public.lecture_progress 
-- SET video_current_time = 0, video_duration = 0 
-- WHERE video_current_time IS NULL OR video_duration IS NULL;

-- 컬럼 설명 추가 (선택사항)
COMMENT ON COLUMN public.lecture_progress.video_current_time IS '동영상 현재 재생 시간 (초)';
COMMENT ON COLUMN public.lecture_progress.video_duration IS '동영상 전체 길이 (초)';

-- 샘플 쿼리 예시
-- 1. 특정 사용자의 동영상별 재생 시간 조회
-- SELECT 
--   l.title,
--   lv.video_title,
--   lp.progress_rate,
--   lp.video_current_time,
--   lp.video_duration,
--   ROUND((lp.video_current_time / lp.video_duration) * 100, 2) as calculated_progress
-- FROM public.lecture_progress lp
-- JOIN public.lectures l ON lp.lecture_id = l.id
-- JOIN public.lecture_videos lv ON lp.video_id = lv.id
-- JOIN public.lecture_applications la ON lp.application_id = la.id
-- WHERE la.member_user_id = '사용자ID'
-- ORDER BY lp.updated_at DESC;

-- 2. 재생 시간이 가장 긴 동영상 조회
-- SELECT 
--   l.title,
--   lv.video_title,
--   lp.video_current_time,
--   lp.video_duration,
--   lp.progress_rate
-- FROM public.lecture_progress lp
-- JOIN public.lectures l ON lp.lecture_id = l.id
-- JOIN public.lecture_videos lv ON lp.video_id = lv.id
-- ORDER BY lp.video_current_time DESC
-- LIMIT 10; 