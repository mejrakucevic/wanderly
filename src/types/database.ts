// Provisional database contract copied from the separate wanderly-backend repository.
// Relationships/constraints are unknown; replace with Supabase CLI output when available.
export type Database = {
  public: {
    Tables: {
      diary_entries: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          location_id: string | null;
          title: string;
          content: string;
          entry_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id?: string;
          location_id?: string | null;
          title: string;
          content?: string;
          entry_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          user_id?: string;
          location_id?: string | null;
          title?: string;
          content?: string;
          entry_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      diary_photos: {
        Row: {
          id: string;
          entry_id: string;
          user_id: string;
          storage_path: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          entry_id: string;
          user_id?: string;
          storage_path: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          entry_id?: string;
          user_id?: string;
          storage_path?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          title: string;
          amount: number;
          category: string;
          expense_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id?: string;
          title: string;
          amount: number;
          category: string;
          expense_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          user_id?: string;
          title?: string;
          amount?: number;
          category?: string;
          expense_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      locations: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          city: string | null;
          country: string | null;
          country_code: string | null;
          latitude: number;
          longitude: number;
          status: string;
          visited_at: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          city?: string | null;
          country?: string | null;
          country_code?: string | null;
          latitude: number;
          longitude: number;
          status?: string;
          visited_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          city?: string | null;
          country?: string | null;
          country_code?: string | null;
          latitude?: number;
          longitude?: number;
          status?: string;
          visited_at?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_path: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_path?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_path?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      trip_activities: {
        Row: {
          id: string;
          trip_id: string;
          user_id: string;
          location_id: string | null;
          title: string;
          description: string | null;
          activity_date: string;
          start_time: string | null;
          sort_order: number;
          ai_generated: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          user_id?: string;
          location_id?: string | null;
          title: string;
          description?: string | null;
          activity_date: string;
          start_time?: string | null;
          sort_order?: number;
          ai_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          user_id?: string;
          location_id?: string | null;
          title?: string;
          description?: string | null;
          activity_date?: string;
          start_time?: string | null;
          sort_order?: number;
          ai_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      trip_locations: {
        Row: {
          trip_id: string;
          location_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          trip_id: string;
          location_id: string;
          user_id?: string;
          created_at?: string;
        };
        Update: {
          trip_id?: string;
          location_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          destination: string;
          start_date: string;
          end_date: string;
          description: string | null;
          cover_image_path: string | null;
          budget: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          destination: string;
          start_date: string;
          end_date: string;
          description?: string | null;
          cover_image_path?: string | null;
          budget?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          destination?: string;
          start_date?: string;
          end_date?: string;
          description?: string | null;
          cover_image_path?: string | null;
          budget?: number;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_countries: {
        Row: {
          id: string;
          user_id: string;
          country_code: string;
          status: string;
          visited_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          country_code: string;
          status: string;
          visited_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          country_code?: string;
          status?: string;
          visited_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
