
import { Handlers, Status } from "$fresh/server.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";

export const handler: Handlers<unknown, ServerState> = {
  async GET(req, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }

    const supa = await authSupabaseClient(ctx.state.supaMetadata);

    const query = supa.from("games").insert({}).select().single();
    const resp: DbResult<typeof query> = await query;
    if (resp.error) {
      return new Response(null, { status: Status.BadRequest });
    }
    const headers = new Headers(req.headers);

    headers.set("location", `/game/${resp.data!.id}`);

    return new Response(null, { status: Status.Found, headers });
  },
}