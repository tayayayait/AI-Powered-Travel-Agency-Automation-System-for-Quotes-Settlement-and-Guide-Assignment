import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuotationStatus } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateQuotationStatus } from "@/hooks/use-quotations";

interface ApprovalFlowProps {
  quotationId: string;
  currentStatus: QuotationStatus;
  marginPercentage: number;
  onStatusChange: (newStatus: QuotationStatus, reason?: string) => void;
}

export function ApprovalFlow({ quotationId, currentStatus, marginPercentage, onStatusChange }: ApprovalFlowProps) {
  const { toast } = useToast();
  const updateStatus = useUpdateQuotationStatus();
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  const handleStatusChange = async (newStatus: QuotationStatus, reason?: string) => {
    try {
      await updateStatus.mutateAsync({
        quotationId,
        previousStatus: currentStatus,
        newStatus,
        reason,
      });
      onStatusChange(newStatus, reason);
    } catch (e: any) {
      toast({
        title: "상태 변경 실패",
        description: e.message || "DB 업데이트 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleRequestReview = async () => {
    if (marginPercentage < 0) {
      toast({ title: "상신 차단", description: "마진율이 0% 미만인 견적은 상신할 수 없습니다.", variant: "destructive" });
      return;
    }
    if (marginPercentage < 15) {
      toast({ title: "마진 경고", description: "권장 마진(15%)보다 낮습니다. 결재자에게 사유가 소명되어야 합니다.", variant: "warning" });
    }

    await handleStatusChange("InReview");
    toast({ title: "결재 상신 완료", description: "해당 견적의 결재가 요청되었습니다." });
  };

  const handleApprove = async () => {
    await handleStatusChange("Approved");
    setIsApproveModalOpen(false);
    toast({ title: "승인 완료", description: "견적이 최종 승인되었습니다. PDF 및 정산서 발행이 가능합니다." });
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({ title: "반려 사유 필수", description: "반려 시에는 반드시 사유를 입력해야 합니다.", variant: "destructive" });
      return;
    }
    await handleStatusChange("Rejected", rejectReason);
    setIsRejectModalOpen(false);
    setRejectReason("");
    toast({ title: "반려 처리", description: "견적이 반려되었습니다." });
  };

  const isProcessing = updateStatus.isPending;

  return (
    <div className="flex gap-2 items-center">
      {currentStatus === "Draft" || currentStatus === "Rejected" ? (
        <Button onClick={handleRequestReview} disabled={isProcessing}>
          {isProcessing ? "처리 중..." : "결재 상신"}
        </Button>
      ) : null}

      {currentStatus === "InReview" ? (
        <>
          <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-success text-success-foreground hover:bg-success/90" disabled={isProcessing}>승인하기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>견적 승인</DialogTitle>
                <DialogDescription>
                  해당 견적을 승인하시겠습니까? 승인 후에는 내용을 수정할 수 없습니다.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>취소</Button>
                <Button onClick={handleApprove} disabled={isProcessing}>
                  {isProcessing ? "처리 중..." : "승인 확정"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={isProcessing}>반려하기</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>견적 반려</DialogTitle>
                <DialogDescription>
                  반려 사유를 입력해주세요. 작성자에게 알림이 전송됩니다.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input 
                  placeholder="예: 마진율 부족, 단가 재확인 요망 등" 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>취소</Button>
                <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
                  {isProcessing ? "처리 중..." : "반려 처리"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : null}
      
      {currentStatus === "Approved" || currentStatus === "Locked" ? (
        <Button variant="outline" disabled={true}>
          PDF / 엑셀 출력 가능
        </Button>
      ) : null}
    </div>
  );
}
