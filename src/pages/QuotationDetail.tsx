import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuotation } from "@/hooks/use-quotations";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import { useAutosave } from "@/hooks/use-autosave";
import { QuotationDetail as QuotationDetailType } from "@/types/quotation";
import { useToast } from "@/components/ui/use-toast";
import { ApprovalFlow } from "@/components/quotation/ApprovalFlow";
import { ChangeHistory } from "@/components/quotation/ChangeHistory";
import { QuotationPDF } from "@/components/quotation/QuotationPDF";

export default function QuotationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: quotation, isLoading, error } = useQuotation(id || "");
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<QuotationDetailType>>({});

  useEffect(() => {
    if (quotation) {
      setFormData(quotation);
    }
  }, [quotation]);

  // 임시 저장 MOCK 동작 (Phase 1)
  const saveToServer = async (data: Partial<QuotationDetailType>) => {
    console.log("Auto-saving data to server:", data);
    // 실제 API 연동 시 supabase.from('quotations').update(...) 호출
    toast({
      title: "자동 저장됨",
      description: "견적 내용이 임시 저장되었습니다.",
    });
  };

  const { isSaving } = useAutosave(formData, saveToServer, 3000);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Card><CardContent className="h-64"></CardContent></Card>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-destructive mb-4">견적 정보를 불러오지 못했습니다.</p>
        <Button onClick={() => navigate("/admin/quotations")}>목록으로 돌아가기</Button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "paxCount" || name === "targetMarginPercentage" 
        ? Number(value) 
        : value,
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">견적 상세</h1>
          <p className="text-sm text-muted-foreground flex gap-2 items-center mt-1">
            {quotation.id}
            <StatusBadge status={quotation.status} />
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground mr-4">
            {isSaving ? "저장 중..." : "모든 변경사항이 저장됨"}
          </span>
          <ApprovalFlow
            quotationId={quotation.id}
            currentStatus={quotation.status}
            marginPercentage={formData.actualMarginPercentage || formData.targetMarginPercentage || 15}
            onStatusChange={(newStatus, reason) => {
              console.log("Status Changed:", newStatus, reason);
              setFormData(prev => ({ ...prev, status: newStatus }));
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">행사명</label>
                  <Input
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    readOnly={quotation.status === "Locked" || quotation.status === "Approved"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">고객사</label>
                  <Input
                    name="clientName"
                    value={formData.clientName || ""}
                    onChange={handleChange}
                    readOnly={quotation.status === "Locked" || quotation.status === "Approved"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">시작일</label>
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ""}
                    onChange={handleChange}
                    readOnly={quotation.status === "Locked" || quotation.status === "Approved"}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">종료일</label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ""}
                    onChange={handleChange}
                    readOnly={quotation.status === "Locked" || quotation.status === "Approved"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 하위 일정, 비용 탭 또는 카드 자리 */}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">총 원가</span>
                <span className="font-medium">{formatCurrency(quotation.totalCostKRW, "KRW")}원</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">목표 마진율</span>
                <span className="font-medium">{formData.targetMarginPercentage || 0}%</span>
              </div>
              <div className="flex justify-between items-center text-sm border-t pt-4 mt-4">
                <span className="font-semibold">제안 단가/건</span>
                <span className="font-bold text-lg text-primary">
                  {formatCurrency(quotation.proposedPriceKRW, "KRW")}원
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* 변경 이력 */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <ChangeHistory />
        </CardContent>
      </Card>
      
      {/* PDF 미리보기 영역 (Mock) */}
      {(quotation.status === "Approved" || quotation.status === "Locked") && (
        <Card className="mt-6 bg-slate-100/50">
          <CardHeader>
            <CardTitle>견적서 생성 (PDF)</CardTitle>
          </CardHeader>
          <CardContent>
            <QuotationPDF data={quotation} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
