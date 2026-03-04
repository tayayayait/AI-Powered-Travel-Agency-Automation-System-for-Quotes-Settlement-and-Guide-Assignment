import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, CreditCard, ChevronRight, UserCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGuideAssignments } from "@/hooks/use-guides";
import { GuideAssignmentStatus } from "@/types/guide";

const statusLabels: Record<GuideAssignmentStatus, { label: string; color: string }> = {
  Pending: { label: "배정 대기", color: "bg-amber-100 text-amber-800" },
  Assigned: { label: "배정 완료", color: "bg-blue-100 text-blue-800" },
  "In Progress": { label: "진행 중", color: "bg-green-100 text-green-800" },
  Completed: { label: "완료", color: "bg-slate-100 text-slate-600" },
  Cancelled: { label: "취소", color: "bg-red-100 text-red-700" },
};

export default function GuideMain() {
  const { data: assignments, isLoading } = useGuideAssignments();
  const navigate = useNavigate();
  
  // 오늘 날짜 기준 진행 중/배정 완료 행사 필터
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const activeAssignments = assignments?.filter(a => {
    const start = new Date(a.startDate);
    const end = new Date(a.endDate);
    return (a.status === "In Progress" || a.status === "Assigned") && end >= today;
  }) || [];

  const upcomingAssignments = assignments?.filter(a => {
    const start = new Date(a.startDate);
    return a.status === "Assigned" && start > today;
  }) || [];

  const currentAssignment = activeAssignments.find(a => {
    const start = new Date(a.startDate);
    const end = new Date(a.endDate);
    return start <= today && end >= today && a.status === "In Progress";
  }) || activeAssignments[0];

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffDays = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    const nights = Math.max(0, diffDays - 1);
    return `${s.toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })} ~ ${e.toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit" })} (${nights}박 ${diffDays}일)`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold mb-2">오늘의 일정</h1>
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold mb-2">오늘의 일정</h1>
      
      {currentAssignment ? (
        <Card className="border-primary/20 shadow-sm cursor-pointer hover:shadow-md transition-shadow bg-white">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-center mb-1">
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${statusLabels[currentAssignment.status as GuideAssignmentStatus]?.color || "bg-slate-100 text-slate-600"}`}>
                {statusLabels[currentAssignment.status as GuideAssignmentStatus]?.label || currentAssignment.status}
              </span>
              <span className="text-xs text-muted-foreground">#{currentAssignment.id.substring(0, 8)}</span>
            </div>
            <CardTitle className="text-base font-semibold">{currentAssignment.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {formatDateRange(currentAssignment.startDate, currentAssignment.endDate)}
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                고객: {currentAssignment.clientName}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm font-medium text-primary">
              일정 상세 보기
              <ChevronRight className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-2">
            <Calendar className="w-10 h-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">오늘 예정된 일정이 없습니다.</p>
            <p className="text-xs text-slate-400">배정된 행사가 있으면 여기에 표시됩니다.</p>
          </CardContent>
        </Card>
      )}

      {/* 예정된 행사 */}
      {upcomingAssignments.length > 0 && (
        <div className="mt-2">
          <h2 className="text-sm font-semibold text-slate-600 mb-2">🗓 예정된 행사 ({upcomingAssignments.length}건)</h2>
          <div className="space-y-2">
            {upcomingAssignments.slice(0, 3).map(a => (
              <Card key={a.id} className="bg-white border-slate-200 hover:shadow-sm transition-shadow cursor-pointer">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDateRange(a.startDate, a.endDate)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mt-2">
        <Card className="bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => navigate("/admin/settlements")}>
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            <span className="text-sm font-semibold text-primary">정산 보관함</span>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => navigate("/admin/guide-assignment")}>
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
            <Calendar className="w-6 h-6 text-slate-600" />
            <span className="text-sm font-semibold text-slate-600">전체 일정</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
