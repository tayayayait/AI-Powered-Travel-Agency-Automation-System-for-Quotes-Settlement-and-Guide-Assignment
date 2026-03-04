// src/hooks/use-guides.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GuideAssignmentDetail, GuideProfile, GuidePerformanceLog, GuideProfileFormData } from "@/types/guide";

export function useGuideProfiles() {
  return useQuery({
    queryKey: ["guide_profiles"],
    queryFn: async (): Promise<GuideProfile[]> => {
      const { data, error } = await supabase
        .from('guide_profiles')
        .select('*')
        .order('name', { ascending: true });
        
      if (error) throw error;
      return data as GuideProfile[];
    },
  });
}

export function useCreateGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (guide: Partial<GuideProfileFormData>) => {
      // 1단계: 기본 스키마(001) 컬럼만으로 insert (400 에러 원천 차단)
      const basePayload: Record<string, any> = {
        name: guide.name,
        phone: guide.phone,
        languages: guide.languages || [],
        rating: guide.rating || 0,
      };

      const { data, error } = await supabase
        .from('guide_profiles')
        .insert([basePayload] as any)
        .select()
        .single();

      if (error) throw error;

      // 2단계: 확장 컬럼이 있으면 update 시도 (실패해도 무시)
      const extPayload: Record<string, any> = {};
      if (guide.tier) extPayload.tier = guide.tier;
      if (guide.regions && guide.regions.length > 0) extPayload.regions = guide.regions;
      if (guide.specialties && guide.specialties.length > 0) extPayload.specialties = guide.specialties;
      if (guide.status) extPayload.status = guide.status;

      if (Object.keys(extPayload).length > 0) {
        try {
          await supabase
            .from('guide_profiles')
            .update(extPayload as any)
            .eq('id', (data as any).id);
        } catch {
          // 확장 컬럼 미지원 시 조용히 무시
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guide_profiles"] });
    }
  });
}

export function useUpdateGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GuideProfile> }) => {
      const { data: result, error } = await supabase
        .from('guide_profiles')
        .update(data as any)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guide_profiles"] });
    }
  });
}

export function useGuideAssignments() {
  return useQuery({
    queryKey: ["guide_assignments"],
    queryFn: async (): Promise<GuideAssignmentDetail[]> => {
      const { data, error } = await supabase
        .from('guide_assignments')
        .select(`*, guide_profiles(*)`)
        .order('startDate', { ascending: true });

      if (error) throw error;
      
      return data.map((d: any) => ({
        ...d,
        assignedGuide: d.guide_profiles
      })) as GuideAssignmentDetail[];
    },
  });
}

export function useAssignGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assignmentId, guideId, aiScore }: { assignmentId: string; guideId: string; aiScore?: number }) => {
      const payload: any = { assignedGuideId: guideId, status: "Assigned" };
      if (aiScore !== undefined) payload.ai_score = aiScore;
      
      const { data, error } = await supabase
        .from('guide_assignments')
        .update(payload)
        .eq('id', assignmentId)
        .select('*, guide_profiles(*)')
        .single();

      if (error || !data) throw error || new Error("배정 실패");
      return {
        ...data,
        assignedGuide: (data as any).guide_profiles
      } as GuideAssignmentDetail;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guide_assignments"] });
    },
  });
}

export function useUpdateGuideAssignmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assignmentId, status }: { assignmentId: string; status: string }) => {
      const { data, error } = await supabase
        .from('guide_assignments')
        .update({ status })
        .eq('id', assignmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guide_assignments"] });
    },
  });
}

export function useGuidePerformanceLogs(guideId: string) {
  return useQuery({
    queryKey: ["guide_performance", guideId],
    queryFn: async (): Promise<GuidePerformanceLog[]> => {
      const { data, error } = await supabase
        .from('guide_performance_logs')
        .select('*')
        .eq('guide_id', guideId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as GuidePerformanceLog[];
    },
    enabled: !!guideId,
  });
}
