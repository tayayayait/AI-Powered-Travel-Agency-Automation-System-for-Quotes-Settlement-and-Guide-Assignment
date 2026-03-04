-- 002_rls_policies.sql

-- 1. Enable RLS on all tables
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 2. Create flexible policies for development MVP 
-- (Allowing authenticated and anon roles to perform standard operations)
-- In a production environment, this should be tightened based on auth.uid() and user roles.

DO $$ 
DECLARE
  table_name text;
  tables text[] := ARRAY[
    'quotations', 'quotation_schedules', 'quotation_costs', 
    'settlements', 'settlement_expenses', 
    'guide_profiles', 'guide_assignments', 'system_settings'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables LOOP
    EXECUTE format('
      CREATE POLICY "Allow ALL for anon on %I" 
      ON public.%I FOR ALL 
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
    ', table_name, table_name);
  END LOOP;
END $$;
