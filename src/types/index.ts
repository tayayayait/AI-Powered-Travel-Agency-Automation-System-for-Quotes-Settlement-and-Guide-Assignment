// src/types/index.ts

export type UserRole = "admin" | "manager" | "employee" | "guide";

export type QuotationStatus = "Draft" | "InReview" | "Approved" | "Rejected" | "Locked";

export type PackageType = "save" | "standard" | "premium" | "incentive";

export type CurrencyCode = "KRW" | "THB" | "VND" | "LAK";

// 견적 기본 정보 모델 (Phase 1 대상)
export interface Quotation {
  id: string;
  title: string;
  clientName: string;
  startDate: string;
  endDate: string;
  status: QuotationStatus;
  packageType: PackageType;
  paxCount: number;
  totalCostKRW: number;
  proposedPriceKRW: number;
  targetMarginPercentage: number;
  actualMarginPercentage: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

// 정산 기본 정보 모델 (Phase 2 대상)
export interface Settlement {
  id: string;
  quotationId: string;
  amountGiven: number;
  amountSpent: number;
  balance: number;
  status: "Pending" | "Completed" | "Disputed";
  created_at: string;
  updated_at: string;
}

// 가이드 배정 모델 (Phase 3 대상)
export interface GuideAssignment {
  id: string;
  quotationId: string;
  guideId: string;
  assignmentDate: string;
  status: "Assigned" | "Confirmed" | "Completed";
  created_at: string;
  updated_at: string;
}

// 승인 이력 모델
export interface ApprovalLog {
  id: string;
  quotation_id: string;
  previous_status: QuotationStatus;
  new_status: QuotationStatus;
  changed_by: string;
  reason?: string;
  created_at: string;
}

// 변경 이력 모델 (범용)
export interface ChangeHistoryEntry {
  id: string;
  entity_type: "quotation" | "settlement" | "guide_assignment";
  entity_id: string;
  field_name: string;
  old_value?: string;
  new_value?: string;
  changed_by: string;
  created_at: string;
}
