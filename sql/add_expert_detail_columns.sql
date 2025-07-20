-- experts 테이블에 상세정보 컬럼 추가
ALTER TABLE experts 
ADD COLUMN IF NOT EXISTS education_detail TEXT, -- 학력 상세정보
ADD COLUMN IF NOT EXISTS certifications_detail TEXT, -- 자격증 상세정보
ADD COLUMN IF NOT EXISTS experience_detail TEXT, -- 경력 상세정보
ADD COLUMN IF NOT EXISTS achievements_detail TEXT, -- 주요성과 상세정보
ADD COLUMN IF NOT EXISTS expertise_areas TEXT[]; -- 전문영역 배열

-- 기존 데이터 마이그레이션 (필요시)
-- education_detail, certifications_detail, experience_detail, achievements_detail은 
-- 기존 education, certifications 컬럼의 데이터를 참고하여 수동으로 입력

-- 전문영역 기본값 설정 (기존 expert_type을 기반으로)
UPDATE experts 
SET expertise_areas = ARRAY[expert_type] 
WHERE expertise_areas IS NULL; 