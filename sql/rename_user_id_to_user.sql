-- members 테이블의 user_id 컬럼을 user로 변경
-- 1단계: 외래키 제약조건 제거
ALTER TABLE coaching_applications DROP CONSTRAINT IF EXISTS fk_coaching_applications_member_user_id;
ALTER TABLE mbti_diagnosis DROP CONSTRAINT IF EXISTS mbti_diagnosis_user_id_fkey;
ALTER TABLE finance_diagnosis DROP CONSTRAINT IF EXISTS finance_diagnosis_user_id_fkey;

-- 2단계: members 테이블 컬럼명 변경
ALTER TABLE members RENAME COLUMN user_id TO "user";

-- 3단계: 다른 테이블들의 외래키 컬럼명도 변경
ALTER TABLE coaching_applications RENAME COLUMN member_user_id TO member_user;
ALTER TABLE mbti_diagnosis RENAME COLUMN user_id TO "user";
ALTER TABLE finance_diagnosis RENAME COLUMN user_id TO "user";

-- 4단계: 새로운 외래키 제약조건 추가
ALTER TABLE coaching_applications 
ADD CONSTRAINT fk_coaching_applications_member_user 
FOREIGN KEY (member_user) REFERENCES members("user");

ALTER TABLE mbti_diagnosis 
ADD CONSTRAINT mbti_diagnosis_user_fkey 
FOREIGN KEY ("user") REFERENCES members("user");

ALTER TABLE finance_diagnosis 
ADD CONSTRAINT finance_diagnosis_user_fkey 
FOREIGN KEY ("user") REFERENCES members("user");

-- 5단계: 인덱스 재생성 (필요한 경우)
CREATE INDEX IF NOT EXISTS idx_coaching_applications_member_user ON coaching_applications(member_user);
CREATE INDEX IF NOT EXISTS idx_mbti_diagnosis_user ON mbti_diagnosis("user");
CREATE INDEX IF NOT EXISTS idx_finance_diagnosis_user ON finance_diagnosis("user"); 