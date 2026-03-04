// src/types/settlement.ts
import { CurrencyCode } from "./index";

export type SettlementStatus = "Pending" | "Completed" | "Disputed";

export interface SettlementExpenseItem {
  id: string;
  settlement_id: string;
  category: "Hotel" | "Transport" | "Guide" | "Meal" | "Ticket" | "Other";
  description: string;
  amountExpected: number; // 예상 비용 (견적서 기준)
  amountActual: number;   // 실제 집행 비용
  currency: CurrencyCode;
  receiptUrl?: string;    // 영수증 증빙용 URL
}

export interface ShoppingSale {
  id: string;
  settlement_id: string;
  shop_name: string;
  sales_amount: number;
  commission_rate: number;
  guide_share: number;
  company_share: number;
  currency: CurrencyCode;
}

export interface OptionSale {
  id: string;
  settlement_id: string;
  option_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  guide_share_rate: number;
  guide_share: number;
  company_share: number;
  currency: CurrencyCode;
}

export interface UnexpectedExpense {
  id: string;
  settlement_id: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  auto_approved: boolean;
  requires_review: boolean;
  status: "Pending" | "Approved" | "Rejected";
  approved_by?: string;
}

export interface SettlementDetail {
  id: string;
  quotationId: string; // 연결된 견적의 마스터 ID
  title: string;       // 연결된 견적의 행사명
  clientName: string;  
  
  status: SettlementStatus;
  
  // 금액 집계 정보
  totalExpectedKRW: number;
  totalActualKRW: number;
  balanceKRW: number; // 고객에게 받을 잔액 또는 환불액
  
  // Phase 2: 정산 수익 및 피 안내
  guideFee: number;
  shoppingCommission: number;
  optionCommission: number;
  profitKRW: number;
  profitRate: number;
  
  expenses?: SettlementExpenseItem[];
  shoppingSales?: ShoppingSale[];
  optionSales?: OptionSale[];
  unexpectedExpenses?: UnexpectedExpense[];
  
  created_at: string;
  updated_at: string;
}

export type SettlementFormData = Omit<SettlementDetail, "id" | "created_at" | "updated_at" | "totalExpectedKRW" | "totalActualKRW" | "balanceKRW" | "guideFee" | "shoppingCommission" | "optionCommission" | "profitKRW" | "profitRate"> & {
  expenses: Omit<SettlementExpenseItem, "id" | "settlement_id">[];
  shoppingSales: Omit<ShoppingSale, "id" | "settlement_id">[];
  optionSales: Omit<OptionSale, "id" | "settlement_id">[];
  unexpectedExpenses: Omit<UnexpectedExpense, "id" | "settlement_id">[];
};
