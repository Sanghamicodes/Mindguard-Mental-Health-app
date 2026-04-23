export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: 'patient' | 'clinician' | 'admin';
          date_of_birth: string | null;
          phone: string;
          bio: string;
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string;
          role?: 'patient' | 'clinician' | 'admin';
          date_of_birth?: string | null;
          phone?: string;
          bio?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          role?: 'patient' | 'clinician' | 'admin';
          date_of_birth?: string | null;
          phone?: string;
          bio?: string;
          avatar_url?: string;
          updated_at?: string;
        };
      };
      mood_entries: {
        Row: {
          id: string;
          user_id: string;
          mood_score: number;
          energy_level: number | null;
          sleep_hours: number | null;
          anxiety_level: number | null;
          notes: string;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood_score: number;
          energy_level?: number | null;
          sleep_hours?: number | null;
          anxiety_level?: number | null;
          notes?: string;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          mood_score?: number;
          energy_level?: number | null;
          sleep_hours?: number | null;
          anxiety_level?: number | null;
          notes?: string;
          recorded_at?: string;
        };
      };
      symptoms: {
        Row: {
          id: string;
          name: string;
          category: 'emotional' | 'physical' | 'behavioral' | 'cognitive';
          description: string;
          severity_weight: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'emotional' | 'physical' | 'behavioral' | 'cognitive';
          description?: string;
          severity_weight?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          category?: 'emotional' | 'physical' | 'behavioral' | 'cognitive';
          description?: string;
          severity_weight?: number;
        };
      };
      symptom_reports: {
        Row: {
          id: string;
          user_id: string;
          symptom_id: string;
          severity: number;
          notes: string;
          reported_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          symptom_id: string;
          severity?: number;
          notes?: string;
          reported_at?: string;
          created_at?: string;
        };
        Update: {
          severity?: number;
          notes?: string;
          reported_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          alert_type: 'mood_drop' | 'sleep_disruption' | 'symptom_escalation' | 'inactivity' | 'anxiety_spike' | 'crisis';
          severity: 'low' | 'medium' | 'high' | 'critical';
          message: string;
          is_resolved: boolean;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          alert_type: 'mood_drop' | 'sleep_disruption' | 'symptom_escalation' | 'inactivity' | 'anxiety_spike' | 'crisis';
          severity?: 'low' | 'medium' | 'high' | 'critical';
          message?: string;
          is_resolved?: boolean;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          is_resolved?: boolean;
          resolved_at?: string | null;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          message?: string;
        };
      };
      clinician_patients: {
        Row: {
          id: string;
          clinician_id: string;
          patient_id: string;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          clinician_id: string;
          patient_id: string;
          assigned_at?: string;
        };
        Update: {
          assigned_at?: string;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          mood_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string;
          content?: string;
          mood_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          mood_score?: number | null;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type MoodEntry = Database['public']['Tables']['mood_entries']['Row'];
export type Symptom = Database['public']['Tables']['symptoms']['Row'];
export type SymptomReport = Database['public']['Tables']['symptom_reports']['Row'];
export type Alert = Database['public']['Tables']['alerts']['Row'];
export type JournalEntry = Database['public']['Tables']['journal_entries']['Row'];
