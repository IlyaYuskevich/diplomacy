import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "lib/database-generated.types.ts";
export type { Json } from "lib/database-generated.types.ts";
import { PostgrestError } from "@supabase";
import { ProvinceCode } from "types/provinces.ts";
import { GamePosition } from "types/gamePosition.ts";

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        moves: {
          Row: {
            player?: string;
            from: ProvinceCode | null;
            origin: ProvinceCode | null;
            to: ProvinceCode;
            created_at?: string;
          };
          Insert: {
            id?: string;
            from: ProvinceCode | null;
            origin: ProvinceCode | null;
            to: ProvinceCode;
            status: DatabaseGenerated["public"]["Enums"]["MoveStatus"] | "VALID"
          };
          Update: {
            id?: string;
          };
        };
        submitted_moves: {
          Row: {
            from: ProvinceCode | null;
            origin: ProvinceCode | null;
            to: ProvinceCode;
            created_at?: string;
          };
          Insert: {
            id?: string;
            player?: string;
            from: ProvinceCode | null;
            origin: ProvinceCode | null;
            to: ProvinceCode;
          };
          Update: {
            id?: string;
          };
        };
        games: {
          Row: {
            game_position: GamePosition;
            phase?: DatabaseGenerated["public"]["Tables"]["phases"]["Row"];
          };
          Insert: {
            id?: string;
            phase?: string;
            game_position: GamePosition;
          };
          Update: {
            id?: string;
            game_position?: GamePosition;
          };
        };
        player_games: {
          Row: {};
          Insert: {
            id?: string;
          };
          Update: {
            id?: string;
          };
        };
      };
      Enums: {
        Country: DatabaseGenerated["public"]["Enums"]["country"] | null;
      };
    };
  }
>;

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;
export type DbResultErr = PostgrestError;
