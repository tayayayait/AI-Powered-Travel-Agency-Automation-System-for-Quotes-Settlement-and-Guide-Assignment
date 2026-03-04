import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateQuotation } from "@/hooks/use-quotations";
import { QuotationFormData, QuotationCostItem } from "@/types/quotation";
import { PackageType, CurrencyCode } from "@/types/index";
import { useToast } from "@/components/ui/use-toast";
import { format, addDays, differenceInDays } from "date-fns";
import { Sparkles, Plus, Trash2, Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PACKAGE_DEFAULT_MARGINS, PACKAGE_LABELS, calcCostItemKRW, calcQuotationSummary } from "@/lib/pricing";
import { checkMarginRule } from "@/lib/validators";
import { formatCurrency } from "@/lib/currency";

type CostFormItem = Omit<QuotationCostItem, "id" | "quotation_id" | "calcAmountKRW">;
type ScheduleFormItem = { dayNumber: number; date: string; description: string };

const COST_CATEGORIES = [
  { value: "Hotel", label: "숙박" },
  { value: "Transport", label: "교통" },
  { value: "Guide", label: "가이드비" },
  { value: "Meal", label: "식사" },
  { value: "Ticket", label: "입장료" },
  { value: "Other", label: "기타" },
] as const;

const emptyCostItem: CostFormItem = {
  category: "Hotel",
  description: "",
  unitPrice: 0,
  quantity: 1,
  days: 1,
  currency: "THB" as CurrencyCode,
  exchangeRate: 39.5,
};

