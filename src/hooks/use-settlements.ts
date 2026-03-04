import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SettlementDetail, SettlementFormData } from "@/types/settlement";

export function useSettlements() {
  return useQuery({
    queryKey: ["settlements"],
    queryFn: async (): Promise<SettlementDetail[]> => {
      // 기본 쿼리만 실행 (확장 테이블은 DB 마이그레이션 완료 후 join 추가)
      const { data, error } = await supabase
        .from('settlements')
        .select(`*, expenses:settlement_expenses(*)`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((s: any) => ({
        ...s,
        shoppingSales: [],
        optionSales: [],
        unexpectedExpenses: [],
      })) as SettlementDetail[];
    },
  });
}

export function useSettlement(id: string) {
  return useQuery({
    queryKey: ["settlement", id],
    queryFn: async (): Promise<SettlementDetail | null> => {
      // 기본 쿼리만 실행 (확장 테이블은 DB 마이그레이션 완료 후 join 추가)
      const { data, error } = await supabase
        .from('settlements')
        .select(`*, expenses:settlement_expenses(*)`)
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        ...(data as any),
        shoppingSales: [],
        optionSales: [],
        unexpectedExpenses: [],
      } as SettlementDetail;
    },
    enabled: !!id,
  });
}

export function useCreateSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quotationId: string) => {
      // 1. 견적 정보 및 비용 항목 조회 (정산 자동 연동)
      const { data: quote, error: quoteErr } = await supabase
        .from('quotations')
        .select('*, costs:quotation_costs(*)')
        .eq('id', quotationId)
        .single();

      if (quoteErr || !quote) throw quoteErr || new Error("견적을 찾을 수 없습니다.");

      // 2. 정산 마스터 레코드 생성
      const { data: settlement, error: setErr } = await supabase
        .from('settlements')
        .insert([{
          quotationId: quote.id,
          title: quote.title,
          clientName: quote.clientName,
          status: "Pending",
          totalExpectedKRW: quote.totalCostKRW,
          totalActualKRW: 0,
          balanceKRW: 0,
          guideFee: 0,
          shoppingCommission: 0,
          optionCommission: 0,
          profitKRW: 0,
          profitRate: 0,
        }])
        .select()
        .single();

      if (setErr || !settlement) throw setErr || new Error("정산 생성 실패");

      // 3. 견적 비용을 정산 예정 비용으로 복사
      if (quote.costs && quote.costs.length > 0) {
        const expenses = quote.costs.map((cost: any) => ({
          settlement_id: settlement.id,
          category: cost.category,
          description: cost.description,
          amountExpected: cost.unitPrice * cost.quantity * cost.days,
          amountActual: 0,
          currency: cost.currency,
        }));
        
        await supabase.from('settlement_expenses').insert(expenses);
      }

      return settlement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settlements"] });
    },
  });
}

export function useUpdateSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SettlementFormData> }) => {
      // 1. 마스터 정보 업데이트
      const { expenses, shoppingSales, optionSales, unexpectedExpenses, ...masterData } = data;
      
      const { error: masterErr } = await supabase
        .from('settlements')
        .update(masterData as any)
        .eq('id', id);

      if (masterErr) throw masterErr;

      // 2. 하위 테이블들 덮어쓰기 (간단한 구현을 위해 delete & insert)
      
      if (expenses) {
        await supabase.from('settlement_expenses').delete().eq('settlement_id', id);
        if (expenses.length > 0) {
          await supabase.from('settlement_expenses').insert(
            expenses.map(e => ({ ...e, settlement_id: id }))
          );
        }
      }

      if (shoppingSales) {
        await supabase.from('shopping_sales').delete().eq('settlement_id', id);
        if (shoppingSales.length > 0) {
          await supabase.from('shopping_sales').insert(
            shoppingSales.map(e => ({ ...e, settlement_id: id }))
          );
        }
      }

      if (optionSales) {
        await supabase.from('option_sales').delete().eq('settlement_id', id);
        if (optionSales.length > 0) {
          await supabase.from('option_sales').insert(
            optionSales.map(e => ({ ...e, settlement_id: id }))
          );
        }
      }

      if (unexpectedExpenses) {
        await supabase.from('unexpected_expenses').delete().eq('settlement_id', id);
        if (unexpectedExpenses.length > 0) {
          await supabase.from('unexpected_expenses').insert(
            unexpectedExpenses.map(e => ({ ...e, settlement_id: id }))
          );
        }
      }

      return { id };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["settlements"] });
      queryClient.invalidateQueries({ queryKey: ["settlement", variables.id] });
    },
  });
}
