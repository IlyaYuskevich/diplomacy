
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";
import { SubmittedMoveInsert } from "types/moves.ts";

export const handler: Handlers<unknown, ServerState> = {
  async POST(req, ctx) {
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }


    const supa = await authSupabaseClient(ctx.state.supaMetadata);
    const payload = await req.json()
    console.log(payload, ctx.state.supaMetadata)
    const query = supa.from("submitted_moves").insert(payload as SubmittedMoveInsert[])

    const resp: DbResult<typeof query> = await query;
    if (resp.error) {
      console.log(resp.error)
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }

    return new Response(null, { status: STATUS_CODE.OK });
  },
}