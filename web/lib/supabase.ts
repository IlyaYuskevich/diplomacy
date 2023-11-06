import { createClient } from "@supabase";
import { SUPABASE_KEY, SUPABASE_URL } from "lib/environment.ts";
import { Database } from "lib/database.types.ts";
import { ISupaSettings } from "types/supaSettings.ts";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

export async function authSupabaseClient(meta: ISupaSettings) {
    await supabase.auth.setSession({
        access_token: meta.accessToken,
        refresh_token: meta.refreshToken,
      });
    return supabase
}