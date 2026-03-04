-- 004_settlement_enhancement.sql
-- Phase 2: 정산 및 손익 관리 스키마 확장

-- 1. settlements 테이블 확장
ALTER TABLE public.settlements 
ADD COLUMN IF NOT EXISTS "guideFee" numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "shoppingCommission" numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "optionCommission" numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "profitKRW" numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "profitRate" numeric NOT NULL DEFAULT 0;

-- 2. 쇼핑 매출 (Shopping Sales) 테이블
CREATE TABLE IF NOT EXISTS public.shopping_sales (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  settlement_id uuid REFERENCES public.settlements(id) ON DELETE CASCADE NOT NULL,
  shop_name text NOT NULL,
  sales_amount numeric NOT NULL DEFAULT 0,
  commission_rate numeric NOT NULL DEFAULT 0, -- % (예: 10)
  guide_share numeric NOT NULL DEFAULT 0, -- 가이드 몫
  company_share numeric NOT NULL DEFAULT 0, -- 회사 몫
  currency text NOT NULL DEFAULT 'THB',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 옵션 매출 (Option Sales) 테이블
CREATE TABLE IF NOT EXISTS public.option_sales (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  settlement_id uuid REFERENCES public.settlements(id) ON DELETE CASCADE NOT NULL,
  option_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  guide_share_rate numeric NOT NULL DEFAULT 0, -- % (예: 50)
  guide_share numeric NOT NULL DEFAULT 0, 
  company_share numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'THB',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 돌발 지출 (Unexpected Expenses) 테이블
CREATE TABLE IF NOT EXISTS public.unexpected_expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  settlement_id uuid REFERENCES public.settlements(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'THB',
  auto_approved boolean NOT NULL DEFAULT false, -- 기준 금액 이하 시 true
  requires_review boolean NOT NULL DEFAULT false, -- 기준 금액 초과 시 true
  status text NOT NULL DEFAULT 'Pending', -- Pending, Approved, Rejected
  approved_by text, -- 결재자
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 빠른 조회를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_shopping_sales_settlement 
ON public.shopping_sales(settlement_id);

CREATE INDEX IF NOT EXISTS idx_option_sales_settlement 
ON public.option_sales(settlement_id);

CREATE INDEX IF NOT EXISTS idx_unexpected_expenses_settlement 
ON public.unexpected_expenses(settlement_id);

-- RLS 활성화
ALTER TABLE public.shopping_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.option_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unexpected_expenses ENABLE ROW LEVEL SECURITY;

-- 권한 정책 (개발용)
CREATE POLICY "Allow ALL for anon on shopping_sales" ON public.shopping_sales FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow ALL for anon on option_sales" ON public.option_sales FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow ALL for anon on unexpected_expenses" ON public.unexpected_expenses FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
