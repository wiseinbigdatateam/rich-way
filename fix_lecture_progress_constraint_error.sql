-- 1단계: 기존 데이터 확인
-- SELECT COUNT(*) FROM public.lecture_progress WHERE video_duration IS NULL OR video_duration <= 0;

-- 2단계: 필드 추가 (제약조건 없이)
ALTER TABLE public.lecture_progress 
ADD COLUMN IF NOT EXISTS video_current_time numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS video_duration numeric(10, 2) DEFAULT 0;

-- 3단계: 기존 데이터에 기본값 설정
UPDATE public.lecture_progress 
SET video_current_time = 0, video_duration = 1 
WHERE video_current_time IS NULL OR video_duration IS NULL OR video_duration <= 0;

-- 4단계: 이제 제약조건 추가
ALTER TABLE public.lecture_progress 
ADD CONSTRAINT IF NOT EXISTS lecture_progress_video_time_check 
CHECK (video_current_time >= 0 AND video_current_time <= video_duration);

ALTER TABLE public.lecture_progress 
ADD CONSTRAINT IF NOT EXISTS lecture_progress_video_duration_check 
CHECK (video_duration > 0);

-- 5단계: 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_lecture_progress_video_time 
ON public.lecture_progress(video_current_time, video_duration);

-- 6단계: 컬럼 설명 추가
COMMENT ON COLUMN public.lecture_progress.video_current_time IS '동영상 현재 재생 시간 (초)';
COMMENT ON COLUMN public.lecture_progress.video_duration IS '동영상 전체 길이 (초)';

-- 7단계: 결과 확인
-- SELECT 
--   COUNT(*) as total_records,
--   COUNT(CASE WHEN video_duration > 0 THEN 1 END) as valid_duration,
--   COUNT(CASE WHEN video_current_time >= 0 THEN 1 END) as valid_current_time
-- FROM public.lecture_progress; 