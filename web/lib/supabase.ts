import { createClient } from "@supabase";

const IDP_URL = Deno.env.get("IDP_URL") || "";
const SUPABASE_KEY = Deno.env.get("SUPABASE_KEY") || "";

export const supabase = createClient(IDP_URL, SUPABASE_KEY);