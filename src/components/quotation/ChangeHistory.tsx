import { useApprovalLogs, useChangeHistory } from "@/hooks/use-quotations";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, ArrowRight } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  Draft: "초안",
  InReview: "검토 중",
  Approved: "승인됨",
  Rejected: "반려됨",
  Locked: "잠금",
};

export function ChangeHistory() {
  const { id } = useParams<{ id: string }>();
  const { data: logs, isLoading } = useApprovalLogs(id || "");

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4" /> 승인 이력
      </h3>
      {!logs || logs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">아직 상태 변경 이력이 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center gap-3 text-sm p-3 rounded-lg bg-muted/30 border">
              <span className="text-xs text-muted-foreground min-w-[140px]">
                {new Date(log.created_at).toLocaleString("ko-KR")}
              </span>
              <span className="font-medium">
                {STATUS_LABELS[log.previous_status] || log.previous_status}
              </span>
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="font-medium text-primary">
                {STATUS_LABELS[log.new_status] || log.new_status}
              </span>
              {log.reason && (
                <span className="text-muted-foreground ml-auto text-xs truncate max-w-[200px]" title={log.reason}>
                  사유: {log.reason}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
