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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          label: string | null
          post_id: string | null
          referrer: string | null
          slug: string | null
          value: number | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          label?: string | null
          post_id?: string | null
          referrer?: string | null
          slug?: string | null
          value?: number | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          label?: string | null
          post_id?: string | null
          referrer?: string | null
          slug?: string | null
          value?: number | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_events_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          archived_at: string | null
          author_id: string | null
          canonical_url: string | null
          category_id: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          featured_image_alt: string | null
          focus_keyword: string | null
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          old_slugs: string[] | null
          published_at: string | null
          raw_imported_content: string | null
          reading_time: number | null
          robots_follow: boolean
          robots_index: boolean
          scheduled_at: string | null
          secondary_keywords: string[] | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          archived_at?: string | null
          author_id?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          featured_image_alt?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          old_slugs?: string[] | null
          published_at?: string | null
          raw_imported_content?: string | null
          reading_time?: number | null
          robots_follow?: boolean
          robots_index?: boolean
          scheduled_at?: string | null
          secondary_keywords?: string[] | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          archived_at?: string | null
          author_id?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          featured_image_alt?: string | null
          focus_keyword?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          old_slugs?: string[] | null
          published_at?: string | null
          raw_imported_content?: string | null
          reading_time?: number | null
          robots_follow?: boolean
          robots_index?: boolean
          scheduled_at?: string | null
          secondary_keywords?: string[] | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_redirects: {
        Row: {
          created_at: string
          id: string
          new_slug: string
          old_slug: string
          post_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          new_slug: string
          old_slug: string
          post_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          new_slug?: string
          old_slug?: string
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_redirects_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          certificate_url: string | null
          created_at: string | null
          description: string | null
          gradient: string | null
          id: string
          image_url: string | null
          is_visible: boolean | null
          issuer: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string | null
          description?: string | null
          gradient?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          issuer?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          certificate_url?: string | null
          created_at?: string | null
          description?: string | null
          gradient?: string | null
          id?: string
          image_url?: string | null
          is_visible?: boolean | null
          issuer?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      linktree_links: {
        Row: {
          animation_enabled: boolean | null
          button_color: string | null
          button_shape: Database["public"]["Enums"]["link_button_shape"] | null
          button_style: Database["public"]["Enums"]["link_button_style"] | null
          created_at: string | null
          icon: string | null
          icon_color: string | null
          id: string
          is_visible: boolean | null
          sort_order: number | null
          subtitle: string | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          animation_enabled?: boolean | null
          button_color?: string | null
          button_shape?: Database["public"]["Enums"]["link_button_shape"] | null
          button_style?: Database["public"]["Enums"]["link_button_style"] | null
          created_at?: string | null
          icon?: string | null
          icon_color?: string | null
          id?: string
          is_visible?: boolean | null
          sort_order?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          animation_enabled?: boolean | null
          button_color?: string | null
          button_shape?: Database["public"]["Enums"]["link_button_shape"] | null
          button_style?: Database["public"]["Enums"]["link_button_style"] | null
          created_at?: string | null
          icon?: string | null
          icon_color?: string | null
          id?: string
          is_visible?: boolean | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      linktree_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      media_library: {
        Row: {
          alt: string | null
          bucket: string
          caption: string | null
          created_at: string
          created_by: string | null
          height: number | null
          id: string
          mime_type: string | null
          path: string
          size_bytes: number | null
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          alt?: string | null
          bucket?: string
          caption?: string | null
          created_at?: string
          created_by?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          path: string
          size_bytes?: number | null
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          alt?: string | null
          bucket?: string
          caption?: string | null
          created_at?: string
          created_by?: string | null
          height?: number | null
          id?: string
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      packages: {
        Row: {
          created_at: string
          features: Json
          gradient: string
          icon: string
          id: string
          is_active: boolean
          name: string
          popular: boolean
          price: string
          price_note: string
          services: Json
          sort_order: number
          tagline: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: Json
          gradient?: string
          icon?: string
          id?: string
          is_active?: boolean
          name: string
          popular?: boolean
          price: string
          price_note?: string
          services?: Json
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: Json
          gradient?: string
          icon?: string
          id?: string
          is_active?: boolean
          name?: string
          popular?: boolean
          price?: string
          price_note?: string
          services?: Json
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          id: string
          page_path: string
          real_ip: string | null
          referrer: string | null
          region: string | null
          user_agent: string | null
          visitor_ip: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          page_path: string
          real_ip?: string | null
          referrer?: string | null
          region?: string | null
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          page_path?: string
          real_ip?: string | null
          referrer?: string | null
          region?: string | null
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visitor_stats: {
        Row: {
          date: string
          id: string
          total_views: number
          unique_visitors: number
          updated_at: string
        }
        Insert: {
          date: string
          id?: string
          total_views?: number
          unique_visitors?: number
          updated_at?: string
        }
        Update: {
          date?: string
          id?: string
          total_views?: number
          unique_visitors?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      aggregate_daily_visitor_stats: {
        Args: { target_date: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_user: { Args: never; Returns: boolean }
      publish_due_scheduled_posts: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
      link_button_shape: "pill" | "rounded" | "square"
      link_button_style: "solid" | "outline" | "neon" | "minimal"
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
      app_role: ["admin", "editor", "viewer"],
      link_button_shape: ["pill", "rounded", "square"],
      link_button_style: ["solid", "outline", "neon", "minimal"],
    },
  },
} as const
