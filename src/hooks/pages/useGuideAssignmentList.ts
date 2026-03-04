import { useState, useEffect, useCallback } from "react";
import { useGuideAssignments, useGuideProfiles, useAssignGuide } from "@/hooks/use-guides";
import { GuideAssignmentDetail, GuideAssignmentStatus } from "@/types/guide";
import { useToast } from "@/components/ui/use-toast";
import { analyzeGuideMatch, isGeminiAvailable, type GuideMatchResult } from "@/lib/gemini";

export function useGuideAssignmentList() {
  const { data: assignments, isLoading } = useGuideAssignments();
  const { data: guides } = useGuideProfiles();
  const assignMutation = useAssignGuide();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<GuideAssignmentStatus | "All">("All");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  
  const [selectedAssignment, setSelectedAssignment] = useState<GuideAssignmentDetail | null>(null);
  const [isAiRecommending, setIsAiRecommending] = useState(false);
  const [aiResults, setAiResults] = useState<Record<string, GuideMatchResult>>({});
  const [aiLoading, setAiLoading] = useState(false);

  const statusLabels: Record<GuideAssignmentStatus, string> = {
    Pending: "미배정(대기)",
    Assigned: "배정완료",
    "In Progress": "진행중",
    Completed: "완료됨",
    Cancelled: "취소됨",
  };

  const filteredAssignments = assignments?.filter((a) => {
    const matchesSearch = a.title.includes(search) || a.clientName.includes(search);
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOverlappingAssignment = (guideId: string) => {
    if (!selectedAssignment) return null;
    const s1 = new Date(selectedAssignment.startDate).getTime();
    const e1 = new Date(selectedAssignment.endDate).getTime();
    
    return assignments?.find(a => {
      if (a.assignedGuideId !== guideId) return false;
      if (a.id === selectedAssignment.id) return false;
      if (a.status === 'Cancelled') return false;
      const s2 = new Date(a.startDate).getTime();
      const e2 = new Date(a.endDate).getTime();
      return Math.max(s1, s2) <= Math.min(e1, e2);
    }) || null;
  };

  // AI 매칭 분석 실행
  const runAiAnalysis = useCallback(async () => {
    if (!selectedAssignment || !guides) return;
    setAiLoading(true);
    
    const activeGuides = guides.filter(g => g.status === 'Active');
    const results: Record<string, GuideMatchResult> = {};
    
    // 병렬 호출 (Gemini API 또는 fallback)
    await Promise.all(
      activeGuides.map(async (guide) => {
        const overlap = getOverlappingAssignment(guide.id);
        if (overlap) {
          results[guide.id] = {
            score: 10,
            reason: `일정 겹침: ${overlap.title} (${overlap.startDate}~${overlap.endDate})`,
            strengths: [],
            risks: ["일정 충돌"],
          };
          return;
        }
        
        try {
          results[guide.id] = await analyzeGuideMatch({
            assignmentTitle: selectedAssignment.title,
            clientName: selectedAssignment.clientName,
            startDate: selectedAssignment.startDate,
            endDate: selectedAssignment.endDate,
            guide,
          });
        } catch {
          results[guide.id] = { score: 50, reason: "분석 실패", strengths: [], risks: [] };
        }
      })
    );

    setAiResults(results);
    setAiLoading(false);
  }, [selectedAssignment, guides, assignments]);

  // AI 모드 <> 토글 시 분석 실행
  useEffect(() => {
    if (isAiRecommending && selectedAssignment) {
      runAiAnalysis();
    }
  }, [isAiRecommending, selectedAssignment]);

  const handleAssign = async (guideId: string, aiScore?: number) => {
    if (!selectedAssignment) return;
    
    const overlap = getOverlappingAssignment(guideId);
    if (overlap) {
      if (!window.confirm(`[과부하/중복 경고]\n이 가이드는 같은 기간에 다른 행사(${overlap.title})가 배정되어 있습니다. 진행하시겠습니까?`)) {
        return;
      }
    }

    try {
      await assignMutation.mutateAsync({ assignmentId: selectedAssignment.id, guideId, aiScore });
      toast({
        title: "배정 완료",
        description: "가이드 배정이 성공적으로 처리되었습니다.",
        variant: "success",
      });
      setSelectedAssignment(null);
    } catch (e) {
      toast({
        title: "배정 실패",
        description: "가이드 배정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const getAiScore = (guideId: string) => {
    // AI 분석 결과가 있으면 사용, 없으면 기본 점수
    if (aiResults[guideId]) return aiResults[guideId].score;
    
    const guide = guides?.find(g => g.id === guideId);
    if (!guide) return 0;
    
    const overlap = getOverlappingAssignment(guideId);
    if (overlap) return 10;
    
    let baseScore = 70;
    if (guide.tier === 'Diamond') baseScore += 25;
    if (guide.tier === 'Platinum') baseScore += 20;
    if (guide.tier === 'Gold') baseScore += 15;
    baseScore += guide.rating * 2;
    if (guide.complaint_count === 0) baseScore += 5;
    return Math.min(99, Math.round(baseScore));
  };

  const activeGuides = guides?.filter(g => g.status === 'Active') || [];
  
  // Sort by AI score if recommending
  const sortedGuides = [...activeGuides].sort((a, b) => {
    if (isAiRecommending) {
      return getAiScore(b.id) - getAiScore(a.id);
    }
    return b.rating - a.rating;
  });

  return {
    isLoading,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    viewMode,
    setViewMode,
    selectedAssignment,
    setSelectedAssignment,
    isAiRecommending,
    setIsAiRecommending,
    aiResults,
    aiLoading,
    statusLabels,
    filteredAssignments,
    getOverlappingAssignment,
    runAiAnalysis,
    handleAssign,
    getAiScore,
    sortedGuides,
    assignMutationIsPending: assignMutation.isPending,
    isGeminiAvailable
  };
}
