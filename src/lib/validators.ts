// src/lib/validators.ts
import { z } from "zod";

// ─── Zod 스키마 ───

export const quotationFormSchema = z.object({
  title: z.string().min(2, { message: "행사명을 2자 이상 입력해주세요." }),
  clientName: z.string().min(1, { message: "고객사를 입력해주세요." }),
  startDate: z.string().min(1, { message: "시작일을 선택해주세요." }),
  endDate: z.string().min(1, { message: "종료일을 선택해주세요." }),
  paxCount: z.number().min(1, { message: "참여 인원은 1명 이상이어야 합니다." }),
  packageType: z.enum(["save", "standard", "premium", "incentive"], {
    errorMap: () => ({ message: "패키지 유형을 선택해주세요." }),
  }),
  targetMarginPercentage: z.number().min(-100).max(100, {
    message: "마진율은 -100% ~ 100% 범위여야 합니다.",
  }),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.startDate) <= new Date(data.endDate);
  },
  { message: "종료일은 시작일보다 같거나 이후여야 합니다.", path: ["endDate"] }
);

export const costItemSchema = z.object({
  category: z.enum(["Hotel", "Transport", "Guide", "Meal", "Ticket", "Other"]),
  description: z.string().min(1, { message: "항목 설명을 입력해주세요." }),
  unitPrice: z.number().min(0, { message: "단가는 0 이상이어야 합니다." }),
  quantity: z.number().min(1, { message: "수량은 1 이상이어야 합니다." }),
  days: z.number().min(1, { message: "일수는 1 이상이어야 합니다." }),
  currency: z.enum(["KRW", "THB", "VND", "LAK"]),
  exchangeRate: z.number().min(0.001, { message: "환율을 입력해주세요." }),
});

export const scheduleItemSchema = z.object({
  dayNumber: z.number().min(1),
  date: z.string().min(1, { message: "날짜를 입력해주세요." }),
  description: z.string().min(1, { message: "일정 내용을 입력해주세요." }),
});

// ─── 비즈니스 규칙 검증 ───

/**
 * 마진율 검증 (상세서 §4-1)
 * @param marginPercentage 현재 마진율 (예: 15)
 * @param minMargin 최소 권장 마진율 (기본 15%)
 * @param blockMargin 결재 차단 마진율 (기본 0% 이하)
 * @returns 'block' | 'warn' | 'pass'
 */
export function checkMarginRule(
  marginPercentage: number,
  minMargin: number = 15,
  blockMargin: number = 0
): "block" | "warn" | "pass" {
  if (marginPercentage < blockMargin) {
    return "block"; // 0% 미만: 저장/상신 차단 (Error Toast)
  }
  if (marginPercentage < minMargin) {
    return "warn"; // 15% 미만: Warning Dialog 제공 후 진행 가능
  }
  return "pass"; // 정상
}

/**
 * 날짜 교차 검증
 */
export function validateDateRange(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return false;
  return new Date(startDate) <= new Date(endDate);
}

/**
 * 비용 항목 최소 1건 검증
 */
export function validateCostsExist(
  costs: Array<unknown>
): { valid: boolean; message?: string } {
  if (!costs || costs.length === 0) {
    return { valid: false, message: "비용 항목을 최소 1건 이상 추가해주세요." };
  }
  return { valid: true };
}
