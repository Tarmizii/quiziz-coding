export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'student' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role?: 'student' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'student' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string | null
          course_id: string | null
          enrolled_at: string
          progress: number
        }
        Insert: {
          id?: string
          student_id?: string | null
          course_id?: string | null
          enrolled_at?: string
          progress?: number
        }
        Update: {
          id?: string
          student_id?: string | null
          course_id?: string | null
          enrolled_at?: string
          progress?: number
        }
      }
      questions: {
        Row: {
          id: string
          title: string
          content: string
          subject: string
          difficulty: string
          question_type: string
          options: Json | null
          correct_answer: string | null
          is_premium: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          subject: string
          difficulty: string
          question_type: string
          options?: Json | null
          correct_answer?: string | null
          is_premium?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          subject?: string
          difficulty?: string
          question_type?: string
          options?: Json | null
          correct_answer?: string | null
          is_premium?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_answers: {
        Row: {
          id: string
          user_id: string | null
          question_id: string | null
          answer: string | null
          is_correct: boolean | null
          answered_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          question_id?: string | null
          answer?: string | null
          is_correct?: boolean | null
          answered_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          question_id?: string | null
          answer?: string | null
          is_correct?: boolean | null
          answered_at?: string
        }
      }
      access_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          ip_address: string | null
          user_agent: string | null
          success: boolean
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          ip_address?: string | null
          user_agent?: string | null
          success: boolean
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          ip_address?: string | null
          user_agent?: string | null
          success?: boolean
          error_message?: string | null
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
      user_role: 'student' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}