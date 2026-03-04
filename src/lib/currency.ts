// src/lib/currency.ts
import { CurrencyCode } from "@/types/index";
export type { CurrencyCode };

export const CURRENCY_RULES: Record<CurrencyCode, { decimals: number; symbol: string; locale: string }> = {
  KRW: { decimals: 0, symbol: "₩", locale: "ko-KR" },
  THB: { decimals: 2, symbol: "฿", locale: "th-TH" }, // 상세서: 바트화만 소수점 2자리 허용
  VND: { decimals: 0, symbol: "₫", locale: "vi-VN" },
  LAK: { decimals: 0, symbol: "₭", locale: "lo-LA" },
};

export function formatCurrency(amount: number, currency: CurrencyCode = "THB"): string {
  const rule = CURRENCY_RULES[currency];
  
  return new Intl.NumberFormat(rule.locale, {
    style: "decimal",
    minimumFractionDigits: rule.decimals,
    maximumFractionDigits: rule.decimals,
  }).format(amount);
}

// TODO: Phase 4에서 실제 DB/설정 기반 환율 모듈로 고도화
const TEMP_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  KRW: 1, // 기준
  THB: 38.5, // 1 THB = 38.5 KRW
  VND: 0.055, // 1 VND = 0.055 KRW
  LAK: 0.065, // 1 LAK = 0.065 KRW
};

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  
  // 기준 통화(KRW)로 변환 후 타겟 통화로 재변환
  const amountInKRW = amount * TEMP_EXCHANGE_RATES[from];
  return amountInKRW / TEMP_EXCHANGE_RATES[to];
}
