-- 001_initial_schema.sql
-- Drop tables if they exist (for clean re-runs during dev)
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.settlement_expenses CASCADE;
DROP TABLE IF EXISTS public.settlements CASCADE;
DROP TABLE IF EXISTS public.guide_assignments CASCADE;
DROP TABLE IF EXISTS public.guide_profiles CASCADE;
DROP TABLE IF EXISTS public.quotation_costs CASCADE;
DROP TABLE IF EXISTS public.quotation_schedules CASCADE;
DROP TABLE IF EXISTS public.quotations CASCADE;

-- Quotations
CREATE TABLE public.quotations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  "clientName" text NOT NULL,
  "startDate" date NOT NULL,
  "endDate" date NOT NULL,
  "paxCount" integer NOT NULL DEFAULT 0,
  "targetMarginPercentage" numeric NOT NULL DEFAULT 0,
  "actualMarginPercentage" numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Draft',
  "totalCostKRW" numeric NOT NULL DEFAULT 0,
  "proposedPriceKRW" numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KRW',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quotation Schedules
CREATE TABLE public.quotation_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE CASCADE NOT NULL,
  "dayNumber" integer NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Quotation Costs
CREATE TABLE public.quotation_costs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id uuid REFERENCES public.quotations(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  "unitPrice" numeric NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 1,
  days integer NOT NULL DEFAULT 1,
  currency text NOT NULL,
  "exchangeRate" numeric NOT NULL DEFAULT 1,
  "calcAmountKRW" numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Settlements
CREATE TABLE public.settlements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "quotationId" uuid REFERENCES public.quotations(id) NOT NULL,
  title text NOT NULL,
  "clientName" text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  "totalExpectedKRW" numeric NOT NULL DEFAULT 0,
  "totalActualKRW" numeric NOT NULL DEFAULT 0,
  "balanceKRW" numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Settlement Expenses
CREATE TABLE public.settlement_expenses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  settlement_id uuid REFERENCES public.settlements(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  "amountExpected" numeric NOT NULL DEFAULT 0,
  "amountActual" numeric NOT NULL DEFAULT 0,
  currency text NOT NULL,
  "receiptUrl" text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Guide Profiles
CREATE TABLE public.guide_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  languages text[] NOT NULL DEFAULT '{}',
  rating numeric NOT NULL DEFAULT 0,
  "profileImageUrl" text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Guide Assignments
CREATE TABLE public.guide_assignments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  "quotationId" uuid REFERENCES public.quotations(id) NOT NULL,
  title text NOT NULL,
  "clientName" text NOT NULL,
  "startDate" date NOT NULL,
  "endDate" date NOT NULL,
  status text NOT NULL DEFAULT 'Unassigned',
  "assignedGuideId" uuid REFERENCES public.guide_profiles(id),
  "meetingPoint" text,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- System Settings
CREATE TABLE public.system_settings (
  id text PRIMARY KEY DEFAULT 'default',
  "baseCurrency" text NOT NULL DEFAULT 'KRW',
  language text NOT NULL DEFAULT 'ko',
  timezone text NOT NULL DEFAULT 'Asia/Seoul',
  rates jsonb NOT NULL DEFAULT '{"THB": 39.5, "VND": 0.055, "LAK": 0.062}'::jsonb,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initial Mock Guide Profile insertion (so that guide assignment has someone to assign to)
INSERT INTO public.guide_profiles (name, phone, languages, rating) VALUES 
('김가이드', '+66-81-234-5678', '{"Korean", "Thai"}', 4.8),
('박가이드', '+66-89-987-6543', '{"Korean", "English"}', 4.5);
