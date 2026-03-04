-- 003_quotation_enhancement.sql
-- Phase 1: 견적 자동화 스키마 확장

-- 1. quotations 테이블에 패키지 유형 컬럼 추가
ALTER TABLE public.quotations 
ADD COLUMN IF NOT EXISTS "packageType" text NOT NULL DEFAULT 'standard';

-- 패키지 유형 CHECK 제약조건
ALTER TABLE public.quotations 
ADD CONSTRAINT quotations_package_type_check 
CHECK ("packageType" IN ('save', 'standard', 'premium', 'incentive'));

-- 2. 승인 이력 테이블
CREATE TABLE IF NOT EXISTS public.approval_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE CASCADE NOT NULL,
  previous_status text NOT NULL,
  new_status text NOT NULL,
  changed_by text NOT NULL DEFAULT 'system', -- 추후 auth.uid()로 교체
  reason text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 변경 이력 테이블 (범용: 견적, 정산, 배정 등에 공통 사용)
CREATE TABLE IF NOT EXISTS public.change_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type text NOT NULL, -- 'quotation', 'settlement', 'guide_assignment'
  entity_id uuid NOT NULL,
  field_name text NOT NULL,
  old_value text,
  new_value text,
  changed_by text NOT NULL DEFAULT 'system',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 인덱스: 빠른 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_approval_logs_quotation 
ON public.approval_logs(quotation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_change_history_entity 
ON public.change_history(entity_type, entity_id, created_at DESC);

-- RLS 활성화
ALTER TABLE public.approval_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_history ENABLE ROW LEVEL SECURITY;

-- 개발용 RLS (추후 역할 기반으로 강화)
CREATE POLICY "Allow ALL for anon on approval_logs" 
ON public.approval_logs FOR ALL 
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow ALL for anon on change_history" 
ON public.change_history FOR ALL 
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. updated_at 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- quotations 테이블에 트리거 적용
DROP TRIGGER IF EXISTS set_quotations_updated_at ON public.quotations;
CREATE TRIGGER set_quotations_updated_at
BEFORE UPDATE ON public.quotations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- settlements 테이블에 트리거 적용
DROP TRIGGER IF EXISTS set_settlements_updated_at ON public.settlements;
CREATE TRIGGER set_settlements_updated_at
BEFORE UPDATE ON public.settlements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- guide_assignments 테이블에 트리거 적용
DROP TRIGGER IF EXISTS set_guide_assignments_updated_at ON public.guide_assignments;
CREATE TRIGGER set_guide_assignments_updated_at
BEFORE UPDATE ON public.guide_assignments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
