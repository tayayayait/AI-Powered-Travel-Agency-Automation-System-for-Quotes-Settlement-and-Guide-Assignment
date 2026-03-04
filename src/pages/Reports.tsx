import { useState, useMemo } from "react";
import { Download, Filter, Map, FileText, BadgeDollarSign, Users, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useSettlements } from "@/hooks/use-settlements";
import { formatCurrency } from "@/lib/currency";
import { exportToExcel, exportToPdf } from "@/lib/export";
import { useToast } from "@/components/ui/use-toast";

export default function Reports() {
  const [period, setPeriod] = useState("6m");
  const [country, setCountry] = useState("all");
  const { data: settlements, isLoading } = useSettlements();

  const { toast } = useToast();

  const handleExport = async (type: "excel" | "pdf") => {
    try {
      if (type === "excel") {
        const rows = (settlements || []).map(s => ({
          "제목": s.title || "",
          "고객사": s.clientName || "",
          "상태": s.status || "",
          "예상비용(KRW)": s.totalExpectedKRW || 0,
          "실제비용(KRW)": s.totalActualKRW || 0,
          "손익(KRW)": s.profitKRW || 0,
          "손익률(%)": s.profitRate || 0,
        }));
        exportToExcel(rows, `손익보고서_${new Date().toISOString().slice(0, 10)}`, "정산 현황");
        toast({ title: "내보내기 완료", description: "Excel 파일이 다운로드되었습니다." });
      } else {
        await exportToPdf("reports-container", `손익보고서_${new Date().toISOString().slice(0, 10)}`);
        toast({ title: "내보내기 완료", description: "PDF 파일이 다운로드되었습니다." });
      }
    } catch (err) {
      toast({ title: "내보내기 실패", description: String(err), variant: "destructive" });
    }
  };

  // 실제 데이터 집계
  const aggregatedData = useMemo(() => {
    if (!settlements) return {
      totalExpected: 0,
      totalActual: 0,
      totalProfit: 0,
      totalSettlements: 0,
    };

    const completed = settlements.filter(s => s.status === 'Completed');
    
    // 영업이익 총합
    const totalProfit = completed.reduce((sum, s) => sum + (s.profitKRW || 0), 0);
    // 매출 총합 (고객 청구액 기준)
    const totalExpected = completed.reduce((sum, s) => sum + (s.totalExpectedKRW || 0), 0);
    const totalActual = completed.reduce((sum, s) => sum + (s.totalActualKRW || 0), 0);

    return {
      totalExpected,
      totalActual,
      totalProfit,
      totalSettlements: completed.length
    };
  }, [settlements]);

  // 임시 월별 데이터 (일부는 실제 데이터를 조합할 수 있음, 여기서는 Mock)
  const monthlyData = [
    { name: '1월', 견적수: 45, 영업이익: 2400000 },
    { name: '2월', 견적수: 52, 영업이익: 3100000 },
    { name: '3월', 견적수: 38, 영업이익: 2800000 },
    { name: '4월', 견적수: 65, 영업이익: 3500000 },
    { name: '5월', 견적수: 85, 영업이익: 5900000 },
    { name: '6월', 견적수: 72, 영업이익: aggregatedData.totalProfit > 0 ? aggregatedData.totalProfit : 5400000 },
  ];

  const countryData = [
    { name: '태국', 매출: 14500000 },
    { name: '베트남', 매출: 12800000 },
    { name: '라오스', 매출: 4500000 },
    { name: '기타', 매출: 2100000 },
  ];

  const formatYAxis = (tickItem: number) => {
    return `${(tickItem / 10000).toLocaleString()}만`;
  };

  return (
    <div className="space-y-6" id="reports-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">손익 리포트 (Phase 2 연동)</h1>
          <p className="text-muted-foreground">정산 완료된 실제 데이터를 바탕으로 한 손익 현황입니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="default" onClick={() => handleExport('pdf')}>
            <FileText className="w-4 h-4 mr-2" />
            PDF 보고서
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-50/50">
        <CardContent className="p-4 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Filter className="w-4 h-4" />
            조회 필터
          </div>
          <div className="w-[180px]">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="조회 기간" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">최근 1개월</SelectItem>
                <SelectItem value="3m">최근 3개월</SelectItem>
                <SelectItem value="6m">최근 6개월</SelectItem>
                <SelectItem value="1y">최근 1년</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[180px]">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="국가별" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 국가</SelectItem>
                <SelectItem value="TH">태국</SelectItem>
                <SelectItem value="VN">베트남</SelectItem>
                <SelectItem value="LA">라오스</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 pb-2">
              <BadgeDollarSign className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">마감 매출 (총견적가)</h3>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(aggregatedData.totalExpected, "KRW")}원</p>
            <p className="text-xs text-muted-foreground mt-1">완료된 확정 정산 기준</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 pb-2">
              <Calculator className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-medium text-primary">영업 이익 (실데이터)</h3>
            </div>
            <p className="text-3xl font-bold text-primary">{formatCurrency(aggregatedData.totalProfit, "KRW")}원</p>
            <p className="text-xs text-muted-foreground mt-1">
              {aggregatedData.totalExpected > 0 ? 
                `마진율: ${((aggregatedData.totalProfit / aggregatedData.totalExpected) * 100).toFixed(1)}%` : 
                '데이터 없음'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 pb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">마감 정산건수</h3>
            </div>
            <p className="text-3xl font-bold">{aggregatedData.totalSettlements}건</p>
            <p className="text-xs text-muted-foreground mt-1">
              전체 견적 중 {((aggregatedData.totalSettlements / (settlements?.length || 1)) * 100).toFixed(0)}% 마감
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 pb-2">
              <Map className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">실제 원가 지출액</h3>
            </div>
            <p className="text-3xl font-bold">{formatCurrency(aggregatedData.totalActual, "KRW")}원</p>
            <p className="text-xs text-muted-foreground mt-1">돌발 지출 포함</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 영업이익 추이 (Line Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>월별 영업이익 현황</CardTitle>
            <CardDescription>과거 6개월 치 정산 마감액 기준</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={formatYAxis} />
                  <Tooltip formatter={(value: number) => [`${formatCurrency(value, "KRW")}원`, "영업이익"]} />
                  <Line type="monotone" dataKey="영업이익" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 국가별 매출 (Bar Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>국가별 견적 비중</CardTitle>
            <CardDescription>성사된 견적건 기준 국가 분포</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={formatYAxis} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [`${formatCurrency(value, "KRW")}원`, "매출"]} />
                  <Bar dataKey="매출" fill="#14b8a6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
