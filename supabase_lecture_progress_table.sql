-- 강의 진도율 테이블 생성
CREATE TABLE IF NOT EXISTS public.lecture_progress (
    id uuid not null default gen_random_uuid(),
    lecture_id uuid not null,
    application_id uuid not null,
    progress_rate numeric(5, 2) not null,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    video_id uuid not null,
    constraint lecture_progress_pkey primary key (id),
    constraint fk_lecture_progress_application_id foreign KEY (application_id) references lecture_applications (id) on delete CASCADE,
    constraint fk_lecture_progress_lecture_id foreign KEY (lecture_id) references lectures (id) on delete CASCADE,
    constraint fk_lecture_progress_video_id foreign KEY (video_id) references lecture_videos (id) on delete CASCADE,
    constraint lecture_progress_progress_rate_check check (
        (
            (progress_rate >= (0)::numeric)
            and (progress_rate <= (100)::numeric)
        )
    )
) TABLESPACE pg_default;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_lecture_progress_lecture_id ON public.lecture_progress(lecture_id);
CREATE INDEX IF NOT EXISTS idx_lecture_progress_application_id ON public.lecture_progress(application_id);
CREATE INDEX IF NOT EXISTS idx_lecture_progress_video_id ON public.lecture_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_lecture_progress_updated_at ON public.lecture_progress(updated_at);

-- RLS 활성화
ALTER TABLE public.lecture_progress ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- 사용자는 자신의 진도율만 조회/수정 가능
CREATE POLICY "Users can view own progress" ON public.lecture_progress
    FOR SELECT USING (
        application_id IN (
            SELECT id FROM lecture_applications 
            WHERE member_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert own progress" ON public.lecture_progress
    FOR INSERT WITH CHECK (
        application_id IN (
            SELECT id FROM lecture_applications 
            WHERE member_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own progress" ON public.lecture_progress
    FOR UPDATE USING (
        application_id IN (
            SELECT id FROM lecture_applications 
            WHERE member_user_id = auth.uid()::text
        )
    );

-- 관리자는 모든 진도율 조회 가능
CREATE POLICY "Admins can view all progress" ON public.lecture_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM members 
            WHERE id = auth.uid()::uuid 
            AND signup_type = 'admin'
        )
    );

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_lecture_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lecture_progress_updated_at 
    BEFORE UPDATE ON public.lecture_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_lecture_progress_updated_at();

-- 샘플 쿼리 예시
-- 1. 특정 사용자의 강의별 진도율 조회
-- SELECT 
--   l.title,
--   lv.video_title,
--   lp.progress_rate,
--   lp.updated_at
-- FROM public.lecture_progress lp
-- JOIN public.lectures l ON lp.lecture_id = l.id
-- JOIN public.lecture_videos lv ON lp.video_id = lv.id
-- JOIN public.lecture_applications la ON lp.application_id = la.id
-- WHERE la.member_user_id = '사용자ID'
-- ORDER BY lp.updated_at DESC;

-- 2. 강의별 평균 진도율 조회
-- SELECT 
--   l.title,
--   AVG(lp.progress_rate) as avg_progress,
--   COUNT(DISTINCT la.member_user_id) as total_students
-- FROM public.lectures l
-- LEFT JOIN public.lecture_progress lp ON l.id = lp.lecture_id
-- LEFT JOIN public.lecture_applications la ON lp.application_id = la.id
-- WHERE l.status = '사용'
-- GROUP BY l.id, l.title
-- ORDER BY avg_progress DESC NULLS LAST; 