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
          created_by: string | null
          gaining_and_loosing_phase_duration: number
          game_type: string
          id: string
          number_of_players: number
          phase: string | null
          retreat_and_disbanding_phase_duration: number
          started_at: string
          status: Database["public"]["Enums"]["game_status"]
          turn_duration: number
        }
        Insert: {
          created_by?: string | null
          gaining_and_loosing_phase_duration?: number
          game_type?: string
          id?: string
          number_of_players?: number
          phase?: string | null
          retreat_and_disbanding_phase_duration?: number
          started_at?: string
          status?: Database["public"]["Enums"]["game_status"]
          turn_duration?: number
        }
        Update: {
          created_by?: string | null
          gaining_and_loosing_phase_duration?: number
          game_type?: string
          id?: string
          number_of_players?: number
          phase?: string | null
          retreat_and_disbanding_phase_duration?: number
          started_at?: string
          status?: Database["public"]["Enums"]["game_status"]
          turn_duration?: number
        }
        Relationships: [
          {
            foreignKeyName: "games_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_phase_fkey"
            columns: ["phase"]
            referencedRelation: "phases"
            referencedColumns: ["id"]
          }
        ]
      }
      moves: {
        Row: {
          created_at: string
          from: string | null
          game: string
          id: string
          origin: string | null
          phase: string
          player: string
          player_game: string
          status: Database["public"]["Enums"]["MoveStatus"]
          to: string
          type: Database["public"]["Enums"]["MoveType"]
          unit_type: Database["public"]["Enums"]["UnitType"]
        }
        Insert: {
          created_at?: string
          from?: string | null
          game: string
          id?: string
          origin?: string | null
          phase: string
          player?: string
          player_game: string
          status: Database["public"]["Enums"]["MoveStatus"]
          to: string
          type: Database["public"]["Enums"]["MoveType"]
          unit_type: Database["public"]["Enums"]["UnitType"]
        }
        Update: {
          created_at?: string
          from?: string | null
          game?: string
          id?: string
          origin?: string | null
          phase?: string
          player?: string
          player_game?: string
          status?: Database["public"]["Enums"]["MoveStatus"]
          to?: string
          type?: Database["public"]["Enums"]["MoveType"]
          unit_type?: Database["public"]["Enums"]["UnitType"]
        }
        Relationships: [
          {
            foreignKeyName: "moves_game_fkey"
            columns: ["game"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moves_phase_fkey"
            columns: ["phase"]
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moves_player_fkey"
            columns: ["player"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moves_player_game_fkey"
            columns: ["player_game"]
            referencedRelation: "player_games"
            referencedColumns: ["id"]
          }
        ]
      }
      phases: {
        Row: {
          ends_at: string
          game: string
          game_position: Json
          id: string
          phase: Database["public"]["Enums"]["Phase"]
          previous_phase: string | null
          starts_at: string
          turn: Database["public"]["Enums"]["Turn"]
          year: number
        }
        Insert: {
          ends_at: string
          game: string
          game_position: Json
          id?: string
          phase?: Database["public"]["Enums"]["Phase"]
          previous_phase?: string | null
          starts_at?: string
          turn?: Database["public"]["Enums"]["Turn"]
          year?: number
        }
        Update: {
          ends_at?: string
          game?: string
          game_position?: Json
          id?: string
          phase?: Database["public"]["Enums"]["Phase"]
          previous_phase?: string | null
          starts_at?: string
          turn?: Database["public"]["Enums"]["Turn"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "phases_game_fkey"
            columns: ["game"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phases_previous_phase_fkey"
            columns: ["previous_phase"]
            referencedRelation: "phases"
            referencedColumns: ["id"]
          }
        ]
      }
      player_games: {
        Row: {
          country: Database["public"]["Enums"]["country"] | null
          created_at: string
          game: string
          id: string
          player: string
        }
        Insert: {
          country?: Database["public"]["Enums"]["country"] | null
          created_at?: string
          game: string
          id?: string
          player?: string
        }
        Update: {
          country?: Database["public"]["Enums"]["country"] | null
          created_at?: string
          game?: string
          id?: string
          player?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_games_game_fkey"
            columns: ["game"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_games_player_fkey"
            columns: ["player"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      submitted_moves: {
        Row: {
          created_at: string | null
          from: string | null
          game: string
          id: string
          origin: string | null
          phase: string
          player: string
          player_game: string
          to: string
          type: Database["public"]["Enums"]["MoveType"]
          unit_type: Database["public"]["Enums"]["UnitType"]
        }
        Insert: {
          created_at?: string | null
          from?: string | null
          game: string
          id?: string
          origin?: string | null
          phase: string
          player: string
          player_game: string
          to: string
          type?: Database["public"]["Enums"]["MoveType"]
          unit_type?: Database["public"]["Enums"]["UnitType"]
        }
        Update: {
          created_at?: string | null
          from?: string | null
          game?: string
          id?: string
          origin?: string | null
          phase?: string
          player?: string
          player_game?: string
          to?: string
          type?: Database["public"]["Enums"]["MoveType"]
          unit_type?: Database["public"]["Enums"]["UnitType"]
        }
        Relationships: [
          {
            foreignKeyName: "submitted_moves_game_fkey"
            columns: ["game"]
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submitted_moves_phase_fkey"
            columns: ["phase"]
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submitted_moves_player_fkey"
            columns: ["player"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submitted_moves_player_game_fkey"
            columns: ["player_game"]
            referencedRelation: "player_games"
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
          game: string
          id: string
          player: string
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
      game_status: "FORMING" | "ACTIVE" | "FINISHED"
      MoveStatus:
        | "SUCCEED"
        | "FAILED"
        | "INVALID"
        | "VALID"
        | "EFFECTLESS"
        | "DISLODGED"
      MoveType:
        | "BUILD"
        | "DISBAND"
        | "MOVE"
        | "SUPPORT"
        | "CONVOY"
        | "HOLD"
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

