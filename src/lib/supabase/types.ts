export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          account_number: string
          account_type: Database["public"]["Enums"]["account_type"] | null
          ai_active: boolean | null
          balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          is_active: boolean | null
          leverage: number | null
          strategy_id: string | null
          total_profit: number | null
          total_trades: number | null
          user_id: string
          winning_trades: number | null
        }
        Insert: {
          account_number: string
          account_type?: Database["public"]["Enums"]["account_type"] | null
          ai_active?: boolean | null
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          leverage?: number | null
          strategy_id?: string | null
          total_profit?: number | null
          total_trades?: number | null
          user_id: string
          winning_trades?: number | null
        }
        Update: {
          account_number?: string
          account_type?: Database["public"]["Enums"]["account_type"] | null
          ai_active?: boolean | null
          balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          is_active?: boolean | null
          leverage?: number | null
          strategy_id?: string | null
          total_profit?: number | null
          total_trades?: number | null
          user_id?: string
          winning_trades?: number | null
        }
        Relationships: []
      }
      ai_strategies: {
        Row: {
          closes_per_cycle_max: number
          closes_per_cycle_min: number
          created_at: string | null
          description: string | null
          id: string
          name: string
          risk_per_trade: number
          slug: string
          trades_per_cycle_max: number
          trades_per_cycle_min: number
          win_rate: number
        }
        Insert: {
          closes_per_cycle_max?: number
          closes_per_cycle_min?: number
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          risk_per_trade: number
          slug: string
          trades_per_cycle_max?: number
          trades_per_cycle_min?: number
          win_rate: number
        }
        Update: {
          closes_per_cycle_max?: number
          closes_per_cycle_min?: number
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          risk_per_trade?: number
          slug?: string
          trades_per_cycle_max?: number
          trades_per_cycle_min?: number
          win_rate?: number
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          created_at: string | null
          doc_type: string
          file_url: string
          id: string
          reviewed_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          doc_type: string
          file_url: string
          id?: string
          reviewed_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          doc_type?: string
          file_url?: string
          id?: string
          reviewed_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"] | null
          country: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          full_name: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"] | null
          phone: string | null
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          phone?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"] | null
          phone?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          category: string
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"] | null
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          sender_role: string
          ticket_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          sender_role: string
          ticket_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          sender_role?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          account_id: string
          close_at: string | null
          close_price: number | null
          close_reason: string | null
          created_at: string | null
          direction: Database["public"]["Enums"]["trade_direction"]
          id: string
          open_at: string | null
          open_price: number
          profit_loss: number | null
          status: Database["public"]["Enums"]["trade_status"] | null
          stop_loss: number | null
          symbol: string
          take_profit: number | null
          user_id: string
          volume: number
        }
        Insert: {
          account_id: string
          close_at?: string | null
          close_price?: number | null
          close_reason?: string | null
          created_at?: string | null
          direction: Database["public"]["Enums"]["trade_direction"]
          id?: string
          open_at?: string | null
          open_price: number
          profit_loss?: number | null
          status?: Database["public"]["Enums"]["trade_status"] | null
          stop_loss?: number | null
          symbol: string
          take_profit?: number | null
          user_id: string
          volume: number
        }
        Update: {
          account_id?: string
          close_at?: string | null
          close_price?: number | null
          close_reason?: string | null
          created_at?: string | null
          direction?: Database["public"]["Enums"]["trade_direction"]
          id?: string
          open_at?: string | null
          open_price?: number
          profit_loss?: number | null
          status?: Database["public"]["Enums"]["trade_status"] | null
          stop_loss?: number | null
          symbol?: string
          take_profit?: number | null
          user_id?: string
          volume?: number
        }
        Relationships: [
          {
            foreignKeyName: "trades_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_snapshots: {
        Row: {
          account_id: string
          balance: number
          created_at: string | null
          equity: number
          id: string
          snapshot_at: string
          user_id: string
        }
        Insert: {
          account_id: string
          balance: number
          created_at?: string | null
          equity: number
          id?: string
          snapshot_at?: string
          user_id: string
        }
        Update: {
          account_id?: string
          balance?: number
          created_at?: string | null
          equity?: number
          id?: string
          snapshot_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_snapshots_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          method: string | null
          reference: string | null
          status: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          account_id: string
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          method?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          account_id?: string
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          method?: string | null
          reference?: string | null
          status?: Database["public"]["Enums"]["transaction_status"] | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: "standard" | "pro" | "vip"
      kyc_status:
        | "not_started"
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
      ticket_status: "open" | "in_progress" | "resolved"
      trade_direction: "buy" | "sell"
      trade_status: "open" | "closed" | "cancelled"
      transaction_status:
        | "pending"
        | "pending_review"
        | "completed"
        | "failed"
        | "cancelled"
      transaction_type: "deposit" | "withdrawal" | "trade"
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
    Enums: {
      account_type: ["standard", "pro", "vip"],
      kyc_status: [
        "not_started",
        "pending",
        "under_review",
        "approved",
        "rejected",
      ],
      ticket_status: ["open", "in_progress", "resolved"],
      trade_direction: ["buy", "sell"],
      trade_status: ["open", "closed", "cancelled"],
      transaction_status: [
        "pending",
        "pending_review",
        "completed",
        "failed",
        "cancelled",
      ],
      transaction_type: ["deposit", "withdrawal", "trade"],
    },
  },
} as const

// Convenience type aliases used throughout the app
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Account = Database["public"]["Tables"]["accounts"]["Row"]
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
export type Trade = Database["public"]["Tables"]["trades"]["Row"]
export type SupportTicket = Database["public"]["Tables"]["support_tickets"]["Row"]
export type TicketMessage = Database["public"]["Tables"]["ticket_messages"]["Row"]
export type KYCDocument = Database["public"]["Tables"]["kyc_documents"]["Row"]
export type AppNotification = Database["public"]["Tables"]["notifications"]["Row"]
export type KycStatus = Database["public"]["Enums"]["kyc_status"]
export type AccountType = Database["public"]["Enums"]["account_type"]
export type TransactionType = Database["public"]["Enums"]["transaction_type"]
export type TransactionStatus = Database["public"]["Enums"]["transaction_status"]
export type TradeDirection = Database["public"]["Enums"]["trade_direction"]
export type TradeStatus = Database["public"]["Enums"]["trade_status"]
export type TicketStatus = Database["public"]["Enums"]["ticket_status"]
export type AIStrategy = Database["public"]["Tables"]["ai_strategies"]["Row"]
export type PortfolioSnapshot = Database["public"]["Tables"]["portfolio_snapshots"]["Row"]
