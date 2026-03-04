// src/lib/pricing.ts
// 패키지 유형별 원가/마진 자동 계산 유틸리티

import { PackageType } from "@/types/index";
import { QuotationCostItem } from "@/types/quotation";

/**
 * 패키지 유형별 기본 마진율 (%)
 * - save: 8% (저가 패키지)
 * - standard: 15% (표준)
 * - premium: 25% (프리미엄)
 * - incentive: 20% (인센티브 단체)
 */
export const PACKAGE_DEFAULT_MARGINS: Record<PackageType, number> = {
  save: 8,
  standard: 15,
  premium: 25,
  incentive: 20,
};

export const PACKAGE_LABELS: Record<PackageType, string> = {
  save: "세이브",
  standard: "스탠다드",
  premium: "프리미엄",
  incentive: "인센티브",
};

/**
 * 비용 항목 1건의 KRW 환산 금액을 계산
 */
export function calcCostItemKRW(item: {
  unitPrice: number;
  quantity: number;
  days: number;
  exchangeRate: number;
}): number {
  return Math.round(item.unitPrice * item.quantity * item.days * item.exchangeRate);
}

/**
 * 전체 비용 항목의 총 원가(KRW)를 계산
 */
export function calcTotalCostKRW(
  costs: Array<{ unitPrice: number; quantity: number; days: number; exchangeRate: number }>
): number {
  return costs.reduce((sum, item) => sum + calcCostItemKRW(item), 0);
}

/**
 * 목표 마진율을 반영한 제안 단가(인당, KRW) 계산
 * 공식: totalCost / (1 - marginRate) / paxCount
 */
export function calcProposedPricePerPax(
  totalCostKRW: number,
  marginPercentage: number,
  paxCount: number
): number {
  if (paxCount <= 0) return 0;
  const marginRate = marginPercentage / 100;
  if (marginRate >= 1) return 0; // 100% 이상 마진은 불가
  return Math.round(totalCostKRW / (1 - marginRate) / paxCount);
}

/**
 * 실제 마진율 역산 (%)
 * 공식: (proposedTotal - totalCost) / proposedTotal * 100
 */
export function calcActualMarginPercentage(
  totalCostKRW: number,
  proposedTotalKRW: number
): number {
  if (proposedTotalKRW <= 0) return 0;
  return Math.round(((proposedTotalKRW - totalCostKRW) / proposedTotalKRW) * 10000) / 100;
}

/**
 * 견적 전체 요약 계산 (한 번에 총 원가, 제안가, 실 마진 산출)
 */
export function calcQuotationSummary(
  costs: Array<{ unitPrice: number; quantity: number; days: number; exchangeRate: number }>,
  targetMarginPercentage: number,
  paxCount: number
) {
  const totalCostKRW = calcTotalCostKRW(costs);
  const proposedPricePerPax = calcProposedPricePerPax(totalCostKRW, targetMarginPercentage, paxCount);
  const proposedTotalKRW = proposedPricePerPax * paxCount;
  const actualMarginPercentage = calcActualMarginPercentage(totalCostKRW, proposedTotalKRW);

  return {
    totalCostKRW,
    proposedPricePerPax,
    proposedTotalKRW,
    actualMarginPercentage,
  };
}
