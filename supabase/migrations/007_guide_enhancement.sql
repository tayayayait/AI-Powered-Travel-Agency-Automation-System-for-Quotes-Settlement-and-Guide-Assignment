-- 007_guide_enhancement.sql
-- Phase 3: 가이드 배정 및 성과 데이터 스키마 확장

-- 1. guide_profiles 테이블 확장
ALTER TABLE public.guide_profiles
ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'Bronze' CHECK (tier IN ('Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond')),
ADD COLUMN IF NOT EXISTS total_tours integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_shopping_revenue numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_option_revenue numeric NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS complaint_count integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS regions text[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS specialties text[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended'));

-- 2. guide_assignments 테이블 확장
ALTER TABLE public.guide_assignments
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled')),
ADD COLUMN IF NOT EXISTS ai_score numeric; -- AI 추천 점수 (배정 시 참고용)

-- 3. 가이드 성과 로그 테이블 (정산 완료 시 데이터가 누적됨)
CREATE TABLE IF NOT EXISTS public.guide_performance_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    guide_id uuid REFERENCES public.guide_profiles(id) ON DELETE CASCADE NOT NULL,
    assignment_id uuid REFERENCES public.guide_assignments(id) ON DELETE CASCADE,
    settlement_id uuid REFERENCES public.settlements(id) ON DELETE CASCADE,
    
    tour_title text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    
    shopping_revenue numeric NOT NULL DEFAULT 0,
    option_revenue numeric NOT NULL DEFAULT 0,
    customer_rating numeric NOT NULL DEFAULT 5.0,
    has_complaint boolean NOT NULL DEFAULT false,
    complaint_details text,
    
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_guide_performance_guide_id ON public.guide_performance_logs(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_assignments_status ON public.guide_assignments(status);
CREATE INDEX IF NOT EXISTS idx_guide_assignments_dates ON public.guide_assignments("startDate", "endDate");

-- RLS 활성화
ALTER TABLE public.guide_performance_logs ENABLE ROW LEVEL SECURITY;

-- 권한 정책
CREATE POLICY "Allow ALL for anon on guide_performance_logs" ON public.guide_performance_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
