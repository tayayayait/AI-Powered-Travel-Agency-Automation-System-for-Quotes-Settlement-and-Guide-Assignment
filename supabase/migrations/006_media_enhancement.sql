-- 006_media_enhancement.sql
-- Phase 1-9: 인스펙션 미디어 DB 연동

CREATE TABLE IF NOT EXISTS public.quotation_media (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN ('Hotel', 'Restaurant', 'Vehicle', 'Tour', 'Other')),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 빠른 조회를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_quotation_media_quotation_id 
ON public.quotation_media(quotation_id, created_at DESC);

-- RLS 활성화
ALTER TABLE public.quotation_media ENABLE ROW LEVEL SECURITY;

-- 권한 정책 (개발용 전체 허용)
CREATE POLICY "Allow ALL for anon on quotation_media" 
ON public.quotation_media FOR ALL 
TO anon, authenticated
USING (true)
WITH CHECK (true);
