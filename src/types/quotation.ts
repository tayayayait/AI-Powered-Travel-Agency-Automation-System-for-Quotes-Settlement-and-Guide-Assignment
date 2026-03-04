// src/types/quotation.ts
import { QuotationStatus, CurrencyCode, PackageType } from "./index";

export interface QuotationDailySchedule {
  id: string;
  quotation_id: string;
  dayNumber: number;
  date: string;
  description: string;
}

export interface QuotationCostItem {
  id: string;
  quotation_id: string;
  category: "Hotel" | "Transport" | "Guide" | "Meal" | "Ticket" | "Other";
  description: string;
  unitPrice: number;
  quantity: number;
  days: number;
  currency: CurrencyCode;
  exchangeRate: number; // KRW 환산용 환율
  calcAmountKRW: number; // unitPrice * quantity * days * exchangeRate
}

export interface QuotationDetail {
  id: string;
  title: string;
  clientName: string;
  startDate: string;
  endDate: string;
  paxCount: number; // 행사 인원
  packageType: PackageType;
  targetMarginPercentage: number;
  status: QuotationStatus;
  
  // 합계 데이터
  totalCostKRW: number;
  proposedPriceKRW: number;
  actualMarginPercentage: number;
  
  // 하위 리스트
  schedules?: QuotationDailySchedule[];
  costs?: QuotationCostItem[];
  
  created_at: string;
  updated_at: string;
}

// 폼 입력용 타입
export type QuotationFormData = Omit<QuotationDetail, "id" | "created_at" | "updated_at" | "status" | "totalCostKRW" | "proposedPriceKRW" | "actualMarginPercentage"> & {
  schedules: Omit<QuotationDailySchedule, "id" | "quotation_id">[];
  costs: Omit<QuotationCostItem, "id" | "quotation_id" | "calcAmountKRW">[];
};
