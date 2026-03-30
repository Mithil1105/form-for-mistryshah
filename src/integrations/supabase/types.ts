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
      applications: {
        Row: {
          answer: string | null
          application_type: string | null
          applying_for: string | null
          area_of_interest: string | null
          attempts: number
          ca_level: string | null
          contact_no: string | null
          created_at: string
          current_address: string | null
          current_ctc: string | null
          date_of_birth: string | null
          domain: string | null
          email: string
          employer_name: string | null
          employment_from: string | null
          employment_to: string | null
          expected_ctc: string | null
          gender: string | null
          graduation_institute: string | null
          graduation_percentage: number | null
          graduation_specialization: string | null
          graduation_year: number | null
          icai_certified_courses: string | null
          id: string
          is_qualified_ca: boolean | null
          is_transfer_case: boolean | null
          last_designation: string | null
          marital_status: string | null
          membership_no: string | null
          middle_name: string | null
          name: string
          notice_period: string | null
          other_qualification_institute: string | null
          other_qualification_percentage: number | null
          other_qualification_specialization: string | null
          other_qualification_year: number | null
          permanent_address: string | null
          phone: string | null
          post_graduation_institute: string | null
          post_graduation_percentage: number | null
          post_graduation_specialization: string | null
          post_graduation_year: number | null
          post_qualification_months: number | null
          post_qualification_years: number | null
          reference: string | null
          resume_url: string | null
          school_institute: string | null
          school_percentage: number | null
          school_specialization: string | null
          school_year: number | null
          surname: string | null
          transfer_case_details: string | null
        }
        Insert: {
          answer?: string | null
          application_type?: string | null
          applying_for?: string | null
          area_of_interest?: string | null
          attempts?: number
          ca_level?: string | null
          contact_no?: string | null
          created_at?: string
          current_address?: string | null
          current_ctc?: string | null
          date_of_birth?: string | null
          domain?: string | null
          email: string
          employer_name?: string | null
          employment_from?: string | null
          employment_to?: string | null
          expected_ctc?: string | null
          gender?: string | null
          graduation_institute?: string | null
          graduation_percentage?: number | null
          graduation_specialization?: string | null
          graduation_year?: number | null
          icai_certified_courses?: string | null
          id?: string
          is_qualified_ca?: boolean | null
          is_transfer_case?: boolean | null
          last_designation?: string | null
          marital_status?: string | null
          membership_no?: string | null
          middle_name?: string | null
          name: string
          notice_period?: string | null
          other_qualification_institute?: string | null
          other_qualification_percentage?: number | null
          other_qualification_specialization?: string | null
          other_qualification_year?: number | null
          permanent_address?: string | null
          phone?: string | null
          post_graduation_institute?: string | null
          post_graduation_percentage?: number | null
          post_graduation_specialization?: string | null
          post_graduation_year?: number | null
          post_qualification_months?: number | null
          post_qualification_years?: number | null
          reference?: string | null
          resume_url?: string | null
          school_institute?: string | null
          school_percentage?: number | null
          school_specialization?: string | null
          school_year?: number | null
          surname?: string | null
          transfer_case_details?: string | null
        }
        Update: {
          answer?: string | null
          application_type?: string | null
          applying_for?: string | null
          area_of_interest?: string | null
          attempts?: number
          ca_level?: string | null
          contact_no?: string | null
          created_at?: string
          current_address?: string | null
          current_ctc?: string | null
          date_of_birth?: string | null
          domain?: string | null
          email?: string
          employer_name?: string | null
          employment_from?: string | null
          employment_to?: string | null
          expected_ctc?: string | null
          gender?: string | null
          graduation_institute?: string | null
          graduation_percentage?: number | null
          graduation_specialization?: string | null
          graduation_year?: number | null
          icai_certified_courses?: string | null
          id?: string
          is_qualified_ca?: boolean | null
          is_transfer_case?: boolean | null
          last_designation?: string | null
          marital_status?: string | null
          membership_no?: string | null
          middle_name?: string | null
          name?: string
          notice_period?: string | null
          other_qualification_institute?: string | null
          other_qualification_percentage?: number | null
          other_qualification_specialization?: string | null
          other_qualification_year?: number | null
          permanent_address?: string | null
          phone?: string | null
          post_graduation_institute?: string | null
          post_graduation_percentage?: number | null
          post_graduation_specialization?: string | null
          post_graduation_year?: number | null
          post_qualification_months?: number | null
          post_qualification_years?: number | null
          reference?: string | null
          resume_url?: string | null
          school_institute?: string | null
          school_percentage?: number | null
          school_specialization?: string | null
          school_year?: number | null
          surname?: string | null
          transfer_case_details?: string | null
        }
        Relationships: []
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
