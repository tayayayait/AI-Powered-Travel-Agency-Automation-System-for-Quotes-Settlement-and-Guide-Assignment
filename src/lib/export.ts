// src/lib/export.ts
// Excel 및 PDF 내보내기 유틸리티

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * 데이터 배열을 Excel(.xlsx) 파일로 내보냅니다.
 */
export function exportToExcel(
  data: Record<string, unknown>[],
  filename: string,
  sheetName = "Sheet1"
) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // 열 너비 자동 조절
  const maxWidths: number[] = [];
  const header = Object.keys(data[0] || {});
  header.forEach((key, i) => {
    const headerLen = key.length;
    const dataLen = Math.max(
      ...data.map(row => String(row[key] ?? "").length)
    );
    maxWidths[i] = Math.min(40, Math.max(headerLen, dataLen) + 2);
  });
  ws["!cols"] = maxWidths.map(w => ({ wch: w }));

  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * HTML 요소를 PDF로 내보냅니다.
 */
export async function exportToPdf(
  elementId: string,
  filename: string
) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element #${elementId} not found`);
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  const pdf = new jsPDF("p", "mm", "a4");
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(
    canvas.toDataURL("image/png"),
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );
  heightLeft -= pageHeight;

  // 여러 페이지 처리
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
}

/**
 * 정산 상세 데이터를 Excel용 2D 배열로 변환합니다.
 */
export function formatSettlementForExcel(settlement: {
  title?: string;
  clientName?: string;
  totalExpectedKRW?: number;
  totalActualKRW?: number;
  profitKRW?: number;
  profitRate?: number;
  expenses?: Array<{ category?: string; description?: string; amountExpected?: number; amountActual?: number }>;
}) {
  const rows: Record<string, unknown>[] = [];

  // 요약 정보
  rows.push({
    분류: "📋 정산 요약",
    항목: settlement.title || "",
    예상금액: settlement.totalExpectedKRW || 0,
    실제금액: settlement.totalActualKRW || 0,
    손익: settlement.profitKRW || 0,
    "손익률(%)": settlement.profitRate || 0,
  });

  // 지출 내역
  settlement.expenses?.forEach((exp) => {
    rows.push({
      분류: "💰 지출",
      항목: `${exp.category || ""} - ${exp.description || ""}`,
      예상금액: exp.amountExpected || 0,
      실제금액: exp.amountActual || 0,
      손익: (exp.amountExpected || 0) - (exp.amountActual || 0),
      "손익률(%)": "",
    });
  });

  return rows;
}
