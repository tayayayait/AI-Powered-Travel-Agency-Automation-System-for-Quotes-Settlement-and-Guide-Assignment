import { Card, CardContent } from "@/components/ui/card";
import { QuotationDetail } from "@/types/quotation";
import { formatCurrency } from "@/lib/currency";
import { CurrencyCode } from "@/types/index";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { calcCostItemKRW } from "@/lib/pricing";

interface QuotationPDFProps {
  data: QuotationDetail;
}

export function QuotationPDF({ data }: QuotationPDFProps) {
  const handleDownload = async () => {
    try {
      // html2pdf.js 동적 임포트 (설치 필요: npm install html2pdf.js)
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("pdf-content");
      if (!element) return;

      const filename = `${data.title}_${data.clientName}_${data.created_at.split("T")[0]}.pdf`;
      
      html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    } catch {
      // html2pdf가 설치되지 않은 경우 window.print() 폴백
      window.print();
    }
  };

  const costs = data.costs || [];
  const totalCostKRW = costs.reduce((sum, c) => sum + (c.calcAmountKRW || calcCostItemKRW(c)), 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleDownload} disabled={data.status !== "Approved" && data.status !== "Locked"}>
          <Download className="w-4 h-4 mr-2" />
          PDF 다운로드
        </Button>
      </div>
      
      {/* A4 크기 컨테이너 */}
      <Card id="pdf-content" className="w-full max-w-[794px] mx-auto bg-white border-muted shadow-sm overflow-hidden text-slate-900">
        <CardContent className="p-10 space-y-8 print:p-0 print:m-0 print:border-none print:shadow-none">
          {/* 헤더 */}
          <div className="flex justify-between items-end border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">견적서 (Quotation)</h1>
              <p className="text-sm text-slate-500">문서 번호: {data.id}</p>
              <p className="text-sm text-slate-500">작성 일자: {data.created_at.split("T")[0]}</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-primary">SE Travel Agency</h2>
              <p className="text-sm text-slate-600">Tel: +82-2-1234-5678</p>
              <p className="text-sm text-slate-600">Email: contact@setravel.com</p>
            </div>
          </div>

          {/* 수신 정보 */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-bold text-slate-700 mb-1">수신 (To Client):</p>
              <p className="font-medium text-lg">{data.clientName} 귀하</p>
            </div>
            <div>
              <p className="font-bold text-slate-700 mb-1">행사명 (Event Name):</p>
              <p>{data.title}</p>
              <p className="mt-1">일정: {data.startDate} ~ {data.endDate}</p>
              <p className="mt-1">인원: {data.paxCount} 명</p>
            </div>
          </div>

          {/* 결제 요약 */}
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 flex justify-between items-center">
            <h3 className="text-xl font-semibold">총 견적 금액</h3>
            <p className="text-2xl font-bold text-primary tracking-tight">
              {formatCurrency(data.proposedPriceKRW * data.paxCount, "KRW")} 원 (VAT 포함)
            </p>
          </div>

          {/* 항목별 명세 — 실데이터 매핑 */}
          <div className="mt-8">
            <h4 className="font-bold mb-4 text-slate-700">비용 상세 내역</h4>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-200">
                  <th className="py-3 px-4 text-left font-medium">카테고리</th>
                  <th className="py-3 px-4 text-left font-medium">항목 / 내용</th>
                  <th className="py-3 px-4 text-center font-medium">수량 × 일수</th>
                  <th className="py-3 px-4 text-right font-medium">단가</th>
                  <th className="py-3 px-4 text-right font-medium">합계 (KRW)</th>
                </tr>
              </thead>
              <tbody>
                {costs.length > 0 ? costs.map((cost, index) => (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-3 px-4 text-slate-600">{cost.category}</td>
                    <td className="py-3 px-4">{cost.description}</td>
                    <td className="py-3 px-4 text-center">{cost.quantity} × {cost.days}일</td>
                    <td className="py-3 px-4 text-right">
                      {formatCurrency(cost.unitPrice, cost.currency as CurrencyCode)} {cost.currency}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(cost.calcAmountKRW || calcCostItemKRW(cost), "KRW")} 원
                    </td>
                  </tr>
                )) : (
                  <tr className="border-b border-slate-100">
                    <td colSpan={5} className="py-6 px-4 text-center text-muted-foreground">비용 항목이 등록되지 않았습니다.</td>
                  </tr>
                )}
                <tr className="bg-slate-50 border-b border-slate-200 font-medium">
                  <td colSpan={4} className="py-3 px-4 text-right">소계 (원가)</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(totalCostKRW, "KRW")} 원</td>
                </tr>
                <tr className="font-semibold">
                  <td colSpan={4} className="py-3 px-4 text-right">마진 ({data.actualMarginPercentage || data.targetMarginPercentage}%)</td>
                  <td className="py-3 px-4 text-right text-primary">
                    {formatCurrency(data.proposedPriceKRW * data.paxCount - totalCostKRW, "KRW")} 원
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 안내 */}
          <div className="mt-12 text-xs text-slate-500 space-y-2 border-t pt-4">
            <p>* 본 견적서는 발행일로부터 14일간 유효합니다.</p>
            <p>* 항공권 비용은 포함되어 있지 않으며 실비 정산됩니다.</p>
            <p>* 상세 호텔 목록 및 식당 인스펙션 파일은 별첨을 참조하시기 바랍니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
