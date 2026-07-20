-- lectures 테이블 생성 (강사이름 필드 포함)
create table public.lectures (
  id uuid not null default gen_random_uuid (),
  category character varying(50) not null,
  title character varying(200) not null,
  thumbnail_url character varying(500) null,
  price integer not null,
  discount_price integer null,
  duration integer null,
  description text null,
  sample_video_url character varying(500) null,
  instructor_name character varying(100) null,
  instructor_intro text null,
  status character varying(10) not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint lectures_pkey primary key (id),
  constraint lectures_status_check check (
    (
      (status)::text = any (
        (
          array[
            '사용'::character varying,
            '사용중지'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

-- 기존 테이블에 강사이름 필드 추가 (ALTER TABLE)
-- ALTER TABLE public.lectures ADD COLUMN instructor_name character varying(100) null;

-- RLS 정책 설정
ALTER TABLE public.lectures ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 사용 중인 강의를 볼 수 있도록 정책 생성
CREATE POLICY "사용 중인 강의 조회 허용" ON public.lectures
    FOR SELECT USING (status = '사용');

-- 관리자만 강의를 생성/수정/삭제할 수 있도록 정책 생성
CREATE POLICY "관리자 강의 관리 허용" ON public.lectures
    FOR ALL USING (auth.role() = 'authenticated');

-- 샘플 데이터 삽입
INSERT INTO public.lectures (
  category, 
  title, 
  thumbnail_url, 
  price, 
  discount_price, 
  duration, 
  description, 
  sample_video_url, 
  instructor_name,
  instructor_intro, 
  status
) VALUES 
(
  '부동산',
  '[NEW] 부동산이 처음이라면? 나나위의 돈이 일하게 하는 부동산 투자 원칙',
  '/lovable-uploads/07086823-4f54-40cb-8cfb-5548fc641a12.png',
  329000,
  169000,
  180,
  '나는 돈을 많이 벌기 위해 부동산을 시작했는데, 되려 투자 후 가난해졌습니다. 그래서 이미 5만 명이 만족한 강의를 대대적으로 리뉴얼했습니다. 2025년 지금 바로 언제·어디에·어떤 부동산을 사야 하는지 확실한 기준을 세워드립니다.',
  'https://www.youtube.com/watch?v=y_B9r4TwIl0',
  '나나위',
  '1년, 2년 뒤가 아니라 5년, 10년 뒤를 보고 정공법 수법에 없는 올바른 투자의 방법을 전파하는 가이드가 되어드리고 싶습니다',
  '사용'
),
(
  '주식',
  '[BEST] 주식 초보자를 위한 완벽 가이드',
  '/lovable-uploads/placeholder.svg',
  199000,
  99000,
  120,
  '주식 투자를 처음 시작하는 분들을 위한 기초부터 실전까지 완벽한 가이드입니다. 체계적인 커리큘럼으로 안전하고 수익성 있는 투자를 배워보세요.',
  'https://www.youtube.com/watch?v=example1',
  '김주식',
  '20년간 주식 시장을 분석해온 전문가로서, 초보자도 쉽게 이해할 수 있는 방법으로 주식 투자를 가르칩니다.',
  '사용'
),
(
  '재테크',
  '[HOT] 월급쟁이 재테크 완전정복',
  '/lovable-uploads/placeholder.svg',
  149000,
  89000,
  90,
  '월급쟁이도 할 수 있는 실용적인 재테크 방법을 알려드립니다. 적은 금액으로도 시작할 수 있는 다양한 투자 방법을 소개합니다.',
  'https://www.youtube.com/watch?v=example2',
  '이재테크',
  '평범한 직장인이었지만 재테크로 경제적 자유를 얻은 경험을 바탕으로, 누구나 따라할 수 있는 방법을 전수합니다.',
  '사용'
),
(
  '부동산',
  '[PREMIUM] 부동산 투자 고급 전략',
  '/lovable-uploads/placeholder.svg',
  499000,
  299000,
  240,
  '부동산 투자의 고급 전략을 다루는 프리미엄 강의입니다. 시장 분석, 리스크 관리, 수익 극대화 방법을 심도 있게 학습합니다.',
  'https://www.youtube.com/watch?v=example3',
  '박부동',
  '부동산 개발업계에서 15년간 일한 경험을 바탕으로, 실무에서 바로 적용할 수 있는 고급 투자 전략을 가르칩니다.',
  '사용'
),
(
  '암호화폐',
  '[NEW] 암호화폐 투자 A to Z',
  '/lovable-uploads/placeholder.svg',
  299000,
  199000,
  150,
  '암호화폐 투자의 기초부터 고급 전략까지 모두 다루는 종합 강의입니다. 변동성이 큰 시장에서 안전하게 투자하는 방법을 배워보세요.',
  'https://www.youtube.com/watch?v=example4',
  '최코인',
  '블록체인 기술 전문가로서 암호화폐 시장의 본질을 이해하고, 장기적 관점에서 투자하는 방법을 가르칩니다.',
  '사용'
); 