
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";
import { Move } from "types/moves.ts";

export const handler: Handlers<unknown, ServerState> = {
  async POST(req, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }


    const supa = await authSupabaseClient(ctx.state.supaMetadata);
    const payload = await req.json()
    const query = supa.from("moves").insert(payload as Move[])

    const resp: DbResult<typeof query> = await query;
    if (resp.error) {
      console.log(resp.error)
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }

    return new Response(null, { status: STATUS_CODE.OK });
  },
}