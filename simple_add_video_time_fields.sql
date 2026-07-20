-- 간단한 방법: 제약조건 없이 필드만 추가
ALTER TABLE public.lecture_progress 
ADD COLUMN IF NOT EXISTS video_current_time numeric(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS video_duration numeric(10, 2) DEFAULT 0;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_lecture_progress_video_time 
ON public.lecture_progress(video_current_time, video_duration);

-- 컬럼 설명 추가
COMMENT ON COLUMN public.lecture_progress.video_current_time IS '동영상 현재 재생 시간 (초)';
COMMENT ON COLUMN public.lecture_progress.video_duration IS '동영상 전체 길이 (초)';

-- 결과 확인
SELECT 
  COUNT(*) as total_records,
  COUNT(CASE WHEN video_duration > 0 THEN 1 END) as valid_duration,
  COUNT(CASE WHEN video_current_time >= 0 THEN 1 END) as valid_current_time
FROM public.lecture_progress; 