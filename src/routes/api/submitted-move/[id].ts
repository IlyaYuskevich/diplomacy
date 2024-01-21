
import { Handlers, STATUS_CODE } from "$fresh/server.ts";
import { ServerState } from "middlewares/auth-middleware.ts";
import { authSupabaseClient } from "lib/supabase.ts";
import { DbResult } from "lib/database.types.ts";
import { SubmittedMove } from "types/moves.ts";

export const handler: Handlers<SubmittedMove, ServerState> = {
  async DELETE(req, ctx) {
    console.log(req)
    if (!ctx.state.supaMetadata) {
      return ctx.render();
    }



    const supa = await authSupabaseClient(ctx.state.supaMetadata);
    const query = supa.from("submitted_moves").delete().eq('id', ctx.params.id)

    const resp: DbResult<typeof query> = await query;
    if (resp.error) {
      console.log(resp.error)
      return new Response(null, { status: STATUS_CODE.BadRequest });
    }

    return new Response(null, { status: STATUS_CODE.OK });
  },
}