export default function QuotationCreate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMutation = useCreateQuotation();

  const [formData, setFormData] = useState<QuotationFormData>({
    title: "",
    clientName: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(addDays(new Date(), 3), "yyyy-MM-dd"),
    paxCount: 1,
    packageType: "standard",
    targetMarginPercentage: PACKAGE_DEFAULT_MARGINS["standard"],
    schedules: [],
    costs: [],
  });
  
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ─── 자동 계산 ───
  const summary = useMemo(() => {
    return calcQuotationSummary(
      formData.costs,
      formData.targetMarginPercentage,
      formData.paxCount
    );
  }, [formData.costs, formData.targetMarginPercentage, formData.paxCount]);

  const marginStatus = useMemo(() => {
    return checkMarginRule(summary.actualMarginPercentage);
  }, [summary.actualMarginPercentage]);

  // ─── 패키지 유형 변경 시 기본 마진 자동 적용 ───
  const handlePackageChange = (value: string) => {
    const pkg = value as PackageType;
    setFormData(prev => ({
      ...prev,
      packageType: pkg,
      targetMarginPercentage: PACKAGE_DEFAULT_MARGINS[pkg],
    }));
  };

  // ─── 일정 자동 생성 ───
  const generateSchedules = () => {
    if (!formData.startDate || !formData.endDate) return;
    const days = differenceInDays(new Date(formData.endDate), new Date(formData.startDate)) + 1;
    if (days <= 0) return;
    
    const newSchedules: ScheduleFormItem[] = Array.from({ length: days }, (_, i) => ({
      dayNumber: i + 1,
      date: format(addDays(new Date(formData.startDate), i), "yyyy-MM-dd"),
      description: i === 0 ? "도착 및 호텔 체크인" : i === days - 1 ? "호텔 체크아웃 및 출발" : `Day ${i + 1} 일정`,
    }));
    
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
    toast({ title: "일정 생성", description: `${days}일 일정이 자동 생성되었습니다.` });
  };

  // ─── 비용 항목 추가/삭제/수정 ───
  const addCostItem = () => {
    setFormData(prev => ({ ...prev, costs: [...prev.costs, { ...emptyCostItem }] }));
  };

  const removeCostItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      costs: prev.costs.filter((_, i) => i !== index),
    }));
  };

  const updateCostItem = (index: number, field: keyof CostFormItem, value: string | number) => {
    setFormData(prev => {
      const updated = [...prev.costs];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, costs: updated };
    });
  };

  // ─── 일정 수정 ───
  const updateSchedule = (index: number, field: keyof ScheduleFormItem, value: string | number) => {
    setFormData(prev => {
      const updated = [...prev.schedules];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, schedules: updated };
    });
  };

  const removeSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };

  // ─── AI 분석 ───
  const handleAiAnalysis = async () => {
    if (!aiPrompt.trim()) {
      toast({ title: "입력 오류", description: "행사 개요를 입력해주세요.", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    try {
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!geminiApiKey) {
        throw new Error("GEMINI API 키가 설정되지 않았습니다. .env 파일에 VITE_GEMINI_API_KEY를 확인하세요.");
      }

      const systemPrompt = `You are an AI assistant for a travel agency. Your goal is to extract information from the user's prompt and output a JSON object describing a travel quotation.
The JSON should follow this structure exactly (no markdown wrapping, just raw JSON):
{
  "title": "string",
  "clientName": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "paxCount": number,
  "targetMarginPercentage": number,
  "schedules": [
    { "dayNumber": number, "date": "YYYY-MM-DD", "description": "string" }
  ],
  "costs": [
    { "category": "Hotel|Transport|Guide|Meal|Ticket|Other", "description": "string", "unitPrice": number, "quantity": number, "days": number, "currency": "KRW|THB|VND|LAK|USD", "exchangeRate": number }
  ]
}
If information is missing, use reasonable defaults or dummy data (targetMarginPercentage default: 15, dates default to today or a few days later).
Make sure to return ONLY valid JSON.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + "\n\nUser Input: " + aiPrompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Gemini API 오류: ${data.error?.message || response.statusText}`);
      }

      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!resultText) throw new Error("AI 응답이 비어있습니다.");

      const parsed = JSON.parse(resultText);
      setFormData(prev => ({
        ...prev,
        title: parsed.title || prev.title,
        clientName: parsed.clientName || prev.clientName,
        startDate: parsed.startDate || prev.startDate,
        endDate: parsed.endDate || prev.endDate,
        paxCount: parsed.paxCount || prev.paxCount,
        packageType: parsed.packageType || prev.packageType,
        targetMarginPercentage: parsed.targetMarginPercentage || prev.targetMarginPercentage,
        schedules: parsed.schedules || prev.schedules,
        costs: parsed.costs || prev.costs,
      }));

      toast({ title: "분석 성공", description: "AI가 견적 정보를 자동으로 채웠습니다." });
      setAiPrompt("");
    } catch (e: any) {
      toast({ title: "AI 분석 실패", description: e.message || "알 수 없는 오류", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ─── 폼 필드 핸들러 ───
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "paxCount" || name === "targetMarginPercentage" ? Number(value) : value,
    }));
  };

  // ─── 제출 ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (marginStatus === "block") {
      toast({ title: "저장 불가", description: "마진율이 0% 미만이어 저장할 수 없습니다.", variant: "destructive" });
      return;
    }
    if (marginStatus === "warn") {
      toast({ title: "마진 경고", description: "권장 마진율(15%)보다 낮습니다. 결재 시 사유가 필요할 수 있습니다.", variant: "warning" });
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({ title: "날짜 오류", description: "종료일은 시작일 이후여야 합니다.", variant: "destructive" });
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      toast({ title: "견적 생성 완료", description: "견적이 성공적으로 저장되었습니다." });
      navigate("/admin/quotations");
    } catch (error) {
      toast({ title: "생성 실패", description: "오류가 발생했습니다.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">새 견적 작성</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/quotations")}>취소</Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending ? "저장 중..." : "견적 저장"}
          </Button>
        </div>
      </div>

      {/* AI 견적 자동 분석 */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5" /> AI 견적 자동 생성
          </CardTitle>
          <CardDescription>
            카카오톡, 이메일 등의 행사 문의 내용을 아래에 붙여넣으시면, AI가 견적서 양식에 맞게 자동 분류합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-start">
            <Textarea
              className="min-h-[100px] flex-1 bg-background"
              placeholder="예) 다음달 3일 방콕으로 4박 5일 30명 워크샵 가려고 합니다..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <Button className="shrink-0 h-[100px] w-[120px] flex flex-col gap-2" onClick={handleAiAnalysis} disabled={isAnalyzing}>
              <Sparkles className="w-6 h-6" />
              {isAnalyzing ? "분석 중..." : "AI 생성"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 기본 정보 */}
      <Card>
        <CardHeader><CardTitle>기본 정보</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">행사명 *</label>
              <Input name="title" value={formData.title} onChange={handleChange} placeholder="예: 2026 하반기 인센티브 단체" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">고객사 *</label>
              <Input name="clientName" value={formData.clientName} onChange={handleChange} placeholder="예: 삼성물산" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">패키지 유형</label>
              <Select value={formData.packageType} onValueChange={handlePackageChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(PACKAGE_LABELS) as [PackageType, string][]).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label} (기본 마진 {PACKAGE_DEFAULT_MARGINS[key]}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">시작일</label>
              <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">종료일</label>
              <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">참여 인원 (명)</label>
              <Input type="number" name="paxCount" min="1" value={formData.paxCount} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">목표 마진율 (%)</label>
              <Input type="number" name="targetMarginPercentage" min="-100" max="100" value={formData.targetMarginPercentage} onChange={handleChange} required />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 일정 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>일정표 ({formData.schedules.length}일)</CardTitle>
            <Button variant="outline" size="sm" onClick={generateSchedules}>
              <Calculator className="w-4 h-4 mr-2" /> 날짜 기준 자동 생성
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              위 날짜를 설정한 후 "자동 생성" 버튼을 누르면 일정이 생성됩니다.
            </p>
          ) : (
            <div className="space-y-3">
              {formData.schedules.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border">
                  <span className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    D{s.dayNumber}
                  </span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                    <Input type="date" value={s.date} onChange={(e) => updateSchedule(i, "date", e.target.value)} className="text-sm" />
                    <Input value={s.description} onChange={(e) => updateSchedule(i, "description", e.target.value)} placeholder="일정 내용" className="text-sm" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeSchedule(i)} className="shrink-0 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 비용 내역 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>비용 내역 ({formData.costs.length}건)</CardTitle>
            <Button variant="outline" size="sm" onClick={addCostItem}>
              <Plus className="w-4 h-4 mr-2" /> 항목 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {formData.costs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-3">비용 항목이 없습니다.</p>
              <Button variant="outline" onClick={addCostItem}><Plus className="w-4 h-4 mr-2" /> 첫 번째 항목 추가</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* 헤더 (데스크탑) */}
              <div className="hidden md:grid grid-cols-[100px_1fr_90px_60px_60px_80px_80px_90px_40px] gap-2 px-3 text-xs font-medium text-muted-foreground">
                <span>카테고리</span><span>설명</span><span>단가</span><span>수량</span>
                <span>일수</span><span>통화</span><span>환율</span><span className="text-right">KRW 합계</span><span></span>
              </div>
              {formData.costs.map((c, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[100px_1fr_90px_60px_60px_80px_80px_90px_40px] gap-2 p-3 rounded-lg bg-muted/30 border items-center">
                  <Select value={c.category} onValueChange={(v) => updateCostItem(i, "category", v)}>
                    <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {COST_CATEGORIES.map(cat => <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input value={c.description} onChange={(e) => updateCostItem(i, "description", e.target.value)} placeholder="항목 설명" className="text-sm h-9" />
                  <Input type="number" value={c.unitPrice} onChange={(e) => updateCostItem(i, "unitPrice", Number(e.target.value))} className="text-sm h-9 text-right" min="0" />
                  <Input type="number" value={c.quantity} onChange={(e) => updateCostItem(i, "quantity", Number(e.target.value))} className="text-sm h-9 text-right" min="1" />
                  <Input type="number" value={c.days} onChange={(e) => updateCostItem(i, "days", Number(e.target.value))} className="text-sm h-9 text-right" min="1" />
                  <Select value={c.currency} onValueChange={(v) => updateCostItem(i, "currency", v)}>
                    <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KRW">KRW</SelectItem>
                      <SelectItem value="THB">THB</SelectItem>
                      <SelectItem value="VND">VND</SelectItem>
                      <SelectItem value="LAK">LAK</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" value={c.exchangeRate} onChange={(e) => updateCostItem(i, "exchangeRate", Number(e.target.value))} className="text-sm h-9 text-right" min="0" step="0.01" />
                  <span className="text-sm font-medium text-right tabular-nums">
                    {formatCurrency(calcCostItemKRW(c), "KRW")}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => removeCostItem(i)} className="h-9 w-9 text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 견적 요약 */}
      {formData.costs.length > 0 && (
        <Card className={marginStatus === "block" ? "border-destructive bg-destructive/5" : marginStatus === "warn" ? "border-warning bg-warning/5" : "border-success/30 bg-success/5"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" /> 견적 요약 (자동 계산)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">총 원가 (KRW)</p>
                <p className="text-lg font-bold tabular-nums">{formatCurrency(summary.totalCostKRW, "KRW")}원</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">제안 단가/인 (KRW)</p>
                <p className="text-lg font-bold text-primary tabular-nums">{formatCurrency(summary.proposedPricePerPax, "KRW")}원</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">제안 총액 (KRW)</p>
                <p className="text-lg font-bold tabular-nums">{formatCurrency(summary.proposedTotalKRW, "KRW")}원</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">실 마진율</p>
                <p className={`text-lg font-bold tabular-nums ${marginStatus === "block" ? "text-destructive" : marginStatus === "warn" ? "text-warning" : "text-success"}`}>
                  {summary.actualMarginPercentage}%
                  {marginStatus === "block" && " ⛔ 차단"}
                  {marginStatus === "warn" && " ⚠️ 경고"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
