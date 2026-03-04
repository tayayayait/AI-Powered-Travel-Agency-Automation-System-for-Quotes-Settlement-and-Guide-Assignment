import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettlement, useUpdateSettlement } from "@/hooks/use-settlements";
import { StatusBadge } from "@/components/ui/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/currency";
import { SettlementFormData } from "@/types/settlement";
import { useToast } from "@/components/ui/use-toast";
import { useAutosave } from "@/hooks/use-autosave";
import { SettlementExpenseGrid } from "@/components/settlement/SettlementExpenseGrid";
import { ShoppingSalesGrid } from "@/components/settlement/ShoppingSalesGrid";
import { OptionSalesGrid } from "@/components/settlement/OptionSalesGrid";
import { UnexpectedExpensesGrid } from "@/components/settlement/UnexpectedExpensesGrid";

export default function SettlementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: settlement, isLoading, error } = useSettlement(id || "");
  const updateMutation = useUpdateSettlement();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<SettlementFormData>>({});

  useEffect(() => {
    if (settlement) {
      setFormData(settlement);
    }
  }, [settlement]);

  // 집계 로직
  const totalExpectedKRW = settlement?.totalExpectedKRW || 0; // 견적가 
  
  const totalActualExpenses = formData.expenses?.reduce((sum, e) => sum + (e.amountActual || 0), 0) || 0;
  
  let guideFee = 0;
  let shoppingCommission = 0;
  let optionCommission = 0;

  formData.shoppingSales?.forEach(s => {
    const comm = s.sales_amount * (s.commission_rate / 100);
    guideFee += (comm * 0.5);
    shoppingCommission += (comm * 0.5);
  });

  formData.optionSales?.forEach(s => {
    const total = s.quantity * s.unit_price;
    const guideShare = total * (s.guide_share_rate / 100);
    guideFee += guideShare;
    optionCommission += (total - guideShare);
  });

  const unexpectedTotal = formData.unexpectedExpenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

  const netProfit = totalExpectedKRW + shoppingCommission + optionCommission - totalActualExpenses - unexpectedTotal;
  const netMargin = totalExpectedKRW > 0 ? (netProfit / totalExpectedKRW) * 100 : 0;
  
  const calculatedMetrics = {
    totalActualKRW: totalActualExpenses + unexpectedTotal,
    balanceKRW: netProfit, // For now, treat balance as profit equivalent
    guideFee,
    shoppingCommission,
    optionCommission,
    profitKRW: netProfit,
    profitRate: netMargin,
  };

  // 자동 저장 로직 연동
  const saveToServer = async (data: Partial<SettlementFormData>) => {
    if (!id) return;
    try {
      await updateMutation.mutateAsync({ id, data: { ...data, ...calculatedMetrics } });
      console.log("Auto-saved:", data);
    } catch (err: any) {
      console.error("Auto-save failed", err);
    }
  };

  const { isSaving } = useAutosave(formData, saveToServer, 3000);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Card><CardContent className="h-64"></CardContent></Card>
      </div>
    );
  }

  if (error || !settlement) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-destructive mb-4">정산 내역을 불러오지 못했습니다.</p>
        <Button onClick={() => navigate("/admin/settlements")}>목록으로 돌아가기</Button>
      </div>
    );
  }

  const handleApprove = async () => {
    try {
      await updateMutation.mutateAsync({ id: settlement.id, data: { ...formData, ...calculatedMetrics, status: "Completed" } });
      setFormData(prev => ({ ...prev, status: "Completed" }));
      toast({
        title: "정산 마감 완료",
        description: "정산 내역이 마감 검토를 통과하여 확정되었습니다.",
        variant: "success",
      });
    } catch (e: any) {
      toast({
        title: "마감 실패",
        description: e.message || "오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const isReadonly = formData.status === "Completed" || formData.status === "Disputed";

  // 항목 수정 핸들러
  const handleExpenseChange = (index: number, field: keyof any, value: any) => {
    const arr = [...(formData.expenses || [])];
    arr[index] = { ...arr[index], [field]: value };
    setFormData(prev => ({ ...prev, expenses: arr }));
  };

  const handleShoppingChange = (index: number, field: keyof any, value: any) => {
    const arr = [...(formData.shoppingSales || [])];
    arr[index] = { ...arr[index], [field]: value };
    setFormData(prev => ({ ...prev, shoppingSales: arr }));
  };

  const handleOptionChange = (index: number, field: keyof any, value: any) => {
    const arr = [...(formData.optionSales || [])];
    arr[index] = { ...arr[index], [field]: value };
    setFormData(prev => ({ ...prev, optionSales: arr }));
  };

  const handleUnexpectedChange = (index: number, field: keyof any, value: any) => {
    const arr = [...(formData.unexpectedExpenses || [])];
    arr[index] = { ...arr[index], [field]: value };
    setFormData(prev => ({ ...prev, unexpectedExpenses: arr }));
  };

  // 항목 추가/삭제 핸들러
  const addShopping = () => setFormData(p => ({ ...p, shoppingSales: [...(p.shoppingSales || []), { shop_name: "", sales_amount: 0, commission_rate: 10, guide_share: 0, company_share: 0, currency: "THB" } as any] }));
  const removeShopping = (idx: number) => setFormData(p => ({ ...p, shoppingSales: p.shoppingSales?.filter((_, i) => i !== idx) }));

  const addOption = () => setFormData(p => ({ ...p, optionSales: [...(p.optionSales || []), { option_name: "", quantity: 1, unit_price: 0, total_amount: 0, guide_share_rate: 50, guide_share: 0, company_share: 0, currency: "THB" } as any] }));
  const removeOption = (idx: number) => setFormData(p => ({ ...p, optionSales: p.optionSales?.filter((_, i) => i !== idx) }));

  const addUnexpected = () => setFormData(p => ({ ...p, unexpectedExpenses: [...(p.unexpectedExpenses || []), { description: "", amount: 0, currency: "THB", auto_approved: true, requires_review: false, status: "Pending" } as any] }));
  const removeUnexpected = (idx: number) => setFormData(p => ({ ...p, unexpectedExpenses: p.unexpectedExpenses?.filter((_, i) => i !== idx) }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">정산 상세 내역</h1>
          <p className="text-sm text-muted-foreground flex gap-2 items-center mt-1">
            {settlement.id}
            <StatusBadge 
              status={
                formData.status === "Pending" ? "InReview" :
                formData.status === "Completed" ? "Approved" : "Rejected"
              } 
              label={
                formData.status === "Pending" ? "검토 / 진행중" :
                formData.status === "Completed" ? "완료됨" : "보류/이슈"
              }
            />
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground mr-4">
            {isSaving ? "저장 중..." : "모든 변경사항이 저장됨"}
          </span>
          <Button variant="outline" onClick={() => navigate("/admin/settlements")}>
            목록으로
          </Button>
          <Button disabled={isReadonly} onClick={handleApprove}>
            정산 최종 마감 (검토 완료)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>연동 견적 요약</CardTitle>
              <div className="text-sm">
                <span className="text-muted-foreground mr-2">행사명:</span>
                <span className="font-semibold">{settlement.title} ({settlement.clientName})</span>
              </div>
            </CardHeader>
            <CardContent>
              <SettlementExpenseGrid 
                expenses={formData.expenses || []} 
                onChange={handleExpenseChange}
                readonly={isReadonly}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>가이드 매출 신고 (쇼핑 / 옵션)</CardTitle>
              <p className="text-sm text-muted-foreground">가이드가 현지에서 발생시킨 추가 매출 내역입니다.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ShoppingSalesGrid 
                sales={formData.shoppingSales || []}
                onAdd={addShopping}
                onRemove={removeShopping}
                onChange={handleShoppingChange}
                readonly={isReadonly}
              />

              <OptionSalesGrid 
                sales={formData.optionSales || []}
                onAdd={addOption}
                onRemove={removeOption}
                onChange={handleOptionChange}
                readonly={isReadonly}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>돌발 지출 (Unexpected Expenses)</CardTitle>
            </CardHeader>
            <CardContent>
              <UnexpectedExpensesGrid
                expenses={formData.unexpectedExpenses || []}
                onAdd={addUnexpected}
                onRemove={removeUnexpected}
                onChange={handleUnexpectedChange}
                readonly={isReadonly}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* 사이드바 - 최종 대사 및 손익 */}
        <div className="space-y-6 sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle>최종 대사 결과 (영업이익)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 수익 탭 */}
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-semibold text-primary">수익 (Revenue)</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">견적가(청구액)</span>
                  <span className="font-medium">{formatCurrency(totalExpectedKRW, "KRW")}원</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">쇼핑 커미션 (회사몫)</span>
                  <span className="font-medium text-blue-600">+{formatCurrency(shoppingCommission, "KRW")}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">옵션 커미션 (회사몫)</span>
                  <span className="font-medium text-blue-600">+{formatCurrency(optionCommission, "KRW")}</span>
                </div>
              </div>
              
              <div className="border-t"></div>

              {/* 지출 탭 */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-destructive">지출 (Cost)</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">실제 원가 지출</span>
                  <span className="font-medium text-destructive">-{formatCurrency(totalActualExpenses, "KRW")}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">돌발 지출 승인액</span>
                  <span className="font-medium text-destructive">-{formatCurrency(unexpectedTotal, "KRW")}</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg">최종 마진(이익)</span>
                  <div className="text-right">
                    <span className={`font-bold text-2xl tracking-tight block ${netProfit < 0 ? 'text-destructive' : 'text-success'}`}>
                      {formatCurrency(netProfit, "KRW")}원
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                      마진율: {netMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {isReadonly && (
                <div className="bg-success/10 text-success-foreground p-3 rounded-md text-sm text-center font-medium mt-4">
                  마감 완료 (정가 및 정산 데이터 확정됨)
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
