import { MergeDeep } from "type-fest";
import { Database as DatabaseGenerated } from "lib/database-generated.types.ts";
export type { Json } from "lib/database-generated.types.ts";
import { PostgrestError } from "@supabase";

export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Views: {
        movies_view: {
          Row: {};
        };
      };
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

