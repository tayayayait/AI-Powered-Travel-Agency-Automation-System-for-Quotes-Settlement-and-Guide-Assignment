// src/types/guide.ts
import { QuotationStatus, UserRole } from "./index";

export type GuideAssignmentStatus = "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
export type GuideTier = "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond";
export type GuideStatus = "Active" | "Inactive" | "Suspended";

export interface GuideProfile {
  id: string;
  name: string;
  phone: string;
  languages: string[];  // 예: ["Korean", "Thai", "English"]
  rating: number;       // 평균 평점
  profileImageUrl?: string | null;
  tier: GuideTier;
  total_tours: number;
  total_shopping_revenue: number;
  total_option_revenue: number;
  complaint_count: number;
  regions: string[];
  specialties: string[];
  status: GuideStatus;
  created_at: string;
}

export interface GuideAssignmentDetail {
  id: string;
  quotationId: string;
  title: string;
  clientName: string;
  startDate: string;
  endDate: string;
  
  status: GuideAssignmentStatus;
  
  assignedGuideId?: string | null;
  assignedGuide?: GuideProfile;
  
  meetingPoint?: string | null;
  notes?: string | null;
  ai_score?: number | null;
  
  created_at: string;
  updated_at: string;
}

export interface GuidePerformanceLog {
  id: string;
  guide_id: string;
  assignment_id?: string | null;
  settlement_id?: string | null;
  tour_title: string;
  start_date: string;
  end_date: string;
  shopping_revenue: number;
  option_revenue: number;
  customer_rating: number;
  has_complaint: boolean;
  complaint_details?: string | null;
  created_at: string;
}

export type GuideAssignmentFormData = Omit<GuideAssignmentDetail, "id" | "status" | "assignedGuide" | "created_at" | "updated_at">;
export type GuideProfileFormData = Omit<GuideProfile, "id" | "created_at" | "total_tours" | "total_shopping_revenue" | "total_option_revenue" | "complaint_count">;
