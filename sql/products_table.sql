-- 부자상품(플랫폼 상품) 테이블
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
  regular_price INTEGER,
  provider VARCHAR(200),
  rate_info VARCHAR(100),
  risk_level VARCHAR(50),
  features TEXT[] DEFAULT '{}',
  rating NUMERIC(3,1) DEFAULT 4.5,
  sales_count INTEGER DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT '판매중',
  thumbnail_url VARCHAR(500),
  link_url VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON public.products(sort_order);

GRANT ALL ON public.products TO anon, authenticated, service_role;
