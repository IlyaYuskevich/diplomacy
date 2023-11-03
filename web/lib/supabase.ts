import { createClient } from "@supabase";
import { SUPABASE_KEY, SUPABASE_URL } from "lib/environment.ts";
import { Database } from "lib/database.types.ts";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);