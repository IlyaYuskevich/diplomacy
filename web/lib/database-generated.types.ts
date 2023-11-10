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
      games: {
        Row: {
          deleted_at: string | null
          diplomatic_phase_fall: string
          diplomatic_phase_spring: string
          gaining_loosing_phase: string
          game_type: string
          id: string
          phase: Database["public"]["Enums"]["Phase"]
          retreat_phase: string
          started_at: string
          status: Database["public"]["Enums"]["GameStatus"]
          year: number
        }
        Insert: {
          deleted_at?: string | null
          diplomatic_phase_fall?: string
          diplomatic_phase_spring?: string
          gaining_loosing_phase?: string
          game_type?: string
          id?: string
          phase?: Database["public"]["Enums"]["Phase"]
          retreat_phase?: string
          started_at?: string
          status?: Database["public"]["Enums"]["GameStatus"]
          year?: number
        }
        Update: {
          deleted_at?: string | null
          diplomatic_phase_fall?: string
          diplomatic_phase_spring?: string
          gaining_loosing_phase?: string
          game_type?: string
          id?: string
          phase?: Database["public"]["Enums"]["Phase"]
          retreat_phase?: string
          started_at?: string
          status?: Database["public"]["Enums"]["GameStatus"]
          year?: number
        }
        Relationships: []
      }
      moves: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          from: string | null
          id: string
          origin: string
          phase: Database["public"]["Enums"]["Phase"]
          player_game_id: string
          player_id: string
          status: Database["public"]["Enums"]["MoveStatus"]
          to: string | null
          type: Database["public"]["Enums"]["MoveType"]
          unit_type: Database["public"]["Enums"]["UnitType"]
          year: number
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          from?: string | null
          id?: string
          origin: string
          phase: Database["public"]["Enums"]["Phase"]
          player_game_id: string
          player_id?: string
          status: Database["public"]["Enums"]["MoveStatus"]
          to?: string | null
          type?: Database["public"]["Enums"]["MoveType"]
          unit_type: Database["public"]["Enums"]["UnitType"]
          year: number
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          from?: string | null
          id?: string
          origin?: string
          phase?: Database["public"]["Enums"]["Phase"]
          player_game_id?: string
          player_id?: string
          status?: Database["public"]["Enums"]["MoveStatus"]
          to?: string | null
          type?: Database["public"]["Enums"]["MoveType"]
          unit_type?: Database["public"]["Enums"]["UnitType"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "moves_player_game_id_fkey"
            columns: ["player_game_id"]
            referencedRelation: "player_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moves_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      player_games: {
        Row: {
          color: string
          country: Database["public"]["Enums"]["Country"] | null
          created_at: string
          deleted_at: string | null
          game_id: string
          id: string
          player_id: string
        }
        Insert: {
          color?: string
          country?: Database["public"]["Enums"]["Country"] | null
          created_at?: string
          deleted_at?: string | null
          game_id: string
          id?: string
          player_id?: string
        }
        Update: {
          color?: string
          country?: Database["public"]["Enums"]["Country"] | null
          created_at?: string
          deleted_at?: string | null
          game_id?: string
          id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_games_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_games_player_id_fkey"
            columns: ["player_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_player_game: {
        Args: {
          pid: string
          gid: string
        }
        Returns: {
          color: string
          country: Database["public"]["Enums"]["Country"] | null
          created_at: string
          deleted_at: string | null
          game_id: string
          id: string
          player_id: string
        }
      }
      is_player_in: {
        Args: {
          _player_id: string
          _game_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      Country:
        | "FRANCE"
        | "GERMANY"
        | "ITALY"
        | "RUSSIA"
        | "AUSTRIA"
        | "ENGLAND"
        | "TURKEY"
      GameStatus: "FORMING" | "ACTIVE" | "FINISHED"
      MoveStatus: "SUCCEED" | "FAILED" | "UNDONE" | "EFFECTLESS" | "SUBMITTED"
      MoveType:
        | "BUILD"
        | "DESTROY"
        | "MOVE"
        | "SUPPORT"
        | "CONVOY"
        | "DEFEND"
        | "RETREAT"
      Phase: "SPRING" | "FALL"
      ProvinceType: "LAND" | "COAST" | "SEA"
      UnitType: "Army" | "Fleet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

