// src/hooks/use-quotations.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuotationDetail, QuotationFormData } from "@/types/quotation";
import { Quotation, QuotationStatus, ApprovalLog, ChangeHistoryEntry } from "@/types/index";

// ─── 목록 조회 ───
export function useQuotations(filters?: {
  status?: QuotationStatus;
  search?: string;
}) {
  return useQuery({
    queryKey: ["quotations", filters],
    queryFn: async (): Promise<Quotation[]> => {
      let query = supabase
        .from('quotations')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,clientName.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Quotation[];
    },
  });
}

// ─── 단일 조회 (하위 테이블 포함) ───
export function useQuotation(id: string) {
  return useQuery({
    queryKey: ["quotation", id],
    queryFn: async (): Promise<QuotationDetail | null> => {
      const { data, error } = await supabase
        .from('quotations')
        .select(`*, schedules:quotation_schedules(*), costs:quotation_costs(*)`)
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as QuotationDetail;
    },
    enabled: !!id,
  });
}

// ─── 생성 ───
export function useCreateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: QuotationFormData) => {
      // Step 1: 견적 마스터 생성
      const { data: qData, error: qError } = await supabase
        .from('quotations')
        .insert([{
          title: formData.title,
          clientName: formData.clientName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          paxCount: formData.paxCount,
          packageType: formData.packageType,
          targetMarginPercentage: formData.targetMarginPercentage,
          status: "Draft",
        }])
        .select()
        .single();

      if (qError) throw qError;

      const quotationId = qData.id;

      // Step 2: 일정 삽입
      if (formData.schedules?.length) {
        const { error: sErr } = await supabase.from('quotation_schedules').insert(
          formData.schedules.map(s => ({ ...s, quotation_id: quotationId }))
        );
        if (sErr) throw sErr;
      }

      // Step 3: 비용 항목 삽입
      if (formData.costs?.length) {
        const { error: cErr } = await supabase.from('quotation_costs').insert(
          formData.costs.map(c => ({ 
            ...c, 
            quotation_id: quotationId,
            calcAmountKRW: c.unitPrice * c.quantity * c.days * c.exchangeRate
          }))
        );
        if (cErr) throw cErr;
      }

      return qData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });
}

// ─── 수정 (마스터 + 하위 테이블) ───
export function useUpdateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<QuotationFormData> }) => {
      // 마스터 업데이트
      const masterFields: Record<string, unknown> = {};
      const allowedFields = [
        'title', 'clientName', 'startDate', 'endDate', 
        'paxCount', 'packageType', 'targetMarginPercentage',
        'totalCostKRW', 'proposedPriceKRW', 'actualMarginPercentage'
      ];
      
      for (const key of allowedFields) {
        if (key in data && data[key as keyof typeof data] !== undefined) {
          masterFields[key] = data[key as keyof typeof data];
        }
      }

      if (Object.keys(masterFields).length > 0) {
        const { error } = await supabase
          .from('quotations')
          .update(masterFields)
          .eq('id', id);
        if (error) throw error;
      }

      // 비용 항목: 기존 삭제 후 재삽입 (간단한 전략)
      if (data.costs) {
        await supabase.from('quotation_costs').delete().eq('quotation_id', id);
        if (data.costs.length > 0) {
          const { error: cErr } = await supabase.from('quotation_costs').insert(
            data.costs.map(c => ({
              ...c,
              quotation_id: id,
              calcAmountKRW: c.unitPrice * c.quantity * c.days * c.exchangeRate
            }))
          );
          if (cErr) throw cErr;
        }
      }

      // 일정: 기존 삭제 후 재삽입
      if (data.schedules) {
        await supabase.from('quotation_schedules').delete().eq('quotation_id', id);
        if (data.schedules.length > 0) {
          const { error: sErr } = await supabase.from('quotation_schedules').insert(
            data.schedules.map(s => ({ ...s, quotation_id: id }))
          );
          if (sErr) throw sErr;
        }
      }

      return { id };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotation", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });
}

// ─── 삭제 (Draft 상태만 허용) ───
export function useDeleteQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Draft 상태 확인
      const { data: q, error: qErr } = await supabase
        .from('quotations')
        .select('status')
        .eq('id', id)
        .single();
      
      if (qErr) throw qErr;
      if (q.status !== 'Draft') {
        throw new Error('Draft 상태의 견적만 삭제할 수 있습니다.');
      }

      const { error } = await supabase
        .from('quotations')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });
}

// ─── 상태 변경 + 승인 이력 ───
export function useUpdateQuotationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quotationId,
      previousStatus,
      newStatus,
      reason,
    }: {
      quotationId: string;
      previousStatus: QuotationStatus;
      newStatus: QuotationStatus;
      reason?: string;
    }) => {
      // 1. 상태 업데이트
      const { error: updateErr } = await supabase
        .from('quotations')
        .update({ status: newStatus })
        .eq('id', quotationId);
      if (updateErr) throw updateErr;

      // 2. 승인 이력 삽입
      const { error: logErr } = await supabase
        .from('approval_logs')
        .insert([{
          quotation_id: quotationId,
          previous_status: previousStatus,
          new_status: newStatus,
          changed_by: 'system', // 추후 auth.uid()로 대체
          reason: reason || null,
        }]);
      if (logErr) throw logErr;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotation", variables.quotationId] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["approval_logs", variables.quotationId] });
    },
  });
}

// ─── 승인 이력 조회 ───
export function useApprovalLogs(quotationId: string) {
  return useQuery({
    queryKey: ["approval_logs", quotationId],
    queryFn: async (): Promise<ApprovalLog[]> => {
      const { data, error } = await supabase
        .from('approval_logs')
        .select('*')
        .eq('quotation_id', quotationId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ApprovalLog[];
    },
    enabled: !!quotationId,
  });
}

// ─── 변경 이력 조회 (범용) ───
export function useChangeHistory(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ["change_history", entityType, entityId],
    queryFn: async (): Promise<ChangeHistoryEntry[]> => {
      const { data, error } = await supabase
        .from('change_history')
        .select('*')
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ChangeHistoryEntry[];
    },
    enabled: !!entityType && !!entityId,
  });
}
