import { useQuotations } from "@/hooks/use-quotations";
import { useSettlements } from "@/hooks/use-settlements";
import { useGuideAssignments } from "@/hooks/use-guides";
import { formatCurrency } from "@/lib/currency";

export function useDashboard() {
  const { data: quotations, isLoading: qLoading } = useQuotations();
  const { data: settlements, isLoading: sLoading } = useSettlements();
  const { data: assignments, isLoading: gLoading } = useGuideAssignments();

  const isLoading = qLoading || sLoading || gLoading;

  // KPI 계산
  const totalQuotations = quotations?.length || 0;
  const pendingReview = quotations?.filter(q => q.status === "InReview").length || 0;
  const approved = quotations?.filter(q => q.status === "Approved" || q.status === "Locked").length || 0;
  const rejected = quotations?.filter(q => q.status === "Rejected").length || 0;

  const pendingSettlements = settlements?.filter(s => s.status === "Pending").length || 0;
  const unassignedGuides = assignments?.filter(a => a.status === "Pending").length || 0;

  return {
    quotations,
    settlements,
    assignments,
    isLoading,
    totalQuotations,
    pendingReview,
    approved,
    rejected,
    pendingSettlements,
    unassignedGuides,
    formatCurrency
  };
}
