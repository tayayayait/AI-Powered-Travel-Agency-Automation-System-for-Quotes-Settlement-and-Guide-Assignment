export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      quotations: {
        Row: {
          id: string
          title: string
          clientName: string
          startDate: string
          endDate: string
          paxCount: number
          packageType: string
          targetMarginPercentage: number
          actualMarginPercentage: number
          status: string
          totalCostKRW: number
          proposedPriceKRW: number
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          clientName: string
          startDate: string
          endDate: string
          paxCount?: number
          packageType?: string
          targetMarginPercentage?: number
          actualMarginPercentage?: number
          status?: string
          totalCostKRW?: number
          proposedPriceKRW?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          clientName?: string
          startDate?: string
          endDate?: string
          paxCount?: number
          packageType?: string
          targetMarginPercentage?: number
          actualMarginPercentage?: number
          status?: string
          totalCostKRW?: number
          proposedPriceKRW?: number
          currency?: string
          created_at?: string
          updated_at?: string
        }
      }
      quotation_schedules: {
        Row: {
          id: string
          quotation_id: string
          dayNumber: number
          date: string
          description: string
          created_at: string
        }
        Insert: {
          id?: string
          quotation_id: string
          dayNumber: number
          date: string
          description: string
          created_at?: string
        }
        Update: {
          id?: string
          quotation_id?: string
          dayNumber?: number
          date?: string
          description?: string
          created_at?: string
        }
      }
      quotation_costs: {
        Row: {
          id: string
          quotation_id: string
          category: string
          description: string
          unitPrice: number
          quantity: number
          days: number
          currency: string
          exchangeRate: number
          calcAmountKRW: number
          created_at: string
        }
        Insert: {
          id?: string
          quotation_id: string
          category: string
          description: string
          unitPrice?: number
          quantity?: number
          days?: number
          currency: string
          exchangeRate?: number
          calcAmountKRW?: number
          created_at?: string
        }
        Update: {
          id?: string
          quotation_id?: string
          category?: string
          description?: string
          unitPrice?: number
          quantity?: number
          days?: number
          currency?: string
          exchangeRate?: number
          calcAmountKRW?: number
          created_at?: string
        }
      }
      settlements: {
        Row: {
          id: string
          quotationId: string
          title: string
          clientName: string
          status: string
          totalExpectedKRW: number
          totalActualKRW: number
          balanceKRW: number
          guideFee: number
          shoppingCommission: number
          optionCommission: number
          profitKRW: number
          profitRate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quotationId: string
          title: string
          clientName: string
          status?: string
          totalExpectedKRW?: number
          totalActualKRW?: number
          balanceKRW?: number
          guideFee?: number
          shoppingCommission?: number
          optionCommission?: number
          profitKRW?: number
          profitRate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quotationId?: string
          title?: string
          clientName?: string
          status?: string
          totalExpectedKRW?: number
          totalActualKRW?: number
          balanceKRW?: number
          guideFee?: number
          shoppingCommission?: number
          optionCommission?: number
          profitKRW?: number
          profitRate?: number
          created_at?: string
          updated_at?: string
        }
      }
      settlement_expenses: {
        Row: {
          id: string
          settlement_id: string
          category: string
          description: string
          amountExpected: number
          amountActual: number
          currency: string
          receiptUrl: string | null
          created_at: string
        }
        Insert: {
          id?: string
          settlement_id: string
          category: string
          description: string
          amountExpected?: number
          amountActual?: number
          currency: string
          receiptUrl?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          settlement_id?: string
          category?: string
          description?: string
          amountExpected?: number
          amountActual?: number
          currency?: string
          receiptUrl?: string | null
          created_at?: string
        }
      }
      guide_profiles: {
        Row: {
          id: string
          name: string
          phone: string
          languages: string[]
          rating: number
          profileImageUrl: string | null
          tier: string
          total_tours: number
          total_shopping_revenue: number
          total_option_revenue: number
          complaint_count: number
          regions: string[]
          specialties: string[]
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          languages?: string[]
          rating?: number
          profileImageUrl?: string | null
          tier?: string
          total_tours?: number
          total_shopping_revenue?: number
          total_option_revenue?: number
          complaint_count?: number
          regions?: string[]
          specialties?: string[]
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          languages?: string[]
          rating?: number
          profileImageUrl?: string | null
          tier?: string
          total_tours?: number
          total_shopping_revenue?: number
          total_option_revenue?: number
          complaint_count?: number
          regions?: string[]
          specialties?: string[]
          status?: string
          created_at?: string
        }
      }
      guide_assignments: {
        Row: {
          id: string
          quotationId: string
          title: string
          clientName: string
          startDate: string
          endDate: string
          status: string
          assignedGuideId: string | null
          meetingPoint: string | null
          notes: string | null
          ai_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quotationId: string
          title: string
          clientName: string
          startDate: string
          endDate: string
          status?: string
          assignedGuideId?: string | null
          meetingPoint?: string | null
          notes?: string | null
          ai_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quotationId?: string
          title?: string
          clientName?: string
          startDate?: string
          endDate?: string
          status?: string
          assignedGuideId?: string | null
          meetingPoint?: string | null
          notes?: string | null
          ai_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      guide_performance_logs: {
        Row: {
          id: string
          guide_id: string
          assignment_id: string | null
          settlement_id: string | null
          tour_title: string
          start_date: string
          end_date: string
          shopping_revenue: number
          option_revenue: number
          customer_rating: number
          has_complaint: boolean
          complaint_details: string | null
          created_at: string
        }
        Insert: {
          id?: string
          guide_id: string
          assignment_id?: string | null
          settlement_id?: string | null
          tour_title: string
          start_date: string
          end_date: string
          shopping_revenue?: number
          option_revenue?: number
          customer_rating?: number
          has_complaint?: boolean
          complaint_details?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          guide_id?: string
          assignment_id?: string | null
          settlement_id?: string | null
          tour_title?: string
          start_date?: string
          end_date?: string
          shopping_revenue?: number
          option_revenue?: number
          customer_rating?: number
          has_complaint?: boolean
          complaint_details?: string | null
          created_at?: string
        }
      }
      system_settings: {
        Row: {
          id: string
          baseCurrency: string
          language: string
          timezone: string
          rates: Json
          updated_at: string
        }
        Insert: {
          id?: string
          baseCurrency?: string
          language?: string
          timezone?: string
          rates?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          baseCurrency?: string
          language?: string
          timezone?: string
          rates?: Json
          updated_at?: string
        }
      }
      quotation_media: {
        Row: {
          id: string
          quotation_id: string
          category: string
          title: string
          description: string | null
          file_url: string
          created_at: string
        }
        Insert: {
          id?: string
          quotation_id: string
          category: string
          title: string
          description?: string | null
          file_url: string
          created_at?: string
        }
        Update: {
          id?: string
          quotation_id?: string
          category?: string
          title?: string
          description?: string | null
          file_url?: string
          created_at?: string
        }
      }
      shopping_sales: {
        Row: {
          id: string
          settlement_id: string
          shop_name: string
          sales_amount: number
          commission_rate: number
          guide_share: number
          company_share: number
          currency: string
          created_at: string
        }
        Insert: {
          id?: string
          settlement_id: string
          shop_name: string
          sales_amount?: number
          commission_rate?: number
          guide_share?: number
          company_share?: number
          currency?: string
          created_at?: string
        }
        Update: {
          id?: string
          settlement_id?: string
          shop_name?: string
          sales_amount?: number
          commission_rate?: number
          guide_share?: number
          company_share?: number
          currency?: string
          created_at?: string
        }
      }
      option_sales: {
        Row: {
          id: string
          settlement_id: string
          option_name: string
          quantity: number
          unit_price: number
          total_amount: number
          guide_share_rate: number
          guide_share: number
          company_share: number
          currency: string
          created_at: string
        }
        Insert: {
          id?: string
          settlement_id: string
          option_name: string
          quantity?: number
          unit_price?: number
          total_amount?: number
          guide_share_rate?: number
          guide_share?: number
          company_share?: number
          currency?: string
          created_at?: string
        }
        Update: {
          id?: string
          settlement_id?: string
          option_name?: string
          quantity?: number
          unit_price?: number
          total_amount?: number
          guide_share_rate?: number
          guide_share?: number
          company_share?: number
          currency?: string
          created_at?: string
        }
      }
      unexpected_expenses: {
        Row: {
          id: string
          settlement_id: string
          description: string
          amount: number
          currency: string
          auto_approved: boolean
          requires_review: boolean
          status: string
          approved_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          settlement_id: string
          description: string
          amount?: number
          currency?: string
          auto_approved?: boolean
          requires_review?: boolean
          status?: string
          approved_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          settlement_id?: string
          description?: string
          amount?: number
          currency?: string
          auto_approved?: boolean
          requires_review?: boolean
          status?: string
          approved_by?: string | null
          created_at?: string
        }
      }
      approval_logs: {
        Row: {
          id: string
          quotation_id: string
          previous_status: string
          new_status: string
          changed_by: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          quotation_id: string
          previous_status: string
          new_status: string
          changed_by?: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          quotation_id?: string
          previous_status?: string
          new_status?: string
          changed_by?: string
          reason?: string | null
          created_at?: string
        }
      }
      change_history: {
        Row: {
          id: string
          entity_type: string
          entity_id: string
          field_name: string
          old_value: string | null
          new_value: string | null
          changed_by: string
          created_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          entity_id: string
          field_name: string
          old_value?: string | null
          new_value?: string | null
          changed_by?: string
          created_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          entity_id?: string
          field_name?: string
          old_value?: string | null
          new_value?: string | null
          changed_by?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
