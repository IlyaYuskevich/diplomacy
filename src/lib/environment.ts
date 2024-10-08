import { load } from "dotenv/mod.ts";

await load({ export: true, allowEmptyValues: true });

export const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
export const SUPABASE_KEY = Deno.env.get("SUPABASE_KEY") || "";
export const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_KEY") || "";