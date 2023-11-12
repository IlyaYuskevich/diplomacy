import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "lib/database-generated.types.ts";
export type { Json } from "lib/database-generated.types.ts";
import { PostgrestError } from "@supabase";
import { ProvinceCode } from "types/provinces.ts";

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        moves: {
          Row: {
            id?: string
            player_id?: string
            from: ProvinceCode | null
            origin: ProvinceCode
            to: ProvinceCode | null
          }
          Insert: {
            from: ProvinceCode | null
            origin: ProvinceCode
            to: ProvinceCode | null
          }
          Update: {
            from: ProvinceCode | null
            origin: ProvinceCode
            to: ProvinceCode | null
          }
        }
      }
      Enums: {
        Country: DatabaseGenerated["public"]["Enums"]["Country"] | null
      }
    };
  }
>;

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }>
  ? Exclude<U, null>
  : never;
export type DbResultErr = PostgrestError;

