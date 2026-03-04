import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateSettlement } from "@/hooks/use-settlements";
import { useQuotations } from "@/hooks/use-quotations";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/currency";

export default function SettlementCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMutation = useCreateSettlement();
  
  // 승인 완료된 견적만 조회
  const { data: quotations, isLoading: qLoading } = useQuotations();
  const approvedQuotations = quotations?.filter(q => q.status === "Approved" || q.status === "Locked") || [];

  const [selectedQuotationId, setSelectedQuotationId] = useState<string>("");

  const selectedQuotation = approvedQuotations.find(q => q.id === selectedQuotationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuotationId) {
      toast({
        title: "견적 선택 필요",
        description: "정산을 생성할 견적을 먼저 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const settlement = await createMutation.mutateAsync(selectedQuotationId);
      toast({
        title: "정산 생성 완료",
        description: "견적 정보가 연동되어 정산서가 생성되었습니다.",
      });
      navigate(`/admin/settlements/${settlement.id}`);
    } catch (error: any) {
      toast({
        title: "생성 실패",
        description: error.message || "오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">정산서 생성</h1>
          <p className="text-muted-foreground mt-1">승인이 완료된 견적서를 바탕으로 새로운 정산을 시작합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/settlements")}>
            목록으로
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending || !selectedQuotationId}>
            {createMutation.isPending ? "생성 중..." : "정산서 생성 및 연동"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>연동할 견적 선택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-xl">
            <Select 
              value={selectedQuotationId} 
              onValueChange={setSelectedQuotationId}
              disabled={qLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={qLoading ? "견적 목록 불러오는 중..." : "정산할 견적을 선택하세요 (승인/확정 상태)"} />
              </SelectTrigger>
              <SelectContent>
                {approvedQuotations.map(q => (
                  <SelectItem key={q.id} value={q.id}>
                    {q.id.split('-')[0]} - {q.title} ({q.clientName})
                  </SelectItem>
                ))}
                {approvedQuotations.length === 0 && !qLoading && (
                  <SelectItem value="empty" disabled>선택 가능한 승인된 견적이 없습니다.</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedQuotation && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">행사명</span>
                <span className="font-medium">{selectedQuotation.title}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">고객사</span>
                <span className="font-medium">{selectedQuotation.clientName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">행사 일정</span>
                <span className="font-medium">{selectedQuotation.startDate} ~ {selectedQuotation.endDate} ({selectedQuotation.paxCount}명)</span>
              </div>
              <div>
                <span className="text-muted-foreground block mb-1">예상 지출(견적 원가)</span>
                <span className="font-medium text-primary">{formatCurrency(selectedQuotation.totalCostKRW, "KRW")}원</span>
              </div>
              <div className="col-span-2 mt-2 text-muted-foreground text-xs">
                * [정산서 생성 및 연동] 버튼을 누르면 위 견적의 지출 원가 항목이 정산 예정 비용으로 자동 복사됩니다.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
