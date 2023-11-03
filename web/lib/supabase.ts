import { createClient } from "@supabase";
import { SUPABASE_KEY, SUPABASE_URL } from "lib/environment.ts";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);