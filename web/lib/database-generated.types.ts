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
          phase_id: string
          retreat_phase: string
          started_at: string
          status: Database["public"]["Enums"]["GameStatus"]
        }
        Insert: {
          deleted_at?: string | null
          diplomatic_phase_fall?: string
          diplomatic_phase_spring?: string
          gaining_loosing_phase?: string
          game_type?: string
          id?: string
          phase_id: string
          retreat_phase?: string
          started_at?: string
          status?: Database["public"]["Enums"]["GameStatus"]
        }
        Update: {
          deleted_at?: string | null
          diplomatic_phase_fall?: string
          diplomatic_phase_spring?: string
          gaining_loosing_phase?: string
          game_type?: string
          id?: string
          phase_id?: string
          retreat_phase?: string
          started_at?: string
          status?: Database["public"]["Enums"]["GameStatus"]
        }
        Relationships: [
          {
            foreignKeyName: "games_phase_id_fkey"
            columns: ["phase_id"]
            referencedRelation: "phases"
            referencedColumns: ["id"]
          }
        ]
      }
      moves: {
        Row: {
          created_at: string
          deleted_at: string | null
          from: string | null
          game_id: string
          id: string
          origin: string
          phase_id: string
          player_game_id: string
          player_id: string
          status: Database["public"]["Enums"]["MoveStatus"]
          to: string | null
          type: Database["public"]["Enums"]["MoveType"]
          unit_type: Database["public"]["Enums"]["UnitType"]
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          from?: string | null
          game_id: string
          id?: string
          origin: string
          phase_id: string
          player_game_id: string
          player_id?: string
          status: Database["public"]["Enums"]["MoveStatus"]
          to?: string | null
          type: Database["public"]["Enums"]["MoveType"]
          unit_type: Database["public"]["Enums"]["UnitType"]
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          from?: string | null
          game_id?: string
          id?: string
          origin?: string
          phase_id?: string
          player_game_id?: string
          player_id?: string
          status?: Database["public"]["Enums"]["MoveStatus"]
          to?: string | null
          type?: Database["public"]["Enums"]["MoveType"]
          unit_type?: Database["public"]["Enums"]["UnitType"]
        }
        Relationships: [
          {
            foreignKeyName: "moves_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moves_phase_id_fkey"
            columns: ["phase_id"]
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
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
      phases: {
        Row: {
          created_at: string
          ends_at: string
          game_id: string
          id: string
          phase: Database["public"]["Enums"]["Phase"]
          starts_at: string
          turn: Database["public"]["Enums"]["Turn"]
          year: number
        }
        Insert: {
          created_at?: string
          ends_at: string
          game_id: string
          id?: string
          phase?: Database["public"]["Enums"]["Phase"]
          starts_at?: string
          turn?: Database["public"]["Enums"]["Turn"]
          year?: number
        }
        Update: {
          created_at?: string
          ends_at?: string
          game_id?: string
          id?: string
          phase?: Database["public"]["Enums"]["Phase"]
          starts_at?: string
          turn?: Database["public"]["Enums"]["Turn"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "phases_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          }
        ]
      }
      player_games: {
        Row: {
          country: Database["public"]["Enums"]["country"] | null
          created_at: string
          deleted_at: string | null
          game_id: string
          id: string
          player_id: string
        }
        Insert: {
          country?: Database["public"]["Enums"]["country"] | null
          created_at?: string
          deleted_at?: string | null
          game_id: string
          id?: string
          player_id?: string
        }
        Update: {
          country?: Database["public"]["Enums"]["country"] | null
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
      submitted_moves: {
        Row: {
          created_at: string
          from: string | null
          game_id: string
          id: string
          origin: string
          phase_id: string
          player_game_id: string
          player_id: string
          to: string | null
          type: Database["public"]["Enums"]["MoveType"]
          unit_type: Database["public"]["Enums"]["UnitType"]
        }
        Insert: {
          created_at?: string
          from?: string | null
          game_id: string
          id?: string
          origin: string
          phase_id: string
          player_game_id: string
          player_id: string
          to?: string | null
          type?: Database["public"]["Enums"]["MoveType"]
          unit_type?: Database["public"]["Enums"]["UnitType"]
        }
        Update: {
          created_at?: string
          from?: string | null
          game_id?: string
          id?: string
          origin?: string
          phase_id?: string
          player_game_id?: string
          player_id?: string
          to?: string | null
          type?: Database["public"]["Enums"]["MoveType"]
          unit_type?: Database["public"]["Enums"]["UnitType"]
        }
        Relationships: [
          {
            foreignKeyName: "submitted_moves_game_id_fkey"
            columns: ["game_id"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submitted_moves_phase_id_fkey"
            columns: ["phase_id"]
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submitted_moves_player_game_id_fkey"
            columns: ["player_game_id"]
            referencedRelation: "player_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submitted_moves_player_id_fkey"
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
      assign_countries: {
        Args: {
          gid: string
        }
        Returns: undefined
      }
      insert_player_game: {
        Args: {
          pid: string
          gid: string
        }
        Returns: {
          country: Database["public"]["Enums"]["country"] | null
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
      country:
        | "FRANCE"
        | "GERMANY"
        | "ITALY"
        | "RUSSIA"
        | "AUSTRIA"
        | "ENGLAND"
        | "TURKEY"
      DeprMoveStatus:
        | "SUCCEED"
        | "FAILED"
        | "UNDONE"
        | "EFFECTLESS"
        | "SUBMITTED"
      GameStatus: "FORMING" | "ACTIVE" | "FINISHED"
      MoveStatus: "SUCCEED" | "FAILED" | "INVALID"
      MoveType:
        | "BUILD"
        | "DESTROY"
        | "MOVE"
        | "SUPPORT"
        | "CONVOY"
        | "DEFEND"
        | "RETREAT"
      Phase: "Diplomatic" | "Retreat and Disbanding" | "Gaining and Losing"
      ProvinceType: "LAND" | "COAST" | "SEA"
      Turn: "SPRING" | "FALL"
      UnitType: "Army" | "Fleet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

